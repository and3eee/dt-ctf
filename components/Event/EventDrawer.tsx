'use client';

import { EventProps, TeamProps } from "@/types";
import { Drawer, Group, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { User } from "@prisma/client";
import EventLeaderBoard from "./EventLeaderBoard";
import EventCountDown from "./EventCountDown";
import EventTeamStats from "./EventTeamStats";
import { RiBook2Line } from "react-icons/ri";

export default function EventDrawer(props: {
  event: EventProps;
  team: TeamProps;
  user?: User;
}) {
    const [opened, { open, close }] = useDisclosure(false);




    return (
        <>
          <Drawer  position={"top"} opened={opened} onClose={close} title={props.event.name + " Info"}>
           <Group justify="center"> <EventCountDown event={props.event} /><EventTeamStats team={props.team} event={props.event}/></Group>
          <EventLeaderBoard teams={props.event.teams} event={props.event} />
          </Drawer>
    
          <NavLink description="Leaderboard, teams stats and more" leftSection={<RiBook2Line />}      variant="subtle" active label="Event Info" onClick={open}/>
        </>
      );




}
