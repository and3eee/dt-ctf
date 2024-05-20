"use client";

import { Riddle } from "@prisma/client";
import CounterMetricWheel from "../General/CounterMetricWheel";
import {
  Card,
  Center,
  Collapse,
  Divider,
  Group,
  NavLink,
  Stack,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  RiFile2Line,
  RiArrowDownSFill,
  RiArrowRightSFill,
  RiBarChart2Fill,
} from "react-icons/ri";
import PercentileMetricWheel from "../General/PercentileMetricWheel";

export default function RiddleListMetrics(props: { riddles: Riddle[] }) {
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <Stack >
      <NavLink
        href="#metrics"
        label="Riddle Metrics"
        leftSection={<RiBarChart2Fill size="1rem" />}
        rightSection={opened ? <RiArrowDownSFill /> : <RiArrowRightSFill />}
        onClick={toggle}
      />
      <Collapse in={opened}>
        <Stack>
          <Group grow gap="xl" p={16}>
            <CounterMetricWheel
              data={props.riddles}
              title={"Buckets"}
              keyFilter={"bucket"}
            />
            <CounterMetricWheel
              data={props.riddles}
              title={"Authors"}
              keyFilter={"author"}
            />
            <CounterMetricWheel
              data={props.riddles}
              title={"Difficulty"}
              keyFilter={"difficulty"}
            />
          
            <PercentileMetricWheel
              data={props.riddles}
              title={"Validated"}
              keyFilter={"validated"}
            />
            <PercentileMetricWheel
              data={props.riddles}
              title={"Implemented"}
              keyFilter={"implemented"}
            />
          </Group>
        </Stack>
      </Collapse>
    </Stack>
  );
}
