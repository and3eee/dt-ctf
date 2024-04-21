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
} from "@mantine/core";
import { Riddle } from "@prisma/client";
import { useForm } from "@mantine/form";
import { theme } from "@/theme";
import { CreateRiddle, EditRiddle } from "./RiddleControl";

export default function RiddleEdit(props: {
  riddle: Riddle;
  onClick?: () => void;
}) {
  const form = useForm<Riddle>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: props.riddle,
    validate: {
      difficulty: (value: string | null) => {
        if (value) updateDifficultyColor(value);
        return value ? null : "Not a valid difficulty";
      },
    },
  });

  const [difficultyColor, setDifficultyColor] = useState<string>("none");

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

  const submissionHandler =  async (values: typeof form.values) => {

    
    const riddle = values

    if(riddle.id<0){
      const reply =  await CreateRiddle(riddle)
      if(props.onClick)
        props.onClick()
    }else{
      const reply = await EditRiddle(riddle)
      if(props.onClick)
        props.onClick()
    }

  }

  return (
    <form
      onSubmit={form.onSubmit(submissionHandler)}
    >
      <Card miw={"32rem"} maw={"48rem"} mah="40rem">
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
              /></Stack>
            </Center>
          </Grid.Col>
          <Grid.Col span={6}>
            <Flex h={"4rem"} gap={"md"} justify={"center"} align={"center"}>
              <Switch
               
                name="implemented"
                label="Implemented"
                {...form.getInputProps("implemented")}
              >
                Implemented
              </Switch>
              <Switch
              
                name="validated"
                label="Validated"
                {...form.getInputProps("validated")}
              >
                Validated
              </Switch>
            </Flex>
          </Grid.Col>
        </Grid>

        <Divider />
        <Card.Section p={"1rem"}>
          <Center>
            <Button type="submit" color="green" >
              Submit
            </Button>
          </Center>
        </Card.Section>
      </Card>
    </form>
  );
}
