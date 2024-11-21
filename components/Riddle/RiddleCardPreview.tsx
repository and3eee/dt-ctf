"use client";
import { EventProps, RiddleProps, UserEntryProps } from "@/types";
import { Stack, Button, Switch } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Riddle, User, UserEntry } from "@prisma/client";
import RiddleCard from "./RiddleCard";
import { useState } from "react";

export default function RiddleCardPreview(props: {
  riddle: Riddle | RiddleProps;
}) {
  const riddle = props.riddle;

  const exampleUser: User = {
    id: "test",
    name: "Example User",
    email: "test@example.com",
    emailVerified: null,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    geo: "The Void",
    role: "USER",
    teamEntryId: null,
    bucket: null,
    skillLevel: null,
    eventId: null,
  };

  const exampleEvent : EventProps = {
      teams: [],
      participants: [],
      id: "",
      name: "Example Event",
      description: "",
      start: new Date(),
      end:  new Date(),
      maxAttempts: 3,
      prize: null,
      requireURL: null,
      requireScreenshot: null,
      active: null,
      useAssignedTeams: null,
      showParticipants: null,
      showTeams: null,
      useTeams: null,
      teamSize: 0,
      public: false,
      createdAt:  new Date(),
      updatedAt: new Date(),
      generatedTeams: false,
      coreEventLink: null
  }
  const defaultSubmission: UserEntryProps = {
    id: "test",
    answeredAt: new Date(),
    userId: "",
    riddleId: riddle.id,
    attempts: 3,
    teamEntryId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    eventId: null,
    answeredBy: exampleUser,
  };

  const [submission, setSubmission] = useState(defaultSubmission);

  const updateSubmission = () => {
    setSubmission({
      id: "test",
      answeredAt: new Date(),
      userId: "",
      riddleId: riddle.id,
      attempts: 1,
      teamEntryId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      eventId: null,
      answeredBy: solved ? exampleUser : undefined,
    });
  };

  const [solved, setSolved] = useState(true);

  return (
    <Stack>
      <RiddleCard event={exampleEvent} userEntry={submission} number={riddle.id} riddle={riddle} />

      <Switch
        label={"Solved"}
        checked={solved}
        onChange={(event) => {
          setSolved(event.currentTarget.checked);
          updateSubmission();
        }}
      />

      <Button fullWidth onClick={() => modals.closeAll()} mt="md">
        Close Preview
      </Button>
    </Stack>
  );
}
