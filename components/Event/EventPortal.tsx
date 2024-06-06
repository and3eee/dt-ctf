"use client";
import { EventProps, RiddleProps, TeamProps, UserEntryProps } from "@/types";
import { Riddle, User, UserEntry } from "@prisma/client";
import RiddleCard from "../Riddle/RiddleCard";
import { Grid, Loader, Stack, Switch } from "@mantine/core";
import { useEffect, useState } from "react";
import EventDrawer from "./EventDrawer";
import { useSession } from "next-auth/react";
import { GetFullUser } from "../User/UserControl";

export default function EventPortal(props: {
  event: EventProps;
  riddles?: RiddleProps[];
  admin?: boolean;
  team: TeamProps;

}) {



  const session = useSession();
  const [fullUser, setFullUser] = useState<User | undefined>(undefined);
  if (session.status == "loading" || !fullUser) return <Loader />;

  useEffect(() => {
    const updateUser = async () => {
      if (session.status == "authenticated") {
        const full = await GetFullUser(session.data.user!.id!);
        if (full) setFullUser(full);
      }
    };
    updateUser();
  }, []);

  const solvedCheck = (riddleID: number) => {
    if (
      props.team.userEntries &&
      props.team.userEntries.some(
        (entry: UserEntryProps) => entry.riddleId == riddleID
      )
    )
      return props.team.userEntries.filter(
        (entry: UserEntryProps) => entry.riddleId == riddleID
      )[0];
    return undefined;
  };
  const [adminMode, toggle] = useState(props.admin);
var pos = 0; 
  if (props.riddles)
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
        <EventDrawer event={props.event} team={props.team}/>

        <Grid>
          {props.riddles?.map((riddle: RiddleProps) => 
          {  return (<Grid.Col key={riddle.id} span="content">
              <RiddleCard
                admin={adminMode}
                answeredBy={solvedCheck(riddle.id)}
                riddle={riddle}
                teamID="0"
                user={fullUser}
                number={props.riddles?.indexOf(riddle)}
              />
            </Grid.Col>)}
          )}
        </Grid>
      </Stack>
    );
}
