'use client';

import { MapPinned, Trash2, BadgeQuestionMark } from 'lucide-react';

const problems = [
  {
    icon: MapPinned,
    title: 'No clear drop-off points',
    description:
      'People want to recycle, but often do not know which facility is nearby or where to bring their waste.',
  },
  {
    icon: BadgeQuestionMark,
    title: 'Confusing material rules',
    description:
      'Different centers accept different materials, making proper disposal unclear.',
  },
  {
    icon: Trash2,
    title: 'Waste ends up mixed',
    description:
      'Without accessible information, recyclables often end up in general waste.',
  },
];

export default function ProblemSection() {
  return (
    <section className="relative overflow-hidden px-5 py-20 md:px-10 md:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="bg-brand-600/10 absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-brand-300/10 absolute right-0 bottom-0 h-60 w-60 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <div className="reveal-fade border-border bg-secondary text-secondary-foreground inline-flex rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase">
            The problem
          </div>

          <h2 className="reveal-up mt-6 text-3xl leading-tight font-semibold md:text-5xl">
            Many people want to recycle,
            <span className="text-primary">
              {' '}
              but don&apos;t know where to go.
            </span>
          </h2>

          <p className="reveal-fade text-muted-foreground mt-5 max-w-2xl text-sm leading-7 md:text-base">
            Recycling should be simple. But for many communities, it is still
            difficult to find nearby facilities, understand accepted materials,
            and dispose of waste properly.
          </p>
        </div>

        <div className="stagger-up mt-12 grid gap-4 md:mt-14 md:grid-cols-3">
          {problems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="problem-card group border-border bg-card rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="bg-primary/10 text-primary inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-foreground mt-5 text-lg font-semibold">
                  {item.title}
                </h3>

                <p className="text-muted-foreground mt-3 text-sm leading-7">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="reveal-scale border-primary/20 bg-secondary mt-8 rounded-3xl border p-6 md:mt-10 md:p-8">
          <p className="text-secondary-foreground text-base leading-8 font-medium md:text-lg">
            EcoLocator bridges this gap by making recycling centers easy to
            discover and understand.
          </p>
        </div>
      </div>
    </section>
  );
}
