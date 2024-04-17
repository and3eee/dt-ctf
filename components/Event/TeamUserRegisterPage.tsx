"use client";

import { Button, Card, Divider } from "@mantine/core";


import { Event } from "@prisma/client";
import { useRouter } from "next/navigation";



const columns = [
  { key: "name", label: "Name" },
  { key: "members", label: "Members" },
];

export default function TeamUserRegisterPage(props: { event: Event }) {
  const event = props.event;
  const router = useRouter();

  if (event.active) {
    router.replace(`/${event.id}`);
  }
  if (event.useTeams) {
    return (
      
      <Card>
        <Card.Section >
          <p className="text-xl bold">{event.name} Registration</p>
        </Card.Section >
        <Divider />
        <Card.Section className="flex flex-col gap-3">
          <p>{event.description}</p>
          <p> Teams will be assigned to provide a fair competition</p>
        </Card.Section>

        <Card.Section >
          <Button>Register for Event</Button>
        </Card.Section >
      </Card>
    );
  }
}
