"use client";

import { TeamProps } from "@/types";

import { Event, TeamEntry } from "@prisma/client";
import router from "next/router";
import React from "react";
import AuthCheck from "../Auth/AuthCheck";
import { registerMember } from "../Team/TeamControl";
import TeamModal from "../Team/TeamModal";
import { useAsyncList } from "@react-stately/data";
import { GetTeams, GetTeamsRaw } from "./EventControl";
import { Chip, Table } from "@mantine/core";
import { TableHeader, TableBody } from "react-stately";


export default function EventLeaderBoard(props: { event: Event,teams:TeamEntry[] }) {
  const event = props.event;
  const [isLoading, setIsLoading] = React.useState(true);

  let list = useAsyncList<TeamEntry>({
    async load({ signal }) {
      let res = await GetTeamsRaw(event.id);

      setIsLoading(false);

      return {
        items: res,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  const renderCell = React.useCallback((team: any, columnKey: string) => {
    const cellValue = team.name;

    switch (columnKey) {
      case "name":
        return <p className="min-w-[300px]">{team.name}</p>;

      case "members":
        if (!props.teams) return <></>;
        let temp: string[] = [];
        team.members?.forEach((member: any) => temp.push(member.name));

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

      case "score":
        return 0;
      default:
        return cellValue;
    }
  }, []);

  //TODO convert to Stratos Table

  if (props.teams) {
    return (
      <div>
        <AuthCheck>
          <Table
            aria-label="Teams"
            onSortChange={list.sort}
            sortDescriptor={list.sortDescriptor}
          >
            <TableHeader>
              <TableColumn key="name" allowsSorting>
                Team Name
              </TableColumn>
              <TableColumn key="members" allowsSorting>
                Members
              </TableColumn>
              <TableColumn key="capacity" allowsSorting>
                Capacity
              </TableColumn>
              <TableColumn key="score" allowsSorting>
                Score
              </TableColumn>
            </TableHeader>
            <TableBody
              items={list.items}
              isLoading={isLoading}
              loadingContent={<Spinner label="Loading..." />}
            >
              {(item: TeamEntry) => (
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
