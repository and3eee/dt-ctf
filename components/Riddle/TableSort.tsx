"use client";

import { useState } from "react";
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
  Badge,
  Tooltip,
  
} from "@mantine/core";
import {
  RiArrowDownFill,
  RiArrowUpFill,
  RiCheckboxBlankCircleLine,
  RiRadioButtonLine,
  RiSearch2Fill,
} from "react-icons/ri";
import { Riddle } from "@prisma/client";

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}
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

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? RiArrowUpFill
      : RiArrowDownFill
    : RiCheckboxBlankCircleLine;
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center>
            <Icon style={{ width: rem(16), height: rem(16) }} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: Riddle[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((riddle: Riddle) =>
    keys(data[0]).some((item) => {
        keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
    })
  );
}

function sortData(
  data: Riddle[],
  payload: { sortBy: keyof Riddle | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

export function TableSort(props: {
  riddles: Riddle[];
  defaultSelected?: Riddle[];
  eventID?: string;
  admin?: boolean;
}) {
  const data = props.riddles;
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof Riddle | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof Riddle) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const rows = sortedData.map((row: Riddle) => [
    <Table.Tr key={row.id}>
      <Table.Td>{row.riddle}</Table.Td>
      <Table.Td>{row.bucket}</Table.Td>
      <Table.Td>{row.topic}</Table.Td>
      <Table.Td>{row.author}</Table.Td>
      <Table.Td>{row.validated}</Table.Td>
      <Table.Td>{row.solution}</Table.Td>
    </Table.Tr>,
  ]);

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={
          <RiSearch2Fill style={{ width: rem(16), height: rem(16) }} />
        }
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        layout="fixed"
      >
        <Table.Tbody>
          <Table.Tr>
            <Th
              sorted={sortBy === "id"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("id")}
            >
              ID
            </Th>
            <Th
              sorted={sortBy === "riddle"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("riddle")}
            >
              Riddle
            </Th>
            <Th
              sorted={sortBy === "bucket"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("bucket")}
            >
             Bucket
            </Th>
            <Th
              sorted={sortBy === "topic"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("topic")}
            >
              Topic
            </Th>
            <Th
              sorted={sortBy === "difficulty"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("difficulty")}
            >
              Difficulty
            </Th>
            <Th
              sorted={sortBy === "author"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("author")}
            >
              Author
            </Th>
            <Th
              sorted={sortBy === "solution"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("solution")}
            >
              Solution
            </Th>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td >
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
