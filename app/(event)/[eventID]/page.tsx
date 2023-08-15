//Leaderboard/info page

import EventLeaderBoard from "@/components/Event/EventLeaderBoard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 5;

export default async function EventPage({
    params,
  }: {
    params: { eventID: string };
  }) {
    const event = await prisma.event.findFirst({ where: { id: params.eventID } ,include:{teams:{include:{members:true,userEntries:true}}}});
  
    return(<div><EventLeaderBoard event={event!} teams={event!.teams}/></div>)
}