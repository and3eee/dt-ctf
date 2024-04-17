"use client";

import { Button, Stack } from "@mantine/core";
import { Riddle } from "@prisma/client";
import { useState } from "react";

export default function RiddleListV2(props: {
    riddles: Riddle[];
    defaultSelected?: Riddle[];
    eventID?: string;
    admin?:boolean;
  }) {

    let defvals = new Set()
    if(props.defaultSelected)
    props.defaultSelected.forEach((riddle) => {
      defvals.add(riddle.id)
    })
    const [selectedKeys, setSelectedKeys] = useState(defvals);
    const [isLoading, setIsLoading] = useState(true);
  
    const submitChanges = () =>{
        let ids:string[] = []
    
        selectedKeys.forEach((item) => {ids.push(item)})
    
        if(props.eventID)
        SetRiddleSet(props.eventID,ids)
      }

      
    return(<Stack>
        {props.admin && <Button color="success" onPress={submitChanges}>Apply Riddle Set</Button>}
    </Stack>)
  }