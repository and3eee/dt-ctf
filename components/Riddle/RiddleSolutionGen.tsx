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
    <Card withBorder radius="xl" p={16} m={4}>
     
        <Center>{value}</Center>
 
      <Button  radius="xl" onClick={updateValue}>Generate New Solution</Button>
    </Card>
  );
}
