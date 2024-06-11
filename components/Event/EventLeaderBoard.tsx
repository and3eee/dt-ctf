'use client';

import { EventProps, EventRiddleProps, TeamProps } from "@/types";

import { Event, TeamEntry, User } from "@prisma/client";
import router from "next/router";
import React from "react";
import AuthCheck from "../Auth/AuthCheck";
import { registerMember } from "../Team/TeamControl";
import TeamModal from "../Team/TeamModal";
import { useAsyncList } from "@react-stately/data";
import { GetTeams, GetTeamsRaw } from "./EventControl";
import { Avatar, Chip, Table, Tooltip } from "@mantine/core";
import { TableHeader, TableBody } from "react-stately";

export default function EventLeaderBoard(props: {
  event: EventProps;
  riddles: EventRiddleProps[]
  teams: TeamProps[];
}) {
  const teams = props.teams.sort(
    (teamA: TeamProps, teamB: TeamProps) =>
      teamB.userEntries?.length! - teamA.userEntries?.length!
  );



  const teamMembers = (team: TeamProps) => {
    return (
      <Tooltip.Group openDelay={300} closeDelay={100}>
        <Avatar.Group>
          {team.members?.map((user: User) => (
            <Tooltip key={user.name} label={user.name!} withArrow>
              <Avatar src={user.image}>
                {user.name!.split(" ").map((word: string) => word.charAt(0))}
              </Avatar>
            </Tooltip>
          ))}
        </Avatar.Group>{" "}
      </Tooltip.Group>
    );
  };

  const rows = teams.map((team: TeamProps) => (
    <Table.Tr key={team.name}>
      <Table.Td>{teams.indexOf(team) + 1}</Table.Td>
      <Table.Td>{team.name}</Table.Td>
      <Table.Td>{teamMembers(team)}</Table.Td>
      <Table.Td>
        {team.userEntries!.length} / {props.riddles.length}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Position</Table.Th>
          <Table.Th>Team Name</Table.Th>
          <Table.Th>Members</Table.Th>
          <Table.Th>Riddles Completed</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
