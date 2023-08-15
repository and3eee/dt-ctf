import EventRiddleEdit from "@/components/Event/EventRiddleEdit";
import RiddleList from "@/components/Riddle/RiddleList";
import SmallTeamList from "@/components/Team/SmallTeamList";
import TeamList from "@/components/Team/TeamList";
import { prisma } from "@/lib/prisma";
import { Divider } from "@nextui-org/react";

export default async function EventAdmin({
  params,
}: {
  params: { eventID: string };
}) {
  const event = await prisma.event.findFirst({
    where: { id: params.eventID },
    include: { teams: { include: { members: true } }, riddles: true },
  });

  const riddles = await prisma.riddle.findMany();

  if (event) {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-3xl">{event.name} Admin </p>
        <p className="text-xl">Riddles</p>
        <RiddleList riddles={riddles} defaultSelected={event.riddles} eventID={event.id} admin/>
        <p className="text-xl">Teams</p>
        <TeamList
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
          teams={event.teams}
          teamSize={event.teamSize}
          admin={true}
        />
      </div>
    );
  }
}
