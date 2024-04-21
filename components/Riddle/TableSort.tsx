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
  Button,
  Paper,
} from "@mantine/core";
import {
  RiArrowDownFill,
  RiArrowUpFill,
  RiCheckboxBlankCircleLine,
  RiRadioButtonLine,
  RiSearch2Fill,
} from "react-icons/ri";
import { Riddle } from "@prisma/client";
import { useSession } from "next-auth/react";
import RiddleModal from "./RiddleModal";
import { SetRiddleSet } from "../Event/EventControl";
import { GetRiddles } from "./RiddleControl";
import SpoilerText from "../SpoilerText";
import { useListState } from "@mantine/hooks";

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}
function Difficulty(dif: string) {
  switch (dif.toLowerCase()) {
    case "easy":
      return <Badge color="green">Easy</Badge>;
    case "medium":
      return <Badge color="orange">Medium</Badge>;
    case "hard":
      return <Badge color="red">Hard</Badge>;
    case "expert":
      return (
        <Badge
          variant="gradient"
          gradient={{ from: "grape", to: "indigo", deg: 90 }}
        >
          Expert
        </Badge>
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

  if (query.length > 0)
    return data.filter((riddle: Riddle) =>
      keys(riddle).some((key) => {
        riddle[key]?.toString().toLowerCase().includes(query);
      })
    );
  else return data;
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
      try {
        if (payload.reversed) {
          if (!a[sortBy]) return -1;
          if (!b[sortBy]) return 1;

          return b[sortBy]!.localeCompare(a[sortBy]);
        }
        if (!a[sortBy]) return 1;
        if (!b[sortBy]) return -1;

        return a[sortBy]!.localeCompare(b[sortBy]);
      } catch (e) {return 1}
    }),
    payload.search
  );
}

export function TableSort(props: {
  riddles: Riddle[];
  defaultSelected?: Riddle[];
  eventID?: string;
}) {
  const { data: session, status }: any = useSession();
  const [data, setRiddleData] = useState<Riddle[]>(props.riddles);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Riddle | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [values, handlers] = useListState<Riddle>(props.riddles);

  const setSorting = (field: keyof Riddle) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    handlers.setState(sortData(data, { sortBy: field, reversed, search }));
  };

  const refreshList = async () => {
    const newData = await GetRiddles();
    await setRiddleData(newData);

    handlers.setState(
      sortData(newData, {
        sortBy,
        reversed: reverseSortDirection,
        search: search,
      })
    );
  };
  const handleSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.currentTarget;
    setSearch(value.toLowerCase());
    handlers.setState(
      sortData(values, {
        sortBy,
        reversed: reverseSortDirection,
        search: value.toLowerCase(),
      })
    );
    await handlers.setState(data);
    console.log(values);
    handlers.filter((item: Riddle) => {
      return keys(item).some((key) =>
        item[key]?.toString().toLowerCase().includes(value)
      );
    });
  };
  const admin = session.user.role == "ADMIN";
  const contributor = session.user.role == "FLAGMASTER";

  const rows = values.map((row: Riddle) => [
    <Table.Tr key={row.id}>
      <Table.Td>{row.id}</Table.Td>
      <Table.Td>{row.riddle}</Table.Td>
      <Table.Td>{row.bucket}</Table.Td>
      <Table.Td>{row.topic}</Table.Td>
      <Table.Td>{Difficulty(row.difficulty ?? "none")}</Table.Td>
      <Table.Td>{row.author}</Table.Td>
      <Table.Td>{row.implemented ? <p>✔️</p> : <p>🗙</p>}</Table.Td>
      <Table.Td>{row.validated ? <p>✔️</p> : <p>🗙</p>}</Table.Td>
      {admin && (
        <Table.Td>
          <SpoilerText>{row.solution}</SpoilerText>
        </Table.Td>
      )}
      {admin && <Table.Td>{row.sourceLocation}</Table.Td>}
      {admin && <Table.Td>{row.sourceURL}</Table.Td>}
      <Table.Td>
        {(admin || (contributor && row.author == session.user.name)) && (
          <RiddleModal buttonText={"Edit"} riddle={row} onClose={refreshList} />
        )}
      </Table.Td>
    </Table.Tr>,
  ]);

  return (
    <Paper>
      <ScrollArea h={"60%"}>
        <TextInput
          p={"2rem"}
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
                sorted={sortBy === "bucket"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("bucket")}
              >
                ID{" "}
              </Th>
              <Table.Th>Riddle</Table.Th>
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
                sorted={sortBy === "implemented"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("implemented")}
              >
                Implemented
              </Th>
              <Th
                sorted={sortBy === "validated"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("validated")}
              >
                Validated
              </Th>

              {admin && <Table.Th>Solution</Table.Th>}

              {admin && <Table.Th>Source Location</Table.Th>}

              {admin && <Table.Th>Source URL</Table.Th>}
              {(admin || contributor) && <Table.Th>Actions</Table.Th>}
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}
