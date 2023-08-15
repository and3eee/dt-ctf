"use client";

import { RiddleProps } from "@/types";
import {
  Button,
  Checkbox,
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
import { Riddle } from "@prisma/client";
import { useAsyncList } from "@react-stately/data";
import React from "react";
import { GetRiddles } from "./RiddleControl";
import RiddleEdit from "./RiddleEdit";
import RiddleModal from "./RiddleModal";
import { SetRiddleSet } from "../Event/EventControl";

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

  function Difficulty(dif: string) {
    switch (dif) {
      case "easy":
        return (
          <Tooltip content="Difficulty">
            <Chip color="success">Easy</Chip>
          </Tooltip>
        );
      case "medium":
        return (
          <Tooltip content="Difficulty">
            <Chip color="warning">Medium</Chip>
          </Tooltip>
        );
      case "hard":
        return (
          <Tooltip content="Difficulty">
            <Chip color="danger">Hard</Chip>
          </Tooltip>
        );
      case "insane":
        return (
          <Tooltip content="Difficulty">
            <Chip variant="shadow" color="secondary">
              Insane
            </Chip>
          </Tooltip>
        );
    }
  }
  const renderCell = React.useCallback((riddle: Riddle, columnKey: string) => {
    const cellValue = riddle.riddle;

    switch (columnKey) {
      case "bucket":
        if (riddle.bucket)
          return <Chip color={"primary"}>{riddle.bucket}</Chip>;
        break;
      case "difficulty":
        if (riddle.difficulty) return Difficulty(riddle.difficulty ?? "N/A");
        break;
      case "topic":
        if (riddle.topic)
          return <Chip color={"secondary"}>{riddle.topic}</Chip>;
        break;
      case "riddle":
      default:
        return cellValue;
      case "author":
        return riddle.author;
      case "implemented":
        return <Checkbox isSelected={riddle.implemented} />;
      case "validated":
        return <Checkbox isSelected={riddle.validated} />;
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
        selectionMode="multiple"
              selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          <TableColumn key="riddle" allowsSorting>
            Riddle
          </TableColumn>
          <TableColumn key="bucket" allowsSorting>
            Bucket
          </TableColumn>
          <TableColumn key="difficulty" allowsSorting>
            Difficulty
          </TableColumn>
          <TableColumn key="topic" allowsSorting>
            Topic
          </TableColumn>
          <TableColumn key="author" allowsSorting>
            Author
          </TableColumn>
          <TableColumn key="implemented" allowsSorting>
            Implemented
          </TableColumn>
          <TableColumn key="validated" allowsSorting>
            Validated
          </TableColumn>
          <TableColumn key="solution" allowsSorting>
            Solution
          </TableColumn>
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
