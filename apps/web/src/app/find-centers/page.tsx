'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';
import { FindCenterCard, FindCentersMapPlaceholder, FindCentersToolbar, useFindCenterMaterialTypes, useFindCenters } from '@/modules/find-centers';


export default function FindCentersPage() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedMaterialSlug, setSelectedMaterialSlug] = useState('');
  const [page, setPage] = useState(1);
  const [activeLocationId, setActiveLocationId] = useState<number | null>(null);

  const { data, isLoading, isFetching } = useFindCenters({
    search: searchValue,
    material_slug: selectedMaterialSlug,
    page,
  });

  const { data: materialTypes = [], isLoading: isLoadingMaterialTypes } =
    useFindCenterMaterialTypes();

  const locations = useMemo(() => data?.data ?? [], [data]);
  const meta = data?.meta;

  useEffect(() => {
    setPage(1);
  }, [searchValue, selectedMaterialSlug]);

  useEffect(() => {
    if (!locations.length) {
      setActiveLocationId(null);
      return;
    }

    const hasActiveLocation = locations.some(
      (location) => location.id === activeLocationId,
    );

    if (!hasActiveLocation) {
      setActiveLocationId(locations[0].id);
    }
  }, [locations, activeLocationId]);

  const activeLocation =
    locations.find((location) => location.id === activeLocationId) ??
    locations[0] ??
    null;

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
          Search by center name or location, filter by accepted material, and
          browse nearby drop-off points.
        </p>
      </div>

      <div className="mb-4">
        <FindCentersToolbar
          searchValue={searchValue}
          selectedMaterialSlug={selectedMaterialSlug}
          materials={materialTypes}
          onSearchChange={setSearchValue}
          onMaterialChange={setSelectedMaterialSlug}
        />
      </div>

      <div className="hidden md:grid md:grid-cols-[360px_minmax(0,1fr)] md:gap-6">
        <div className="flex max-h-[calc(100vh-220px)] flex-col">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-foreground text-sm font-semibold">Centers</p>
            <p className="text-muted-foreground text-xs">
              {meta?.total ?? 0} result{meta?.total === 1 ? '' : 's'}
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {isLoading ? (
              <div className="bg-background border-border rounded-2xl border p-6 text-center shadow-sm">
                <p className="text-foreground text-sm font-semibold">
                  Loading centers...
                </p>
              </div>
            ) : locations.length > 0 ? (
              locations.map((location) => (
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
                  No centers found
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Try adjusting the search keyword or material filter.
                </p>
              </div>
            )}
          </div>

          {meta && meta.last_page > 1 ? (
            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <button
                type="button"
                disabled={meta.current_page === 1 || isFetching}
                onClick={() => setPage((currentPage) => currentPage - 1)}
                className="text-foreground disabled:text-muted-foreground text-sm font-medium disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <p className="text-muted-foreground text-xs">
                Page {meta.current_page} of {meta.last_page}
              </p>

              <button
                type="button"
                disabled={meta.current_page === meta.last_page || isFetching}
                onClick={() => setPage((currentPage) => currentPage + 1)}
                className="text-foreground disabled:text-muted-foreground text-sm font-medium disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>

        <div className="h-[calc(100vh-220px)] min-h-155">
          <FindCentersMapPlaceholder
            activeLocationName={activeLocation?.name}
          />
        </div>
      </div>

      <div className="md:hidden">
        <div className="relative">
          <FindCentersMapPlaceholder
            activeLocationName={activeLocation?.name}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 rounded-b-2xl bg-linear-to-t from-black/25 to-transparent" />

          <div className="absolute right-3 bottom-3 left-3">
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
              {isLoading ? (
                <div className="bg-background border-border w-full rounded-2xl border p-5 shadow-sm">
                  <p className="text-foreground text-sm font-semibold">
                    Loading centers...
                  </p>
                </div>
              ) : locations.length > 0 ? (
                locations.map((location) => (
                  <div key={location.id} className="min-w-[88%] snap-center">
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
                    No centers found
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Try adjusting the filters above.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {meta && meta.last_page > 1 ? (
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              disabled={meta.current_page === 1 || isFetching}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className="text-foreground disabled:text-muted-foreground text-sm font-medium disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <p className="text-muted-foreground text-xs">
              Page {meta.current_page} of {meta.last_page}
            </p>

            <button
              type="button"
              disabled={meta.current_page === meta.last_page || isFetching}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className="text-foreground disabled:text-muted-foreground text-sm font-medium disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        ) : null}

        {isLoadingMaterialTypes ? (
          <p className="text-muted-foreground mt-3 text-center text-xs">
            Loading material filters...
          </p>
        ) : null}
      </div>
    </section>
  );
}
