'use client';

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

export default function CounterMetricWheel(props: {
  data: any[];
  title: string;
  keyFilter: string;
  colors?: string[];
}) {
  //first mutate the data to track based off the key
  var count_dict: { name: string; value: number; color: string }[] = [];

  props.data.forEach((entry: any) => {
    if (
      !count_dict.some(
        (countedEntry) => countedEntry.name == entry[props.keyFilter]
      )
    ) {
      count_dict.push({
        name: entry[props.keyFilter],
        value: props.data.filter(
          (filterEntry) =>
            filterEntry[props.keyFilter] == entry[props.keyFilter]
        ).length,
        color: props.colors
          ? props.colors![count_dict.length]
          : colors[count_dict.length],
      });
    }
  });

  

  return (
    <Stack align="center">
      <DonutChart strokeWidth={0} chartLabel={props.title} data={count_dict} />
    </Stack>
  );
}
