"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import EventEdit from "./EventEdit";
import { EventProps } from "@/types";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate-path";
import { NextRequest } from "next/server";

import { usePathname, useRouter } from "next/navigation";
interface EventModalProps extends EventProps {
  buttonText: string;
}

export default function EventModal(
  props: EventModalProps,
  request: NextRequest
) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        {props.buttonText}
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
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
              onClick={onClose} teamSize={props.teamSize}            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
