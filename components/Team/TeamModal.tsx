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
import TeamEdit from "./TeamEdit";

import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate-path";
import { NextRequest } from "next/server";

import { usePathname, useRouter } from "next/navigation";
import { TeamEntry } from "@prisma/client";
import { TeamProps } from "@/types";
interface TeamModalProps extends TeamProps {
  buttonText: string;
}

export default function TeamModal(props: TeamModalProps, request: NextRequest) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        {props.buttonText}
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <TeamEdit
                          onClick={onClose}
                          id={props.id}
                          name={props.name}
                          eventId={props.eventId} event={props.event}            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
