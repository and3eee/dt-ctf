"use client";
import { EventProps } from "@/types";
import { User } from "@prisma/client";
import TeamModal from "../Team/TeamModal";
import TeamList from "../Team/TeamList";
import { useRouter } from "next/navigation";
import { Text, Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";

export default function TeamEventSignUp(props: {
  event: EventProps;
  user: User;
  small?: boolean;
}) {
  if (props.event.useTeams) {
    return (
      <Button
      variant="gradient"
        onClick={() =>
          modals.open({
            title: "Sign-Up for a Team",
            size:"xl",
            children: (
              <Stack>
            
                <Stack>
           

                  <Text>
                    Select a team to join or create a new one.
                  </Text>

                  {props.event.teams && (
                    <TeamList
                      event={props.event}
                
                      user={props.user}
                    />
                  )}
                  {!props.event.active && (
                    <TeamModal
                      onClick={modals.closeAll}
                      team={{
                        id: "",
                        name: "Default Team Name",
                        eventId: props.event.id,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      }}
                      user={props.user}
                      createMode
                    />
                  )}
                </Stack>
              </Stack>
            ),
          })
        }
      >
        Teams Sign Up
      </Button>
    );
  }
}
