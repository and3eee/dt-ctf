import ColorSchemeContext from "@/lib/ColorSchemeContext";
import {
  ActionIcon,
  Group,
  ThemeIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useCounter } from "@mantine/hooks";
import { useContext } from "react";
import { RiSunFill, RiMoonClearFill } from "react-icons/ri";

export default function ThemeSwitch(props: { trigger?: () => void }) {
  const [count, handlers] = useCounter(0, { min: 0, max: 100 });
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });

  return (
    <Group justify="center" maw={"2rem"}>
      <ActionIcon
        onClick={() => {
          handlers.increment();
          if (count < 100)
            setColorScheme(computedColorScheme === "light" ? "dark" : "light");
          else if (props.trigger){props.trigger();}
        }}
        variant={computedColorScheme === "light" ? "default" : "subtle"}
        size="xl"
        radius={"xl"}
        aria-label="Toggle color scheme"
      >
        {computedColorScheme == "light" && <RiSunFill color={"orange"} />}

        {computedColorScheme == "dark" && <RiMoonClearFill color={"cyan"} />}
      </ActionIcon>
    </Group>
  );
}
