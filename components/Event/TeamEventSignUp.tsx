"use client";
import { EventProps } from "@/types";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { GetTeams } from "./EventControl";
import TeamModal from "../Team/TeamModal";
import TeamList from "../Team/TeamList";

export interface TeamEventSignUpProps extends EventProps {
  small?:boolean;
}

const columns = [
  { key: "name", label: "Name" },
  { key: "members", label: "Members" },
];

export default function TeamEventSignUp(props: TeamEventSignUpProps) {
  if (props.useTeams) {
    return (
      <Card >
        <CardHeader>
          <p className="text-xl bold">{props.name} Sign Up</p>
        </CardHeader>
        <Divider/>
        <CardBody className="flex flex-col gap-3">
          <p>{props.description}</p>

          <p className="text-medium">Select a team to join or create a new one.</p>

          {props.teams && (
            <TeamList
              id={props.id}
              name={props.name}
              start={props.start}
              end={props.end}
              description={""}
              requireURL={props.requireURL}
              requireScreenshot={props.requireScreenshot}
              active={props.active}
              teams={props.teams}
              participants={props.participants}
              riddleCount={0}
              showTeams={props.showTeams}
              showParticipants={props.showParticipants}
              public={props.public}
              useTeams={props.useTeams}
              teamSize={props.teamSize}
              small={props.small}
            />
          )}
         {!props.active &&  <TeamModal
            buttonText={"Create Team"}
            id={"NEW"}
            name={""}
            eventId={props.id}
          />}
        </CardBody>
      </Card>
    );
  }
}
