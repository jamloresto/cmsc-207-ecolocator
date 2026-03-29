'use client';

import { ThemeProvider } from "./theme-provider";
import { ToastProvider } from "./toast-provider";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="ecolocator-theme"
    >
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
