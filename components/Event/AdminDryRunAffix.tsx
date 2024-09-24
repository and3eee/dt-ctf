"use client";

import {
  Affix,
  Transition,
  Button,
  rem,
  Card,
  Title,
  Text,
  Stack,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { RiArrowUpCircleFill } from "react-icons/ri";

export default function AdminDryRunAffix() {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Affix position={{ top: 20, right: 20 }}>
      <Card radius={"xl"} bg="red">
        <Stack align="center" gap="0">
          <Text size="xs"> Admin mode</Text>
          <Title>Dry Run</Title>
        </Stack>
      </Card>
    </Affix>
  );
}
