"use client";

import { Tooltip, Badge, Card, Text, Group, Stack, Grid } from "@mantine/core";
import { RiddleResource } from "@prisma/client";
import RiddleResourcePreview from "../RiddleResources/RiddleResourcePreview";

export default function ExampleRiddleCard() {
  function Difficulty() {
    return (
      <Tooltip label="The difficulty can be easy, medium, hard or expert">
        <Badge variant="light" color="green">
          Difficulty
        </Badge>
      </Tooltip>
    );
  }

  function Bucket() {
    return (
      <Tooltip label="The Bucket can be Agent, Env, DEM or Platform">
        <Badge color="red" variant="light">
          Bucket
        </Badge>
      </Tooltip>
    );
  }

  const ResourceGrid = () => {
    const resources: RiddleResource[] = [
      {
        id: 0,
        name: "Example Resource",
        description:
          "Resources are used to provide access information when a flag is hidden within a non-dynatrace location. Examples can include an ubuntu server, website or cloud service.",
        link: "https://example.link",
        AuthInfo:
          "If the resource is required to be accessed with authentication, then this is where you would provide that info. A link to secret server is ideal.",
        owner: "Owner/Maintainer Name",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return (
      <Grid>
        <Grid.Col span={12}>
          <Text c="dimmed" size={"md"}>
            Related Resource(s)
          </Text>
        </Grid.Col>
        {resources.map((resource: RiddleResource) => (
          <Grid.Col key={resource.id} span={12} my={8}>
            <RiddleResourcePreview resource={resource} />
          </Grid.Col>
        ))}
      </Grid>
    );
  };

  return (
    <Card miw="20rem" maw="40rem" padding={"md"}>
      <Card.Section inheritPadding withBorder>
        <Stack gap="0">
          <Group justify="space-between">
            <Group p="sm" justify="right">
              <Difficulty />
              {
                <Tooltip
                  label={`The topic is roughly equivilant to the product area.`}
                >
                  <Badge>Flag Topic</Badge>
                </Tooltip>
              }
              {Bucket()}
            </Group>
          </Group>
        </Stack>
      </Card.Section>
      <Card.Section withBorder inheritPadding>
        <Stack gap="xl" py={"1rem"} align="center">
          <Text size="md">
            {
              'This is the flag\'s riddle. It should provide direction to where the flag is hidden. The best methods for this is either a problem statement such as "I configured a setting to capture heading info for example/request but don\'t see it " or as a use case description such as "Within a trace to display and provide header information for example/request".'
            }
          </Text>
        </Stack>

        {ResourceGrid()}
      </Card.Section>
    </Card>
  );
}
