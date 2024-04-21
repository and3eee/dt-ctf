import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
} from "@/components/icons";

import { Logo } from "@/components/icons";
import { FaFlag } from "react-icons/fa";
import { SignInButton } from "./Auth/buttons";

import AdminCheck from "./Auth/AdminCheck";
import {
  Chip,
  Kbd,
  NavLink,
  Paper,
  Space,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import {
  RiBook2Fill,
  RiBook2Line,
  RiBook3Line,
  RiCalendar2Fill,
  RiHome2Fill,
  RiMessage3Line,
} from "react-icons/ri";
import ContributorCheck from "./Auth/ContributorCheck";
import RiddleSolutionGenerator from "./Riddle/RiddleSolutionGen";

export const Navbar = () => {
  const searchInput = (
    <TextInput
      aria-label="Search"
      classNames={{
        input: "text-sm",
      }}
      placeholder="Search..."
      type="search"
    />
  );

  return (
    <Paper>
      <Stack gap={0}>
        <NavLink
          href="#required-for-focus"
          label="Go to Homepage"
          leftSection={<RiHome2Fill size="1rem" />}
        />
        <AdminCheck>
          <Space h={"1rem"} />
          <Title order={5}>Admin Utils</Title>

          <NavLink
            href="#required-for-focus"
            label="Event List"
            leftSection={<RiCalendar2Fill size="1rem" />}
          />
          <NavLink
            href="#required-for-focus"
            label="User List"
            leftSection={<RiCalendar2Fill size="1rem" />}
          />
        </AdminCheck>
        <ContributorCheck>
          <Space h={"1rem"} />
          <Title order={5}>Contributor Utils</Title>

          <NavLink
            href="#required-for-focus"
            label="Riddle List"
            leftSection={<RiMessage3Line size="1rem" />}
          />
          <NavLink
            href="#required-for-focus"
            label="Docs"
            leftSection={<RiBook2Line size="1rem" />}
          />
          <RiddleSolutionGenerator/>
        </ContributorCheck>
      </Stack>
    </Paper>
  );
};
