'use client';

import { useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';

import {
  FindCenterCard,
  FindCenterLocationModal,
  FindCentersGoogleMap,
  FindCentersToolbar,
  useFindCenterMaterialTypes,
  useMapLocations,
  usePublicLocationDetail,
  type MapBounds,
} from '@/modules/find-centers';
import { Loader } from '@/components/common/loading/loader';

export function FindCentersPage() {
  const [selectedMaterialSlug, setSelectedMaterialSlug] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [activeLocationId, setActiveLocationId] = useState<number | null>(null);
  const [bounds, setBounds] = useState<MapBounds | null>(null);

  const { data: materialTypes = [] } = useFindCenterMaterialTypes();

  const { data, isLoading, isFetching } = useMapLocations({
    bounds,
    materialSlug: selectedMaterialSlug,
  });

  const locations = useMemo(() => data?.data ?? [], [data]);

  const { data: activeLocation, isLoading: isActiveLocationLoading } =
    usePublicLocationDetail(activeLocationId);

  const mapListLocations = useMemo(
    () =>
      locations.map((location: any) => ({
        ...location,
        country_code: '',
        country_name: '',
        state_province: null,
        state_code: null,
        city_municipality: null,
        city_slug: null,
        region: null,
        street_address: null,
        postal_code: null,
        contact_number: null,
        email: null,
        operating_hours: null,
        notes: null,
        is_active: true,
      })),
    [locations],
  );

  return (
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

      <div className="mb-4">
        <FindCentersToolbar
          searchValue={searchValue}
          selectedMaterialSlug={selectedMaterialSlug}
          materials={materialTypes.map((materialType) => ({
            name: materialType.name,
            slug: materialType.slug,
          }))}
          onSearchChange={setSearchValue}
          onMaterialChange={setSelectedMaterialSlug}
        />
      </div>

      <div className="hidden max-h-[60vh] w-full gap-4 md:flex">
        <div className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-foreground text-sm font-semibold">Centers</p>
            <p className="text-muted-foreground text-xs">
              {isFetching ? 'Updating...' : `${locations.length} visible`}
            </p>
          </div>

          <div className="max-w-64 flex-1 space-y-3 overflow-y-auto pr-1">
            {isLoading ? (
              <Loader text="Loading centers..." />
            ) : mapListLocations.length > 0 ? (
              mapListLocations.map((location: any) => (
                <FindCenterCard
                  key={location.name}
                  location={location}
                  isActive={activeLocation?.id === location.id}
                  onClick={() => setActiveLocationId(location.id)}
                />
              ))
            ) : (
              <div className="bg-background border-border rounded-2xl border p-6 text-center shadow-sm">
                <p className="text-foreground text-sm font-semibold">
                  No centers found in this area
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Move the map or change the material filter.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full">
          <FindCentersGoogleMap
            locations={locations}
            activeLocationId={activeLocation?.id ?? null}
            onLocationSelect={setActiveLocationId}
            onBoundsChange={setBounds}
            isLoading={isLoading || isFetching}
          />
        </div>
      </div>

      <div className="md:hidden">
        <div className="relative h-[70vh] w-full">
          <FindCentersGoogleMap
            locations={locations}
            activeLocationId={activeLocation?.id ?? null}
            onLocationSelect={setActiveLocationId}
            onBoundsChange={setBounds}
            isLoading={isLoading || isFetching}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 rounded-b-2xl bg-linear-to-t from-black/25 to-transparent" />

          <div className="absolute right-3 bottom-3 left-3">
            <div className="scrollbar-hide flex h-full snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
              {isLoading ? (
                <Loader text="Loading centers..." />
              ) : mapListLocations.length > 0 ? (
                mapListLocations.map((location: any) => (
                  <div
                    key={location.name}
                    className="flex min-w-48 snap-center items-stretch"
                  >
                    <FindCenterCard
                      location={location}
                      isActive={activeLocation?.id === location.id}
                      onClick={() => setActiveLocationId(location.id)}
                    />
                  </div>
                ))
              ) : (
                <div className="bg-background border-border w-full rounded-2xl border p-5 shadow-sm">
                  <p className="text-foreground text-sm font-semibold">
                    No centers found in this area
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Move the map or change the material filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <FindCenterLocationModal
        open={!!activeLocationId}
        onClose={() => setActiveLocationId(null)}
        location={activeLocation ?? null}
        isLoading={isActiveLocationLoading}
      />
    </section>
  );
}
