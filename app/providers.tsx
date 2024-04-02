"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { IntlProvider } from "react-intl";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}


//TODO: Fix the internationalization. Most likely will need to pull local from the local session.
export function Providers({ children, themeProps }:any) {
  return (
    <IntlProvider locale="en" defaultLocale="en">

      <NextUIProvider>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </NextUIProvider>
    </IntlProvider>
  );
}
