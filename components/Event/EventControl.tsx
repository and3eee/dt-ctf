"use server";

import { prisma } from "@/lib/prisma";
import { EventProps, TeamProps } from "@/types";
import { Event, Riddle, TeamEntry, User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { Noto_Sans_Gunjala_Gondi } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";
import { purgeEmptyTeams } from "../Team/TeamControl";

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
    include: {
      teams: {
        include: {
          members: true,
          userEntries: { include: { answeredBy: true } },
        },
      },
    },
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
  const data: { id: number }[] = ids.map((riddle) => ({ id: riddle.id }));

  const out = await prisma.event.update({
    where: { id: eventId },
    data: { riddles: { connect: data! } },
    include: { riddles: true },
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

export async function SaveEventTeams(
  event: EventProps,
  generatedTeams: TeamProps[]
) {
  var out: TeamEntry[] = [];

  generatedTeams.forEach(async (team: TeamProps) => {
    out.push(
      await prisma.teamEntry.create({
        data: {
          name: team.name,
          event: { connect: { id: event.id } },
          members: {
            connect: team.members!.map((member: User) => {
              return {
                id: member.id,
              };
            }),
          },
        },
      })
    );
  });
  purgeEmptyTeams(event.id);
  return out;
}

export async function PreGenerateTeams(event: EventProps) {
  console.log("Team Generation request received for event " + event.name);
  var out: TeamProps[] = [];
  //first divide by bucket
  var NASA = event.participants.filter((member: User) => member.geo == "NASA");
  var EMEA = event.participants.filter((member: User) => member.geo == "EMEA");
  var APAC = event.participants.filter((member: User) => member.geo == "APAC");
  console.log("TG - Region partitioning completed.");

  if (EMEA.length > 0) {
    out = out.concat(await GenerateTeamsFromGroup(EMEA, "EMEA "));
  }
  if (APAC.length > 0) {
    out = out.concat(await GenerateTeamsFromGroup(APAC, "APAC "));
  }
  if (NASA.length > 0) {
    out = out.concat(await GenerateTeamsFromGroup(NASA, "NASA "));
  }
  console.log(out.map((entry) => entry.name));
  return out;
}

async function GenerateTeamsFromGroup(
  members: User[],
  tag?: string,
  teamSize?: number
) {
  console.log(tag + "Teams Initiated");
  var scoreGoal =
    members
      .map((member: User) => member.skillLevel ?? 5)
      .reduce((a, b) => a + b) / members.length;
  var out: TeamProps[] = [];

  //Split by bucket
  let agent = members.filter((member: User) => member.bucket == "Agent");
  let env = members.filter((member: User) => member.bucket == "Environment");
  let dem = members.filter((member: User) => member.bucket == "DEM");
  let platform = members.filter((member: User) => member.bucket == "Platform");

  while (
    agent.length > 0 ||
    dem.length > 0 ||
    env.length > 0 ||
    platform.length > 0
  ) {
    var memberHold: User[] = [];
    var teamScore = 0;
    while (memberHold.length < (teamSize ?? 3)) {
      if (memberHold.length < (teamSize ?? 3)) {
        if (agent.length > 0 && memberHold.length < (teamSize ?? 3)) {
          const temp = agent.pop()!;
          memberHold.push(temp);
          teamScore += temp.skillLevel ?? 5;
        }

        if (env.length > 0 && memberHold.length < (teamSize ?? 3)) {
          if (memberHold.length == 0) {
            const temp = env.pop()!;
            memberHold.push(temp);
            teamScore += temp.skillLevel ?? 5;
          } else {
            const envIndex = await IndexOfClosetScore(
              env,
              scoreGoal - teamScore / 2
            );
            const temp = env.at(envIndex);
            teamScore += temp!.skillLevel ?? 5;
            memberHold.push(temp!);
            env = env.filter((member: User) => member.id != temp?.id);
          }
        }

        if (dem.length > 0 && memberHold.length < (teamSize ?? 3)) {
          if (memberHold.length == 0) {
            const temp = dem.pop()!;
            memberHold.push(temp);
            teamScore += temp.skillLevel ?? 5;
          } else {
            const demIndex = await IndexOfClosetScore(
              dem,
              scoreGoal - teamScore / 2
            );
            const temp = dem.at(demIndex);
            teamScore += temp!.skillLevel ?? 5;
            memberHold.push(temp!);

            dem = dem.filter((member: User) => member.id != temp?.id);
          }
        }

        if (platform.length > 0 && memberHold.length < (teamSize ?? 3)) {
          if (memberHold.length == 0) {
            const temp = platform.pop()!;
            memberHold.push(temp);
            teamScore += temp.skillLevel ?? 5;
          } else {
            const plaftormIndex = await IndexOfClosetScore(
              platform,
              scoreGoal - teamScore / 2
            );

            const temp = platform.at(plaftormIndex);
            teamScore += temp!.skillLevel ?? 5;

            memberHold.push(temp!);
            platform = platform.filter((member: User) => member.id != temp?.id);
          }
        }
      }
    }

    out.push({
      name: (tag ?? "") + "Team " + (out.length + 1),
      id: "-1",
      eventId: "-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      members: memberHold,
    });
    console.log("Created team " + (tag ?? "") + "Team " + (out.length + 1));
  }
  console.log(tag + "Teams Completed");

  return out;
}

async function IndexOfClosetScore(members: User[], target: number) {
  var error = 0;
  var lastRun = 0;
  let index = -1;
  do {
    var run = members.filter(
      (member: User) =>
        (member.skillLevel ?? 5 <= error + target) ||
        (member.skillLevel ?? 5 >= error - target)
    );
    if (run.length > 1) {
      error += 1;
    }
    //previous error run was best case, select from there
    if (lastRun > 0 && lastRun <= run.length) {
      return getRandomInt(run.length - 1);
    }

    if (run.length == 1) return 0;

    lastRun = run.length;
  } while (!(index > -1));

  return index;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
