"use client";
import {
  ActionIcon,
  AppShell,
  Badge,
  Burger,
  Chip,
  ColorSchemeScript,
  Divider,
  Flex,
  Group,
  MantineProvider,
  Space,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  AwaitedReactNode,
  useState,
} from "react";
import { Navbar } from "./navbar";
import { FaFlag } from "react-icons/fa";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import AdminCheck from "./Auth/AdminCheck";
import { SignInButton } from "./Auth/buttons";
import ColorSchemeContext from "@/lib/ColorSchemeContext";
import ThemeSwitch from "./theme-switch";
import { theme } from "@/theme";
import { RiFlag2Fill, RiHeart2Fill } from "react-icons/ri";

export default function Shell(props: { children: any }) {
  const [opened, { toggle }] = useDisclosure(false);
  const [colorScheme, setColorScheme] = useState("dark");
  return (
    <MantineProvider theme={theme}>
      <AppShell
        header={{ height: "5rem" }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header h={"5rem"}>
          <Group grow h={"5rem"}>
            <Group justify="center" grow maw={"10%"}>
              <ActionIcon
              radius={"xl"}
                variant="gradient"
                size="xl"
                aria-label="Gradient action icon"
                gradient={{ from: "orange", to: "yellow", deg: 192 }}
              >
                       <RiFlag2Fill />
              </ActionIcon>
             
       

              <Title order={2} >
                CTF
              </Title>
            </Group>
            <Space />
            <Group h={"5rem"}>
              <AdminCheck>
                <Divider orientation="vertical" />
                <Title order={3}>Admin</Title>
                <Link color="foreground" href={"/admin/events"}>
                  {" "}
                  Events
                </Link>
                <Link color="foreground" href={"/admin/riddles"}>
                  {" "}
                  Riddles
                </Link>
              </AdminCheck>
              <Divider orientation="vertical" />{" "}
            </Group>
            <Space />
            <Group grow p={4} gap="xs" justify="right">
              <ThemeSwitch />
              <SignInButton />
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <Navbar />
        </AppShell.Navbar>

        <AppShell.Main>{props.children}</AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
