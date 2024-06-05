"use client";

import React from "react";
6;
import {  CreateTeam, UpdateTeam } from "./TeamControl";
import { NextRequest } from "next/server";
import { useRouter } from "next/navigation";
import { TeamProps } from "@/types";
import {
  Card,

  Text,
  Group,
  Stack,
} from "@mantine/core";
import { TeamEntry, User, Event } from "@prisma/client";
import { useForm } from "@mantine/form";

export default function TeamCard(props: {
  onClick: () => void;
  canEdit?: boolean;
  team: TeamEntry;
  event: Event;
  user: User;
}) {



  const router = useRouter();



  const form = useForm({
    mode: 'uncontrolled',
    initialValues: props.team,
  });



  return (

      
      <Card>
        <Group justify="space-between">
            <Text c="bold">{props.team.name}</Text>
        </Group>
      </Card>
  
  );
}
