import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';

import './globals.css';
import { AppProvider } from '@/components/providers/app-provider';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'EcoLocator',
    template: '%s | EcoLocator',
  },
  description:
    'Find nearby recycling centers and waste collection facilities. EcoLocator helps you dispose of plastic, e-waste, paper, and more responsibly.',

  applicationName: 'EcoLocator',

  keywords: [
    'recycling centers',
    'waste collection',
    'eco friendly',
    'recycling',
    'waste management',
    'plastic recycling',
    'e-waste disposal',
    'sustainability',
    'environment',
  ],

  authors: [{ name: 'Jessa Mae Hernandez' }],
  creator: 'Jessa Mae Hernandez',

  // metadataBase: new URL('https://ecolocator.app'),

  // alternates: {
  //   canonical: '/',
  // },

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  manifest: '/manifest.webmanifest',

  themeColor: '#16A34A',

  category: 'environment',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
