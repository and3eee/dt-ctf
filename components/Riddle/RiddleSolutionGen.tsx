import { useState } from "react";
import { GenerateNewSolution } from "./RiddleControl";
import { Button, Card, Center } from "@mantine/core";

export default function RiddleSolutionGenerator() {
  const [value, setValue] = useState<string>("");
  const updateValue = async () => {
    const newVal: string = await GenerateNewSolution();

    setValue(newVal);
  };

  return (
    <Card withBorder>
     
        <Center>{value}</Center>
 
      <Button onClick={updateValue}>Generate New Solution</Button>
    </Card>
  );
}
