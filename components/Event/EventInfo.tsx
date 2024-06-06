"use client";

import { EventProps, TeamProps } from "@/types";
import { useEffect, useState } from "react";

import { Event, Riddle, TeamEntry, User } from "@prisma/client";
import EventModal from "./EventModal";
import {
  Tooltip,
  Avatar,
  Card,
  Divider,
  Badge,
  Button,
  Title,
  Group,
  Stack,
  Text,
  Loader,
} from "@mantine/core";
import { notFound, useRouter } from "next/navigation";
import EventCountDown from "./EventCountDown";
import TeamUserRegisterPage from "./TeamUserRegisterPage";
import TeamEventSignUp from "./TeamEventSignUp";
import { useSession } from "next-auth/react";
import { GetFullUser } from "../User/UserControl";

export default function EventInfo(props: {
  event: EventProps;
  riddles?: Riddle[];
  admin?: boolean;
}) {
  const { data: session } = useSession();
  const [fullUser, setFullUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const updateUser = async () => {
      const full = await GetFullUser(session!.user!.id!);
      if (full) setFullUser(full);
    };
    updateUser();
  }, []);

  const event = props.event;
  const teams = props.event.teams;

  const now = new Date();
  const start = event.start.toLocaleString();
  const end = event.end.toLocaleString();

  const TeamsGroup = () => {
    if (teams) {
      const trimmedTeams = teams?.slice(0, 20);
      return (
        <Stack gap="xs">
          <Title order={4}>Teams</Title>
          <Tooltip.Group>
            <Avatar.Group>
              {trimmedTeams.map((team: TeamProps) => {
                if (team.name) {
                  let initials: string = team.name
                    .split(" ")
                    .map((n) => n[0])
                    .join(".");

                  let label = (
                    <Stack gap={0}>
                      <Text>{team.name}</Text>
                      {team.members!.map((member: User) => (
                        <Text key={member.name}>{member.name}</Text>
                      ))}
                    </Stack>
                  );

                  return (
                    <Tooltip key={team.id} multiline label={label}>
                      <Avatar>{initials}</Avatar>
                    </Tooltip>
                  );
                }
              })}
              {teams?.length > 20 && <Avatar>{`+${teams.length - 20}`}</Avatar>}
            </Avatar.Group>
          </Tooltip.Group>
        </Stack>
      );
    }
  };

  const Participants = () => {
    const participants = event.participants?.slice(0, 20);
    return (
      <Stack gap="xs">
        <Title order={4}>Participants</Title>
        <Tooltip.Group>
          <Avatar.Group>
            {participants.map((user: User) => {
              if (user.name) {
                let initials: string = user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join(".");

                return (
                  <Tooltip key={user.id} multiline label={user.name}>
                    <Avatar src={user.image}>{initials}</Avatar>
                  </Tooltip>
                );
              }
            })}
            {participants?.length > 20 && (
              <Avatar>{`+${participants.length - 20}`}</Avatar>
            )}
          </Avatar.Group>
        </Tooltip.Group>
      </Stack>
    );
  };

  const signUpButton = () => {
    if (fullUser) {
      if (event.useAssignedTeams && !event.generatedTeams)
        return <TeamUserRegisterPage event={event} user={fullUser} />;
      if (event.useTeams || (event.useAssignedTeams && event.generatedTeams))
        return <TeamEventSignUp user={fullUser} event={event} />;
    } else return "No Sign Up";
  };

  if (event.public || props.admin)
    return (
      <Stack>
        <Group justify="space-between">
          <Title>{event.name}</Title>

          <Group>
            <Divider orientation="vertical" />
            {props.admin && !event.public && <Badge>Private</Badge>}
            {!event.active && (
              <Tooltip label="Event starts at">
                <Badge color="green">{start}</Badge>
              </Tooltip>
            )}

            {(event.active || props.admin) && (
              <Tooltip label="Event ends at">
                <Badge color="indigo">{end}</Badge>
              </Tooltip>
            )}
            {event.active && (
              <Tooltip label="Registration Closed">
                <Badge variant="gradient">Event is Live!</Badge>
              </Tooltip>
            )}
          </Group>
        </Group>

        <Divider />

        <Stack>
          <Text py={32}>{event.description}</Text>
          <Group grow>
            {event.prize && (
              <Stack gap={0}>
                <Text size="xs" c="dimmed">
                  Prize:
                </Text>
                {event.prize.split("/n").map((input: string) => (
                  <Text mih={12} key={input} size="lg">
                    {input}
                  </Text>
                ))}
              </Stack>
            )}
            <EventCountDown event={event} />
          </Group>

          {event.showTeams && event.teams && event.teams.length > 0 && (
            <TeamsGroup />
          )}
          {event.showParticipants && event.participants.length > 0 && (
            <Participants />
          )}
        </Stack>

        <Divider />

        <Group>
          {((now < event.start && !event.active) || props.admin) &&
            signUpButton()}

          {props.admin && (
            <EventModal buttonText={"Edit Event"} event={event} />
          )}
        </Group>
      </Stack>
    );
}
