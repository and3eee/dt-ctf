"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { TeamProps, EventProps } from "@/types";
import { TeamEntry, User, UserEntry } from "@prisma/client";

import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { disconnect } from "process";
import { OutliningSpanKind } from "typescript";

export async function CreateTeam(team: TeamEntry, user: User) {
  const out = await prisma.teamEntry.create({
    data: {
      name: team.name,
      event: { connect: { id: team.eventId } },
      members: { connect: { id: user.id } },
    },
  });
  await purgeEmptyTeams(team.eventId);
  return out;
}

export async function UpdateTeam(team: TeamEntry) {
  const out = await prisma.teamEntry.update({
    where: { id: team.id },
    data: { name: team.name, event: { connect: { id: team.eventId } } },
  });
  await purgeEmptyTeams(team.eventId);
  return out;
}

export async function AddTeamUserEntry(
  riddleID: number,
  teamID: string,
  user: User,
  value: string
) {
  const riddle = await prisma.riddle.findFirst({ where: { id: riddleID } });

  if (riddle && value == riddle?.solution) {
    let out = await prisma.userEntry.create({
      data: {
        answeredAt: new Date(),
        riddle: { connect: { id: riddleID } },
        answeredBy: { connect: { email: user.email! } },
        teamEntry: { connect: { id: teamID } },
      },
      include: { answeredBy: true },
    });
    return true;
  }return false;
}

export async function RemoveTeamUserEntry(riddleID: number, teamID: string) {
  const session = await auth();

  if (session) {
    let out = await prisma.userEntry.deleteMany({
      where: {
        riddle: { id: riddleID },
        teamEntry: { id: teamID },
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

export async function RemoveFromAllTeams(user: User) {
  const teamsToTarget = await prisma.teamEntry.findMany({
    where: { members: { some: { id: user.id } } },
  });

  if (teamsToTarget && teamsToTarget.length > 0)
    teamsToTarget.forEach(
      async (team: TeamEntry) =>
        await prisma.teamEntry.update({
          where: { id: team.id },
          data: { members: { disconnect: { id: user.id } } },
        })
    );
}

export async function registerMember(team: TeamEntry, user: User) {
  const teams = await prisma.teamEntry.findFirstOrThrow({
    where: { id: team.id },
    include: { members: true },
  });

  await RemoveFromAllTeams(user);

  let ids = [{ id: user.id }];
  teams.members.forEach((member) => ids.push({ id: member.id }));

  const teamEntry = await prisma.teamEntry.update({
    where: { id: team.id },
    data: { members: { connect: ids } },
  });

  await purgeEmptyTeams(teams.eventId);

  return teamEntry;
}
