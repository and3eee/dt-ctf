"use client";

import { EventProps } from "@/types";
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Switch,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import { useState } from "react";
import { EditEvent } from "./EventControl";
import { useRouter } from "next/navigation";

interface EventEditProps extends EventProps{
  onClick:() => void
}

export default function EventEdit(props: EventEditProps) {

  const router = useRouter();

  const updateEvent = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);

  
    const res = await EditEvent(formData)

    router.refresh()

  }
  return (
    <form onSubmit={updateEvent}>
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 max-w-[800px]"
      shadow="sm"
    >
      <CardHeader>
      <Input isReadOnly
       name="id"
       defaultValue={props.id}
       label="Event ID"
       variant="bordered"/>
      </CardHeader>
      <Divider />
      <div
        className="grid grow
       grid-flow-row grid-cols-3 auto-rows-max gap-5 m-5"
      >
        <div className="grow">
          <Input label="Name" name="name" placeholder="name" defaultValue={props.name} isRequired/>
        </div>
        <div>
          <Input label="Prize" name="prize" placeholder="Prize" defaultValue={props.prize} />
        </div>
        <div>
          <p className="text-small">
            Due to limitations with the component library, please edit dates
            directly in the DB for now.
          </p>
        </div>
        <div className="col-span-3">
          <Textarea label="Description" name="description" placeholder="Description" defaultValue={props.description}isRequired  />
        </div>

        <div className="flex col-span-3 gap-2">
          <Switch value="urls" name="urls" defaultSelected={props.requireURL}>Require URLs </Switch>
          <Switch value="screenshot" name="screenshot" defaultSelected={props.requireScreenshot}>Require Screenshot </Switch>
          <Switch value="showTeams" name="showTeams" defaultSelected={props.showTeams}>Show Teams </Switch>
        </div>
        <div className="flex col-span-3 gap-2">
          <Switch value="showParticipants" name="showParticipants"  defaultSelected={props.showTeams}>Show Participants </Switch>
          <Switch value="public" name="public"  defaultSelected={props.public}>Public </Switch>
          <Switch value="useTeams" name="useTeams"  defaultSelected={props.useTeams}>Use Teams </Switch>
          <Switch value="active" name="active"  defaultSelected={props.useTeams}>Active </Switch>
        </div>
      </div>

      <Divider />
      <CardFooter>
        <Button type="submit" color="success" onPress={props.onClick}>Save Changes</Button>
      </CardFooter>
    </Card>
    </form>
  );
}
