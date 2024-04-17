"use client";

import { RiddleProps } from "@/types";



import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import RiddleEdit from "./RiddleEdit";
interface RiddleModalProps extends RiddleProps {
  buttonText: string;
}

export default function RiddleModal(
  props :RiddleModalProps
) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Authentication" centered >
        <RiddleEdit riddle={{
          id: -1,
          riddle: "",
          difficulty: null,
          bucket: null,
          topic: null,
          author: null,
          implemented: false,
          validated: false,
          solution: "",
          sourceLocation: null,
          sourceDescription: null,
          sourceURL: null,
          sourcePlaceHolder: null,
          eventId: null
        }} />
      </Modal>

      <Button onClick={open}>Open centered Modal</Button>
    </>
  );
  
}
