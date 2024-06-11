"use client";

import { EventProps, TeamProps } from "@/types";
import { Button, Drawer, Group, NavLink, Stack } from "@mantine/core";
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
      <Drawer position={"top"} opened={opened} onClose={close} size="xl">
        <Group grow align="top" m={16} justify="space-between">
          <EventInfo event={props.event} panelMode user={props.user!} />

          <Stack align="center" justify="space-between">
            <EventTeamStats team={props.team} event={props.event} />
            {props.event.coreEventLink && (
              <Button size="xl" radius="xl" component="a" href={props.event.coreEventLink}>
                Access Event Tenant
              </Button>
            )}
          </Stack>
          <EventLeaderBoard teams={props.event.teams} event={props.event} />
        </Group>
      </Drawer>

      <NavLink
        description="Leaderboard, event tenant, teams stats and more"
        leftSection={<RiBook2Line />}
        variant="subtle"
        active
        label="Event Info"
        onClick={open}
      />
    </>
  );
}
