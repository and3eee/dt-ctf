'use client';

import { Group, Stack, Title, Text, Loader } from "@mantine/core";
import { User, UserEntry } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GetFullUser } from "./UserControl";
import { notFound } from "next/navigation";

export default function UserInfo() {
  const { data: session } = useSession();
  const [fullUser, setFullUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const updateUser = async () => {
      const full = await GetFullUser(session!.user!.id!);
      if (full) setFullUser(full);
    };
    updateUser();
  }, []);

  if(fullUser)
  return (
    <Stack>
      <Group grow>
        <Stack gap="0">
          <Text c="dimmed">Name</Text>
          <Text>{fullUser.name}</Text>
        </Stack>
        <Stack gap="0">
          <Text c="dimmed">Email</Text>
          <Text>{fullUser.email}</Text>
        </Stack>
        <Stack gap="0">
          <Text c="dimmed">Bucket</Text>
          <Text>{fullUser.bucket}</Text>
        </Stack>
        <Stack gap="0">
          <Text c="dimmed">Skill Level</Text>

          <Text>{fullUser.skillLevel}</Text>
        </Stack>
      </Group>
    </Stack>
  );
}
