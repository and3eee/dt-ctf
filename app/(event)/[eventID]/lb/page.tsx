import { auth } from "@/app/api/auth/[...nextauth]/route";
import AuthCheck from "@/components/Auth/AuthCheck";
import EventLeaderBoard from "@/components/Event/EventLeaderBoard";
import { prisma } from "@/lib/prisma";
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

  if (event)
    return (
      <AuthCheck>
        <Center>
          <EventLeaderBoard event={event} teams={event?.teams} />
        </Center>
      </AuthCheck>
    );
  else notFound();
}
