"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider({ children, attribute }: { children: ReactNode, attribute?: string }) {
  return <NextThemesProvider attribute={attribute || "class"}>{children}</NextThemesProvider>;
}
