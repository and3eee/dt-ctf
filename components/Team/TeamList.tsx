"use client";

import { EventProps, TeamProps } from "@/types";

import React from "react";
import { registerMember } from "./TeamControl";
import { useSession } from "next-auth/react";
import AuthCheck from "../Auth/AuthCheck";
import { useRouter } from "next/navigation";
import TeamModal from "./TeamModal";
import { User } from "@prisma/client";
import { Container } from "@mantine/core";

const columns = [
  { key: "name", label: "Name" },
  { key: "members", label: "Members" },
  { key: "capacity", label: "Space Left" },
  { key: "actions", label: "Actions" },
];

export interface TeamListProps extends EventProps {
  admin?: boolean;
  small?: boolean;
}

export default function TeamList(props: {
  event: EventProps;
  admin?: boolean;
  small?: boolean;
  user: User;
}) {
  const router = useRouter();

  return <Container></Container>;
}
