import { Modal, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Riddle, RiddleResource } from "@prisma/client";
import { useSession } from "next-auth/react";
import RiddleEdit from "../Riddle/RiddleEdit";
import RiddleResourceEdit from "./RiddleResourceEdit";

export default function RiddleResourceModal(props: {
  resource: RiddleResource | any;
  createNew?: boolean;
  onClose?: () => void;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const session = useSession();
  if (props.createNew) {
    const newRiddle: RiddleResource = {
      id: 0,
      name: "",
      description: null,
      link: null,
      AuthInfo: null,
      owner: null,
      createdAt: new Date(),
      updatedAt: new Date()
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
          <RiddleResourceEdit
            resource={newRiddle}
            onClick={() => {
              if (props.onClose) props.onClose();
              close();
            }}
          />
        </Modal>
        <Button onClick={open}>Create New Resource</Button>
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
          <RiddleResourceEdit
            resource={props.resource!}
            onClick={() => {
              if (props.onClose) props.onClose();
              close();
            }}
          />
        </Modal>

        <Button onClick={open} h={"2rem"} maw={"3rem"} p={0}>Edit</Button>
      </>
    );
}
