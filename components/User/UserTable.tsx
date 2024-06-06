'use client';

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
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { GetUsers } from "./UserControl";

import { useListState } from "@mantine/hooks";
import UserModal from "./UserModal";

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
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

function filterData(data: User[], search: string) {
  const query = search.toLowerCase().trim();

  if (query.length > 0)
    return data.filter((User: User) =>
      keys(User).some((key) => {
        User[key]?.toString().toLowerCase().includes(query);
      })
    );
  else return data;
}

function sortData(
  data: User[],
  payload: { sortBy: keyof User | null; reversed: boolean; search: string }
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

          return b[sortBy]!.toString().localeCompare(a[sortBy]!.toString());
        }
        if (!a[sortBy]) return 1;
        if (!b[sortBy]) return -1;

        return a[sortBy]!.toString().localeCompare(b[sortBy]!.toString());
      } catch (e) {
        return 1;
      }
    }),
    payload.search
  );
}

export function UserTable(props: {
  users: User[];

}) {
  const { data: session, status }: any = useSession();
  const [data, setUserData] = useState<User[]>(props.users);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof User | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [values, handlers] = useListState<User>(props.users);

  const setSorting = (field: keyof User) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    handlers.setState(sortData(data, { sortBy: field, reversed, search }));
  };

  const refreshList = async () => {
    const newData = await GetUsers();
    await setUserData(newData);

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
    
    handlers.filter((item: User) => {
      return keys(item).some((key) =>
        item[key]?.toString().toLowerCase().includes(value)
      );
    });
  };


  const rows = values.map((row: User) => [
    <Table.Tr key={row.id}>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>{row.role}</Table.Td>
      <Table.Td>{row.skillLevel}</Table.Td>
      <Table.Td>{row.bucket}</Table.Td>
      <Table.Td><UserModal user={row} onResolve={refreshList}/></Table.Td>
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
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                Name
              </Th>
              <Th
                sorted={sortBy === "email"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("email")}
              >
                Email
              </Th>
              <Th
                sorted={sortBy === "role"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("role")}
              >
                Role
              </Th>
              <Th
                sorted={sortBy === "skillLevel"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("skillLevel")}
              >
                Skill Level
              </Th>
              <Th
                sorted={sortBy === "bucket"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("bucket")}
              >
                Bucket
              </Th>
              <Table.Th>Actions</Table.Th>
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
