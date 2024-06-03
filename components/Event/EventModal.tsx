"use client";

import EventEdit from "./EventEdit";

import { Event } from "@prisma/client";
import { Button, Modal, ModalContent } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NextRequest } from "next/server";

export default function EventModal(
  props: { event: any | undefined; buttonText?: String; createMode?: boolean },
  request: NextRequest
) {
  const [opened, { open, close }] = useDisclosure(false);
  const newEvent: Event = {
    id: "New Event",
    name: "New Event",
    description: "",
    start: new Date(),
    end: new Date(),
    prize: null,
    requireURL: false,
    requireScreenshot: false,
    active: false,
    useAssignedTeams: false,
    showParticipants: false,
    showTeams: true,
    useTeams: true,
    teamSize: 4,
    public: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };


  if (props.createMode)
    return (
      <>
        <Button  onClick={open}>
          {props.buttonText ?? "Create Event"}
        </Button>

        <Modal opened={opened} onClose={close} size="auto">
          <EventEdit createMode event={newEvent} onClick={close} />
        </Modal>
      </>
    );
  else {
    return (
      <>
        <Button  onClick={open}>
          {props.buttonText ?? "Edit Event"}
        </Button>

        <Modal opened={opened} onClose={close} size="3xl">
          <EventEdit event={props.event!} onClick={close} />
        </Modal>
      </>
    );
  }
}
