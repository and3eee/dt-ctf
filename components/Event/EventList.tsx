import { Event, TeamEntry } from "@prisma/client";
import AuthCheck from "../Auth/AuthCheck";
import EventModal from "./EventModal";
import { prisma } from "@/lib/prisma";
import AdminCheck from "../Auth/AdminCheck";
import EventCard from "./EventCard";
import { Stack } from "@mantine/core";

export const dynamic = "force-dynamic";
export const revalidate = 15;

export default async function EventList(props: { admin?: boolean }) {
  const events = await prisma.event.findMany({
    include: {
      participants: {
        select: {
          name: true,
        },
      },
      teams: true,
      riddles: true,
    },
  });

  return (
    <Stack justify="center" gap="xl">
      {props.admin && (
        <EventModal
          buttonText={"Create New Event"}
          createMode
          event={undefined}
        />
      )}

      {events.map((event) => {
        if (event.public || props.admin)
          return (
            <EventCard
              key={event.id}
              event={event}
              teams={event.teams}
              riddles={event.riddles}
            />
          );
      })}
    </Stack>
  );
}
