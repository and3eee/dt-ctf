import AdminCheck from "@/components/Auth/AdminCheck";
import RiddleCard from "@/components/Riddle/RiddleCard";
import RiddleModal from "@/components/Riddle/RiddleModal";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Button } from "@nextui-org/button";
import RiddleList from "@/components/Riddle/RiddleList";
import EventCard from "@/components/Event/EventCard";
import EventModal from "@/components/Event/EventModal";
import { TeamEntry } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 600;

export default async function EventPage() {
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
    <AdminCheck>
      <div className="grid gap-5 justify-center align-center">
        <EventModal
          event={undefined}
          createMode
          buttonText={"Create New Event"}
        />

        {events.map((event) => {
          let users: string[] = [];
          event.participants.forEach((user) => {
            users.push(user.name);
          });
          let teams: TeamEntry[] = event.teams;
          return (
            <EventCard
              key={event.id}
              event={event}
              teams={event.teams}
              riddles={event.riddles}
              admin
            />
          );
        })}
      </div>
    </AdminCheck>
  );
}
