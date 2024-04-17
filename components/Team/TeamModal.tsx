"use client";

import TeamEdit from "./TeamEdit";

import { NextRequest } from "next/server";

import { usePathname, useRouter } from "next/navigation";
import { TeamEntry } from "@prisma/client";
import { TeamProps } from "@/types";
import { useDisclosure } from "@mantine/hooks";
import { Button, Modal, ModalContent } from "@mantine/core";
interface TeamModalProps extends TeamProps {
  buttonText: string;
}

export default function TeamModal(props: TeamModalProps, request: NextRequest) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button color="primary" onClick={open}>
        {props.buttonText}
      </Button>

      <Modal opened={opened} onClose={close} size="3xl">
        <ModalContent>
          <TeamEdit
            onClick={close}
            id={props.id}
            name={props.name}
            eventId={props.eventId}
            event={props.event}
          />
        </ModalContent>
      </Modal>
    </>
  );
}
