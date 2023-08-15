"use client";
import { RiddleProps } from "@/types";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@nextui-org/react";
import { Underdog } from "next/font/google";
import RiddleEdit from "./RiddleEdit";
import RiddleModal from "./RiddleModal";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { AddTeamUserEntry, RemoveTeamUserEntry } from "../Team/TeamControl";
import React from "react";

interface RiddleCardProps extends RiddleProps {
  answered?: boolean;
  answeredBy?: string;
  number?: number;
  admin: boolean;
  teamID?: string;
}

const defaults: Pick<RiddleCardProps, "answered"> = {
  answered: false,
};
export default function RiddleCard(props: RiddleCardProps) {
  const router = useRouter();
  const [value, setValue] = React.useState("");

  const onClick = () => {
    if(value == props.solution && props.teamID){
    AddTeamUserEntry(props.id, props.teamID);
    }
    router.refresh();
  };

  const onDelete = async ( ) => {
    if(props.teamID){
     const res = await RemoveTeamUserEntry(props.id, props.teamID);
      }
      router.refresh();
  }

  function Difficulty() {
    if (props.difficulty) {
      switch (props.difficulty) {
        case "easy":
          return (
            <Tooltip content="Difficulty">
              <Chip color="success">Easy</Chip>
            </Tooltip>
          );
        case "medium":
          return (
            <Tooltip content="Difficulty">
              <Chip color="warning">Medium</Chip>
            </Tooltip>
          );
        case "hard":
          return (
            <Tooltip content="Difficulty">
              <Chip color="danger">Hard</Chip>
            </Tooltip>
          );
        case "insane":
          return (
            <Tooltip content="Difficulty">
              <Chip variant="shadow" color="secondary">
                Insane
              </Chip>
            </Tooltip>
          );
      }
    }
  }
  let authInitials = undefined;
  if (props.author) {
    authInitials = props.author
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
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 min-w-[500px] max-w-[800px]"
      shadow="sm"
    >
      <CardHeader className="flex growflex-row gap-2">
        <div className="grow basis-7/8">
          {props.number && (
            <h1 className="text-large">Riddle: {props.number}</h1>
          )}
          {(props.admin || props.answered) && (
            <Button isIconOnly color="danger" onPress={onDelete}>X</Button>
          )}
        </div>
        <div className="flex gap-2 flex-row-reverse">
          {props.answered && props.answeredBy && (
            <Tooltip content={`Solved by ${props.answeredBy}`}>
              <Avatar color="success" name={ansInitials} />
            </Tooltip>
          )}
          {props.admin && (
            <RiddleModal
              id={props.id}
              riddle={props.riddle}
              solution={props.solution}
              implemented={props.implemented}
              difficulty={props.difficulty}
              bucket={props.bucket}
              topic={props.topic}
              sourceDescription={props.sourceDescription}
              sourceLocation={props.sourceLocation}
              sourcePlaceHolder={props.sourcePlaceHolder}
              sourceURL={props.sourceURL}
              buttonText={"Edit"}
              validated={props.validated}
              author={props.author}
            />
          )}
          <Difficulty />
          {props.topic && (
            <Tooltip content={`Topic`}>
              <Chip color="primary">{props.topic}</Chip>
            </Tooltip>
          )}
          {props.bucket && (
            <Tooltip content={`Bucket`}>
              <Chip color="secondary">{props.bucket}</Chip>
            </Tooltip>
          )}
          {props.admin && props.implemented && (
            <Tooltip content={`Status`}>
              <Chip color="success">Implemented</Chip>
            </Tooltip>
          )}
          {props.admin && !props.implemented && (
            <Tooltip content={`Status`}>
              <Chip color="danger">Not Implemented</Chip>
            </Tooltip>
          )}
          {props.admin && !props.validated && (
            <Tooltip content={`Status`}>
              <Chip color="warning">Not validated</Chip>
            </Tooltip>
          )}
          {props.admin && props.validated && (
            <Tooltip content={`Status`}>
              <Chip color="success">Validated</Chip>
            </Tooltip>
          )}
          {props.admin && props.author && authInitials && (
            <Tooltip content={`Author: ${props.author}`}>
              <Avatar color="success" name={authInitials} />
            </Tooltip>
          )}
        </div>
      </CardHeader>

      <Divider />
      <CardBody>
        <h1 className="text-large">{props.riddle}</h1>

        {props.admin && props.sourceLocation && (
          <div className="col-span-3">
            <h1 className="text-large font-bold">Source Location:</h1>
            <h1 className="text-large">{props.sourceLocation}</h1>
          </div>
        )}
        {props.admin && props.sourceDescription && (
          <div className="col-span-3">
            <h1 className="text-large font-bold">Source Description:</h1>
            <h1 className="text-large">{props.sourceDescription}</h1>
          </div>
        )}
        {props.admin && props.sourceURL && (
          <div className="flex gap-3 col-span-3">
            <h1 className="text-large font-bold">Source URL:</h1>
            <h1 className="text-large">{props.sourceURL}</h1>
          </div>
        )}
        {props.admin && props.sourcePlaceHolder && (
          <div className="flex gap-3 col-span-3">
            <h1 className="text-large font-bold">Source Placeholder:</h1>
            <h1 className="text-large">{props.sourcePlaceHolder}</h1>
          </div>
        )}
      </CardBody>
      <Divider />

      {!props.answered && (
        <CardFooter className="flex gap-3">
          <Input
            label="Answer"
            value={value}
            onValueChange={setValue}
            placeholder={props.sourcePlaceHolder ?? "Riddle Answer Here...."}
          ></Input>
          <Popover placement="right" color={"danger"} showArrow={true} >
            <PopoverTrigger>
              <Button color="success" onPress={onClick}>
                Submit
              </Button>
            </PopoverTrigger>
            {value!== props.solution && <PopoverContent>
               <div className="px-1 py-2">
                <div className="text-small font-bold">Wrong, try again!</div>
              </div>
            </PopoverContent>}
          </Popover>
        </CardFooter>
      )}
      {props.answered && (
        <CardFooter className="flex gap-3">
          <h1 color="success" className="text-large">
            Solution:
          </h1>
          <h1 color="success" className="text-medium font-light">
            {props.solution}
          </h1>
        </CardFooter>
      )}
    </Card>
  );
}
