"use client";

import React, { useState } from "react";
6;

import {
  Card,
  Divider,
  Textarea,
  Switch,
  Button,
  TextInput,
  Select,
  NumberInput,
  SegmentedControl,
  Text,
  Group,
  Grid,
  Center,
  Title,
  Stack,
  Flex,
  MultiSelect,
  Container,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { RiddleResource } from "@prisma/client";
import { hasLength, useForm } from "@mantine/form";

import {
  CreateRiddle,
  DeleteRiddle,
  EditRiddle,
  UpdateResourceLinks,
} from "./RiddleControl";
import { modals } from "@mantine/modals";
import { RiCheckFill, RiDeleteBin2Fill, RiEye2Fill } from "react-icons/ri";
import RiddleCard from "./RiddleCard";

export default function RiddleEdit(props: {
  riddle: any;
  onClick?: () => void;
  resources?: RiddleResource[];
  createMode?: boolean;
}) {
  const mappedInit: string[] = props.riddle.RiddleResource
    ? props.riddle.RiddleResource.map(
        (resource: RiddleResource) => resource.name
      )
    : [];

  const form = useForm({
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
      riddle: hasLength(
        { min: 16, max: 512 },
        "Riddle must be between 16 and 512 characters"
      ),
    },
  });

  const deleteModal = () =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          This action is permanent and cannot be reversed. Please ensure that you want to proceed before continuing.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => {},
      onConfirm: () => {
        DeleteRiddle(props.riddle);
        if (props.onClick) props.onClick();
      },
    });

  const previewModal = () =>
    modals.open({
      title: "Riddle Preview",
      size:"auto",
      children: (
        <Stack>
          <RiddleCard number={props.riddle.id} riddle={props.riddle} />
          <Button fullWidth onClick={() => modals.closeAll()} mt="md">
            Close Preview
          </Button>
        </Stack>
      ),
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
    if (!form.isValid()) return;
    const riddle = values;
    
    if (riddle.id < 0) {
      const reply = await CreateRiddle(riddle, riddle.RiddleResource);
      if (props.onClick) props.onClick();
    } else {
      const reply = await EditRiddle(riddle);
      if (riddle.RiddleResource) {
        const update = await UpdateResourceLinks(riddle, riddle.RiddleResource);
      }
      if (props.onClick) props.onClick();
    }
  };

  

  return (
    <Container>
      <form onSubmit={form.onSubmit(submissionHandler)}>
        <Stack>
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
                description={form.getValues().riddle.length + "/512 characters"}
                error={form.errors["riddle"]}
                autosize
                maxRows={8}
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
                  autosize
                  maxRows={8}
                />
                <Textarea
                  label="Source Location"
                  name="sourceLocation"
                  {...form.getInputProps("sourceLocation")}
                  autosize
                  maxRows={8}
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
                  data={props.resources?.map((resource) => resource.name)}
                  {...form.getInputProps("RiddleResource")}
                  searchable
                />
              </Group>
            </Grid.Col>
          </Grid>

          <Divider />

          <Group gap="xl" grow justify="space-between" align="center">
            <Tooltip label="Submit Changes">
              <ActionIcon
                size="lg"
                type="submit"
                variant="filled"
                color="green"
              >
                <RiCheckFill />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Preview Riddle">
              <ActionIcon
                size="lg"
                variant="filled"
                color="cyan"
                onClick={previewModal}
              >
                <RiEye2Fill />
              </ActionIcon>
            </Tooltip>
            {!props.createMode && (
              <Tooltip label="Delete Riddle">
                <ActionIcon
                  size="lg"
                  variant="filled"
                  color="red"
                  onClick={deleteModal}
                >
                  <RiDeleteBin2Fill />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Stack>
      </form>
    </Container>
  );
}
