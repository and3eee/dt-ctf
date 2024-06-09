"use client";

import React from "react";
6;
import { CreateTeam, UpdateTeam } from "./TeamControl";
import { NextRequest } from "next/server";
import { useRouter } from "next/navigation";
import { TeamProps } from "@/types";
import { Card, Text, Group, Stack, Avatar, Tooltip, Title } from "@mantine/core";
import { TeamEntry, User, Event } from "@prisma/client";
import { useForm } from "@mantine/form";
import { GetTeams } from "../Event/EventControl";
import JoinTeamButton from "./JoinTeamButton";
import TeamModal from "./TeamModal";

export default function TeamCard(props: {
  team: TeamProps;
  event: Event;
  user: User;
  admin?: boolean;
}) {
  const router = useRouter();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: props.team,
  });

  const teamCap = (team: TeamProps) => {
    return (
      <Text>
        {team.members?.length ?? 0} / {props.event.teamSize}
      </Text>
    );
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
      </Group>
    );
  };
  const teamSkill = (team: TeamProps) => {
    if (team.members && team.members?.length > 0) {
      var score: number =
        team.members
          .map((m: User) => m.skillLevel ?? 5)
          ?.reduce((a, b) => a + b) ?? 0;
      return <Text>{score}</Text>;
    } else {
      return 0;
    }
  };

  return (
    <Card withBorder m={8} shadow="xl" >
      <Group justify="space-between">
        <Stack>
          <Title order={4}>{props.team.name}</Title>
        </Stack>
        <Stack>
          <Text c="dimmed">Capacity</Text>
          <Text c="dimmed">{teamCap(props.team)}</Text>
        </Stack>
        <Stack>
          <Text c="dimmed">Members</Text>
          <Text c="dimmed">{teamMembers(props.team)}</Text>
        </Stack>
        {props.admin && (
          <Stack>
            <Text c="dimmed">Skill</Text>
            <Text c="dimmed">{teamSkill(props.team)}</Text>
          </Stack>
        )}
      </Group>
    </Card>
  );
}
