"use client";
import { RiddleProps } from "@/types";

import RiddleModal from "./RiddleModal";
import { useRouter } from "next/navigation";
import { AddTeamUserEntry, RemoveTeamUserEntry } from "../Team/TeamControl";
import React from "react";
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
} from "@mantine/core";
import { Riddle, RiddleResource } from "@prisma/client";
import { RiDeleteBack2Fill } from "react-icons/ri";
import RiddleResourcePreview from "../RiddleResources/RiddleResourcePreview";
import { theme } from "@/theme";

export default function RiddleCard(props: {
  answered?: boolean;
  answeredBy?: string;
  number?: number;
  admin?: boolean;
  teamID?: string;
  riddle: any;
  preview?: boolean;
}) {
  
  const router = useRouter();
  const [value, setValue] = React.useState("");

  const onClick = () => {
    if (value == props.riddle.solution && props.teamID) {
      AddTeamUserEntry(props.riddle.id, props.teamID);
    }
    router.refresh();
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
          return <Badge variant="light" color="green">Easy</Badge>;
        case "medium":
          return <Badge variant="light" color="orange">Medium</Badge>;
        case "hard":
          return <Badge variant="light" color="red">Hard</Badge>;
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
          return <Badge color="red"  variant="light">Agent</Badge>;
        case "environment":
          return <Badge color="blue"  variant="light">Env</Badge>;
        case "dem":
          return <Badge color="green" variant="light">DEM</Badge>;
        case "platform":
          return (
            <Badge
             color="violet"
             variant="light"
            >
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
  if (props.answeredBy) {
    ansInitials = props.answeredBy
      .split(" ")
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
      <Card.Section inheritPadding>
        <Group justify="space-between">
          {" "}
          {props.number && <Title order={3}>Riddle: {props.number}</Title>}
          <Group p="sm" justify="right">
            {props.answered && props.answeredBy && (
              <Tooltip label={`Solved by ${props.answeredBy}`}>
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
            {(props.admin || props.answered) && (
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
      </Card.Section>

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
                  </Stack>{" "}
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
          ResourceGrid()}
      </Card.Section>

      {!props.answered && (
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
            <Popover position="right" withArrow>
              <Popover.Target>
                <Button color="green" onClick={onClick}>
                  Submit
                </Button>
              </Popover.Target>
              {value !== props.riddle.solution && (
                <Popover.Dropdown>
                  <Text>Wrong, try again!</Text>
                </Popover.Dropdown>
              )}
            </Popover>
          </Group>
        </Card.Section>
      )}
      {props.answered && (
        <Card.Section className="flex gap-3">
          <Text c="bold">Solution:</Text>
          <Text c="dimmed">{props.riddle.solution}</Text>
        </Card.Section>
      )}
    </Card>
  );
}
