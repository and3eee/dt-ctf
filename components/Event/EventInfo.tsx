"use client";

import { EventProps } from "@/types";
import { useState } from "react";

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
} from "@mantine/core";
import { notFound, useRouter } from "next/navigation";
import EventCountDown from "./EventCountDown";
import TeamUserRegisterPage from "./TeamUserRegisterPage";
import TeamEventSignUp from "./TeamEventSignUp";


interface EventCardProps {
  event: EventProps;
  teams?: TeamEntry[];
  riddles?: Riddle[];
  admin?: boolean;
  user?: User;
}

export default function EventInfo(props: EventCardProps) {
  const event = props.event;
  const teams = props.teams;
  const riddles = props.riddles;

  const now = new Date();
  const start = event.start.toLocaleString();
  const end = event.end.toLocaleString();

  var diff = Math.abs(now.getTime() - props.event.start.getTime());
  var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  var diffHrs = Math.floor(
    (Math.abs(props.event.start.getTime() - props.event.end.getTime()) %
      86400000) /
      3600000
  ); // hours
  var diffMins = Math.round(
    Math.abs(props.event.start.getTime() - props.event.end.getTime()) / 60000
  ); // minutes

  const router = useRouter();

  function TeamsGroup() {
    if (teams) {
      const trimmedTeams = teams.slice(0, 10);
      return (
        <div className="flex flex-row">
          {trimmedTeams.map((team: TeamEntry) => {
            if (team.name) {
              let initials: string = team.name
                .split(" ")
                .map((n) => n[0])
                .join(".");

              return (
                <Tooltip key={team.id} label={team.name}>
                  <Avatar>{initials}</Avatar>
                </Tooltip>
              );
            }
          })}
          {teams?.length > 10 && <Avatar>{`+${teams.length - 10}`}</Avatar>}
        </div>
      );
    }
  }

  const signUpButton = () => {
    if (props.user) {
      if (event.useAssignedTeams) return <TeamUserRegisterPage event={event} user={props.user}/>;
      if (event.useTeams)
        return <TeamEventSignUp user={props.user} event={event} />;
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
                <Badge color="warning">{end}</Badge>
              </Tooltip>
            )}
            {event.active && (
              <Tooltip label="Registration Closed">
                <Badge color="critical">Event is Live!</Badge>
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
          {teams && event.showTeams && teams.length > 0 && (
            <Group>
              <h1 className="text-xl">Teams:</h1>
              <TeamsGroup />
            </Group>
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
