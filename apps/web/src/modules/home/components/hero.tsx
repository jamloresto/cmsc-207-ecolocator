import { MapPin, Recycle } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section>
      <div className="from-foreground to-primary min-h-[70vh] bg-linear-to-l">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center p-5 md:justify-start md:p-10">
          <div className="flex flex-col items-start gap-4">
            <div className="text-background flex items-center gap-3">
              <span className="bg-background inline-flex h-8 w-8 items-center justify-center rounded-full md:h-12 md:w-12">
                <Recycle className="text-primary h-4 md:h-8" />
              </span>
              <p className="text-2xl font-semibold md:text-4xl">EcoLocator</p>
            </div>

            <div className="max-w-75 md:max-w-160">
              <h1 className="text-background text-3xl font-bold md:text-6xl">
                Find <span className="text-accent">recycling centers</span> near
                you with ease.
              </h1>

              <p className="text-background mt-2 font-medium md:text-lg">
                Discover nearby waste collection and recycling facilities,
                explore accepted materials, and make responsible disposal part
                of your everyday routine.
              </p>

              <div className="mt-8 flex flex-col gap-3 md:mt-24 md:flex-row md:items-center">
                <Button variant="secondary">
                  <MapPin className="mr-2 h-4 w-4" />
                  Find centers
                </Button>

                <Button variant="primary">Learn more</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}