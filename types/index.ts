import { TeamEntry, User, UserEntry } from "@prisma/client";
import { SVGProps } from "react";
import { BooleanLiteral, StringMappingType } from "typescript";


export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};


export interface EventProps{
    id:string,
    name:string,
    start:Date,
    end:Date,
    description:string,
    prize?:string,
    duration?:number,
    requireURL:boolean,
    requireScreenshot:boolean,
    active:boolean,
    teams?: TeamProps[],
    participants:string[],
    riddleCount:number,
    showTeams:boolean,
    showParticipants:boolean,
    public: boolean,
    useTeams: boolean,
    teamSize: number
}

export interface RiddleProps {
    id: number;
    riddle: string;
    difficulty?: string;
    bucket?: string;
    topic?: string;
    sourcePlaceHolder?: string;
    solution: string;
    author?: string;
    sourceLocation?: string;
    sourceDescription?:string;
    sourceURL?:string;
    implemented:boolean;
    validated: boolean;
  }
  
  export interface TeamProps {
    id    :      string    ,
    members?:     User[],
    name    :    string,
    event?    :   Event ,      
    eventId   :  string,
    userEntries?: UserEntry[],
  }