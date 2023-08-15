"use client";

import { EventProps, TeamProps } from "@/types";
import {
  Avatar,
  AvatarGroup,
  Button,
  Chip,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  getKeyValue,
} from "@nextui-org/react";
import React from "react";
import { registerMember } from "./TeamControl";
import { useSession } from "next-auth/react";
import AuthCheck from "../AuthCheck";
import { useRouter } from "next/navigation";
import TeamModal from "./TeamModal";
import { User } from "next-auth";
import { FaPen, FaPenSquare } from "react-icons/fa";

const columns = [
  { key: "name", label: "Name" },
  { key: "members", label: "Members" },
];

export interface TeamListProps extends EventProps {
  admin?: boolean;
}

export default function SmallTeamList(event: TeamListProps, user: User) {
  const router = useRouter();

  const renderCell = React.useCallback((team: TeamProps, columnKey: string) => {
    const cellValue = team.name;

    switch (columnKey) {
      case "name":
        return <p className="min-w-[100px]">{team.name}</p>;
      case "members":
        let temp: string[] = [];
        team.members?.forEach((member) => temp.push(member.name));

        return (
          <AvatarGroup isBordered>
            {temp.map((name) => {
              const initials = name
                .split(" ")
                .map((n) => n[0])
                .join(".");
              return (
                <Tooltip key={name}  content={name}>
                  <Avatar name={initials} />
                </Tooltip>
              );
            })}
          </AvatarGroup>
        );

      case "actions":
        const teamUser = team.members?.find((user) => user.email == user.email);
        return (
          <div className="flex gap-2">
            {
              <Tooltip content="Join Team">
                <Button
                  isIconOnly
                  onPress={() => {
                    registerMember(team.id);
                    router.refresh();
                  }}
                  color={"success"}
                >
                  <FaPen />
                </Button>
              </Tooltip>
            }
            {event.admin && (
              <TeamModal
                buttonText={"Edit"}
                id={team.id}
                name={team.name}
                eventId={team.eventId}
              />
            )}
            {(event.admin || (teamUser && event.active)) && (
              <Button
                onPress={() => {
                  router.push(`${team.id}`);
                }}
              >
                Go to page
              </Button>
            )}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  if (event.teams) {
    return (
      <div className="min-w-[300px]">
        <AuthCheck>
          <Table aria-label="Teams">
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
