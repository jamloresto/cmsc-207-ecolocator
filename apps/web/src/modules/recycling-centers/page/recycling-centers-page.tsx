'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchX } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableToolbar } from '@/components/shared/table-toolbar';
import { TableFooterMeta } from '@/components/shared/table-footer-meta';
import { CardSkeleton } from '@/components/common/loading/card-skeleton';
import { EmptyState } from '@/components/common/states/empty-state';

import { useFindCenterMaterialTypes } from '@/modules/find-centers';
import {
  RecyclingCentersFilters,
  RecyclingCentersList,
  usePublicRecyclingCenters,
} from '@/modules/recycling-centers';

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}

export function RecyclingCentersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const materialSlugsFromUrl = searchParams.getAll('material_slugs');
  const searchFromUrl = searchParams.get('search') || '';
  const pageFromUrl = Number(searchParams.get('page') || '1');

  const [searchInput, setSearchInput] = useState(searchFromUrl);

  useEffect(() => {
    setSearchInput(searchFromUrl);
  }, [searchFromUrl]);

  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const centersQuery = usePublicRecyclingCenters({
    material_slugs:
      materialSlugsFromUrl.length > 0 ? materialSlugsFromUrl : undefined,
    search: debouncedSearch || undefined,
    page: Number.isNaN(pageFromUrl) ? 1 : pageFromUrl,
  });

  const materialTypesQuery = useFindCenterMaterialTypes();

  const centers = centersQuery.data?.data ?? [];
  const meta = centersQuery.data?.meta;

  const isInitialLoading = centersQuery.isLoading && !centersQuery.data;

  const selectedMaterialLabel = useMemo(() => {
    if (materialSlugsFromUrl.length === 0) return 'All materials';

    const matches =
      materialTypesQuery.data?.filter((item: { slug: string; name: string }) =>
        materialSlugsFromUrl.includes(item.slug),
      ) ?? [];

    if (matches.length === 0) return 'Selected materials';
    if (matches.length === 1) return matches[0].name;
    if (matches.length === materialTypesQuery.data?.length)
      return 'All materials';

    return `${matches.length} materials selected`;
  }, [materialSlugsFromUrl, materialTypesQuery.data]);

  function updateQueryParams(next: {
    search?: string;
    material_slugs?: string[];
    page?: number;
  }) {
    const params = new URLSearchParams(searchParams.toString());

    if (typeof next.search !== 'undefined') {
      if (next.search) params.set('search', next.search);
      else params.delete('search');
    }

    if (typeof next.material_slugs !== 'undefined') {
      params.delete('material_slugs');

      next.material_slugs.forEach((slug) => {
        if (slug) params.append('material_slugs', slug);
      });
    }

    if (typeof next.page !== 'undefined') {
      if (next.page > 1) params.set('page', String(next.page));
      else params.delete('page');
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';

    if (debouncedSearch !== currentSearch) {
      updateQueryParams({
        search: debouncedSearch || '',
        page: 1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-6 space-y-2 md:mb-8">
        <h1 className="text-foreground text-3xl font-semibold md:text-4xl">
          Recycling Centers
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-6 md:text-base">
          Browse active recycling centers and filter them by material type
          without using the map.
        </p>
      </div>

      <div className="flex w-full flex-col gap-4 md:flex-row">
        <div className="space-y-4">
          <Card className="gap-4 md:sticky md:top-24">
            <CardHeader className="gap-2">
              <CardTitle className="text-base md:text-lg">Materials</CardTitle>
            </CardHeader>

            <CardContent>
              {materialTypesQuery.isLoading ? (
                <div className="text-muted-foreground text-sm">
                  Loading materials...
                </div>
              ) : (
                <RecyclingCentersFilters
                  materialTypes={materialTypesQuery.data ?? []}
                  selectedMaterialSlugs={materialSlugsFromUrl}
                  onMaterialChange={(slugs) =>
                    updateQueryParams({
                      material_slugs: slugs,
                      page: 1,
                    })
                  }
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <Card className="gap-4">
            <CardContent className="space-y-4">
              <TableToolbar
                searchValue={searchInput}
                onSearchChange={setSearchInput}
                searchPlaceholder="Search by center name or location"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-muted-foreground text-sm">
                  Showing results for{' '}
                  <span className="text-foreground font-medium">
                    {selectedMaterialLabel}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid w-full grid-cols-1 gap-4">
            {isInitialLoading ? (
              <CardSkeleton count={6} content button />
            ) : centers.length > 0 ? (
              <>
                <RecyclingCentersList centers={centers} />

                {meta ? (
                  <TableFooterMeta
                    currentPage={meta.current_page}
                    totalPages={meta.last_page}
                    totalItems={meta.total}
                    singularLabel="recycling center"
                    onPageChange={(page) =>
                      updateQueryParams({
                        page,
                      })
                    }
                  />
                ) : null}
              </>
            ) : (
              <EmptyState
                title="No recycling centers found"
                description="Try changing the material filter or search keyword."
                icon={<SearchX />}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
