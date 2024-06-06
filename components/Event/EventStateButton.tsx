'use client';


import { Event } from "@prisma/client";
import { useRouter } from "next/navigation";
import { StartEvent, StopEvent } from "./EventControl";
import AdminCheck from "../Auth/AdminCheck";
import { Button, Card } from "@mantine/core";

export default function EventStateButton(props: { event: Event }) {
  const event = props.event;
  const router = useRouter();

  const startEvent = async () => {
    const resp = await StartEvent(event.id);

    if (resp) router.refresh();
  };

  const stopEvent = async () => {
    const resp = await StopEvent(event.id);

    if (resp) router.refresh();
  };

  return (
    <AdminCheck>
      {" "}
      <Card>
        {!event.active && (
          <Button color={"success"} onClick={startEvent}>
            Start
          </Button>
        )}
        {event.active && (
          <Button color="danger" onClick={stopEvent}>
            Stop
          </Button>
        )}
      </Card>
    </AdminCheck>
  );
}
