//Leaderboard/info page

import { auth } from "@/app/api/auth/[...nextauth]/route";
import Error from "@/app/error";
import AuthCheck from "@/components/Auth/AuthCheck";
import { GetUserTeamID } from "@/components/Event/EventControl";
import EventCountDown from "@/components/Event/EventCountDown";
import EventInfo from "@/components/Event/EventInfo";
import EventLeaderBoard from "@/components/Event/EventLeaderBoard";
import EventPortal from "@/components/Event/EventPortal";
import EventStateButton from "@/components/Event/EventStateButton";
import { prisma } from "@/lib/prisma";
import { EventProps, TeamProps } from "@/types";
import { Container } from "@mantine/core";
import { TeamEntry, User } from "@prisma/client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export default async function EventPage({
  params,
}: {
  params: { eventID: string };
}) {
  const event = await prisma.event.findFirst({
    where: { id: { startsWith: params.eventID } },
    include: {
      riddles: { include: { RiddleResource: true } },
      participants: true,
      teams: {
        include: {
          members: true,
          userEntries: { include: { answeredBy: true } },
        },
      },
    },
  });


  const now = new Date();
  if (event) {
    if (event?.public) {
      if (event.active) {
        //Show Team list and so
        return (
          <AuthCheck>
            <EventPortal
              event={event}
              riddles={event.riddles}
             
            />
          </AuthCheck>
        );
      }

      if (event.start > now) {
        //Count down and event Car
        return (
          <AuthCheck>
            <Container maw="60%">
              <EventInfo event={event} />
            </Container>
          </AuthCheck>
        );
      }
    }

    return <div></div>;
  } else {
    if (!event) return notFound();
    return <div>Sign in to see event info.</div>;
  }
}
