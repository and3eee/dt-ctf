"use client";

import { EventProps } from "@/types";
import { EditEvent } from "./EventControl";
import { useRouter } from "next/navigation";
import { Card, Input, Divider, Textarea, Switch, Button, TextInput } from "@mantine/core";

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
      className="border-none bg-background/60 dark:bg-default-100/50 max-w-[800px]"
      shadow="sm"
    >
      <Card.Section >
      <TextInput 
       name="id"
       defaultValue={props.id}
       label="Event ID"
       variant="bordered"/>
      </Card.Section >
      <Divider />
      <div
        className="grid grow
       grid-flow-row grid-cols-3 auto-rows-max gap-5 m-5"
      >
        <div className="grow">
          <TextInput label="Name" name="name" placeholder="name" defaultValue={props.name} required/>
        </div>
        <div>
          <TextInput label="Prize" name="prize" placeholder="Prize" defaultValue={props.prize} />
        </div>
        <div>
          <p className="text-small">
            Due to limitations with the component library, please edit dates
            directly in the DB for now.
          </p>
        </div>
        <div className="col-span-3">
          <Textarea label="Description" name="description" placeholder="Description" defaultValue={props.description} required  />
        </div>

        <div className="flex col-span-3 gap-2">
          <Switch value="urls" name="urls" defaultChecked={props.requireURL}>Require URLs </Switch>
          <Switch value="screenshot" name="screenshot" defaultChecked={props.requireScreenshot}>Require Screenshot </Switch>
          <Switch value="showTeams" name="showTeams" defaultChecked={props.showTeams}>Show Teams </Switch>
        </div>
        <div className="flex col-span-3 gap-2">
          <Switch value="showParticipants" name="showParticipants"  defaultChecked={props.showTeams}>Show Participants </Switch>
          <Switch value="public" name="public"  defaultChecked={props.public}>Public </Switch>
          <Switch value="useTeams" name="useTeams"  defaultChecked={props.useTeams}>Use Teams </Switch>
          <Switch value="active" name="active"  defaultChecked={props.useTeams}>Active </Switch>
        </div>
      </div>

      <Divider />
      <Card.Section >
        <Button type="submit" color="success" onClick={props.onClick}>Save Changes</Button>
      </Card.Section >
    </Card>
    </form>
  );
}
