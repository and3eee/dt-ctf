import { prisma } from "@/lib/prisma";
import {
  Avatar,
  Card,
  Divider,
  Flex,
  Group,
  Menu,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import {
  RiSettingsFill,
  RiSearch2Fill,
  RiCalendarFill,
  RiQuestionAnswerFill,
} from "react-icons/ri";
import AdminCheck from "../Auth/AdminCheck";
import { SignOutButton } from "../Auth/buttons";
export async function GetUsername(userId: string) {
  const data = await prisma.user.findFirst({ where: { id: userId } });

  return data?.name;
}

export function User(props: {
  name: string;
  description: string;
  color: string;
}) {
  let initials: string = props
    .name!.match(/(\b\S)?/g)
    .join("")
    .toUpperCase();

  return (
    <Menu shadow="md">
      <Menu.Target>
        <Card withBorder maw={"20rem"} radius={"lg"} m={2} p={8}>
          <Group grow>
            <Stack gap="0" maw={"15rem"}>
              <Text size="md">{props.name}</Text>
              <Divider />
              <Text size="xs">{props.description}</Text>
            </Stack>
            <Avatar maw={"2rem"} color={props.color}>
              {initials}
            </Avatar>
          </Group>
        </Card>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item leftSection={<RiSettingsFill />}>Settings</Menu.Item>

        <Menu.Item
          leftSection={<RiSearch2Fill />}
          rightSection={
            <Text size="xs" c="dimmed">
              ⌘K
            </Text>
          }
        >
          Search
        </Menu.Item>

        <Menu.Divider />
        <AdminCheck>
          <Menu.Label color="red">Admin Option</Menu.Label>
          <Menu.Item color="red" leftSection={<RiCalendarFill />}>
            Events
          </Menu.Item>
          <Menu.Item
            color="red"
            leftSection={
              <RiQuestionAnswerFill
                style={{ width: rem(14), height: rem(14) }}
              />
            }
          >
            Riddles
          </Menu.Item>
        </AdminCheck>
        <Menu.Item>
          <SignOutButton />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
