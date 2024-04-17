"use client";

import EventEdit from "./EventEdit";
import { EventProps } from "@/types";
import { Button, Modal, ModalContent } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NextRequest } from "next/server";

interface EventModalProps extends EventProps {
  buttonText: string;
}

export default function EventModal(
  props: EventModalProps,
  request: NextRequest
) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button color="primary" onClick={open}>
        {props.buttonText}
      </Button>

      <Modal opened={opened} onClose={close} size="3xl">
        <ModalContent>
          <EventEdit
            id={props.id}
            name={props.name}
            start={props.start}
            end={props.end}
            description={props.description}
            requireURL={props.requireURL}
            requireScreenshot={props.requireScreenshot}
            active={props.active}
            participants={props.participants}
            riddleCount={0}
            showTeams={props.showTeams}
            showParticipants={props.showParticipants}
            public={props.public}
            useTeams={props.useTeams}
            onClick={close}
            teamSize={props.teamSize}
          />
        </ModalContent>
      </Modal>
    </>
  );
}
