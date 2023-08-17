import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthCheck from "@/components/AuthCheck";
import TeamEventSignUp from "@/components/Event/TeamEventSignUp";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";


export const dynamic = "force-dynamic";
export const revalidate = 30;

export default async function EventSignUp({
  params,
}: {
  params: { eventID: string };
}) {
  const event = await prisma.event.findFirst({ where: { id: params.eventID } ,include:{teams:{include:{members:true}}}});




  if(event)
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
          active={event.active ?? false}
          participants={[]}
          riddleCount={0}
          showTeams={event.showTeams ?? false}
          showParticipants={event.showParticipants ?? false}
          public={event.public ?? false}
          useTeams={event.useTeams ?? false}
          teams={event.teams} teamSize={event.teamSize} small />
      </AuthCheck>
    );
  
}
