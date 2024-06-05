"use server";

import { prisma } from "@/lib/prisma";
import { EventProps } from "@/types";
import { Event, Riddle, User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { Noto_Sans_Gunjala_Gondi } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

export async function RegisterUserForEvent(event: Event, user: User) {
  const resp = await prisma.event.update({
    where: { id: event.id },
    data: { participants: { connect: { id: user.id } } },
  });
  return resp != undefined;
}
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
      teamSize: formData.teamSize,
      useTeams: formData.useTeams, //
      generatedTeams: formData.generatedTeams,
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
        teamSize: formData.teamSize, //
        generatedTeams: formData.generatedTeams,
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
    include: { teams: { include: { members: true, userEntries: true } } },
  });

  if (!event) return [];

  return event.teams;
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

export async function SetRiddleSet(eventId: string, ids: Riddle[]) {
  //purge first
  await prisma.event.update({
    where: { id: eventId },
    data: { riddles: { set: [] } },
  });
  const data: { id: number }[] = (ids.map((riddle) => ({ id: riddle.id })));

  const out = await prisma.event.update({
    where: { id: eventId },
    data: { riddles: { connect: data! } }, include:{riddles:true}
  });
  return out; 
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
