'use client';

import { MantineColorsTuple, createTheme } from "@mantine/core";

const myColor: MantineColorsTuple = [
  "#fff5e1",
  "#ffeacc",
  "#ffd29b",
  "#ffb964",
  "#ffa438",
  "#ff971b",
  "#ff9009",
  "#e37d00",
  "#ca6e00",
  "#b05d00",
];

export const theme = createTheme({
defaultGradient: {
  from: 'grape.6',
  to: 'indigo.6',
  deg: 110,
},
primaryColor: "violet", primaryShade: 8,
  defaultRadius:"md"
});

export const supersecrettheme = createTheme({
  colors: {
    blue: [
      "#ffe9e9",
      "#ffd1d1",
      "#fba0a1",
      "#f76d6d",
      "#f34141",
      "#f22625",
      "#f21616",
      "#d8070b",
      "#c10008",
      "#a90003",
    ],
    dark: [
      "#fbefef",
      "#efdcdc",
      "#e2b3b4",
      "#d6898a",
      "#cd6667",
      "#c75050",
      "#c54445",
      "#ae3636",
      "#9c2e2f",
      "#892527"
    ],
  },
});
