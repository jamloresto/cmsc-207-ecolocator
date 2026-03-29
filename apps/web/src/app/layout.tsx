import type { Metadata } from 'next';

import './globals.css';
import { AppProvider } from '@/components/providers/app-provider';

export const metadata: Metadata = {
  title: {
    default: 'EcoLocator',
    template: '%s | EcoLocator',
  },
  description: 'Waste Collection & Recycling Locator',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
