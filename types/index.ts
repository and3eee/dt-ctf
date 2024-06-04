import { Event, TeamEntry, User, UserEntry } from "@prisma/client";
import { SVGProps } from "react";
import { BooleanLiteral, StringMappingType } from "typescript";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface EventProps extends Event {
  teams?: TeamProps[];
  participants: User[];
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
  sourceDescription?: string;
  sourceURL?: string;
  implemented: boolean;
  validated: boolean;
}

export interface TeamProps extends TeamEntry {
  members?: User[];
  event?: Event;
  userEntries?: UserEntry[];
}

export interface UserEntryProps extends UserEntry {
  answeredBy: User;
}
