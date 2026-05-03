"use client";

import type { ReactNode } from "react";

import { PageTransitionProvider } from "@/hooks/usePageTransition";
import { ThemeProvider } from "@/hooks/useTheme";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <PageTransitionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </PageTransitionProvider>
  );
}
