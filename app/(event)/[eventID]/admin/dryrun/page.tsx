import { auth } from "@/app/api/auth/[...nextauth]/route";
import EventPortal from "@/components/Event/EventPortal";
import TeamList from "@/components/Team/TeamList";
import { prisma } from "@/lib/prisma";
import { RiddleProps } from "@/types";
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
    const admin = user.role != "USER";

    if (!admin) return <>Why are you here? {notFound()}</>;

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







    if (event && admin && user) {
      const riddles = await prisma.riddle.findMany({where:{eventId:event.id}, include:{RiddleResource:true}})
      return (
        <Stack>
          <p className="text-3xl">{event.name} Dry Run View </p>
          <EventPortal
            admin
            user={user}
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
           
          />
    </Stack>
      );
    }
  }
}
