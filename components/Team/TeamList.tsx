"use client";

import { EventProps, TeamProps } from "@/types";

import { User, UserEntry } from "@prisma/client";
import { Avatar, Group, ScrollArea, Table, Text, Tooltip } from "@mantine/core";
import TeamModal from "./TeamModal";
import JoinTeamButton from "./JoinTeamButton";
import { useState } from "react";
import { GetTeams } from "../Event/EventControl";

export default function TeamList(props: {
  event: EventProps;
  admin?: boolean;
  small?: boolean;

  user: User;
}) {
  //Additional phases to allow for post start signups
  const now = new Date();
  const baseDif = props.event.end.getTime() - props.event.start.getTime();
  const endDif = props.event.end.getTime() - now.getTime();
  const phase1 = endDif > baseDif / 5;
  const phase2 = endDif > (baseDif *2) / 5;

  const [teams, setTeams] = useState<TeamProps[]>(props.event.teams ?? []);

  if (!props.event.teams) return <Text> No teams made yet</Text>;

  const teamCap = (team: TeamProps) => {
    return (
      <Text>
        {team.members?.length ?? 0} / {props.event.teamSize}
      </Text>
    );
  };

  const refreshTeams = async () => {
    const newTeams = await GetTeams(props.event.id);
    setTeams(newTeams);
  };

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

  const edit = (team: TeamProps) => {
    const isMember = team.members?.some(
      (member: User) => member.id == props.user.id
    );
    return (
      <Group>
        {(isMember || props.admin) && (
          <TeamModal team={team} user={props.user} />
        )}

        {team.members &&
          team.members.length < props.event.teamSize &&
          ((phase1) ||
            (team.createdAt.getTime() > props.event.start.getTime() &&
              team.members!.length == 1 &&
              phase2)) &&
          !isMember && (
            <JoinTeamButton
              onClick={refreshTeams}
              team={team}
              user={props.user}
            />
          )}
      </Group>
    );
  };

  const rows = teams.map((team: TeamProps) => (
    <Table.Tr key={team.id}>
      <Table.Td>{team.name}</Table.Td>

      <Table.Td>{teamMembers(team)}</Table.Td>
      <Table.Td>{teamCap(team)}</Table.Td>
      <Table.Td>{edit(team)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={"30rem"}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Team Name</Table.Th>
            <Table.Th>Members</Table.Th>
            <Table.Th>Capacity</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
