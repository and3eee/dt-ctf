import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import UserEdit from "./UserEdit";
import { User } from "@prisma/client";

export default function UserModal(props: {
  user: User;
  onResolve?: () => void;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="User Editor">
        <UserEdit user={props.user} onClick={props.onResolve} />
      </Modal>
      <Button onClick={open}>Edit</Button>
    </>
  );
}
