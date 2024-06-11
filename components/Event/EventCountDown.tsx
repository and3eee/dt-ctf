"use client";
import { EventProps } from "@/types";
import { Center, RingProgress, Stack, Title } from "@mantine/core";
import { Event } from "@prisma/client";
export default function EventCountDown(props: {
  event: EventProps;
  useEnd?: boolean;
}) {
  const now = new Date();
  const dif = (props.useEnd
    ? props.event.end.valueOf() - now.valueOf()
    : props.event.start.valueOf() - now.valueOf())
  const dateDif = () => {
    return (
      <Stack align="center" gap="0">
        {dif /
          3600000 >
          24 &&<Title order={3}>
          {Math.floor(
            (dif) /
              (3600000 * 24)
          )} {" "}
           days
        </Title>}
        {dif /
          3600000 <
          24 && (
          <Title order={3}>
            {Math.floor(
              (dif %
                (3600000 * 24)) /
                3600000
            )}{" "}
            hrs
          </Title>
        )}

        {dif /
          3600000 <
          24 && (
          <Title order={3}>
            {Math.floor(
              (dif %
                (3600000 * 24 * 60)) /
                3600000
            )}{" "}
            min
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
          value: Math.floor(
            100 -
              100 *
                (dif /
                  (24 * 10 * 3600000))
          ),
          color: "gray",
        },
        {
          tooltip:
            Math.floor(
             
                (dif /
                  (3600000))
            ) + "  hours left",
          value: Math.floor(
            100 *
              (dif /
                (24 * 10 * 3600000))
          ),
          color: "violet",
        },
      ]}
    />
  );
}
