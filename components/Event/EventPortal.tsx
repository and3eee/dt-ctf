"use client";
import { EventProps, RiddleProps, TeamProps, UserEntryProps } from "@/types";
import { Riddle, User, UserEntry } from "@prisma/client";
import RiddleCard from "../Riddle/RiddleCard";
import { Grid, Loader, Stack, Switch } from "@mantine/core";
import { useEffect, useState } from "react";
import EventDrawer from "./EventDrawer";
import { useSession } from "next-auth/react";


export default function EventPortal(props: {
  event: EventProps;
  riddles?: RiddleProps[];
  admin?: boolean;
  user: User;
}) {
  const team = props.event.teams.filter((team: TeamProps) =>
    team.members!.some((member: User) => member.id == props.user!.id)
  )[0];

  const [adminMode, toggle] = useState(props.admin);

  if (props.riddles && props.user && team) {
    const solvedCheck = (riddleID: number) => {
      if (
        team.userEntries &&
        team.userEntries.some(
          (entry: UserEntryProps) => entry.riddleId == riddleID
        )
      )
        return team.userEntries.filter(
          (entry: UserEntryProps) => entry.riddleId == riddleID
        )[0];
      return undefined;
    };
    return (
      <Stack>
        {props.admin && (
          <Switch
            label="Admin Mode"
            checked={adminMode}
            onChange={() => {
              toggle(!adminMode);
            }}
          />
        )}
        <EventDrawer event={props.event} team={team} />

        <Grid>
          {props.riddles?.map((riddle: RiddleProps) => {
            return (
              <Grid.Col key={riddle.id} span="content">
                <RiddleCard
                  admin={adminMode}
                  answeredBy={solvedCheck(riddle.id)}
                  riddle={riddle}
                  teamID="0"
                  user={props.user}
                  number={props.riddles?.indexOf(riddle)}
                />
              </Grid.Col>
            );
          })}
        </Grid>
      </Stack>
    );
  }
}
