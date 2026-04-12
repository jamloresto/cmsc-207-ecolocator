'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, Recycle, X } from 'lucide-react';

import { Container } from '@/components/shared/container';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/find-centers', label: 'Find Centers' },
  { href: '/suggest-location', label: 'Suggest a Location' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const TOP_OFFSET = 40;
    const SCROLL_THRESHOLD = 12;
    const HIDE_AFTER = 100;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      setAtTop(currentScrollY <= TOP_OFFSET);

      if (mobileMenuOpen) {
        setVisible(true);
        ticking.current = false;
        return;
      }

      if (currentScrollY <= TOP_OFFSET) {
        setVisible(true);
      } else if (Math.abs(diff) >= SCROLL_THRESHOLD) {
        if (diff > 0 && currentScrollY > HIDE_AFTER) {
          setVisible(false);
        } else if (diff < 0) {
          setVisible(true);
        }

        lastScrollY.current = currentScrollY;
      }

      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateHeader);
        ticking.current = true;
      }
    };

    lastScrollY.current = window.scrollY;

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      setVisible(true);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!mobileMenuOpen) return;

      const target = event.target as Node;

      if (headerRef.current && !headerRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <header
      ref={headerRef}
      className={[
        'fixed inset-x-0 top-0 z-50',
        'transition-transform duration-300 ease-out',
        visible ? 'translate-y-0' : '-translate-y-full',
        atTop || mobileMenuOpen
          ? 'bg-background/90 border-border/80 border-b backdrop-blur-md'
          : 'bg-background/80 border-border/80 border-b backdrop-blur-md',
      ].join(' ')}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMobileMenuOpen(false)}
        >
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

        <div className="flex items-center gap-3 md:gap-6">
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

          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="text-foreground hover:bg-muted inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </Container>

      <div
        className={[
          'border-border/80 bg-background/95 overflow-hidden border-t backdrop-blur-md transition-all duration-300 md:hidden',
          mobileMenuOpen
            ? 'max-h-80 opacity-100'
            : 'pointer-events-none max-h-0 opacity-0',
        ].join(' ')}
      >
        <Container className="flex flex-col py-4">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground hover:bg-muted hover:text-primary rounded-xl px-3 py-3 text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-auto w-fit">
              <ThemeToggle />
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
}
