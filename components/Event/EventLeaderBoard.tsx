"use client";

import { EventProps, TeamProps } from "@/types";

import { Event, TeamEntry } from "@prisma/client";
import router from "next/router";
import React from "react";
import AuthCheck from "../Auth/AuthCheck";
import { registerMember } from "../Team/TeamControl";
import TeamModal from "../Team/TeamModal";
import { useAsyncList } from "@react-stately/data";
import { GetTeams, GetTeamsRaw } from "./EventControl";
import { Chip, Table } from "@mantine/core";
import { TableHeader, TableBody } from "react-stately";

export default function EventLeaderBoard(props: {
  event: EventProps;
  teams: TeamProps[];
}) {
  const teams = props.teams.sort(
    (teamA: TeamProps, teamB: TeamProps) =>
      teamA.userEntries?.length! - teamB.userEntries?.length!
  );
  const rows = teams.map((team: TeamProps) => (
    <Table.Tr key={team.name}>
      <Table.Td>{teams.indexOf(team) + 1}</Table.Td>
      <Table.Td>{team.name}</Table.Td>
      <Table.Td>
        {team.userEntries!.length} / {props.event.riddles.length}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Position</Table.Th>
          <Table.Th>Team Name</Table.Th>
          <Table.Th>Riddles Completed</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
