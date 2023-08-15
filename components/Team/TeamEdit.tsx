"use client";

import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";

import { Switch } from "@nextui-org/switch";
import { useSession } from "next-auth/react";
import React from "react";
6;
import { EditTeam } from "./TeamControl";
import { NextRequest } from "next/server";
import { useRouter } from "next/navigation";
import { TeamProps } from "@/types";
import { Card, CardFooter, CardHeader, Divider } from "@nextui-org/react";

interface TeamEditProps extends TeamProps {
  onClick: () => void;
  admin?: boolean;
}

export default function TeamEdit(props: TeamEditProps, request: NextRequest) {
  const router = useRouter();

  const { data: session, status } = useSession();

  const updateTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = await session?.user?.email;
    if (email) await EditTeam(formData, email);
    else await EditTeam(formData);
    router.refresh();
  };
  return (
    <form onSubmit={updateTeam}>
      <Card>
        <CardHeader>
          <Input
            isReadOnly
            name="id"
            defaultValue={props.id}
            label="Team ID"
            variant="bordered"
          />
          <Input
            label="Event ID"
            className="m-1"
            defaultValue={props.eventId}
            name="eventID"
            isReadOnly
          />
        </CardHeader>
        <Divider />
        <div
          className="grid grow
         grid-flow-row grid-cols-3 auto-rows-max gap-5 m-5"
        >
          <Textarea
            label="Team Name"
            className="m-1 col-span-2 "
            placeholder="Team Placeholder"
            name="name"
            type="string"
            defaultValue={props.name}
            isRequired
          />
        </div>

        <Divider />
        <CardFooter>
          <Button type="submit" color="success" onPress={props.onClick}>
            Submit
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
