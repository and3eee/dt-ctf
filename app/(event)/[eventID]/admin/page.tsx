import { auth } from "@/app/api/auth/[...nextauth]/route";
import EventAdminMenu from "@/components/Event/EventAdminMenu";
import EventModal from "@/components/Event/EventModal";
import EventRiddleList from "@/components/Event/EventRiddleList";
import TeamGeneratorPanel from "@/components/Event/TeamGeneratorPanel";
import TeamList from "@/components/Team/TeamList";
import { prisma } from "@/lib/prisma";
import { Group, Stack, Title } from "@mantine/core";

export const dynamic = "force-dynamic";

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

    if (event) {
      return (
        <Stack justify="center">
          <Title order={2}>{event.name} Admin View</Title>
          <Group>
          <EventAdminMenu event={event} />
          <EventModal event={event}/>
          </Group>
          <TeamGeneratorPanel event={event} />
          <EventRiddleList
         
            user={user}
            event={event}
            riddles={riddles}
            resources={[]}
          />
        </Stack>
      );
    }
  }
}
