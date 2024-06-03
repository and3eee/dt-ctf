"use client";

import { EventProps } from "@/types";
import { Button, Card, Collapse, Divider, NavLink, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";

import { Event, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import UserEdit from "../User/UserEdit";
import { useDisclosure } from "@mantine/hooks";

const columns = [
  { key: "name", label: "Name" },
  { key: "members", label: "Members" },
];

export default function TeamUserRegisterPage(props: {
  event: EventProps;
  user: User;
}) {
  const event = props.event;
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure(false);
  if (event.useTeams) {
    return (
      <Button
        onClick={() =>
          modals.open({
            title: "Sign Up",

            children: (
              <Stack align="center">
                <p className="text-xl bold">{event.name} Registration</p>

                <Divider />

                <p>{event.description}</p>
                <p> Teams will be auto generated</p>

                <NavLink component="button" onClick={toggle}>Edit User Preferences</NavLink>
                <Collapse
                  in={opened}
                  transitionDuration={10}
                  transitionTimingFunction="linear"
                >
                  <UserEdit user={props.user} />
                </Collapse>
                <Button>Register for Event</Button>
              </Stack>
            ),
          })
        }
      >
        Sign Up
      </Button>
    );
  }
}
