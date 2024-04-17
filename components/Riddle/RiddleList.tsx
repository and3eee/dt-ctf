"use client";

import { RiddleProps } from "@/types";

import { Riddle } from "@prisma/client";
import { useAsyncList } from "@react-stately/data";
import React from "react";
import { GetRiddles } from "./RiddleControl";
import RiddleEdit from "./RiddleEdit";
import RiddleModal from "./RiddleModal";
import { SetRiddleSet } from "../Event/EventControl";
import { Badge, Button, Checkbox, Table, Tooltip } from "@mantine/core";
import { TableHeader, TableBody } from "react-stately";

export default function RiddleList(props: {
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
  const [selectedKeys, setSelectedKeys] = React.useState(defvals);
  const [isLoading, setIsLoading] = React.useState(true);



  let list = useAsyncList<Riddle>({
    async load({ signal }) {
      let res = await GetRiddles();

      setIsLoading(false);

      return {
        items: res,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column?];
          let second = b[sortDescriptor.column?];
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

  function Difficulty(dif: string) {
    switch (dif) {
      case "easy":
        return (
          <Tooltip label="Difficulty">
            <Badge color="success">Easy</Badge>
          </Tooltip>
        );
      case "medium":
        return (
          <Tooltip label="Difficulty">
            <Badge color="warning">Medium</Badge>
          </Tooltip>
        );
      case "hard":
        return (
          <Tooltip label="Difficulty">
            <Badge color="danger">Hard</Badge>
          </Tooltip>
        );
      case "insane":
        return (
          <Tooltip label="Difficulty">
            <Badge variant="shadow" color="secondary">
              Insane
            </Badge>
          </Tooltip>
        );
    }
  }

  const rows = {}
  const renderCell = React.useCallback((riddle: Riddle, columnKey: string) => {
    const cellValue = riddle.riddle;

    switch (columnKey) {
      case "bucket":
        if (riddle.bucket)
          return <Badge color={"primary"}>{riddle.bucket}</Badge>;
        break;
      case "difficulty":
        if (riddle.difficulty) return Difficulty(riddle.difficulty ?? "N/A");
        break;
      case "topic":
        if (riddle.topic)
          return <Badge color={"secondary"}>{riddle.topic}</Badge>;
        break;
      case "riddle":
     return riddle.riddle;

      case "solution":
        return riddle.solution;
        case "author":
          return riddle.author;
      case "implemented":
        return <Checkbox defaultChecked={riddle.implemented} />;
      case "validated":
        return <Checkbox defaultChecked={riddle.validated} />;
        default:
          return cellValue;
    }
  }, []);


  const submitChanges = () =>{
    let ids:string[] = []

    selectedKeys.forEach((item) => {ids.push(item)})

    if(props.eventID)
    SetRiddleSet(props.eventID,ids)
  }
  return (
    <div className="flex flex-col 
    gap-5">
      <Table
        aria-label="Example table with client side sorting"
        sortDescriptor={list.sortDescriptor}
        color={"primary"}
        onSortChange={list.sort}
        classNames={{
          table: "min-h-[100px]",
        }}
        isStriped
        defaultSelectedKeys={props.defaultSelected?.map((riddle) => riddle.id)}
        selectionMode={props.admin ? "multiple" : undefined}
              selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          <Table.Th key="riddle" allowsSorting>
            Riddle
          </Table.Th>
          <Table.Th key="bucket" allowsSorting>
            Bucket
          </Table.Th>
          <Table.Th key="difficulty" allowsSorting>
            Difficulty
          </Table.Th>
          <Table.Th key="topic" allowsSorting>
            Topic
          </Table.Th>
          <Table.Th key="author" allowsSorting>
            Author
          </Table.Th>
          <Table.Th key="implemented" allowsSorting>
            Implemented
          </Table.Th>
          <Table.Th key="validated" allowsSorting>
            Validated
          </Table.Th>
          <Table.Th key="solution" allowsSorting>
            Solution
          </Table.Th>
        </TableHeader>
        <TableBody
          items={list.items}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item: Riddle) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {props.admin && <Button color="success" onPress={submitChanges}>Apply Riddle Set</Button>}
    </div>
  );
}
