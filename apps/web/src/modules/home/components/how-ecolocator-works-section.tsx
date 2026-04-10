'use client';

import { SlidersHorizontal, MapPinned, Map } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Search your area',
    description:
      'Enter your city or explore the map to discover nearby recycling and waste collection options.',
    icon: Map,
  },
  {
    step: '02',
    title: 'Filter by material',
    description:
      'Choose the material you want to dispose of, such as plastic, paper, glass, e-waste, or batteries.',
    icon: SlidersHorizontal,
  },
  {
    step: '03',
    title: 'Find a center',
    description:
      'View accepted materials and location details so you can dispose of waste properly and confidently.',
    icon: MapPinned,
  },
];

export default function HowEcoLocatorWorksSection() {
  return (
    <section className="bg-muted/40 relative overflow-hidden px-5 py-20 md:px-10 md:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="bg-brand-300/10 absolute top-16 left-[10%] h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-primary/8 absolute right-[8%] bottom-0 h-72 w-72 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="reveal-fade border-border bg-background/70 text-secondary-foreground inline-flex rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase backdrop-blur-sm">
            How it works
          </div>

          <h2 className="reveal-up mt-6 text-3xl leading-tight font-semibold md:text-5xl">
            Recycling made simpler in three clear steps.
          </h2>

          <p className="stagger-reveal-fade text-muted-foreground mx-auto mt-5 max-w-2xl text-sm leading-7 md:text-base">
            EcoLocator helps users move from confusion to action by making it
            easier to search, filter, and find proper disposal options nearby.
          </p>
        </div>

        <div className="relative mt-16 md:mt-20">
          <div className="bg-border absolute top-0 left-1/2 hidden h-full w-px -translate-x-1/2 md:block" />

          <div className="space-y-14 md:space-y-20">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={item.step}
                  className="relative grid items-center gap-6 md:grid-cols-2 md:gap-12"
                >
                  <div
                    className={
                      isLeft
                        ? 'reveal-left md:pr-14'
                        : 'reveal-right md:col-start-2 md:pl-14'
                    }
                  >
                    <div className="relative">
                      <span className="text-foreground/8 absolute -top-10 text-7xl leading-none font-bold md:-top-12 md:text-8xl">
                        {item.step}
                      </span>

                      <div className="relative z-10">
                        <div className="bg-primary/10 text-primary inline-flex h-14 w-14 items-center justify-center rounded-2xl">
                          <Icon className="h-6 w-6" />
                        </div>

                        <h3 className="text-foreground mt-5 text-2xl font-semibold">
                          {item.title}
                        </h3>

                        <p className="text-muted-foreground mt-4 max-w-md text-sm leading-7 md:text-base">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      isLeft
                        ? 'hidden md:block'
                        : 'hidden md:col-start-1 md:row-start-1 md:block'
                    }
                  />

                  <div className="bg-primary absolute top-10 left-1/2 hidden h-5 w-5 -translate-x-1/2 rounded-full md:block animate-ping" />
                  <div className="bg-background border-border absolute top-10 left-1/2 hidden h-5 w-5 -translate-x-1/2 rounded-full border md:block">
                    <div className="bg-primary absolute top-1/2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
