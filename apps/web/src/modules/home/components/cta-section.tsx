'use client';

import { ArrowRight, MapPin, Recycle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden px-5 py-20 md:px-10 md:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/12 absolute top-0 left-[8%] h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-brand-300/12 absolute right-[6%] bottom-0 h-80 w-80 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="reveal-scale from-brand-950 via-brand-800 to-primary relative overflow-hidden rounded-4xl bg-linear-to-br p-8 shadow-xl md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_32%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.16))]" />

          <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
            {/* LEFT */}
            <div className="max-w-2xl">
              <div className="reveal-fade inline-flex items-center gap-2 rounded-full border border-red-500 px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase">
                <Recycle className="h-4 w-4" />
                Take action today
              </div>

              <h2 className="reveal-up mt-6 text-3xl leading-tight font-semibold md:text-5xl">
                Start recycling smarter,
                <span className="text-accent"> one search at a time.</span>
              </h2>

              <p className="reveal-fade text-background/80 mt-5 max-w-xl text-sm leading-7 md:text-base">
                Find nearby recycling and waste collection centers, check what
                materials they accept, and make proper disposal part of your
                everyday routine.
              </p>

              <div className="stagger-up mt-8 flex flex-col gap-3 md:flex-row md:items-center">
                <Link
                  href="/find-centers"
                  className="flex w-full md:block md:w-fit"
                >
                  <Button
                    variant="secondary"
                    className="w-full cursor-pointer md:w-fit"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Find centers now
                  </Button>
                </Link>

                <Button
                  variant="primary"
                  className="cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById('problem');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}