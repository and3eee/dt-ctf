"use client";

import { DonutChart } from "@mantine/charts";
import { Stack, Title } from "@mantine/core";
import { count } from "console";

const colors = [
  "red",
  "purple",
  "cyan",
  "green",
  "yellow",
  "pink",
  "blue",
  "teal",
  "lime",
  "orange",
];

export default function PercentileMetricWheel(props: {
  data: any[];
  title: string;
  keyFilter: string;
  colors?: string[];
}) {
  var trueC = 0;

  props.data.forEach((entry: any) => {
    if (entry[props.keyFilter]) trueC++;
  });
  var count_dict: { name: string; value: number; color: string }[] = [
    {
      name: "True",
      value: trueC,
      color: "green",
    },
    {
      name: "False",
      value: props.data.length - trueC,
      color: "red",
    },
  ];


  return (
    <Stack align="center">
      <DonutChart strokeWidth={0} chartLabel={props.title} data={count_dict} />
    </Stack>
  );
}
