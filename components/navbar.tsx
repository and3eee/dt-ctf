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
import { Chip, Kbd, Stack, TextInput } from "@mantine/core";

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
    <Stack>




   


    </Stack>
  );
};
