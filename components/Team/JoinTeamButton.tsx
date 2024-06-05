"use client";
import { TeamProps } from "@/types";
import { User } from "@prisma/client";
import { registerMember } from "./TeamControl";
import { Button } from "@mantine/core";

export default function JoinTeamButton(props: {
  team: TeamProps;
  user: User;
  onClick?: () => void;
}) {
  return (
    <Button
      onClick={() => {
        registerMember(props.team, props.user);
        if (props.onClick) props.onClick();
      }}
    >
      Join Team
    </Button>
  );
}
