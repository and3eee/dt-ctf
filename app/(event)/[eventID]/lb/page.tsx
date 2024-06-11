import { auth } from "@/app/api/auth/[...nextauth]/route";
import AuthCheck from "@/components/Auth/AuthCheck";
import EventLeaderBoard from "@/components/Event/EventLeaderBoard";
import { prisma } from "@/lib/prisma";
import { RiddleProps } from "@/types";
import { Center } from "@mantine/core";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
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

  if (event) {
    const riddles = await prisma.riddle.findMany({
      where: { eventId: event.id },
      include: { RiddleResource: true },
    });
    return (
      <AuthCheck>
        <Center>
          <EventLeaderBoard
            riddles={riddles.map((riddle: RiddleProps) => {
              return {
                id: riddle.id,
                riddle: riddle.riddle,
                difficulty: riddle.difficulty ?? "easy",
                bucket: riddle.bucket ?? "none",
                author: riddle.author ?? "N/A",
                topic: riddle.topic ?? "",
                eventId: riddle.eventId!,
                RiddleResource: riddle.RiddleResource,
                showRiddleResource: riddle.showRiddleResource,
              };
            })}
            event={event}
            teams={event?.teams}
          />
        </Center>
      </AuthCheck>
    );
  } else notFound();
}
