'use client';

import { EventProps, EventRiddleProps, TeamProps } from "@/types";
import { RingProgress, Center, Text } from "@mantine/core";
import { User, UserEntry } from "@prisma/client";

export default function EventTeamStats(props: {
  event: EventProps;
  team: TeamProps;
  riddles: EventRiddleProps[];
  user?: User;
}) {
  const colors = [
    "red",
    "purple",
    "cyan",
    "green",
    "yellow",
    "pink",
    "blue",
    "teal",
    "lime",
    "orange",
  ];

  var scoreFields = [
    {
      value: props.riddles.length - (props.team.userEntries?.length ?? 0),
      color: "gray",
      tooltip:
        props.riddles.length -
        (props.team.userEntries?.length ?? 0) +
        " Unsolved",
    },
  ];

  props.team.members?.forEach((member: User) => {
    scoreFields.push({
      value: props.team.userEntries?.filter(
        (entry: UserEntry) => entry.userId == member.id
      ).length!,
      color: colors[props.team.members!.indexOf(member)],
      tooltip: member.name ?? "Mystery Contestant",
    });
  });
  const ratio = 100 / props.riddles.length;
  scoreFields = scoreFields.map(
    (entry: { value: number; color: string; tooltip: string }) => {
      return {
        value: Math.round(entry.value * ratio),
        tooltip: entry.tooltip,
        color: entry.color,
      };
    }
  );

  return (
    <RingProgress
      size={180}
      maw={180}
      thickness={16}
      roundCaps
      label={<Center><Text c="bold" size="lg">{(props.team.userEntries?.length ?? 0) + "/" +  props.riddles.length + " solved"}</Text></Center>}
      sections={scoreFields}
    />
  );
}
