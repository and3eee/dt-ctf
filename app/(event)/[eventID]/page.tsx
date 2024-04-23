//Leaderboard/info page

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GetUserTeamID } from "@/components/Event/EventControl";
import EventLeaderBoard from "@/components/Event/EventLeaderBoard";
import EventStateButton from "@/components/Event/EventStateButton";
import { prisma } from "@/lib/prisma";

import { auth } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export default async function EventPage({
    params,
  }: {
    params: { eventID: string };
  }) {
    const event = await prisma.event.findFirst({ where: { id: params.eventID } ,include:{teams:{include:{members:true,userEntries:true}}}});


    return(<div > <EventStateButton event={event!}/><EventLeaderBoard event={event!} teams={event!.teams}/></div>)
}