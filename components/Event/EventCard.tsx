"use client";

import { EventProps } from "@/types";
import { useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  Image,
  Progress,
  Tooltip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Event, Riddle, TeamEntry } from "@prisma/client";
import EventModal from "./EventModal";

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
  const [url, setURL] = useState(event.requireURL);
  const [screenshot, setScreenshot] = useState(event.requireScreenshot);
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
      const trimmedTeams = teams.slice(0, 5);
      return (
        <div className="flex flex-row">
          {trimmedTeams.map((team: TeamEntry) => {
            return (
              <div className="isBordered" key={team.id}>
                <Tooltip content={team.name}>
                  <Chip>{team.name}</Chip>
                </Tooltip>
              </div>
            );
          })}
          {teams?.length > 5 && <Chip>+{teams.length - 5}</Chip>}
        </div>
      );
    }
  }

  if (event.public || props.admin)
    return (
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 min-w-[800px] max-w-[800px]"
        shadow="sm"
      >
        <CardHeader className="flex gap-3">
          <h1 className="flex-grow text-large font-medium mt-2">
            {event.name}
          </h1>
          <Divider className="flex-none" orientation="vertical" />
          {props.admin && !event.public && (
            <Chip color="secondary">Private</Chip>
          )}
          {!event.active && (
            <Tooltip content="Event starts at">
              <Chip color="success" variant="shadow" size="lg">
                {start}
              </Chip>
            </Tooltip>
          )}

          {(event.active || props.admin) && (
            <Tooltip content="Event ends at">
              <Chip color="warning" variant="shadow">
                {end}
              </Chip>
            </Tooltip>
          )}
          {event.active && (
            <Tooltip content="Registration Closed">
              <Chip color="danger" variant="shadow">
                Event is Live!
              </Chip>
            </Tooltip>
          )}
        </CardHeader>
        <Divider />
        <CardBody className=" gap-y-20 ">
          <div className="flex flex-row gap-5">
            <p className="basis-2/3">{event.description}</p>
            <Card className="w-[120px] h-[120px] border-none bg-gradient-to-br from-green-500 to-blue-500">
              <CardBody className="justify-center items-center pb-0">
                <CircularProgress
                  classNames={{
                    svg: "w-14 h-14 drop-shadow-md",
                    indicator: "stroke-white",
                    track: "stroke-white/10",
                    value: "text-xs font-semibold text-white",
                  }}
                  value={diffMins + 60 * diffHrs}
                  maxValue={
                    riddles
                      ? riddles.length * 5 > diffMins
                        ? riddles.length * 5
                        : diffMins
                      : diffMins
                  }
                  strokeWidth={2}
                  formatOptions={{ style: "unit", unit: "minute" }}
                  showValueLabel={true}
                />
              </CardBody>
              <CardFooter className="justify-center items-center pt-0">
                <Chip
                  classNames={{
                    base: "border-1 border-white/30",
                    content: "text-white/90 text-xs font-semibold",
                  }}
                  variant="bordered"
                >
                  <p>Duration</p>
                </Chip>
              </CardFooter>
            </Card>

            {riddles && (
              <Card className="w-[120px] h-[120px] border-none bg-gradient-to-br from-blue-500 to-cyan-500">
                <CardBody className="justify-center items-center pb-0">
                  <CircularProgress
                    classNames={{
                      svg: "w-14 h-14 drop-shadow-md",
                      indicator: "stroke-white",
                      track: "stroke-white/10",
                      value: "text-small font-semibold text-white",
                    }}
                    value={riddles.length}
                    maxValue={
                      riddles.length < diffMins / 5
                        ? riddles.length
                        : diffMins / 5
                    }
                    strokeWidth={2}
                    isIndeterminate
                    formatOptions={{ style: "decimal" }}
                    showValueLabel={true}
                  />
                </CardBody>
                <CardFooter className="justify-center items-center pt-0">
                  <Chip
                    classNames={{
                      base: "border-1 border-white/30",
                      content: "text-white/90 text-xs font-semibold",
                    }}
                    variant="bordered"
                  >
                    <p>Riddles</p>
                  </Chip>
                </CardFooter>
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
        </CardBody>
        {((now < event.start && !event.active) || props.admin) && (
          <>
            <Divider />
            <CardFooter className="flex flex-row-reverse gap-5">
              <Button
                color="success"
                className="justify-self-end"
                onPress={() => {
                  router.replace(`/${event.id}/signup`);
                }}
              >
                Sign Up
              </Button>
              <Button
                color="primary"
                className="justify-self-end"
                onPress={() => {
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
                  requireURL={event.requireURL?? false}
                  requireScreenshot={event.requireScreenshot?? false}
                  active={event.active?? false}
                  participants={[]}
                  riddleCount={riddles?.length ?? 0}
                  showTeams={event.showTeams?? false}
                  showParticipants={event.showParticipants?? false}
                  public={event.public?? false}
                  useTeams={event.useTeams?? true}
                  teamSize={event.teamSize}
                />
              )}
            </CardFooter>
          </>
        )}
      </Card>
    );
}
