import { auth } from "@/app/api/auth/[...nextauth]/route";
import EventRiddleList from "@/components/Event/EventRiddleList";
import TeamList from "@/components/Team/TeamList";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function EventAdmin({
  params,
}: {
  params: { eventID: string };
}) {
  const session = await auth();
  if (session?.user) {
    const user = await prisma.user.findFirstOrThrow({
      where: { id: session?.user.id },
    });
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
    })


    const riddles = await prisma.riddle.findMany();

    if (event) {
      return (
        <div className="flex flex-col gap-5">
          <p className="text-3xl">{event.name} Admin </p>
          <EventRiddleList user={user} event={event} riddles={riddles} resources={[]} />
        </div>
      );
    }
  }
}
