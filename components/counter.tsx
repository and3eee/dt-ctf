"use client";

import { Button } from "@mantine/core";
import { useState } from "react";


export const Counter = () => {
	const [count, setCount] = useState(0);

	return (
		<Button radius="full" onClick={() => setCount(count + 1)}>
			Count is {count}
		</Button>
	);
};
