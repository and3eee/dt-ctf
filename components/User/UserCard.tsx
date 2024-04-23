"use client";
import {
  Menu,
  Card,
  Group,
  Stack,
  Divider,
  Avatar,
  rem,
  Text,
} from "@mantine/core";
import { User } from "@prisma/client";
import {
  RiSettingsFill,
  RiCalendarFill,
  RiQuestionAnswerFill,
} from "react-icons/ri";
import AdminCheck from "../Auth/AdminCheck";
import { SignOutButton } from "../Auth/buttons";

export default function UserCard(props: { user: User }) {
  const user: User = props.user;
  return (
    <Menu>
      <Menu.Target>
        <Card withBorder maw={"20rem"} radius={"lg"} m={2} p={8}>
          <Group grow>
            <Stack gap="0" maw={"15rem"}>
              <Text size="md">{user.name}</Text>
              <Divider />
              <Text size="xs">{user.email}</Text>
            </Stack>
            <Avatar maw={"2rem"} src={props.user.image}>
              {props.user.name?.split(" ").map((input:string) => input[0]).join(".")}
            </Avatar>
          </Group>
        </Card>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item
          href="/account"
          component="a"
          leftSection={<RiSettingsFill />}
        >
          Account Settings
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
