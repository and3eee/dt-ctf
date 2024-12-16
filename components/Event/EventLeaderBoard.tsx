"use client";

import {
  EventProps,
  EventRiddleProps,
  TeamProps,
  UserEntryProps,
} from "@/types";

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
  riddles: EventRiddleProps[];
  teams: TeamProps[];
  truncate?: boolean;
}) {
  if (props.event.useTeams) {
    var teams = props.teams.sort(
      (teamA: TeamProps, teamB: TeamProps) =>
        teamB.userEntries?.length! - teamA.userEntries?.length!
    );

    if (props.truncate) teams = teams.slice(0, 5);

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
          {team.userEntries!.length}{" "}
          {props.riddles.length > 0 ? "/ " + props.riddles.length : ""}
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
  } else {
    const run = props.event.entries.map(
      (entry) => entry.answeredBy?.name ?? "Mystery User"
    );
    let hold: { name: string; count: number }[] = [];
    let parsed: string[] = [];
    for (const name of run) {
      if (!parsed.includes(name)) {
        hold.push({
          name: name,
          count: run.filter((input: string) => input == name).length,
        });
        parsed.push(name);
      }
    }
    const ranks = hold.sort(
      (
        a: { name: string; count: number },
        b: { name: string; count: number }
      ) => b.count - a.count
    );

    const rows = ranks.map((entry) => (
      <Table.Tr key={entry.name}>
        <Table.Td>{ranks.indexOf(entry) + 1}</Table.Td>
        <Table.Td>{entry.name}</Table.Td>
        <Table.Td>
          {entry.count}{" "}
          {props.riddles.length > 0 ? "/ " + props.riddles.length : ""}
        </Table.Td>
      </Table.Tr>
    ));

    return (
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Position</Table.Th>
            <Table.Th>User</Table.Th>

            <Table.Th>Riddles Completed</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    );
  }
}
