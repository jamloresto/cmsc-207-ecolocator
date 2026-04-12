'use client';

import { useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import {
  ArrowRight,
  Battery,
  GlassWater,
  Laptop,
  MapPin,
  Newspaper,
  Recycle,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { initHeroAnimations } from '@/lib/animations';

const chips = [
  { label: 'Plastic', icon: Recycle },
  { label: 'Paper', icon: Newspaper },
  { label: 'Glass', icon: GlassWater },
  { label: 'E-waste', icon: Laptop },
  { label: 'Batteries', icon: Battery },
];

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const cleanup = initHeroAnimations(heroRef.current);
    return cleanup;
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden">
      <div className="from-foreground to-primary relative min-h-screen bg-linear-to-br">
        <div className="absolute inset-0">
          <div className="hero-orb-a bg-brand-300/15 absolute top-[10%] left-[8%] h-56 w-56 rounded-full blur-3xl md:h-72 md:w-72" />
          <div className="hero-orb-b bg-primary/20 absolute right-[6%] bottom-[8%] h-64 w-64 rounded-full blur-3xl md:h-80 md:w-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_30%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.16))]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 py-16 md:px-10">
          <div className="grid w-full items-center gap-12 md:grid-cols-2">
            <div className="flex flex-col items-start">
              <div className="reveal-fade text-background mb-6 inline-flex items-center gap-3 rounded-full border px-4 py-2 backdrop-blur-md">
                <span className="bg-background inline-flex h-9 w-9 items-center justify-center rounded-full md:h-10 md:w-10">
                  <Recycle className="text-primary h-4 w-4 md:h-5 md:w-5" />
                </span>
                <p className="text-sm font-semibold tracking-[0.18em] uppercase md:text-base">
                  EcoLocator
                </p>
              </div>

              <div className="max-w-2xl">
                <h1 className="reveal-up text-background max-w-xl text-4xl leading-tight font-bold text-pretty md:text-6xl">
                  Find where waste <span className="text-accent">goes.</span>
                </h1>

                <p className="reveal-fade text-background/85 mt-5 max-w-xl text-base leading-7 text-pretty md:mt-6 md:text-lg md:leading-8">
                  Discover nearby recycling and waste collection centers, filter
                  by material, and make proper disposal part of your everyday
                  routine.
                </p>

                <div className="stagger-up mt-8 flex flex-col gap-3 md:mt-10 md:flex-row md:items-center">
                  <Link
                    href="/find-centers"
                    className="flex w-full md:block md:w-fit"
                  >
                    <Button
                      variant="secondary"
                      className="w-full cursor-pointer"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Find centers
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

            <div className="reveal-scale relative hidden min-h-130 md:block">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative aspect-square h-[40vw] rounded-full border border-white/10 bg-white/5 backdrop-blur-sm lg:h-[35vw]">
                  <div className="absolute inset-[8vw] rounded-full border border-white/10" />
                  <div className="absolute inset-[4vw] rounded-full border border-white/10" />
                  <div className="absolute inset-[20vw] rounded-full border border-white/8" />

                  <div className="hero-pin-pulse bg-primary/20 absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl" />

                  <div className="bg-background/95 absolute top-1/2 left-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary shadow-2xl">
                    <div className="bg-background/30 absolute -z-100 h-full w-full animate-ping rounded-full"></div>
                    <MapPin className="text-primary h-10 w-10" />
                  </div>

                  <div className="hero-chip-a absolute top-[18%] left-[6%]">
                    <Chip icon={chips[0].icon} label={chips[0].label} />
                  </div>
                  <div className="hero-chip-b absolute top-[12%] right-[4%]">
                    <Chip icon={chips[1].icon} label={chips[1].label} />
                  </div>
                  <div className="hero-chip-c absolute top-[42%] right-[2%]">
                    <Chip icon={chips[2].icon} label={chips[2].label} />
                  </div>
                  <div className="hero-chip-a absolute bottom-[14%] left-[10%]">
                    <Chip icon={chips[3].icon} label={chips[3].label} />
                  </div>
                  <div className="hero-chip-b absolute right-[14%] bottom-[10%]">
                    <Chip icon={chips[4].icon} label={chips[4].label} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type ChipProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
};

function Chip({ icon: Icon, label }: ChipProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent/15 px-4 py-2 text-sm font-medium text-accent shadow-lg backdrop-blur-md">
      <Icon className="text-background h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}
