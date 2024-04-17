"use client";

import { RiddleProps } from "@/types";

import React from "react";6
import { EditRiddle } from "./RiddleControl";

import { useRouter } from "next/navigation";
import { Card, Divider, Textarea, RadioGroup, Radio, Switch, Button, TextInput } from "@mantine/core";
import { Riddle } from "@prisma/client";
import { useForm } from '@mantine/form';



export default function RiddleEdit(props:{riddle: Riddle, onClick?: () => void}) {

  const router = useRouter();

  const form = useForm<Riddle>({
    mode: 'uncontrolled',
    initialValues: props.riddle,
})

  return (
    <form onSubmit={() => {if(props.onClick) props.onClick()}}  >
    <Card>
      <Card.Section >
       <TextInput 
      {...form.getInputProps('riddle')}
    
       label="RIDDLE ID"
       variant="bordered"/>
      </Card.Section >
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
        
      
            required
          />
        </div>
        <div className="col-span-1">
          <Textarea
            label="Solution"
            className="m-1"
    
            required
            name="solution"
            
          />
        </div>

        <div className="grow">
          <Textarea
            label="Source Description"
            className="m-1"
   
            name="sourceDescription"
            
          />
        </div>

        <div className="grow ">
         <TextInput
            label="Source Location"
            className="m-1"
      
            name="sourceLocation"
          />
         <TextInput label="Topic" name="topic" className="m-1"  />
        </div>
        <div className="grow">
         <TextInput
            label="Source URL"
            className="m-1"

            name="sourceURL"
          />
                   <TextInput
            label="Source Placeholder"
            className="m-1"
  
            name="sourcePlaceHolder"
          />
        </div>

        <RadioGroup
          className="col-span-3"
          label="Bucket"

          name="bucket"
       
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

          name="difficulty"
        
        >
          <Radio value="easy">Easy</Radio>
          <Radio value="medium">Medium</Radio>
          <Radio value="hard">Hard</Radio>
          <Radio value="insane">Insane</Radio>
          <Radio value="none">None</Radio>
        </RadioGroup>
        

        <div className="flex col-span-3 gap-2">
         <TextInput label="Author" name="author" />
          <Switch value="implemented" name="implemented" >Implemented</Switch>
          <Switch value="validated" name="validated" >Validated</Switch>
        </div>
      </div>

      <Divider/>
      <Card.Section >
        <Button type="submit" color="success" onClick={props.onClick}>Submit</Button>
      </Card.Section >
    </Card>
    </form>
  );
}


