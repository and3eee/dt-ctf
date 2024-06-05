"use client";

import { EventProps } from "@/types";
import {
  Badge,
  Button,
  Card,
  Collapse,
  Divider,
  NavLink,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";

import { Event, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import UserEdit from "../User/UserEdit";
import { useDisclosure } from "@mantine/hooks";
import { RegisterUserForEvent } from "./EventControl";
import { RiCheckLine } from "react-icons/ri";

const columns = [
  { key: "name", label: "Name" },
  { key: "members", label: "Members" },
];

export default function TeamUserRegisterPage(props: {
  event: EventProps;
  user: User;
  
}) {
  const event = props.event;
  const router = useRouter()

  if (event.useTeams) {
    if (event.participants.some((member: User) => props.user.id == member.id))
      return <Badge variant="gradient" size="lg" leftSection={<RiCheckLine/>}>Registered!</Badge>;
    return (
      <Button
      variant="gradient"
        onClick={() =>
          modals.open({
            title: "Sign Up",

            children: (
              <Stack align="center">
                <Text>
                  {" "}
                  Teams will be auto generated to balance skill-sets.
                  Adjustments can be made once assigned. Please ensure your
                  account information is up to date for accurate assignments.{" "}
                </Text>

                <NavLink label="Edit Account Info">
                  {" "}
                  <Card shadow="xl">
                    <UserEdit user={props.user} />
                  </Card>
                </NavLink>

                <Button
                  onClick={() => {
                    RegisterUserForEvent(props.event, props.user);
                    router.refresh();
                  }}
                >
                  Register for Event
                </Button>
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
