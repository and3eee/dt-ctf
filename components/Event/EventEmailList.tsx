"use client";

import { EventProps } from "@/types";
import { Button, CopyButton, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { RiFileCopyLine } from "react-icons/ri";

export default function EventEmailList(props: { event: EventProps }) {
  const openModal = () =>
    modals.open({
      title: "Email List",
      children: (
        <Stack>
          <CopyButton
            value={props.event.participants
              .map((part) => part.email)
              .toString()}
          >
            {({ copied, copy }) => (
              <Button leftSection={<RiFileCopyLine/>} color={copied ? "teal" : "blue"} onClick={copy}>
                {copied ? "Copied list" : "Copy list"}
              </Button>
            )}
          </CopyButton>
          <Text size="sm">
            {props.event.participants.map((part) => part.email).toString()}
          </Text>
        </Stack>
      ),
    });

  return <Button onClick={openModal}>Get Email List</Button>;
}
