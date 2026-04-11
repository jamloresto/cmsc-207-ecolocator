'use client';

import {
  ArrowRight,
  MapPin,
  Navigation,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FindCentersPage } from '@/modules/find-centers';
import Link from 'next/link';

export default function FindCentersNearYouSection() {
  return (
    <section className="relative overflow-hidden px-5 py-20 md:px-10 md:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/8 absolute top-10 left-[8%] h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-brand-300/10 absolute right-[6%] bottom-0 h-72 w-72 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 md:grid-cols-[0.95fr_1.05fr] md:gap-14">
          <div>
            <div className="reveal-fade border-border bg-secondary text-secondary-foreground inline-flex rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase">
              Find centers near you
            </div>

            <h2 className="reveal-up mt-6 max-w-xl text-3xl leading-tight font-semibold md:text-5xl">
              Search nearby recycling centers with less guesswork.
            </h2>

            <p className="reveal-fade text-muted-foreground mt-5 max-w-2xl text-sm leading-7 md:text-base">
              Explore locations near your area, compare accepted materials, and
              quickly identify where your waste should go before you visit.
            </p>

            <div className="stagger-up mt-8 space-y-4">
              <FeatureItem
                icon={Search}
                title="Search by city or location"
                description="Start with a place you know, then narrow the results down."
              />
              <FeatureItem
                icon={SlidersHorizontal}
                title="Filter by material type"
                description="See centers that match the items you want to dispose of."
              />
              <FeatureItem
                icon={Navigation}
                title="Check details before going"
                description="Review distance, accepted materials, and center information."
              />
            </div>

            <div className="stagger-up mt-8 flex flex-col items-center gap-4 lg:flex-row">
              <Link href="/find-centers">
                <Button
                  variant="primary"
                  className="cursor-pointer whitespace-nowrap"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Find centers by Map
                </Button>
              </Link>

              <Link href="/recycling-centers">
                <Button
                  variant="secondary"
                  className="cursor-pointer whitespace-nowrap"
                >
                  Find centers by Material Type
                </Button>
              </Link>
            </div>
          </div>

          <div className="reveal-scale">
            <div className="bg-card/90 overflow-hidden">
              <FindCentersPage view="home" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type FeatureItemProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

function FeatureItem({ icon: Icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-primary/10 text-primary inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="text-foreground text-base font-semibold md:text-lg">
          {title}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm leading-7 md:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
