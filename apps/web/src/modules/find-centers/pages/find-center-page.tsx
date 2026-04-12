'use client';

import { useMemo, useState } from 'react';
import { MapPinX } from 'lucide-react';
import { APIProvider } from '@vis.gl/react-google-maps';

import { GOOGLE_MAPS_API_KEY } from '@/lib/api';
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
import { EmptyState } from '@/components/common/states/empty-state';
import { ErrorState } from '@/components/common/states/error-state';

type FindCentersPageProps = {
  view?: 'home' | 'default';
};

export function FindCentersPage({ view = 'default' }: FindCentersPageProps) {
  const isHomeView = view === 'home';

  const [selectedMaterialSlug, setSelectedMaterialSlug] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [activeLocationId, setActiveLocationId] = useState<number | null>(null);
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [mapCenterOverride, setMapCenterOverride] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <ErrorState
          title="Google Maps API key missing"
          description="Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables."
        />
      </section>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
      {!isHomeView && (
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
            onPlaceSelect={(coords) => {
              setMapCenterOverride(coords);
              setActiveLocationId(null);
            }}
          />
        </div>
      )}

      {!isHomeView && (
        <div className="hidden w-full md:flex md:h-[70vh]">
          <div className="h-[70vh] max-h-[70vh] min-h-[70vh] w-64 max-w-64 min-w-64 shrink-0 pr-4">
            <div className="flex h-full flex-col">

              <div className="flex-1 space-y-3 overflow-y-auto pr-1 [scrollbar-gutter:stable]">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-foreground text-sm font-semibold">Centers</p>
                  <p className="text-muted-foreground text-xs">
                    {isFetching ? 'Updating...' : `${locations.length} visible`}
                  </p>
                </div>
                {isLoading || isFetching ? (
                  <div className="bg-background border-border h-full rounded-2xl border p-6 text-center shadow-sm">
                    <Loader text="Loading centers..." />
                  </div>
                ) : mapListLocations.length > 0 ? (
                  mapListLocations.map((location: any) => (
                    <FindCenterCard
                      key={location.id}
                      location={location}
                      isActive={activeLocation?.id === location.id}
                      onClick={() => setActiveLocationId(location.id)}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="No centers found in this area"
                    description="Move the map or change the material filter."
                    icon={<MapPinX />}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="h-full w-full">
              <FindCentersGoogleMap
                locations={locations}
                activeLocationId={activeLocation?.id ?? null}
                centerOverride={mapCenterOverride}
                onLocationSelect={setActiveLocationId}
                onBoundsChange={setBounds}
                isLoading={isLoading || isFetching}
              />
            </div>
          </div>
        </div>
      )}

      <div className={isHomeView ? '' : 'md:hidden'}>
        <div className="relative h-[70vh] w-full">
          <FindCentersGoogleMap
            locations={locations}
            activeLocationId={activeLocation?.id ?? null}
            centerOverride={mapCenterOverride}
            onLocationSelect={setActiveLocationId}
            onBoundsChange={setBounds}
            isLoading={isLoading || isFetching}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 rounded-b-2xl bg-linear-to-t from-black/25 to-transparent" />

          <div className="absolute right-3 bottom-3 left-3">
            <div className="scrollbar-hide flex h-full snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
              {isLoading ? (
                null
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
                <EmptyState
                  title="No centers found in this area"
                  description="Move the map or change the material filter."
                  icon={<MapPinX />}
                />
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
    </APIProvider>
  );
}
