"use client";

import TeamEdit from "./TeamEdit";

import { NextRequest } from "next/server";

import { usePathname, useRouter } from "next/navigation";
import { TeamEntry, User } from "@prisma/client";
import { TeamProps } from "@/types";
import { useDisclosure } from "@mantine/hooks";
import { Button, Modal, ModalContent } from "@mantine/core";

export default function TeamModal(props:{team: TeamEntry, user: User, createMode?:boolean}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button color="primary" onClick={open}>
        {props.createMode? "Create New Team"  : "Edit Team"}
      </Button>

      <Modal opened={opened} onClose={close} size="3xl">
        <ModalContent>
          <TeamEdit
            onClick={close}
            id={props.team.id}
            name={props.team.name}
            eventId={props.team.eventId}
            event={props.team.event}
          />
        </ModalContent>
      </Modal>
    </>
  );
}
