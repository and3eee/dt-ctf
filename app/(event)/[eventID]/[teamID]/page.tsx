// Team submission page

import AdminCheck from "@/components/Auth/AdminCheck";
import AdminTeamList from "@/components/Team/AdminTeamList";
import TeamRiddleList from "@/components/Team/TeamRiddleList";

import { prisma } from "@/lib/prisma";
import { Card, Card.Section, Card.Section  } from "@nextui-org/react";

export const dynamic = "force-dynamic";
export const revalidate = 5;

export default async function TeamPage({
  params,
}: {
  params: { eventID: string; teamID: string };
}) {
  const event = await prisma.event.findFirst({
    where: { id: params.eventID },
    include: { riddles: true },
  });

  const team = await prisma.teamEntry.findFirst({
    where: { id: params.teamID },
    include: { userEntries: { include: { riddle: true, answeredBy: true } } },
  });

  if (team && event)
    return (
      <div>
        <AdminCheck>
          <AdminTeamList
            team={team}
            riddles={event?.riddles}
            solved={team.userEntries}
          />
        </AdminCheck>
        {event.active && (
          <TeamRiddleList
            team={team}
            riddles={event?.riddles}
            solved={team.userEntries}
          />
        )}
      </div>
    );
}
