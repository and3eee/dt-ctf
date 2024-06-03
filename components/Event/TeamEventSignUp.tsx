"use client";
import { EventProps } from "@/types";

import { GetTeams } from "./EventControl";
import TeamModal from "../Team/TeamModal";
import TeamList from "../Team/TeamList";
import { useRouter } from "next/navigation";
import { Text, Button, Card, Divider } from "@mantine/core";
import { modals } from "@mantine/modals";
import { User } from "next-auth";

export interface TeamEventSignUpProps {
  event: EventProps;
  user: User;
  small?: boolean;
}

const columns = [
  { key: "name", label: "Name" },
  { key: "members", label: "Members" },
];

export default function TeamEventSignUp(props: TeamEventSignUpProps) {
  const router = useRouter();

  if (props.event.useTeams) {
    return (
      <Button
        onClick={() =>
          modals.open({
            title: "Please confirm your action",

            children: (
              <Card>
                <Card.Section>
                  <p className="text-xl bold">{props.event.name} Sign Up</p>
                </Card.Section>
                <Divider />
                <Card.Section className="flex flex-col gap-3">
                  <p>{props.event.description}</p>

                  <p className="text-medium">
                    Select a team to join or create a new one.
                  </p>

                  {props.event.teams && (
                    <TeamList
                      event={props.event}
                      small={props.small}
                      user={props.user}
                    />
                  )}
                  {!props.event.active && (
                    <TeamModal
                      buttonText={"Create Team"}
                      id={"NEW"}
                      name={""}
                      eventId={props.event.id}
                    />
                  )}
                </Card.Section>
              </Card>
            ),
          })
        }
      ></Button>
    );
  }
}
