"use server";

import { prisma } from "@/lib/prisma";
import { EventProps } from "@/types";
import { Event } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function DeleteEvent(input: any) {
  return await prisma.event.delete({ where: { id: input.id } });
}

export async function CreateEvent(formData: Event) {
  //Ignore ID as its only used in update

  const out = await prisma.event.create({
    data: {
      name: formData.name ?? "ERROR WHILE CREATING", //
      description: formData.description ?? "ERROR WHILE CREATING", //
      start: formData.start ?? new Date(), //
      end: formData.end ?? new Date(), //
      prize: formData.prize ?? undefined,
      requireURL: formData.requireURL, //
      requireScreenshot: formData.requireScreenshot, //
      active: formData.active, //
      useTeams: formData.useTeams, //

      public: formData.public, //
      showTeams: formData.showTeams, //
      showParticipants: formData.showParticipants, //
    },
  });

  return out;
}

export async function EditEvent(formData: Event) {
  if (formData.id == "NEW") return CreateEvent(formData);
  else {
    //Logic to update a event

    const out = await prisma.event.update({
      where: { id: formData.id },
      data: {
        name: formData.name ?? "ERROR WHILE CREATING", //
        description: formData.description ?? "ERROR WHILE CREATING", //
        prize: formData.prize,
        start: formData.start ?? new Date(), //
        end: formData.end ?? new Date(), //
        requireURL: formData.requireURL, //
        requireScreenshot: formData.requireScreenshot, //
        active: formData.active, //
        useTeams: formData.useTeams, //
        public: formData.public, //
        showTeams: formData.showTeams, //
        showParticipants: formData.showParticipants, //
      },
    });

    return out;
  }
}

export async function GetTeams(eventID: string) {
  const event = await prisma.event.findFirst({
    where: { id: eventID },
    include: { teams: { include: { members: true } } },
  });

  if (!event) return [];
  let teams = new Map<string, string[]>();
  event.teams.forEach((teamEntry) => {
    let temp: string[] = [];
    teamEntry.members.forEach((member) => {
      temp.push(member.name!);
    });
    teams.set(teamEntry.name, temp);
  });

  return teams;
}

export async function GetUserTeamID(eventId: string, email: string) {
  const team = await prisma.teamEntry.findFirst({
    where: { members: { some: { email: email } } },
  });
  return team;
}

export async function GetTeamsRaw(eventID: string) {
  const event = await prisma.event.findFirst({
    where: { id: eventID },
    include: { teams: { include: { members: true, userEntries: true } } },
  });

  if (event?.teams) return await event.teams;
}

export async function SetRiddleSet(eventId: string, ids: string[]) {
  //purge first
  await prisma.event.update({
    where: { id: eventId },
    data: { riddles: { set: [] } },
  });
  const data: { id: string; }[] = ids.map((riddle) => ({ id: riddle }));

  const out = await prisma.event.update({
    where: { id: eventId },
    data: { riddles: { connect: data! } },
  });
}

export async function StartEvent(id: string) {
  return await prisma.event.update({
    where: { id: id },
    data: { active: true },
  });
}

export async function StopEvent(id: string) {
  return await prisma.event.update({
    where: { id: id },
    data: { active: false },
  });
}
