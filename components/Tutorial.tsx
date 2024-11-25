"use client";

import { EventProps, RiddleProps, UserEntryProps } from "@/types";
import { Button, Center, Group, Stack, Stepper, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { RiddleResource, User } from "@prisma/client";
import { useState } from "react";
import RiddleCard from "./Riddle/RiddleCard";
import EventDrawer from "./Event/EventDrawer";

const exampleResource: RiddleResource = {
  id: 0,
  name: "Linux VM",
  description: "Ubuntu VM running K3s",
  link: "https://example.com/login",
  AuthInfo: null,
  owner: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const exampleRiddle: RiddleProps = {
  id: -1,
  riddle: "This is an example flag. Go find it!",
  difficulty: "Medium",
  bucket: "Agent",
  topic: "Kubernetes",
  tags: ["Cloud", "Kubernetes"],
  author: null,
  implemented: false,
  validated: false,
  solution: "ctf_111111111",
  sourceJson: null,
  showRiddleResource: true,
  sourceDescription: null,
  sourceURL: null,
  eventId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  RiddleResource: [exampleResource],
};

const exampleRiddle2: RiddleProps = {
  id: -1,
  riddle: "This is a flag your imaginary teammate already solved.",
  difficulty: "Expert",
  bucket: "DEM",
  topic: "Synthetic",
  tags: ["Cloud", "Kubernetes"],
  author: null,
  implemented: false,
  validated: false,
  solution: "ctf_111111111",
  sourceJson: null,
  showRiddleResource: false,
  sourceDescription: null,
  sourceURL: null,
  eventId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

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
  username: null,
};

const exampleEvent: EventProps = {
  teams: [],
  participants: [],
  id: "example",
  name: "Example Event",
  description: "",
  start: new Date(),
  end: new Date(),
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
  createdAt: new Date(),
  updatedAt: new Date(),
  generatedTeams: false,
  coreEventLink: null,
};
const unsolvedEntry: UserEntryProps = {
  id: "test",
  answeredAt: new Date(),
  userId: "",
  riddleId: 1,
  attempts: 2,
  teamEntryId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  eventId: null,
  answeredBy: undefined,
};

const solvedEntry: UserEntryProps = {
  id: "test",
  answeredAt: new Date(),
  userId: "",
  riddleId: 1,
  attempts: 3,
  teamEntryId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  eventId: null,
  answeredBy: exampleUser,
};
export function TutorialModal(props: { useTeams?: boolean }) {
  const openModal = () =>
    modals.open({
      title: "Capture the Flag Tutorial",
      children: <Tutorial useTeams={props.useTeams} />,
      size: "lg",
    });

  return <Button onClick={openModal}>Open confirm modal</Button>;
}

export function Tutorial(props: { useTeams?: boolean }) {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="First step" description="Sign up for an Event">
          <Stack gap="lg" align="center">
            <Text>
              From the event list or via a direct link sign up for an event.
            </Text>
            {props.useTeams && (
              <>
                <Text>
                  For team events, teams are auto-generated to balance skill
                  sets, but you can always move teams once they are made.
                </Text>

                <Text>
                  {" "}
                  Be sure to update your account information so your team
                  assignment is accurate!
                </Text>
                <Button component="a" href="/account">
                  Account Page
                </Button>
              </>
            )}
          </Stack>
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Find those flags!">
          <Stack gap="lg" align="center">
            <Text>
              Once the event starts the page will update with the flags and live
              event info. Each flag is hidden in the event tenant which can be
              accessed via the event info drawer.
            </Text>

            <Text>
              Flags will have a riddle that hints at where the flag is hidden,
              as well as topic, bucket and difficulty tags. Some flags will
              require you to investigate a resource other than the event tenant,
              in which case they will be linked on the flag.
            </Text>
            <Text>
              {" "}
              There are limited attempts for each flag denoted by the dots next
              in the header. Once all attempts are used it cannot be solved.
            </Text>
            <RiddleCard
              riddle={exampleRiddle}
              event={exampleEvent}
              user={exampleUser}
              userEntry={unsolvedEntry}
            />
          </Stack>
        </Stepper.Step>
        {props.useTeams && (
          <Stepper.Step label="Team Event" description="Team Event Info">
            <Stack gap="lg" align="center">
              <Text>
                When playing with teams, an additional leaderboard will be show
                in the event info with your team score breakdown.
              </Text>

              <Text>
                You can also see your teammates submissions within the solved
                flags.
              </Text>
              <RiddleCard
                riddle={exampleRiddle2}
                event={exampleEvent}
                user={exampleUser}
                userEntry={solvedEntry}
              />
            </Stack>
          </Stepper.Step>
        )}
        <Stepper.Completed>
          <Stack align="center">
            Once the event is done a final leaderboard and summary will be
            available for all. Have fun flag hunters!
          </Stack>
        </Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Next step</Button>
      </Group>
    </>
  );
}
