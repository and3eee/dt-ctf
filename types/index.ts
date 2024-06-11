import { Event, Riddle, RiddleResource, TeamEntry, User, UserEntry } from "@prisma/client";
import { SVGProps } from "react";
import { BooleanLiteral, StringMappingType } from "typescript";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface EventProps extends Event {
  teams: TeamProps[];
  participants: User[];
}

export interface RiddleProps extends Riddle{
  RiddleResource:RiddleResource[];
}

export interface TeamProps extends TeamEntry {
  members?: User[];
  event?: Event;
  userEntries?: UserEntryProps[];
}

export interface UserEntryProps extends UserEntry {
  answeredBy: User;
}



export interface EventRiddleProps{
  id: number;
  riddle: string;
  difficulty: string;
  bucket: string;
  author: string;
  topic: string;
  eventId: string;
  RiddleResource?: RiddleResource[];
  showRiddleResource: boolean;
}