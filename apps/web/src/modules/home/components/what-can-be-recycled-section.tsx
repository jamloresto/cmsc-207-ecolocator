'use client';

import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { MaterialType, useMaterialTypes } from '@/modules/material-types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function getMaterialIcon(iconName?: string): LucideIcon {
  if (!iconName) return Icons.Recycle;

  const icon = Icons[iconName as keyof typeof Icons];
  return (icon ?? Icons.Recycle) as LucideIcon;
}

export default function WhatCanBeRecycledSection() {
  const { materialTypes, isLoading } = useMaterialTypes();
  return (
    <section className="relative overflow-hidden px-5 py-20 md:px-10 md:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="bg-brand-600/8 absolute top-10 left-[8%] h-60 w-60 rounded-full blur-3xl" />
        <div className="bg-brand-300/10 absolute right-[10%] bottom-0 h-72 w-72 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-10">
          <div>
            <div className="reveal-fade border-border bg-secondary text-secondary-foreground inline-flex rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase">
              What can be recycled
            </div>

            <h2 className="reveal-up mt-6 max-w-xl text-3xl leading-tight font-semibold md:text-5xl">
              Explore materials that can be sorted and recycled.
            </h2>
          </div>

          <p className="reveal-fade text-muted-foreground max-w-2xl text-sm leading-7 md:justify-self-end md:text-base">
            From everyday plastics and paper to e-waste and batteries,
            EcoLocator helps users understand which materials may be accepted
            and where they can be brought for proper disposal.
          </p>
        </div>

        <div className="reveal-scale border-border bg-card/80 mt-12 rounded-4xl border p-6 shadow-sm backdrop-blur-sm md:mt-14 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-around">
            <div className="max-w-2xl">
              <h3 className="text-foreground text-2xl font-semibold md:text-3xl">
                Materials vary by center
              </h3>

              <p className="text-muted-foreground mt-4 text-sm leading-7 text-pretty md:text-base">
                Not every facility accepts the same types of waste. Browse
                material categories first, then match them to nearby recycling
                centers that handle them properly.
              </p>
            </div>
            <Link href="/what-can-be-recycled">
              <Button
                variant="secondary"
                className="cursor-pointer whitespace-nowrap"
              >
                Browse Material Types
              </Button>
            </Link>
          </div>
        </div>

        {/* Row 1 */}
        <div className="group relative overflow-hidden pt-6">
          <div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r to-transparent md:w-24" />
          <div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l to-transparent md:w-24" />

          <div className="animate-marquee flex w-max gap-4 group-hover:[animation-play-state:paused]">
            {materialTypes.map((material, index) => (
              <MaterialCard
                key={`${material.name}-a-${index}`}
                material={material}
              />
            ))}
          </div>
        </div>

        <p className="reveal-fade text-muted-foreground mt-8 max-w-2xl text-sm leading-7 md:mt-10 md:text-base">
          Accepted materials may differ from one location to another, so users
          should still check the center details before visiting.
        </p>
      </div>
    </section>
  );
}

type Material = {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

function MaterialCard({ material }: { material: MaterialType }) {
  const IconComponent = getMaterialIcon(material.icon);

  return (
    <article className="border-border bg-card group/card hover:border-primary/30 hover:bg-accent-foreground relative flex min-h-36 max-w-60 flex-col overflow-hidden rounded-[1.75rem] border px-4 pb-9 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md md:w-76">

      
      <h3 className="text-foreground group-hover/card:text-primary mt-5 text-xl font-semibold z-100">
        {material.name}
      </h3>

      <IconComponent className="text-primary absolute -right-6 -bottom-6 h-36 w-36 opacity-30 scale-x-[-1]" />
    </article>
  );
}
