import { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';

import { SmoothScrollProvider } from '../providers/smooth-scroll-provider';

type PublicLayoutProps = {
  children: ReactNode;
};

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <SmoothScrollProvider>
      <div className="bg-background text-foreground flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 pt-20">{children}</main>
        <SiteFooter />
      </div>
    </SmoothScrollProvider>
  );
}
