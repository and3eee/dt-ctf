"use client";

import { EventProps } from "@/types";
import { useState } from "react";

import { Event, Riddle, TeamEntry } from "@prisma/client";
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
  Stack, Text,
} from "@mantine/core";
import { notFound, useRouter } from "next/navigation";

interface EventCardProps {
  event: Event;
  teams?: TeamEntry[];
  riddles?: Riddle[];
  admin?: boolean;
}

export default function EventCard(props: EventCardProps) {
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

  //TODO: Replace the circular chart with Stratos Donut chart, which should support showing per person contribution as well

  if (event.public || props.admin)
    return (
      <Card withBorder shadow="md" maw="50rem">
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
            {event.prize && (
              <Stack gap={0}>
                <Text size="xs" c="dimmed">Prize:</Text>
                {event.prize.split("/n").map((input: string) => <Text key={input} size="lg">{input}</Text>)}
              </Stack>
            )}
            {teams && event.showTeams && teams.length > 0 && (
              <Group>
                <h1 className="text-xl">Teams:</h1>
                <TeamsGroup />
              </Group>
            )}
          </Stack>

          <Divider />

          <Group>
            {((now < event.start && !event.active) || props.admin) && (
              <Button
                color="green"
                className="justify-self-end"
                onClick={() => {
                  router.replace(`/${event.id}/signup`);
                }}
              >
                Sign Up
              </Button>
            )}
            <Button
              className="justify-self-end"
              onClick={() => {
                router.replace(`/${event.id}`);
              }}
            >
              Goto Event Page
            </Button>
            {props.admin && (
              <EventModal buttonText={"Edit Event"} event={event} />
            )}
          </Group>
        </Stack>
      </Card>
    );
    else notFound();
}
