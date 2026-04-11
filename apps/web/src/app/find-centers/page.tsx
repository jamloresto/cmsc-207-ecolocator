import { PublicLayout } from '@/components/layout/public-layout';
import { FindCentersPage } from '@/modules/find-centers';
import { MapPin } from 'lucide-react';

export default function Page() {
  return (
    <PublicLayout>
      <section className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="text-primary h-5 w-5" />
            <p className="text-primary text-sm font-semibold">Find Centers</p>
          </div>

          <h1 className="text-foreground mt-2 text-2xl font-bold md:text-3xl">
            Find recycling and waste collection centers
          </h1>

          <p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-base">
            Move the map to load nearby recycling and waste collection centers.
          </p>
        </div>

        <FindCentersPage />
      </section>
    </PublicLayout>
  );
}
