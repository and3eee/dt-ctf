"use client";

import { EventProps, TeamProps } from "@/types";
import {
  Stack,
  NavLink,
  Collapse,
  ScrollArea,
  Loader,
  Text,
  Table,
  Avatar,
  Tooltip,
  Button,
  Group,
} from "@mantine/core";
import { RiddleResource, User } from "@prisma/client";
import { Suspense, useState } from "react";
import {
  RiFile2Line,
  RiArrowDownSFill,
  RiArrowRightSFill,
  RiTeamLine,
} from "react-icons/ri";
import RiddleResourceCard from "../RiddleResources/RiddleResourceCard";
import { useDisclosure } from "@mantine/hooks";
import { PreGenerateTeams, SaveEventTeams } from "./EventControl";
import { useRouter } from "next/navigation";

export default function TeamGeneratorPanel(props: { event: EventProps }) {
  const [generatedTeams, setGeneratedTeams] = useState<TeamProps[]>(
    props.event.teams ?? []
  );
  const [opened, { toggle }] = useDisclosure(false);

  const teamCap = (team: TeamProps) => {
    return (
      <Text>
        {team.members?.length ?? 0} / {props.event.teamSize}
      </Text>
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
        </Avatar.Group>
      </Tooltip.Group>
    );
  };

  const generate = async () => {
    const output = await PreGenerateTeams(props.event);
    setGeneratedTeams(output);
  };

  const router = useRouter();

  const save = async () => {
    const reply = await SaveEventTeams(props.event, generatedTeams);
    if (reply) router.refresh();
  };

  const rows = generatedTeams.map((team: TeamProps) => (
    <Table.Tr key={team.id}>
      <Table.Td>{team.name}</Table.Td>

      <Table.Td>{teamMembers(team)}</Table.Td>
      <Table.Td>{teamCap(team)}</Table.Td>
      <Table.Td>{teamSkill(team)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="sm">
      <NavLink
        href="#teamGenerator"
        label="Team Generation"
        variant="subtle"
        active
        leftSection={
          <Group gap={2}>
   
            {opened ? <RiArrowDownSFill /> : <RiArrowRightSFill />}{" "}
            <RiTeamLine size="1rem" />
          </Group>
        }
        onClick={toggle}
      />

      <Collapse in={opened}>
        <Stack gap="md">
          <Group>
            <Button onClick={generate}>Generate Teams</Button>
            <Button onClick={save}>Save Teams</Button>
          </Group>
          <ScrollArea.Autosize h="30rem" scrollbarSize={2} offsetScrollbars>
            <Suspense fallback={<Loader />}>
              <ScrollArea mih={200} mah={400}>
                <Table title="Preview Generated Teams">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Team Name</Table.Th>
                      <Table.Th>Members</Table.Th>
                      <Table.Th>Capacity</Table.Th>
                      <Table.Th>Skill Sum</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>
              </ScrollArea>
            </Suspense>
          </ScrollArea.Autosize>
        </Stack>
      </Collapse>
    </Stack>
  );
}
