"use client";
import { RiddleProps } from "@/types";

import RiddleModal from "./RiddleModal";
import { useRouter } from "next/navigation";
import { AddTeamUserEntry, RemoveTeamUserEntry } from "../Team/TeamControl";
import React from "react";
import {
  Tooltip,
  Chip,
  Card,
  Button,
  Avatar,
  Divider,
  Input,
  Popover,
  TextInput,
} from "@mantine/core";
import { Riddle } from "@prisma/client";

export default function RiddleCard(props: {
  answered?: boolean;
  answeredBy?: string;
  number?: number;
  admin: boolean;
  teamID?: string;
  riddle: Riddle;
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
      switch (props.riddle.difficulty) {
        case "easy":
          return (
            <Tooltip label="Difficulty">
              <Chip color="success">Easy</Chip>
            </Tooltip>
          );
        case "medium":
          return (
            <Tooltip label="Difficulty">
              <Chip color="warning">Medium</Chip>
            </Tooltip>
          );
        case "hard":
          return (
            <Tooltip label="Difficulty">
              <Chip color="danger">Hard</Chip>
            </Tooltip>
          );
        case "insane":
          return (
            <Tooltip label="Difficulty">
              <Chip variant="shadow" color="secondary">
                Insane
              </Chip>
            </Tooltip>
          );
      }
    }
  }
  let authInitials = undefined;
  if (props.riddle.author) {
    authInitials = props.riddle.author
      .split(" ")
      .map((n) => n[0])
      .join(".");
  }
  let ansInitials = undefined;
  if (props.answeredBy) {
    ansInitials = props.answeredBy
      .split(" ")
      .map((n) => n[0])
      .join(".");
  }

  return (
    <Card
      className="border-none bg-background/60 dark:bg-default-100/50 min-w-[500px] max-w-[800px] m-5"
      shadow="sm"
    >
      <Card.Section className="flex growflex-row gap-2">
        <div className="grow basis-7/8">
          {props.number && (
            <h1 className="text-large">Riddle: {props.number}</h1>
          )}
          {(props.admin || props.answered) && (
            <Tooltip color="danger" label={"Clear Answer"}>
              <Button color="danger" onClick={onDelete}>
                X
              </Button>
            </Tooltip>
          )}
        </div>
        <div className="flex gap-2 flex-row-reverse">
          {props.answered && props.answeredBy && (
            <Tooltip label={`Solved by ${props.answeredBy}`}>
              <Avatar color="success">{ansInitials} </Avatar>
            </Tooltip>
          )}
          {props.admin && <RiddleModal buttonText={"Edit"} riddle={props.riddle} />}
          <Difficulty />
          {props.riddle.topic && (
            <Tooltip label={`Topic`}>
              <Chip color="primary">{props.riddle.topic}</Chip>
            </Tooltip>
          )}
          {props.riddle.bucket && (
            <Tooltip label={`Bucket`}>
              <Chip color="secondary">{props.riddle.bucket}</Chip>
            </Tooltip>
          )}
          {props.admin && props.riddle.implemented && (
            <Tooltip label={`Status`}>
              <Chip color="success">Implemented</Chip>
            </Tooltip>
          )}
          {props.admin && !props.riddle.implemented && (
            <Tooltip label={`Status`}>
              <Chip color="danger">Not Implemented</Chip>
            </Tooltip>
          )}
          {props.admin && !props.riddle.validated && (
            <Tooltip label={`Status`}>
              <Chip color="warning">Not validated</Chip>
            </Tooltip>
          )}
          {props.admin && props.riddle.validated && (
            <Tooltip label={`Status`}>
              <Chip color="success">Validated</Chip>
            </Tooltip>
          )}
          {props.admin && props.riddle.author && authInitials && (
            <Tooltip label={`Author: ${props.riddle.author}`}>
              <Avatar color="success">{authInitials} </Avatar>
            </Tooltip>
          )}
        </div>
      </Card.Section>

      <Divider />
      <Card.Section className="flex flex-col gap-5">
        <h1 className="text-large">{props.riddle.riddle}</h1>

        {props.admin && props.riddle.sourceLocation && (
          <div className="col-span-3">
            <h1 className="text-large font-bold">Source Location:</h1>
            <h1 className="text-large">{props.riddle.sourceLocation}</h1>
          </div>
        )}
        {props.admin && props.riddle.sourceDescription && (
          <div className="col-span-3">
            <h1 className="text-large font-bold">Source Description:</h1>
            <h1 className="text-large">{props.riddle.sourceDescription}</h1>
          </div>
        )}
        {props.admin && props.riddle.sourceURL && (
          <div className="flex gap-3 col-span-3">
            <h1 className="text-large font-bold">Source URL:</h1>
            <h1 className="text-large">{props.riddle.sourceURL}</h1>
          </div>
        )}
        {props.admin && props.riddle.sourcePlaceHolder && (
          <div className="flex gap-3 col-span-3">
            <h1 className="text-large font-bold">Source Placeholder:</h1>
            <h1 className="text-large">{props.riddle.sourcePlaceHolder}</h1>
          </div>
        )}

        {((props.riddle.sourceDescription && props.riddle.sourceDescription.length > 0) ||
          props.riddle.sourceLocation) && (
          <div className="grid auto-cols-max gap-5 mx-auto">
            {props.riddle.sourceDescription &&
              props.riddle.sourceDescription.length > 0 &&
              !props.admin && (
                <Card
                  radius={"lg"}
                  shadow={"md"}
                  className="flex max-w-[600px]"
                >
                  <Card.Section>
                    <h1 className="text-small">Description</h1>
                  </Card.Section>
                  <Divider />
                  <Card.Section>
                    <h1 className="text-small">{props.riddle.sourceDescription} </h1>
                  </Card.Section>
                </Card>
              )}
            {props.riddle.sourceLocation && !props.admin && (
              <Card radius={"lg"} shadow={"md"} className="flex max-w-[600px]">
                <Card.Section>
                  <h1 className="text-xs">Hint</h1>
                </Card.Section>

                <Divider />
                <Card.Section>
                  <h1 className="text-xs">{props.riddle.sourceLocation} </h1>{" "}
                </Card.Section>
              </Card>
            )}
          </div>
        )}
      </Card.Section>
      <Divider />

      {!props.answered && (
        <Card.Section className="flex gap-3">
          <TextInput
            c="Answer"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            placeholder={props.riddle.sourcePlaceHolder ?? "Riddle Answer Here...."}
          ></TextInput>
          <Popover position="right" withArrow>
            <Popover.Target>
              <Button color="success" onClick={onClick}>
                Submit
              </Button>
            </Popover.Target>
            {value !== props.riddle.solution && (
              <Popover.Dropdown>
                <div className="px-1 py-2">
                  <div className="text-small font-bold">Wrong, try again!</div>
                </div>
              </Popover.Dropdown>
            )}
          </Popover>
        </Card.Section>
      )}
      {props.answered && (
        <Card.Section className="flex gap-3">
          <h1 color="success" className="text-large">
            Solution:
          </h1>
          <h1 color="success" className="text-medium font-light">
            {props.riddle.solution}
          </h1>
        </Card.Section>
      )}
    </Card>
  );
}
