'use client';

import { useEffect } from 'react';

import { PublicLayout } from '@/components/layout/public-layout';
import { initScrollAnimations } from '@/lib/animations/init-scroll-animations';
import Hero from '@/modules/home/components/hero';
import ProblemSection from '@/modules/home/components/problem-section';
import HowEcoLocatorWorksSection from '@/modules/home/components/how-ecolocator-works-section';
import WhatCanBeRecycledSection from '@/modules/home/components/what-can-be-recycled-section';
import FindCentersNearYouSection from '@/modules/home/components/find-centers-near-you';
import WhyItMattersSection from '@/modules/home/components/why-it-matters-section';

export default function HomePage() {
  useEffect(() => {
    initScrollAnimations();
  }, []);

  return (
    <PublicLayout>
      <main className="bg-background text-foreground">
        <Hero />
        <ProblemSection />
        <HowEcoLocatorWorksSection />
        <WhatCanBeRecycledSection />
        <FindCentersNearYouSection />
        <WhyItMattersSection />
      </main>
    </PublicLayout>
  );
}
