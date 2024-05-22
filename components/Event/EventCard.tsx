"use client";

import { EventProps } from "@/types";
import { useState } from "react";

import { Event, Riddle, TeamEntry } from "@prisma/client";
import EventModal from "./EventModal";
import { Tooltip, Avatar, Card, Divider, Chip, Button } from "@mantine/core";
import { useRouter } from "next/router";

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
              
                  <Tooltip label={team.name}>
                    <Avatar color="primary">{initials}</Avatar>
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
      <Card
        withBorder
        shadow="sm"
      >
        <Card.Section className="flex gap-3">
          <h1 className="flex-grow text-large font-medium mt-2">
            {event.name}
          </h1>
          <Divider orientation="vertical" />
          {props.admin && !event.public && <Chip color="primary">Private</Chip>}
          {!event.active && (
            <Tooltip label="Event starts at">
              <Chip color="success">{start}</Chip>
            </Tooltip>
          )}

          {(event.active || props.admin) && (
            <Tooltip label="Event ends at">
              <Chip color="warning">{end}</Chip>
            </Tooltip>
          )}
          {event.active && (
            <Tooltip label="Registration Closed">
              <Chip color="critical">Event is Live!</Chip>
            </Tooltip>
          )}
        </Card.Section >
        <Divider />
        <Card.Section  className=" gap-y-20 ">
          <div className="flex flex-row gap-5">
            <p className="basis-2/3">{event.description}</p>
            <Card className="w-[120px] h-[120px] border-none bg-gradient-to-br from-green-500 to-blue-500">
              <Card.Section  className="justify-center items-center pb-0">
            
              </Card.Section >
              <Card.Section  className="justify-center items-center pt-0">
                <Chip>
                  <p>Duration</p>
                </Chip>
              </Card.Section >
            </Card>

            {riddles && (
              <Card className="w-[120px] h-[120px] border-none bg-gradient-to-br from-blue-500 to-cyan-500">
                <Card.Section  className="justify-center items-center pb-0">
                  
                </Card.Section >
                <Card.Section  className="justify-center items-center pt-0">
                  <Chip>
                    <p>Riddles</p>
                  </Chip>
                </Card.Section >
              </Card>
            )}
          </div>

          <div className="grid gap-4 grid-cols-3">
            {event.prize && (
              <div className="flex gap-3">
                <h1 className="text-xl">Prize:</h1>
                <p>{event.prize}</p>
              </div>
            )}
            {teams && event.showTeams && teams.length > 0 && (
              <div className="flex flex-row gap-3">
                <h1 className="text-xl">Teams:</h1>
                <TeamsGroup />
              </div>
            )}
          </div>
        </Card.Section >

        <>
          <Divider />
          <Card.Section  className="flex flex-row-reverse gap-5">
            {((now < event.start && !event.active) || props.admin) && (
              <Button
                color="success"
                className="justify-self-end"
                onClick={() => {
                  router.replace(`/${event.id}/signup`);
                }}
              >
                Sign Up
              </Button>
            )}
            <Button
              color="primary"
              className="justify-self-end"
              onClick={() => {
                router.replace(`/${event.id}`);
              }}
            >
              Goto Event Page
            </Button>
            {props.admin && (
              <EventModal
                buttonText={"Edit Event"}
                id={event.id}
                name={event.name}
                start={event.start}
                end={event.end}
                description={event.description}
                requireURL={event.requireURL ?? false}
                requireScreenshot={event.requireScreenshot ?? false}
                active={event.active ?? false}
                participants={[]}
                riddleCount={riddles?.length ?? 0}
                showTeams={event.showTeams ?? false}
                showParticipants={event.showParticipants ?? false}
                public={event.public ?? false}
                useTeams={event.useTeams ?? true}
                teamSize={event.teamSize}
              />
            )}
          </Card.Section >
        </>
      </Card>
    );
}
