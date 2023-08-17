"use server";

import { prisma } from "@/lib/prisma";
import { EventProps } from "@/types";
import { TeamEntry } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


export async function CreateEvent(formData: FormData) {
  //Ignore ID as its only used in update

  const out = await prisma.event.create({
    data: {
      name: formData.get("name")?.toString() ?? "ERROR WHILE CREATING", //
      description:
        formData.get("description")?.toString() ?? "ERROR WHILE CREATING", //
      start: formData.get("start")?.toString() ?? new Date(), //
      end: formData.get("end")?.toString() ?? new Date(), //
      prize: formData.get("prize")?.toString() ?? undefined,
      requireURL: formData.get("requireURL") == "requireURL", //
      requireScreenshot:
        formData.get("requireScreenshot") == "requireScreenshot", //
      active: formData.get("active") == "active", //
      useTeams: formData.get("useTeams") == "useTeams", //
      public: formData.get("public") == "public", //
      showTeams: formData.get("showTeams") == "showTeams", //
      showParticipants: formData.get("showParticipants") == "showParticipants", //
    },
  });

  return out;
}

export async function EditEvent(formData: FormData) {
  if (formData.get("id")?.toString() == "NEW") return CreateEvent(formData);
  else {
    //Logic to update a event

    const out = await prisma.event.update({
      where: { id: formData.get("id")?.toString() },
      data: {
        name: formData.get("name")?.toString() ?? "ERROR WHILE CREATING", //
        description:
          formData.get("description")?.toString() ?? "ERROR WHILE CREATING", //
        prize: formData.get("prize")?.toString() ?? undefined,
        requireURL: formData.get("requireURL") == "requireURL", //
        requireScreenshot:
          formData.get("requireScreenshot") == "requireScreenshot", //
        active: formData.get("active") == "active", //
        useTeams: formData.get("useTeams") == "useTeams", //
        public: formData.get("public") == "public", //
        showTeams: formData.get("showTeams") == "showTeams", //
        showParticipants:
          formData.get("showParticipants") == "showParticipants", //
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
      temp.push(member.name);
    });
    teams.set(teamEntry.name, temp);
  });

  return teams;
}

export async function GetUserTeamID(eventId: string,email:string ){

  const team = await prisma.teamEntry.findFirst({where:{members:{some:{email:email}}}})
  return team;
}

export async function GetTeamsRaw(eventID: string) {
  const event = await prisma.event.findFirst({
    where: { id: eventID },
    include: { teams: { include: { members: true ,userEntries:true} } },
  });


  if(event?.teams)
  return await event.teams;
}

export async function SetRiddleSet(eventId: string, ids: string[]) {
  //purge first
  await prisma.event.update({
    where: { id: eventId },
    data: { riddles: { set: [] } },
  });
  const data = ids.map((riddle) => ({ id: riddle }));

  const out = await prisma.event.update({
    where: { id: eventId },
    data: { riddles: { connect: data } },
  });


}
