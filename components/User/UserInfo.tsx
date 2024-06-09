"use client";

import { Group, Stack, Title, Text, Loader } from "@mantine/core";
import { User, UserEntry } from "@prisma/client";

export default function UserInfo(props: { user: User }) {
  return (
    <Stack maw="60%" justify="center">
      <Group grow>
        <Stack gap="0">
          <Text c="dimmed">Name</Text>
          <Text>{props.user.name}</Text>
        </Stack>
        <Stack gap="0">
          <Text c="dimmed">Email</Text>
          <Text>{props.user.email}</Text>
        </Stack>
      </Group>
      <Group grow>
        <Stack gap="0">
          <Text c="dimmed">Bucket</Text>
          <Text>{props.user.bucket}</Text>
        </Stack>
        <Stack gap="0">
          <Text c="dimmed">Skill Level</Text>

          <Text>{props.user.skillLevel}</Text>
        </Stack>
        <Stack gap="0">
          <Text c="dimmed">Geo</Text>

          <Text>{props.user.geo}</Text>
        </Stack>
      </Group>
    </Stack>
  );
}
