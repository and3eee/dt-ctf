"use client";
import { EventProps } from "@/types";
import { Center, RingProgress, Stack, Title } from "@mantine/core";
import { Event } from "@prisma/client";
export default function EventCountDown(props: { event: EventProps }) {
  const now = new Date();

  const dateDif = () => {
    return (
      <Stack align="center" gap="0">
        <Title order={3}>
          {Math.round(
            (props.event.start.valueOf() - now.valueOf()) / (3600000 * 24)
          )}{" "}
          days
        </Title>
        {(props.event.start.valueOf() - now.valueOf()) / 3600000 > 24 && (
          <Title order={3}>
            {Math.round(
              ((props.event.start.valueOf() - now.valueOf()) % (3600000 * 24)) /
                3600000
            )}{" "}
            hrs
          </Title>
        )}
      </Stack>
    );
  };

  return (
    <RingProgress
      size={180}
      maw={180}
      thickness={16}
      roundCaps
      label={dateDif()}
      sections={[
        {

          value: Math.round(
            100 -
              100 *
                ((props.event.start.valueOf() - now.valueOf()) /
                  (24 * 10 * 3600000))
          ),
          color: "gray",
        },
        {
          tooltip:
            Math.round(
              100 *
                ((props.event.start.valueOf() - now.valueOf()) /
                  (24 * 10 * 3600000))
            ) + "  hours",
          value: Math.round(
            100 *
              ((props.event.start.valueOf() - now.valueOf()) /
                (24 * 10 * 3600000))
          ),
          color: "orange",
        },
      ]}
    />
  );
}
