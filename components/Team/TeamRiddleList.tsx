"use client";

import { Event, TeamEntry, Riddle, UserEntry, User } from "@prisma/client";
import RiddleCard from "../Riddle/RiddleCard";
import { GetUsername } from "../User/UserLib";



export default function TeamRiddleList(props: {
  riddles: Riddle[];
  team: TeamEntry;
  solved: UserEntry[];
}) {
  const solvedRiddles = props.solved.map((entry) => ({
    id:entry.id,
    entry: entry,
    solved: entry.riddle,
    solvedBy: entry.answeredBy.name
  }));


  
  return (
    <div className="gap-5 columns-2xl gap-y-5">
      {solvedRiddles.map((items: { entry: UserEntry; solved: Riddle,solvedBy:User ,id:string}) => {

  
          return (
            <RiddleCard 
            key={items.id}
              id={items.solved.id}
              riddle={items.solved.riddle}
              solution={items.solved.solution}
              implemented={items.solved.implemented}
              sourceDescription={items.solved.sourceDescription ?? undefined}
              sourceLocation={items.solved.sourceLocation ?? undefined}
              sourcePlaceHolder={items.solved.sourcePlaceHolder ?? undefined}
              sourceURL={items.solved.sourceURL ?? undefined}
              bucket={items.solved.bucket ?? undefined}
              difficulty={items.solved.difficulty ?? undefined}
              topic={items.solved.topic ?? undefined}
              author={items.solved.author ?? undefined}
              validated={items.solved.validated}
              admin={false}
              teamID={props.team.id}
              answered
              answeredBy={items.solvedBy ?? "N?A"}

            />
          );
      })}
      {props.riddles.map((riddle: Riddle) => {
        if (!solvedRiddles.find((hold) => riddle.id == hold.solved.id)){
          return (
            <RiddleCard
              key={riddle.id}
              id={riddle.id}
              riddle={riddle.riddle}
              solution={riddle.solution}
              implemented={riddle.implemented}
              sourceDescription={riddle.sourceDescription ?? undefined}
              sourceLocation={riddle.sourceLocation ?? undefined}
              sourcePlaceHolder={riddle.sourcePlaceHolder ?? undefined}
              sourceURL={riddle.sourceURL ?? undefined}
              bucket={riddle.bucket ?? undefined}
              difficulty={riddle.difficulty ?? undefined}
              topic={riddle.topic ?? undefined}
              author={riddle.author ?? undefined}
              validated={riddle.validated}
              admin={false}
              teamID={props.team.id}
            />
          );}
          return (<></>);
      })}
    </div>
  );
}
