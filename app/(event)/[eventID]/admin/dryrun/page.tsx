import { auth } from "@/app/api/auth/[...nextauth]/route";
import EventPortal from "@/components/Event/EventPortal";
import TeamList from "@/components/Team/TeamList";
import { prisma } from "@/lib/prisma";
import { Stack } from "@mantine/core";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function EventDryRunView({
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

    if (!admin) return <>Why are you here? {notFound()}</>;

    const event = await prisma.event.findFirst({
      where: { id: { startsWith: params.eventID } },
      include: {
        riddles: {include:{RiddleResource:true}},
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

    if (event && admin && user) {
      return (
        <Stack>
          <p className="text-3xl">{event.name} Dry Run View </p>
          <EventPortal
            admin
            user={user}
            event={event}
            riddles={event.riddles}
            team={{
              id: "Test",
              name: "Placeholder",
              event: event,
              eventId: event.id,
              userEntries: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              members: [],
            }}
          />
    </Stack>
      );
    }
  }
}
