"use client";

import { Button, Loader, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import UserEdit from "./UserEdit";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { GetFullUser } from "./UserControl";
import { useState, useEffect } from "react";

export default function UserModal(props: {

  onResolve?: () => void;
}) {

  const session = useSession();
  const [fullUser, setFullUser] = useState<User | undefined>(undefined);
  if (session.status == "loading" || !fullUser) return <Loader />;

  useEffect(() => {
    const updateUser = async () => {
      if (session.status == "authenticated") {
        const full = await GetFullUser(session.data.user!.id!);
        if (full) setFullUser(full);
      }
    };
    updateUser();
  }, []);
  
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="User Editor">
        <UserEdit user={fullUser} onClick={props.onResolve} />
      </Modal>
      <Button maw={"8rem"} onClick={open}>Edit</Button>
    </>
  );
}
