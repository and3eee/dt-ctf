"use client";

import TeamEdit from "./TeamEdit";

import { TeamEntry, User } from "@prisma/client";

import { Button, ModalContent, Popover } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function TeamModal(props: {
  team: TeamEntry;
  user: User;
  createMode?: boolean;
  onClick?: ()=> void
}) {
  const router = useRouter()
  return (
    <Popover
      width={200}
      position="bottom"
      clickOutsideEvents={["mouseup", "touchend"]}
    >
      <Popover.Target>
        <Button >
          {props.createMode ? "Create New Team" : "Edit Team"}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <TeamEdit
          onClick={() => {if(props.onClick) props.onClick(); else router.refresh();}} 
          team={props.team}
          createMode={props.createMode}
          user={props.user}
          
        />
      </Popover.Dropdown>
    </Popover>
  );
}
