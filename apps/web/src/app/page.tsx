'use client';

import { useEffect } from 'react';

import { PublicLayout } from '@/components/layout/public-layout';
import { initScrollAnimations } from '@/lib/animations/init-scroll-animations';
import Hero from '@/modules/home/components/hero';
import ProblemSection from '@/modules/home/components/problem-section';

export default function HomePage() {
  useEffect(() => {
    initScrollAnimations();
  }, []);

  return (
    <PublicLayout>
      <main className="bg-background text-foreground">
        <Hero />
        <ProblemSection />
      </main>
    </PublicLayout>
  );
}
