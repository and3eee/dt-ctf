"use client";

import { EventProps, TeamProps } from "@/types";

import React from "react";
import { registerMember } from "./TeamControl";
import { useSession } from "next-auth/react";
import AuthCheck from "../Auth/AuthCheck";
import { useRouter } from "next/navigation";
import TeamModal from "./TeamModal";
import { User } from "next-auth";
import { FaPen } from "react-icons/fa";

const columns = [
  { key: "name", label: "Name" },
  { key: "members", label: "Members" },
  { key: "capacity", label: "Space Left" },
  { key: "actions", label: "Actions" },
];

export interface TeamListProps extends EventProps {
  admin?: boolean;
  small?:boolean;
}

export default function TeamList(event: TeamListProps, user:User) {
  const router = useRouter();


  const renderCell = React.useCallback((team: TeamProps, columnKey: string) => {
    const cellValue = team.name;

    switch (columnKey) {
      case "name":
        if(!event.small)
        return <p className="min-w-[300px]">{team.name}</p>;
        else
        return <p className="min-w-[100px]">{team.name}</p>;
      case "members":
        if (!event.teams) return <></>;
        let temp: string[] = [];
        team.members?.forEach((member) => temp.push(member.name));

        return (
          <div className="relative flex items-center gap-2">
            {temp.join(", ")}
          </div>
        );
      case "capacity":
        return (
          <Chip>
            {team.members?.length}/{event.teamSize}
          </Chip>
        );
      case "actions":
  
        const teamUser = (team.members?.find((user) => user.email == user.email))
        return (
          <div className="flex gap-2">
            {!event.admin && team.members && team.members?.length < event.teamSize && (
              <Button isIconOnly
                onPress={async () => {
                  await registerMember(team.id);
                  router.refresh();
                }}
              >
                Join
              </Button>
            )}
            {event.admin && (
              <TeamModal buttonText={"Edit"} id={team.id} name={team.name} eventId={team.eventId} />
            )}
            {(event.admin || (teamUser && event.active)) && (<Button onPress={() =>{router.push(`${team.id}`)}}>Go to page</Button>)}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  if (event.teams) {
    return (
      <div><AuthCheck>
        <Table aria-label="Teams" >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={event.teams}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        </AuthCheck>
      </div>
    );
  }
}
