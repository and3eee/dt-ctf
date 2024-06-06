//Leaderboard/info page

import { auth } from "@/app/api/auth/[...nextauth]/route";
import Error from "@/app/error";
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
  const session = await auth();
  const user = await prisma.user.findFirst({
    where: { id: session?.user?.id },
  });
  if (session?.user && user) {
    const admin = user.role == "ORGANIZER" || user.role == "ADMIN";

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

    const riddles = await prisma.riddle.findMany();

    const now = new Date();
    if (event && session) {
      if (event?.public || admin) {
        if (event.active) {
          //Show Team list and so
          return (
            <EventPortal
              user={user}
              event={event}
              riddles={event.riddles}
              team={
                event.teams.filter((team: TeamProps) =>
                  team.members?.some((userRun: User) => user.id == userRun.id)
                )[0]
              }
            />
          );
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
    }else{
      if(!event) return notFound();
      return <div>Sign in to see event info.</div>
    }
  }
}
