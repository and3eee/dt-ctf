"use client";

import { RiddleProps } from "@/types";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import {
  Card,
  CardHeader,
  Divider,
  CardFooter,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { Switch } from "@nextui-org/switch";
import { useSession } from "next-auth/react";
import React from "react";6
import { EditRiddle } from "./RiddleControl";
import { NextRequest } from "next/server";
import { useRouter } from "next/navigation";


interface RiddleEditProps extends RiddleProps{
  onClick:() => void
}

export default function RiddleEdit(props: RiddleEditProps,request: NextRequest) {

  const router = useRouter();

  const { data: session, status } = useSession();



  const updateUser = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);

  
    const res = await EditRiddle(formData)

    router.refresh()

  }
  return (
    <form onSubmit={updateUser}  >
    <Card>
      <CardHeader>
       <Input isReadOnly
       name="id"
       defaultValue={props.id}
       label="RIDDLE ID"
       variant="bordered"/>
      </CardHeader>
      <Divider />
      <div
        className="grid grow
         grid-flow-row grid-cols-3 auto-rows-max gap-5 m-5"
      >
        <div className="col-span-2">
          <Textarea
            label="Riddle"
            className="m-1"
            placeholder="Riddle..."
            name="riddle"
            type="string"
            defaultValue={props.riddle}
            isRequired
          />
        </div>
        <div className="col-span-1">
          <Textarea
            label="Solution"
            className="m-1"
            placeholder={props.sourcePlaceHolder}
            defaultValue={props.solution}
            isRequired
            name="solution"
            
          />
        </div>

        <div className="grow">
          <Textarea
            label="Source Description"
            className="m-1"
            defaultValue={props.sourceDescription}
            name="sourceDescription"
            
          />
        </div>

        <div className="grow ">
          <Input
            label="Source Location"
            className="m-1"
            defaultValue={props.sourceLocation}
            name="sourceLocation"
          />
          <Input label="Topic" name="topic" className="m-1" defaultValue={props.topic} />
        </div>
        <div className="grow">
          <Input
            label="Source URL"
            className="m-1"
            defaultValue={props.sourceURL}
            name="sourceURL"
          />
                    <Input
            label="Source Placeholder"
            className="m-1"
            defaultValue={props.sourcePlaceHolder}
            name="sourcePlaceHolder"
          />
        </div>

        <RadioGroup
          className="col-span-3"
          label="Bucket"
          orientation="horizontal"
          name="bucket"
          defaultValue={props.bucket?? "none"}
        >
          <Radio value="Agent">Agent</Radio>
          <Radio value="Env">Environment</Radio>
          <Radio value="DEM">DEM</Radio>
          <Radio value="Other">Other</Radio>
          <Radio value="none">None</Radio>
        </RadioGroup>
        <RadioGroup
          className="col-span-3"
          label="Difficulty"
          orientation="horizontal"
          name="difficulty"
          defaultValue={props.difficulty?? "none"}
        >
          <Radio value="easy">Easy</Radio>
          <Radio value="medium">Medium</Radio>
          <Radio value="hard">Hard</Radio>
          <Radio value="insane">Insane</Radio>
          <Radio value="none">None</Radio>
        </RadioGroup>
        

        <div className="flex col-span-3 gap-2">
          <Input label="Author" name="author" defaultValue={ props.author}/>
          <Switch value="implemented" name="implemented" defaultSelected={props.implemented}>Implemented</Switch>
          <Switch value="validated" name="validated" defaultSelected={props.validated}>Validated</Switch>
        </div>
      </div>

      <Divider/>
      <CardFooter>
        <Button type="submit" color="success" onPress={props.onClick}>Submit</Button>
      </CardFooter>
    </Card>
    </form>
  );
}
