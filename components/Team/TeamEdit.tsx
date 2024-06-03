"use client";

import React from "react";
6;
import { EditTeam, UpdateTeam } from "./TeamControl";
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
    mode: 'uncontrolled',
    initialValues: props.team,
  });



  const updateTeam = async (values: TeamEntry ) => {


    if(props.createMode){

    }else{

    }

    const email = await props.user?.email;
    if (email) await UpdateTeam(values);
    else await UpdateTeam(values);
    router.refresh();
  };

  return (
    <form onSubmit={form.onSubmit((values) => {updateTeam(values)})}>
      <Card>
        <Card.Section>
          <TextInput
            name="id"
            label="Team ID"
            variant="bordered"
            key={form.key('id')}
            {...form.getInputProps('id')}
          />
          <TextInput
            label="Event ID"
            className="m-1"
            defaultValue={props.team.eventId}
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
        </Card.Section>
        <Divider />
        <div
          className="grid grow
         grid-flow-row grid-cols-3 auto-rows-max gap-5 m-5"
        >
          <Textarea
            label="Team Name"
            className="m-1 col-span-2 "
            placeholder="Team Placeholder"
            key={form.key('name')}
            {...form.getInputProps('name')}
            defaultValue={props.team.name}
            required
          />
        </div>

        <Divider />
        <Card.Section>
          <Button type="submit" color="success" onClick={props.onClick}>
            Submit
          </Button>
        </Card.Section>
      </Card>
    </form>
  );
}
