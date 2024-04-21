"use client";
import { Button, Text } from "@mantine/core";

import { useState } from "react";

export default function SpoilerText(props: { children: any }) {
  const [toggled, setToggled] = useState(false);

  return (
    <div>
      {toggled && <Text onClick={() => {setToggled(false)}}>{props.children}</Text>}
      {!toggled && <Button onClick={() => {setToggled(true)}} color="gray">Spoiler</Button>}
    </div>
  );
}
