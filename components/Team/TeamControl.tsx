"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { TeamProps, EventProps } from "@/types";
import { UserEntry } from "@prisma/client";



import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { OutliningSpanKind } from "typescript";

export async function CreateTeam(formData: FormData, userID?: string) {
  const out = await prisma.teamEntry.create({
    data: {
      name: formData.get("name")?.toString() ?? "ERROR WHILE CREATING", //
      event: { connect: { id: formData.get("eventID")?.toString() } },
    },
  });

  if (userID) {
    registerMember(out.id);
  }
  return out;
}

export async function EditTeam(formData: FormData, userID?: string) {
  if (formData.get("id")?.toString() == "NEW")
    return CreateTeam(formData, userID);
  else {
    //Logic to update a event

    const out = await prisma.teamEntry.update({
      where: { id: formData.get("id")?.toString() },
      data: {
        name: formData.get("name")?.toString() ?? "ERROR WHILE CREATING", //

        event: { connect: { id: formData.get("eventID")?.toString() } },
      },
    });

    return out;
  }
}

export async function AddTeamUserEntry(riddleID: number, teamID: string) {
  const session = await auth();

  if (session) {
    let out = await prisma.userEntry.create({
      data: {
        answeredAt: new Date(),
        riddle: { connect: { id: riddleID } },
        answeredBy: { connect: { email: session.user!.email! } },
        teamEntry: { connect: { id: teamID } },
      },
    });
    return out;
  }
}

export async function RemoveTeamUserEntry(riddleID: number, teamID: string) {
  const session = await auth();

  if (session) {
    let out = await prisma.userEntry.deleteMany({
      where: {
        riddle: {  id: riddleID  },
        teamEntry: { id: teamID  },
      },
    });
    return out;
  }
}

export async function purgeEmptyTeams(eventId: string) {
  const out = await prisma.teamEntry.deleteMany({
    where: { NOT: { members: { some: {} } } },
  });
}

export async function registerMember(teamId: string) {
  const session = await auth();

  const teams = await prisma.teamEntry.findFirstOrThrow({
    where: { id: teamId },
    include: { members: true },
  });

  let ids = [{ email: session?.user?.email! }];
  teams.members.forEach((member) => ids.push({ email: member.email! }));

  const teamEntry = await prisma.teamEntry.update({
    where: { id: teamId },
    data: { members: { connect: ids } },
  });

  purgeEmptyTeams(teams.eventId);
}
