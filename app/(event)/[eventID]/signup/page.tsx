import AuthCheck from "@/components/AuthCheck";
import TeamEventSignUp from "@/components/Event/TeamEventSignUp";
import SmallTeamList from "@/components/Team/SmallTeamList";
import { prisma } from "@/lib/prisma";
import { Card } from "@nextui-org/react";
import { M_PLUS_1 } from "next/font/google";

export default async function EventSignUp({
  params,
}: {
  params: { eventID: string };
}) {
  const event = await prisma.event.findFirst({ where: { id: params.eventID } ,include:{teams:{include:{members:true}}}});


  if (event) {
    return (
      <AuthCheck>
        
        <TeamEventSignUp
          id={event.id}
          name={event.name}
          start={event.start}
          end={event.end}
          description={event.description ?? false}
          requireURL={event.requireURL ?? false}
          requireScreenshot={event.requireScreenshot ?? false}
          active={event.requireScreenshot ?? false}
          participants={[]}
          riddleCount={0}
          showTeams={event.showTeams ?? false}
          showParticipants={event.showParticipants ?? false}
          public={event.public ?? false}
          useTeams={event.useTeams ?? false}
          teams={event.teams} teamSize={event.teamSize}  small      />
      </AuthCheck>
    );
  }
}
