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
import RiddleEdit from "./RiddleEdit";
import { RiddleProps } from "@/types";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate-path";
import { NextRequest } from "next/server";

import { usePathname, useRouter } from 'next/navigation'
interface RiddleModalProps extends RiddleProps{
  buttonText: string

}


export default function RiddleModal(props: RiddleModalProps, request:NextRequest) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();


  return (
    <>
      <Button color="primary" onPress={onOpen}>{props.buttonText}</Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <RiddleEdit
              id={props.id}
              riddle={props.riddle}
              solution={props.solution}
              implemented={props.implemented}
              difficulty={props.difficulty}
              bucket={props.bucket}
              topic={props.topic}
              sourceDescription={props.sourceDescription}
              sourceLocation={props.sourceLocation}
              sourcePlaceHolder={props.sourcePlaceHolder}
              sourceURL={props.sourceURL} validated={props.validated}
              author={props.author}
              onClick={onClose}            
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
