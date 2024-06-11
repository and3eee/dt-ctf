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
import { EventProps, RiddleProps, TeamProps } from "@/types";
import { Container } from "@mantine/core";
import { TeamEntry, User } from "@prisma/client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EventPage({
  params,
}: {
  params: { eventID: string };
}) {
  const session = await auth();

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

  if (session?.user) {
    const user = await prisma.user.findFirst({
      where: { id: session.user.id },
    });
    if (user) {
      
      const admin = user.role == "ADMIN" || user.role == "ORGANIZER";
      const now = new Date();
      if (event) {
        const riddles = await prisma.riddle.findMany({where:{eventId:event.id}, include:{RiddleResource:true}})
        if (event?.public || admin) {
          if (
            event.active &&
            event.start <= now &&
            now <= event.end &&
            event.teams.some((team: TeamProps) =>
              team.members?.some((member) => member.id == user.id)
            )
          ) {
            //Show Team list and so
            return (
              <AuthCheck>
                <EventPortal
                  admin={admin}
                  event={event}
                  riddles={riddles.map((riddle: RiddleProps) => {
                    return {
                      id: riddle.id,
                      riddle: riddle.riddle,
                      difficulty: riddle.difficulty ?? "easy",
                      bucket: riddle.bucket ?? "none",
                      author: riddle.author ?? "N/A",
                      topic: riddle.topic ?? "",
                      eventId: riddle.eventId!,
                      RiddleResource:riddle.RiddleResource,
                      showRiddleResource:riddle.showRiddleResource
                    };
                  })}
                  user={user}
                />
              </AuthCheck>
            );
          }

          //Count down and event Car
          return (
            <AuthCheck>
              <Container maw="60%">
                <EventInfo
                  admin={admin}
                  event={event}

                  user={user}
                />
              </Container>
            </AuthCheck>
          );
        }

        return <div></div>;
      } else {
        if (!event) return notFound();
        return <div>Sign in to see event info.</div>;
      }
    }
  }
}
