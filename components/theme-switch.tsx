import ColorSchemeContext from "@/lib/ColorSchemeContext";
import { ActionIcon, Group, ThemeIcon, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { useContext } from "react";
import { RiSunFill, RiMoonClearFill } from "react-icons/ri";

export default function ThemeSwitch() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });

  return (
    <Group justify="center" maw={"2rem"}>
      <ActionIcon
        onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
        variant={computedColorScheme === 'light' ? 'default' : 'subtle'}
        size="xl"
        radius={"xl"}
        
        aria-label="Toggle color scheme"
      >
       {computedColorScheme =='light' && <RiSunFill color={ 'orange'} />}
     
      {computedColorScheme =='dark' &&    <RiMoonClearFill  color={ 'cyan'} />}
      </ActionIcon>
    </Group>
  );
}
