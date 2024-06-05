"use client";

import { Button } from "@mantine/core";
import { Riddle } from "@prisma/client";
import { ValidateRiddle } from "./RiddleControl";
import { useState } from "react";

export default function ValidateButton(props: { riddle: Riddle, onValidate?:() => void }) {
    const [validated, setValidated] = useState(props.riddle.validated);
  const validate = async () => {
    const reply = await ValidateRiddle(props.riddle);
    setValidated(true)
    if(props.onValidate)props.onValidate()
  };
  if (props.riddle.validated) {
    return;
  } else {
    return <Button onClick={validate}>Validate</Button>;
  }
}
