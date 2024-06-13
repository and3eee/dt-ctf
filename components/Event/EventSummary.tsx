"use client";

import { EventProps, TeamProps, UserEntryProps } from "@/types";
import {
  Container,
  Group,
  Text,
  Title,
  Avatar,
  Tooltip,
  Stack,
} from "@mantine/core";
import { User, UserEntry } from "@prisma/client";

interface UserScore {
  user: User;
  count: number;
}

export default function EventSummary(props: { event: EventProps }) {
  var score: UserScore[] = [];

  var contributors = props.event.teams.forEach((team: TeamProps) =>
    team.members?.forEach((member: User) => {
      const out: UserScore = {
        user: member,
        count:
          team.userEntries?.filter(
            (entry: UserEntryProps) => entry.answeredBy.id == member.id
          ).length ?? 0,
      };
      score.push(out);
    })
  );

  score = score.sort((a, b) => b.count - a.count);
  const first: UserScore | undefined = score[0];
  const second = score[1];
  const third = score[2];



  return (
    <Container>
      <Stack align="center">
        <Title order={3}>MVPs</Title>
        <Group>
          {second && (
            <Stack gap="xs">
            
              <Text c="dimmed">2nd</Text>
              <Tooltip
                key={second.user.name}
                label={second.user.name!}
                withArrow
              >
                <Avatar size="lg" src={second.user.image}>
                  {second.user
                    .name!.split(" ")
                    .map((word: string) => word.charAt(0))}
                </Avatar>
              </Tooltip>
              <Text>{second.user.name}</Text>
              <Text c="dimmed">{second.count} Solved</Text>
            </Stack>
          )}

          {first && (
            <Stack gap="xs">
            
              <Text c="dimmed">1st</Text>
              <Tooltip key={first.user.name} label={first.user.name!} withArrow>
                <Avatar size="xl" src={first.user.image}>
                  {first.user
                    .name!.split(" ")
                    .map((word: string) => word.charAt(0))}
                </Avatar>
              </Tooltip>
              <Text>{first.user.name}</Text>
              <Text c="dimmed">{first.count} Solved</Text>
            </Stack>
          )}
          {third && (
            <Stack gap="xs">
              <Text c="dimmed">3rd</Text>
              <Tooltip key={third.user.name} label={third.user.name!} withArrow>
                <Avatar src={third.user.image}>
                  {third.user
                    .name!.split(" ")
                    .map((word: string) => word.charAt(0))}
                </Avatar>
              </Tooltip>

              <Text>{third.user.name}</Text>
              <Text c="dimmed">{third.count} Solved</Text>
            </Stack>
          )}
        </Group>
      </Stack>
    </Container>
  );
}
