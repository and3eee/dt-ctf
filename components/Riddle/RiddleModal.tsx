"use client";

import { RiddleProps } from "@/types";

import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import RiddleEdit from "./RiddleEdit";
import { Riddle } from "@prisma/client";
import { useSession } from "next-auth/react";


export default function RiddleModal(props: {
  buttonText: string;
  riddle?: Riddle;
  createNew?: boolean;
  onClose?: () => void;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const session = useSession();
  if (props.createNew) {
    const newRiddle: Riddle = {
      id: -1,
      riddle: "",
      difficulty: "none",
      bucket: "none",
      topic: "none",
      author: session.data?.user?.name ?? "",
      implemented: false,
      validated: false,
      solution: "ctf_00000000",
      sourceLocation: null,
      sourceDescription: null,
      sourceURL: null,
      sourcePlaceHolder: null,
      eventId: null,
      showRiddleResource: false
    };
    return (
      <>
        <Modal
          size="auto"
          opened={opened}
          onClose={close}
          title="Create New Flag"
          centered
        >
          <RiddleEdit riddle={newRiddle} onClick={() => {
              if (props.onClose) props.onClose();
              close();
            }} />
        </Modal>
        <Button onClick={open}>{props.buttonText}</Button>
      </>
    );
  } else
    return (
      <>
        <Modal
          size="auto"
          opened={opened}
          onClose={close}
          title="Authentication"
          centered
        >
          <RiddleEdit
            riddle={props.riddle!}
            onClick={() => {
              if (props.onClose) props.onClose();
              close();
            }}
          />
        </Modal>

        <Button onClick={open}>{props.buttonText}</Button>
      </>
    );
}
