'use client';

import Link from 'next/link';

import { Recycle } from 'lucide-react';

import { ThemeToggle } from '@/components/theme/theme-toggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/find-centers', label: 'Find Centers' },
  { href: '/contact', label: 'Contact' },
  { href: '/admin/login', label: 'Admin' },
];

export function SiteHeader() {
  return (
    <header className="border-border bg-card border-b">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full font-bold">
            <Recycle />
          </div>

          <div className="flex flex-col">
            <span className="text-foreground text-lg font-bold">
              EcoLocator
            </span>
            <span className="text-muted-foreground text-xs">
              Waste & Recycling Solutions
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
