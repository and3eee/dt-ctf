//Leaderboard/info page

import { auth } from "@/app/api/auth/[...nextauth]/route";
import Error from "@/app/error";
import { GetUserTeamID } from "@/components/Event/EventControl";
import EventCountDown from "@/components/Event/EventCountDown";
import EventInfo from "@/components/Event/EventInfo";
import EventLeaderBoard from "@/components/Event/EventLeaderBoard";
import EventStateButton from "@/components/Event/EventStateButton";
import { prisma } from "@/lib/prisma";
import { EventProps } from "@/types";
import { Container } from "@mantine/core";
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
      participants: true,
      teams: {
        include: {
          members: true,
          userEntries: { include: { answeredBy: true } },
        },
      },
    },
  });

  const session = await auth();
  const user = await prisma.user.findFirst({
    where: { id: session?.user?.id },
  });
  const admin = user?.role == "ORGANIZER" || user?.role == "ADMIN";
  const now = new Date();

  if (event && session) {
    if (event?.public || admin) {
      if (event.active) {
        //Show Team list and so
      }

      if (event.start > now) {
        //Count down and event Car
        return (
          <Container maw="60%">
            <EventInfo admin={admin} event={event} user={user!} />
          </Container>
        );
      }
    }

    return <div></div>;
  }
}
