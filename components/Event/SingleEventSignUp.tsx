import { EventProps } from "@/types";
import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";

import { User } from "@prisma/client";
import { RiClipboardFill } from "react-icons/ri";
import EventCard from "./EventCard";
import { RegisterUserForEvent } from "./EventControl";

export default function SingleEventSignUp(props: {
  user: User;
  event: EventProps;
}) {

    const signUp = async() => {
        const result = await RegisterUserForEvent(props.event,props.user)
    }


  const openModal = () =>
    modals.openConfirmModal({

      children: (
        <Stack align="center">
          <Title>{props.event.name}</Title>
          <Group gap="xl" >
            <Stack gap="xs">
              <Text c="dimmed">Starting:</Text>
              <Text>{props.event.start.toLocaleDateString()}</Text>
            </Stack>
            <Stack gap="xs">
              {" "}
              <Text c="dimmed">Ending:</Text>
              <Text>{props.event.end.toLocaleDateString()}</Text>
            </Stack>
          </Group>
          <Stack gap="xs">
              {" "}
              <Text c="dimmed">Description:</Text>
              <Text>{props.event.description}</Text>
            </Stack>
        </Stack>
      ),
      labels: { confirm: "Sign Up", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => signUp(),
    });

  return (
    <Button color="green" onClick={openModal} leftSection={<RiClipboardFill />}>
      Sign Up
    </Button>
  );
}
