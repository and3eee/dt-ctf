"use client";

import { EventProps, TeamProps } from "@/types";
import { Drawer, Group, NavLink, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { User } from "@prisma/client";
import EventLeaderBoard from "./EventLeaderBoard";
import EventCountDown from "./EventCountDown";
import EventTeamStats from "./EventTeamStats";
import { RiBook2Line } from "react-icons/ri";
import EventInfo from "./EventInfo";

export default function EventDrawer(props: {
  event: EventProps;
  team: TeamProps;
  user?: User;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        position={"top"}
        opened={opened}
        onClose={close}
        size="xl"
      
      >
        <Group grow align="top" m={16} justify="space-between">
 
            <EventInfo event={props.event} panelMode user={props.user!} />

            <EventTeamStats team={props.team} event={props.event} />
 
          <EventLeaderBoard teams={props.event.teams} event={props.event} />
        </Group>
      </Drawer>

      <NavLink
        description="Leaderboard, teams stats and more"
        leftSection={<RiBook2Line />}
        variant="subtle"
        active
        label="Event Info"
        onClick={open}
      />
    </>
  );
}
