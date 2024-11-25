"use client";
import {
  EventProps,
  EventRiddleProps,
  RiddleProps,
  UserEntryProps,
} from "@/types";

import RiddleModal from "./RiddleModal";
import { useRouter } from "next/navigation";
import { AddTeamUserEntry, RemoveTeamUserEntry } from "../Team/TeamControl";
import React, { useState } from "react";
import {
  Tooltip,
  Badge,
  Card,
  Button,
  Avatar,
  Divider,
  Text,
  Input,
  Popover,
  TextInput,
  ActionIcon,
  Group,
  Title,
  Stack,
  Grid,
  getGradient,
  Switch,
  Spoiler,
  Loader,
  ThemeIcon,
  Box,
} from "@mantine/core";
import { Riddle, RiddleResource, User } from "@prisma/client";
import {
  RiChatCheckFill,
  RiCheckFill,
  RiCheckLine,
  RiCloseLargeFill,
  RiDeleteBack2Fill,
  RiFlag2Fill,
  RiLock2Fill,
} from "react-icons/ri";
import RiddleResourcePreview from "../RiddleResources/RiddleResourcePreview";
import { notifications } from "@mantine/notifications";
import { UserSubmit } from "../Event/EventControl";

export default function RiddleCard(props: {
  userEntry?: UserEntryProps;
  number?: number;
  admin?: boolean;
  teamID?: string;
  riddle: RiddleProps | EventRiddleProps;
  preview?: boolean;
  user?: User;
  event?: EventProps;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [solvedBy, setSolvedBy] = useState<UserEntryProps | undefined>(
    props.userEntry
  );
  const [solutionIsLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(props.userEntry?.attempts ?? 0);

  const submitEntry = async () => {
    setIsLoading(true);



    //Check if conditions are met for example flag
    if (props.event?.id === "example" && props.riddle.id == -1) {
      setSolvedBy({
        id: "temp",
        eventId: props.event!.id,
        attempts: attempts + 1,
        riddleId: props.riddle.id,
        answeredBy: props.user,
        userId: "0",
        teamEntryId: "0",
        createdAt: new Date(),
        updatedAt: new Date(),
        answeredAt: new Date(),
      });
      setIsLoading(false);
      notifications.show({
        icon: <RiCheckFill />,
        color: "green",
        title: "Correct!",
        message: "Example flag solved! Good job!",
      });
    }

    //Check if using teams

    if (props.event?.useTeams)
      if (props.teamID && props.user) {
        if (!props.admin) {
          const reply = await AddTeamUserEntry(
            props.riddle.id,
            props.teamID,
            props.user,
            value,
            attempts + 1
          );
          if (reply)
            setSolvedBy({
              id: "temp",
              eventId: props.event!.id,
              attempts: attempts + 1,
              riddleId: props.riddle.id,
              answeredBy: props.user,
              userId: props.user.id,
              teamEntryId: props.teamID,
              createdAt: new Date(),
              updatedAt: new Date(),
              answeredAt: new Date(),
            });
          else
            notifications.show({
              icon: <RiCloseLargeFill />,
              color: "red",
              title: "Wrong",
              message: "That's not the right flag, try again! ",
            });
        } else {
          setSolvedBy({
            id: "temp",
            eventId: props.event!.id,
            attempts: attempts + 1,
            riddleId: props.riddle.id,
            answeredBy: props.user,
            userId: props.user.id,
            teamEntryId: props.teamID,
            createdAt: new Date(),
            updatedAt: new Date(),
            answeredAt: new Date(),
          });
        }
      } else {
        if (props.user) {
          const reply = await UserSubmit(
            props.event.id,
            value,
            props.riddle.id,
            props.user,
            attempts
          );
          setIsLoading(false);
          if (reply) {
            setSolvedBy({
              id: "temp",
              eventId: props.event!.id,
              attempts: attempts + 1,
              riddleId: props.riddle.id,
              answeredBy: props.user,
              userId: props.user.id,
              teamEntryId: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              answeredAt: new Date(),
            });
          } else {
            notifications.show({
              icon: <RiCloseLargeFill />,
              color: "red",
              title: "Wrong",
              message: "That's not the right flag, try again! ",
            });
          }
        }
      }
  };

  const onDelete = async () => {
    if (props.teamID) {
      const res = await RemoveTeamUserEntry(props.riddle.id, props.teamID);
    }
    setValue("");
    setSolvedBy(undefined);
  };

  function Difficulty() {
    if (props.riddle.difficulty) {
      switch (props.riddle.difficulty.toLowerCase()) {
        case "easy":
          return (
            <Badge variant="light" color="green">
              Easy
            </Badge>
          );
        case "medium":
          return (
            <Badge variant="light" color="orange">
              Medium
            </Badge>
          );
        case "hard":
          return (
            <Badge variant="light" color="red">
              Hard
            </Badge>
          );
        case "expert":
          return (
            <Badge
              variant="gradient"
              gradient={{ from: "grape", to: "indigo", deg: 90 }}
            >
              Expert
            </Badge>
          );
      }
    }
  }

  function Bucket() {
    if (props.riddle.bucket) {
      switch (props.riddle.bucket.toLowerCase()) {
        case "agent":
          return (
            <Badge color="red" variant="light">
              Agent
            </Badge>
          );
        case "environment":
          return (
            <Badge color="blue" variant="light">
              Env
            </Badge>
          );
        case "dem":
          return (
            <Badge color="green" variant="light">
              DEM
            </Badge>
          );
        case "platform":
          return (
            <Badge color="violet" variant="light">
              Platform
            </Badge>
          );
        default:
          return <Badge>{props.riddle.bucket}</Badge>;
      }
    }
  }
  let authInitials = undefined;
  if (props.riddle.author) {
    authInitials = props.riddle.author
      .split(" ")
      .map((n: string) => n[0])
      .join(".");
  }
  let ansInitials = undefined;
  if (solvedBy?.answeredBy) {
    ansInitials = solvedBy.answeredBy
      .name!.split(" ")
      .map((n) => n[0])
      .join(".");
  }

  const ResourceGrid = () => {
    const resources: RiddleResource[] = props.riddle.RiddleResource!;

    return (
      <Grid>
        <Grid.Col span={12}>
          <Text c="dimmed" size={"md"}>
            Related Resource(s)
          </Text>
        </Grid.Col>
        {resources.map((resource: RiddleResource) => (
          <Grid.Col key={resource.id} span={12} my={8}>
            <RiddleResourcePreview resource={resource} />
          </Grid.Col>
        ))}
      </Grid>
    );
  };

  const AttemptsAvailable = () => {
    if (!props.event) return true;
    if (!solvedBy) return true;
    return props.event.maxAttempts > solvedBy?.attempts;
  };

  const AttemptMarkers = () => {
    let markers = [];
    if (!props.event) return <></>;
    for (let i = 0; i < props.event?.maxAttempts; i++) {
      if (solvedBy && solvedBy.attempts > i) {
        if (solvedBy?.answeredBy && solvedBy.attempts - 1 == i) markers[i] = 2;
        else markers[i] = 1;
      } else {
        markers[i] = 0;
      }
    }

    return (
      <Tooltip
        label={
          solvedBy?.answeredBy
            ? "Attempts"
            : "Attempts remaining " +
              (props.event.maxAttempts - (solvedBy?.attempts ?? 0))
        }
      >
        <Group gap={6}>
          {markers.map((stat: number) => (
            <Box
              bg={stat == 0 ? "gray" : stat == 1 ? "red" : "green"}
              h="8"
              w="8"
              style={{ "--radius": "0.5rem", borderRadius: "var(--radius)" }}
            />
          ))}
        </Group>
      </Tooltip>
    );
  };

  const status = () => {
    
    if (props.event && props.userEntry) {
      if(props.userEntry.answeredBy) return (
        <ActionIcon size="lg" radius="xl" color="green">
          <RiCheckFill />
        </ActionIcon>
      );
      if (!(props.event.maxAttempts > props.userEntry.attempts)) {
        return (
          <ActionIcon size="lg" radius="xl" color="gray">
            <RiLock2Fill />
          </ActionIcon>
        );
      } else
        return (
          <ActionIcon size="lg" radius="xl" color="red">
            <RiFlag2Fill />
          </ActionIcon>
        );
    }else{
        return(
          <ActionIcon size="lg" radius="xl" color="red">
            <RiFlag2Fill />
          </ActionIcon>
        );
    }
  };

  return (
    <Card miw="20rem" maw="40rem" padding={"md"}>
      <Card.Section inheritPadding withBorder>
        <Stack gap="0">
          <Group justify="space-between">
            <Group gap={8}>{status()}</Group>
            {AttemptMarkers()}

            <Group p="sm" justify="right">
              {solvedBy && solvedBy.answeredBy && (
                <Tooltip label={`Solved by ${solvedBy.answeredBy.name}`}>
                  <Avatar color="green">{ansInitials} </Avatar>
                </Tooltip>
              )}

              <Difficulty />
              {props.riddle.topic && (
                <Tooltip label={`Topic`}>
                  <Badge>{props.riddle.topic}</Badge>
                </Tooltip>
              )}
              {props.riddle.bucket && Bucket()}
              {props.admin && solvedBy?.answeredBy && (
                <Tooltip color="red" label={"Clear Answer"}>
                  <ActionIcon color="red" onClick={onDelete}>
                    <RiDeleteBack2Fill />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          </Group>
        </Stack>
      </Card.Section>
      <Card.Section withBorder inheritPadding>
        <Stack gap="xl" py={"1rem"} align="center">
          <Text size="md">{props.riddle.riddle}</Text>
        </Stack>

        {props.riddle.showRiddleResource &&
          props.riddle.RiddleResource &&
          props.riddle.RiddleResource.length > 0 &&
          ResourceGrid()}
      </Card.Section>
      <Card.Section withBorder m="xs" inheritPadding>
        {!solvedBy?.answeredBy && !solutionIsLoading && AttemptsAvailable() && (
          <Group justify="center">
            <TextInput
              c="Answer"
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              placeholder={"Insert Flag Here...."}
            ></TextInput>

            <Button color="green" onClick={submitEntry}>
              Submit
            </Button>
          </Group>
        )}
        {solutionIsLoading && <Loader variant="bars" />}
      </Card.Section>
    </Card>
  );
}
