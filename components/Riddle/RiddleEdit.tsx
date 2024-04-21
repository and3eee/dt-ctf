"use client";

import { RiddleProps } from "@/types";

import React, { useState } from "react";
6;

import {
  Card,
  Divider,
  Textarea,
  Switch,
  Button,
  TextInput,
  Slider,
  Select,
  NumberInput,
  SegmentedControl,
  getGradient,
  useMantineTheme,
  Chip,
  Group,
  Grid,
  Center,
  Title,
  Stack,
  Flex,
  MultiSelect,
} from "@mantine/core";
import { Riddle, RiddleResource } from "@prisma/client";
import { useForm } from "@mantine/form";

import { CreateRiddle, EditRiddle, UpdateResourceLinks } from "./RiddleControl";
import { GetRiddleResources } from "../RiddleResources/RRController";

interface RiddleWithResourceProps extends Riddle {
  RiddleResource: string[];
}
interface RiddleWithResourceInputProps extends Riddle {
  RiddleResource: RiddleResource[];
}

export default function RiddleEdit(props: {
  riddle: RiddleWithResourceInputProps;
  onClick?: () => void;
}) {
  const mappedInit: string[] = props.riddle.RiddleResource
    ? props.riddle.RiddleResource.map(
        (resource: RiddleResource) => resource.name
      )
    : [];
  const form = useForm<RiddleWithResourceProps>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      id: props.riddle.id,
      riddle: props.riddle.riddle,
      difficulty: props.riddle.difficulty,
      bucket: props.riddle.bucket,
      topic: props.riddle.topic,
      author: props.riddle.author,
      implemented: props.riddle.implemented,
      validated: props.riddle.validated,
      solution: props.riddle.solution,
      sourceLocation: props.riddle.sourceLocation,
      showRiddleResource: props.riddle.showRiddleResource,
      sourceDescription: props.riddle.sourceDescription,
      sourceURL: props.riddle.sourceURL,
      sourcePlaceHolder: props.riddle.sourcePlaceHolder,

      eventId: props.riddle.eventId,
      RiddleResource: mappedInit,
    },
    validate: {
      difficulty: (value: string | null) => {
        if (value) updateDifficultyColor(value);
        return value ? null : "Not a valid difficulty";
      },
    },
  });
  const loadResources = async () => {
    const data = await GetRiddleResources();
    setResources(data);
  };
  const [resources, setResources] = useState<RiddleResource[]>(() => {
    loadResources();
    return [];
  });

  var initColor: string;
  switch (props.riddle.difficulty) {
    case "Easy":
      initColor = "Green";
      break;
    case "Medium":
      initColor = "Orange";
      break;
    case "Hard":
      initColor = "Red";
      break;
    case "Expert":
      initColor = "Purple";
      break;
    default:
      initColor = "gray";
  }
  const [difficultyColor, setDifficultyColor] = useState<string>(initColor);

  const updateDifficultyColor = (input: string) => {
    switch (input) {
      case "Easy":
        setDifficultyColor("Green");
        break;
      case "Medium":
        setDifficultyColor("Orange");
        break;
      case "Hard":
        setDifficultyColor("Red");
        break;
      case "Expert":
        setDifficultyColor("Purple");
        break;
      default:
        setDifficultyColor("gray");
    }
  };

  const submissionHandler = async (values: typeof form.values) => {
    const riddle = values;

    if (riddle.id < 0) {
      const reply = await CreateRiddle(riddle, riddle.RiddleResource);
      if (props.onClick) props.onClick();
    } else {
      const reply = await EditRiddle(riddle);
      if (riddle.RiddleResource)
        await UpdateResourceLinks(riddle, riddle.RiddleResource);
      if (props.onClick) props.onClick();
    }
  };

  return (
    <form onSubmit={form.onSubmit(submissionHandler)}>
      <Card miw={"32rem"} maw={"48rem"} mah="60rem">
        <NumberInput
          disabled
          {...form.getInputProps("id")}
          label="RIDDLE ID"
          variant="bordered"
        />

        <Divider />
        <Grid p={8}>
          <Grid.Col span={12}>
            <Textarea
              label="Riddle"
              {...form.getInputProps("riddle")}
              placeholder="Riddle..."
              name="riddle"
              required
            />
            <Group grow>
              <TextInput
                label="Solution"
                required
                name="solution"
                {...form.getInputProps("solution")}
              />
              <TextInput
                label="Author"
                name="author"
                {...form.getInputProps("author")}
              />
            </Group>
          </Grid.Col>
          <Grid.Col span={12}>
            <Group grow>
              <Textarea
                label="Source Description"
                name="sourceDescription"
                {...form.getInputProps("sourceDescription")}
              />
              <Textarea
                label="Source Location"
                name="sourceLocation"
                {...form.getInputProps("sourceLocation")}
              />
            </Group>
            <Group grow>
              <TextInput
                label="Source URL"
                className="m-1"
                name="sourceURL"
                {...form.getInputProps("sourceURL")}
              />
              <TextInput
                label="Source Placeholder"
                {...form.getInputProps("sourcePlaceholder")}
                name="sourcePlaceHolder"
              />
            </Group>
          </Grid.Col>
          <Grid.Col span={12}>
            <Group grow>
              <TextInput
                label="Topic"
                name="topic"
                className="m-1"
                {...form.getInputProps("topic")}
              />

              <Select
                label="Bucket"
                placeholder="Pick a bucket"
                {...form.getInputProps("bucket")}
                data={["Agent", "Environment", "DEM", "Platform", "none"]}
              />
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Center>
              <Stack gap={2} h={"4rem"}>
                <Title order={6}>Difficulty</Title>
                <SegmentedControl
                  name="difficulty"
                  autoContrast
                  radius={"xl"}
                  color={difficultyColor}
                  withItemsBorders={false}
                  data={["none", "Easy", "Medium", "Hard", "Expert"]}
                  {...form.getInputProps("difficulty")}
                />
              </Stack>
            </Center>
          </Grid.Col>
          <Grid.Col span={6}>
            <Stack>
              <Flex gap={"md"}>
                <Switch
                  name="implemented"
                  label="Implemented"
                  {...form.getInputProps("implemented", { type: "checkbox" })}
                >
                  Implemented
                </Switch>
                <Switch
                  name="validated"
                  label="Validated"
                  {...form.getInputProps("validated", { type: "checkbox" })}
                >
                  Validated
                </Switch>
              </Flex>
              <Switch
                name="showRiddleResource"
                label="Show Riddle Resource(s)"
                {...form.getInputProps("showRiddleResource", {
                  type: "checkbox",
                })}
              >
                Show Riddle Resource(s)
              </Switch>
            </Stack>
          </Grid.Col>
          <Grid.Col span={12}>
            <Group grow>
              <MultiSelect
                label="Linked Resources"
                placeholder="Selected Resource(s)"
                data={resources.map((resource) => resource.name)}
                {...form.getInputProps("RiddleResource")}
                searchable
              />
            </Group>
          </Grid.Col>
        </Grid>

        <Divider />
        <Card.Section p={"1rem"}>
          <Center>
            <Button type="submit" color="green">
              Submit
            </Button>
          </Center>
        </Card.Section>
      </Card>
    </form>
  );
}
