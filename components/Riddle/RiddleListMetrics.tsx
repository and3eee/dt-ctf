"use client";

import { Riddle } from "@prisma/client";
import CounterMetricWheel from "../General/CounterMetricWheel";
import { Card, Center, Divider, Group, Title } from "@mantine/core";

export default function RiddleListMetrics(props: { riddles: Riddle[] }) {
  return (
    <Card padding={12} >
      <Card.Section inheritPadding>
        <Center>
          <Title order={3}>Flag Metrics</Title>
       
        </Center>
      </Card.Section>
      <Divider/>
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
      </Group>
    </Card>
  );
}
