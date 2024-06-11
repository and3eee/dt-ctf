"use client";
import { EventProps, RiddleProps, TeamProps, UserEntryProps } from "@/types";
import { Riddle, User, UserEntry } from "@prisma/client";
import RiddleCard from "../Riddle/RiddleCard";
import {
  Button,
  Card,
  Grid,
  Group,
  Loader,
  Select,
  Stack,
  Switch,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import EventDrawer from "./EventDrawer";
import { useSession } from "next-auth/react";
import TeamCard from "../Team/TeamCard";





export default function EventPortal(props: {
  event: EventProps;
  riddles?: RiddleProps[];
  admin?: boolean;
  user: User;
}) {
  


  

  const team = props.event.teams.filter((team: TeamProps) =>
    team.members!.some((member: User) => member.id == props.user!.id)
  )[0];

  const [teamContext, setTeamContext] = useState(team ?? props.event.teams[0]);

  const [adminMode, toggle] = useState(props.admin);

  if (props.riddles && props.user && teamContext) {
    const solvedCheck = (riddleID: number) => {
      if (
        teamContext.userEntries &&
        teamContext.userEntries.some(
          (entry: UserEntryProps) => entry.riddleId == riddleID
        )
      )
        return teamContext.userEntries.filter(
          (entry: UserEntryProps) => entry.riddleId == riddleID
        )[0];
      return undefined;
    };

    const onTeamContextChange = (value: string | null) => {
      if (value)
        setTeamContext(
          props.event.teams.filter((team: TeamProps) => team.name == value)[0]
        );
    };

    return (
      <Stack>
        {props.admin && (
          <Card title="Admin Context" maw="40rem">
            <Card.Section withBorder inheritPadding>
              <Title order={4}>Admin Context</Title>
            </Card.Section>
            <Group grow>
              <Stack my={8} gap="md" align="center">
                <Switch
                  label="Admin Mode"
                  checked={adminMode}
                  onChange={() => {
                    toggle(!adminMode);
                  }}
                />
                <Select
                  label="Team Context"
                  placeholder="Select a team"
                  defaultValue={teamContext.name ?? ""}
                  onChange={(value) => onTeamContextChange(value)}
                  data={props.event.teams.map((team: TeamProps) => team.name)}
                />
              </Stack>
              <TeamCard
                admin
                team={teamContext}
                event={props.event}
                user={props.user}
              />
            </Group>
          </Card>
        )}
        <EventDrawer event={props.event} team={teamContext} />
        <Grid>
          {props.riddles?.map((riddle: RiddleProps) => {
            return (
              <Grid.Col key={riddle.id} span="content">
                <RiddleCard
                  admin={adminMode}
                  answeredBy={solvedCheck(riddle.id)}
                  riddle={riddle}
                  teamID={teamContext.id}
                  user={props.user}
                  number={props.riddles?.indexOf(riddle)}
                  event={props.event}
                />
              </Grid.Col>
            );
          })}
        </Grid>
      </Stack>
    );
  }
}
