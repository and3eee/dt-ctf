import { prisma } from "@/lib/prisma";
import {
  Avatar,
  Card,
  Divider,
  Flex,
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
  return (
    <Menu shadow="md" width={"10rem"}>
      <Menu.Target>
        <Card withBorder  maw={"10rem"} radius={"lg"} m={2} p={8}>
          <Flex>
            <Stack gap="0">
              <Text size="md">{props.name}</Text>
              <Divider />
              <Text size="xs">{props.description}</Text>
            </Stack>
            <Avatar color={props.color}>
              {props.name
                .split(" ")
                .map((word) => word[0])
                .join(".")}
            </Avatar>
          </Flex>
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
          <SignOutButton/>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
