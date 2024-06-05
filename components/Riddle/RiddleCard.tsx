"use client";
import { RiddleProps, UserEntryProps } from "@/types";

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
} from "@mantine/core";
import { Riddle, RiddleResource, User } from "@prisma/client";
import { RiDeleteBack2Fill } from "react-icons/ri";
import RiddleResourcePreview from "../RiddleResources/RiddleResourcePreview";
import { theme } from "@/theme";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

export default function RiddleCard(props: {
  answeredBy?: UserEntryProps ;
  number?: number;
  admin?: boolean;
  teamID?: string;
  riddle: any;
  preview?: boolean;
  user?: User;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [solvedBy, setSolvedBy] = useState<UserEntryProps | undefined>(
    props.answeredBy
  );
  const submitEntry = async () => {
    if (value == props.riddle.solution && props.teamID && props.user) {
      if (!props.admin) {
        const reply = await AddTeamUserEntry(
          props.riddle.id,
          props.teamID,
          props.user
        );
        if (reply) setSolvedBy(reply);
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
        console.log(solvedBy);
      }
    } else {
      notifications.show({
        title: "Wrong",
        message: "That's not the right flag, try again! ",
      });
    }
  };

  const onDelete = async () => {
    if (props.teamID) {
      const res = await RemoveTeamUserEntry(props.riddle.id, props.teamID);
    }
    router.refresh();
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
    const resources: RiddleResource[] = props.riddle.RiddleResource;

    return (
      <Grid>
        <Grid.Col span={12}>
          <Divider />
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
      <Stack gap="0">
        <Group justify="space-between">
          {props.number != undefined && (
            <Title order={3}>Riddle: {props.number + 1}</Title>
          )}
          <Group p="sm" justify="right">
            {solvedBy && solvedBy && (
              <Tooltip label={`Solved by ${solvedBy}`}>
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

        {props.admin && (
          <Group p="sm" justify="right">
            <Text>Admin Context: </Text>
            {props.riddle.implemented && (
              <Tooltip label={`Status`}>
                <Badge color="green">Implemented</Badge>
              </Tooltip>
            )}
            {!props.riddle.implemented && (
              <Tooltip label={`Status`}>
                <Badge color="red">Not Implemented</Badge>
              </Tooltip>
            )}
            {!props.riddle.validated && (
              <Tooltip label={`Status`}>
                <Badge color="orange">Not validated</Badge>
              </Tooltip>
            )}
            {props.riddle.validated && (
              <Tooltip label={`Status`}>
                <Badge color="green">Validated</Badge>
              </Tooltip>
            )}
            {props.riddle.author && authInitials && (
              <Tooltip label={`Author: ${props.riddle.author}`}>
                <Avatar color="green">{authInitials} </Avatar>
              </Tooltip>
            )}

            {!props.preview && (
              <RiddleModal buttonText={"Edit"} riddle={props.riddle} />
            )}
          </Group>
        )}
      </Stack>

      <Divider />
      <Card.Section inheritPadding>
        <Stack gap="xl" py={"1rem"} align="center">
          <Text size="md">{props.riddle.riddle}</Text>

          {props.admin && (
            <Grid p="md">
              {props.riddle.sourceLocation && (
                <Grid.Col span={6}>
                  <Stack>
                    <Title order={5}>Source Location:</Title>
                    <Text>{props.riddle.sourceLocation}</Text>
                  </Stack>
                </Grid.Col>
              )}

              {props.admin && props.riddle.sourceDescription && (
                <Grid.Col span={6}>
                  <Stack>
                    <Title order={5}>Source Description:</Title>
                    <Text>{props.riddle.sourceDescription}</Text>
                  </Stack>
                </Grid.Col>
              )}

              {props.admin && props.riddle.sourceURL && (
                <Grid.Col span={6}>
                  <Stack>
                    <Title order={5}>Source URL:</Title>
                    <Text>{props.riddle.sourceURL}</Text>
                  </Stack>
                </Grid.Col>
              )}
              {props.admin && props.riddle.sourcePlaceHolder && (
                <Grid.Col span={6}>
                  <Stack>
                    <Title order={5}>Source Placeholder:</Title>
                    <Text>{props.riddle.sourcePlaceHolder}</Text>
                  </Stack>
                </Grid.Col>
              )}
            </Grid>
          )}
        </Stack>

        {props.riddle.showRiddleResource &&
          props.riddle.RiddleResource &&
          props.riddle.RiddleResource.length > 0 &&
          ResourceGrid()}
      </Card.Section>

      {!solvedBy && (
        <Card.Section m="lg" inheritPadding>
          <Group justify="center">
            <TextInput
              c="Answer"
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              placeholder={
                props.riddle.sourcePlaceHolder ?? "Riddle Answer Here...."
              }
            ></TextInput>

            <Button color="green" onClick={submitEntry}>
              Submit
            </Button>
          </Group>
        </Card.Section>
      )}
      {solvedBy && (
        <Group>
          <Text c="bold">Solution:</Text>
          <Text c="dimmed">{props.riddle.solution}</Text>
        </Group>
      )}
    </Card>
  );
}
