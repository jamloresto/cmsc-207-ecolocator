'use client';

import { Globe, Leaf, Recycle, Users } from 'lucide-react';

const impacts = [
  {
    icon: Recycle,
    title: 'Reduce waste pollution',
    description:
      'Proper disposal prevents recyclable materials from ending up in landfills or oceans.',
  },
  {
    icon: Leaf,
    title: 'Protect the environment',
    description:
      'Recycling helps conserve natural resources and reduces the need for raw material extraction.',
  },
  {
    icon: Globe,
    title: 'Support sustainability',
    description:
      'Small actions contribute to a larger global effort toward sustainable living.',
  },
  {
    icon: Users,
    title: 'Empower communities',
    description:
      'Accessible information encourages more people to take part in responsible waste management.',
  },
];

export default function WhyItMattersSection() {
  return (
    <section className="relative overflow-hidden px-5 py-20 md:px-10 md:py-28">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/10 absolute top-[10%] left-[6%] h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-brand-300/10 absolute right-[10%] bottom-[5%] h-72 w-72 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="reveal-fade border-border bg-secondary text-secondary-foreground inline-flex rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase">
            Why it matters
          </div>

          <h2 className="reveal-up mt-6 text-3xl leading-tight font-semibold md:text-5xl">
            Small actions today can create
            <span className="text-primary"> lasting impact tomorrow.</span>
          </h2>

          <p className="reveal-fade text-muted-foreground mx-auto mt-5 max-w-2xl text-sm leading-7 md:text-base">
            Recycling is not just about waste—it’s about protecting our
            environment, supporting communities, and building a more sustainable
            future for everyone.
          </p>
        </div>

        {/* Impact Cards */}
        <div className="stagger-up mt-12 grid gap-4 md:gap-8 md:mt-14 md:grid-cols-2">
          {impacts.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group border-border bg-card hover:border-primary/30 hover:bg-accent-foreground rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="bg-primary/10 text-primary group-hover:text-accent inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-foreground group-hover:text-accent mt-5 text-lg font-semibold">
                  {item.title}
                </h3>

                <p className="text-muted-foreground group-hover:text-background mt-3 text-sm leading-7">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Highlight */}
        <div className="reveal-scale border-primary/20 bg-secondary mt-10 rounded-3xl border p-6 text-center md:mt-12 md:p-8">
          <p className="text-secondary-foreground text-base leading-8 font-medium md:text-lg">
            By making recycling easier to access, EcoLocator helps turn good
            intentions into real environmental impact.
          </p>
        </div>
      </div>
    </section>
  );
}
