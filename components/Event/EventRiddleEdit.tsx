"use client";

import { Event, Riddle } from "@prisma/client";
import RiddleList from "../Riddle/RiddleList";
import { Button } from "@nextui-org/button";


export default function EventRiddleEdit(props:{event: Event,riddles:Riddle[],defaultSel:Riddle[]}){
    const event = props.event;
    const riddles = props.riddles;


    return(<div><RiddleList riddles={riddles} defaultSelected={props.defaultSel} admin eventID={event.id}/></div>)
    
}