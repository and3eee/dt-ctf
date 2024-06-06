'use client';

import React from "react";
6;
import { CreateTeam, UpdateTeam } from "./TeamControl";
import { NextRequest } from "next/server";
import { useRouter } from "next/navigation";
import { TeamProps } from "@/types";
import {
  Card,
  Input,
  Divider,
  Textarea,
  Button,
  TextInput,
  Group,
  Stack,
} from "@mantine/core";
import { TeamEntry, User } from "@prisma/client";
import { useForm } from "@mantine/form";

export default function TeamEdit(props: {
  onClick: () => void;
  admin?: boolean;
  team: TeamEntry;
  createMode?: boolean;
  user: User;
}) {
  const router = useRouter();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: props.team,
  });

  const updateTeam = async (values: TeamEntry) => {
    if (props.createMode) {
    } else {
    }

    const email = await props.user?.email;
    if (email) await CreateTeam(values, props.user);
    else await UpdateTeam(values);
  
    router.refresh();
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        updateTeam(values);
      })}
    >
      <Stack align="center">
        <TextInput
          label="Team Name"
          className="m-1 col-span-2 "
          placeholder="Team Placeholder"
          key={form.key("name")}
          {...form.getInputProps("name")}
          defaultValue={props.team.name}
          required
        />

        <Button type="submit" color="green" onClick={props.onClick}>
          Submit
        </Button>
      </Stack>
    </form>
  );
}
