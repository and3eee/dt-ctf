"use client";

import { Card, CardHeader, CardBody } from "@nextui-org/react";
import TeamRiddleList from "./TeamRiddleList";
import { Riddle, TeamEntry, UserEntry } from "@prisma/client";

export default function AdminTeamList(props: {
    riddles: Riddle[];
    team: any; // Any set so TS complaining that it doesn't have userEntries 
    solved: UserEntry[];
  }) {
  return (

        <TeamRiddleList
          team={props.team}
          riddles={props.riddles}
          solved={props.team.userEntries}
        />
   
  );
}
