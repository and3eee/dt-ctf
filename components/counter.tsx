"use client";

import { Button } from "@dynatrace/strato-components-preview";
import { useState } from "react";


export const Counter = () => {
	const [count, setCount] = useState(0);

	return (
		<Button  onClick={() => setCount(count + 1)}>
			Count is {count}
		</Button>
	);
};
