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
} from "@mantine/core";
import { Riddle, RiddleResource, User } from "@prisma/client";
import {
  RiCheckFill,
  RiCloseLargeFill,
  RiDeleteBack2Fill,
  RiErrorWarningLine,
} from "react-icons/ri";
import RiddleResourcePreview from "../RiddleResources/RiddleResourcePreview";
import { theme } from "@/theme";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import SpoilerText from "../SpoilerText";

export default function RiddleCard(props: {
  answeredBy?: UserEntryProps;
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
    props.answeredBy
  );
  const [solutionIsLoading, setIsLoading] = useState(false);
  const submitEntry = async () => {
    if (props.teamID && props.user) {
      if (!props.admin) {
        const reply = await AddTeamUserEntry(
          props.riddle.id,
          props.teamID,
          props.user,
          value
        );
        if (reply)
          setSolvedBy({
            id: "temp",
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
      notifications.show({
        icon: <RiCloseLargeFill />,
        color: "red",
        title: "Wrong",
        message: "That's not the right flag, try again! ",
      });
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
          <Title order={4}>Related Resource(s)</Title>
        </Grid.Col>
        {resources.map((resource: RiddleResource) => (
          <Grid.Col key={resource.id} span={12}>
            <RiddleResourcePreview resource={resource} />
          </Grid.Col>
        ))}
      </Grid>
    );
  };

  return (
    <Card w="40rem" padding={"lg"}>
      <Card.Section inheritPadding withBorder>
        <Stack gap="0">
          <Group justify="space-between">
            <Group gap={8}>
              {" "}
              {props.answeredBy && (
                <ThemeIcon variant="gradient" radius={"xl"} size="xl">
                  <RiCheckFill />
                </ThemeIcon>
              )}
              {props.number != undefined && (
                <Title order={3}>Riddle: {props.number + 1}</Title>
              )}
            </Group>

            <Group p="sm" justify="right">
              {solvedBy && solvedBy && (
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
              {(props.admin || solvedBy) && (
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
      <Card.Section withBorder m="lg" inheritPadding>
        {!solvedBy && !solutionIsLoading && (
          <Group justify="center">
            <TextInput
              c="Answer"
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              placeholder={"Riddle Answer Here...."}
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
