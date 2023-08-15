// Team submission page

import TeamRiddleList from "@/components/Team/TeamRiddleList";

import { prisma } from "@/lib/prisma";
import { useSession } from "next-auth/react";

export default async function TeamPage({
    params,
  }: {
    params: { eventID: string ,teamID:string};
  }) {

    const event = await prisma.event.findFirst({
      where: { id: params.eventID },
      include: { riddles: true },
    });


    const team = await prisma.teamEntry.findFirst({where:{id:params.teamID},include:{userEntries:{include:{riddle:true,answeredBy:true}}}})

    if(team && event)
    return(<div className={"flex flex-col max-w-full justify-items-center"}>
       {event.active && <TeamRiddleList team={team} riddles={event?.riddles} solved={team.userEntries}/>}
    </div>)
}