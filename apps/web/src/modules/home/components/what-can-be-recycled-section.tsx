'use client';

import {
  Battery,
  Cable,
  CircleDashed,
  GlassWater,
  Leaf,
  Monitor,
  Newspaper,
  Recycle,
} from 'lucide-react';

// TODO: Connect to API then add icons to backend / db
const materials = [
  {
    name: 'Plastic',
    description:
      'Bottles, containers, packaging, and other common recyclable plastics.',
    icon: Recycle,
  },
  {
    name: 'Paper',
    description:
      'Newspapers, office paper, cardboard, and other paper-based materials.',
    icon: Newspaper,
  },
  {
    name: 'Glass',
    description:
      'Glass bottles, jars, and other reusable or recyclable glass items.',
    icon: GlassWater,
  },
  {
    name: 'Metal',
    description:
      'Aluminum cans, tin containers, and selected metal household waste.',
    icon: CircleDashed,
  },
  {
    name: 'E-waste',
    description:
      'Old gadgets, small electronics, accessories, and computer peripherals.',
    icon: Monitor,
  },
  {
    name: 'Batteries',
    description:
      'Used batteries that require safer handling and proper disposal.',
    icon: Battery,
  },
  {
    name: 'Wires & Cables',
    description:
      'Chargers, extension wires, and cables that should not go to mixed trash.',
    icon: Cable,
  },
  {
    name: 'Organic Waste',
    description:
      'Selected biodegradable waste for composting or separate collection.',
    icon: Leaf,
  },
];

const marqueeRowA = [...materials, ...materials];
const marqueeRowB = [
  ...materials.slice(4),
  ...materials.slice(0, 4),
  ...materials.slice(4),
  ...materials.slice(0, 4),
];

export default function WhatCanBeRecycledSection() {
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
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h3 className="text-foreground text-2xl font-semibold md:text-3xl">
                Materials vary by center
              </h3>

              <p className="text-muted-foreground mt-4 text-sm leading-7 md:text-base">
                Not every facility accepts the same types of waste. Browse
                material categories first, then match them to nearby recycling
                centers that handle them properly.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                'Plastic',
                'Paper',
                'Glass',
                'Metal',
                'E-waste',
                'Batteries',
              ].map((item) => (
                <span
                  key={item}
                  className="border-border bg-secondary text-secondary-foreground rounded-full border px-3 py-2 text-xs font-medium md:text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Row 1 */}
        <div className="group relative overflow-hidden pt-6">
          <div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r to-transparent md:w-24" />
          <div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l to-transparent md:w-24" />

          <div className="animate-marquee flex w-max gap-4 group-hover:[animation-play-state:paused]">
            {marqueeRowA.map((material, index) => (
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

function MaterialCard({ material }: { material: Material }) {
  const Icon = material.icon;

  return (
    <article className="border-border bg-card group/card hover:border-primary/30 hover:bg-accent-foreground relative flex min-h-48 w-[18rem] shrink-0 flex-col overflow-hidden rounded-[1.75rem] border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md md:w-76">
      <Icon className="text-primary/20 absolute -right-6 -bottom-6 h-36 w-36" />

      <h3 className="text-foreground group-hover/card:text-primary mt-5 text-xl font-semibold">
        {material.name}
      </h3>

      <p className="text-muted-foreground group-hover/card:text-background mt-3 text-sm leading-7 md:text-base">
        {material.description}
      </p>
    </article>
  );
}
