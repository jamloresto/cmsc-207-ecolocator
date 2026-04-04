'use client';

import { QueryProvider } from "./query-provider";
import { StoreProvider } from "./store-provider";
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
      <QueryProvider>
        <StoreProvider>
          <ToastProvider>{children}</ToastProvider>
        </StoreProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
