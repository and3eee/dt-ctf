"use client";

import { Button } from "@nextui-org/button";
import { Card, CardHeader, Divider, CardBody, CardFooter } from "@nextui-org/react";
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
        <CardHeader>
          <p className="text-xl bold">{event.name} Registration</p>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-3">
          <p>{event.description}</p>
          <p> Teams will be assigned to provide a fair competition</p>
        </CardBody>

        <CardFooter>
          <Button>Register for Event</Button>
        </CardFooter>
      </Card>
    );
  }
}
