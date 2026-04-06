'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';

import { TableSkeleton } from '@/components/common/loading/table-skeleton';
import { AdminHeading } from '@/components/shared/admin-heading';
import { Pagination } from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';

import { useToast } from '@/hooks/use-toast';
import { useMaterialTypes } from '@/modules/material-types';
import {
  useDeleteWasteCollectionLocation,
  useWasteCollectionLocations,
  WasteCollectionLocationsTable,
  WasteCollectionLocationsToolbar,
} from '@/modules/waste-collection-locations';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function AdminLocationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [locationToDelete, setLocationToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const page = Number(searchParams.get('page') ?? '1');
  const search = searchParams.get('search') ?? '';
  const materialSlug = searchParams.get('material_slug') ?? '';

  const queryParams = useMemo(
    () => ({
      page,
      search,
      material_slug: materialSlug,
    }),
    [page, search, materialSlug],
  );

  const locationsQuery = useWasteCollectionLocations(queryParams);
  const materialTypesQuery = useMaterialTypes();
  const deleteMutation = useDeleteWasteCollectionLocation();

  function updateUrl(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    if (!next.page) params.delete('page');

    router.push(`/admin/recycling-centers?${params.toString()}`);
  }

  function handleDelete(location: { id: number; name: string }) {
    setLocationToDelete(location);
  }

  function confirmDelete() {
    if (!locationToDelete) return;

    const selected = locationToDelete;
    setLocationToDelete(null);

    deleteMutation.mutate(selected.id, {
      onSuccess: () => {
        toast({
          title: 'Recycling center deleted',
          description: `${selected.name} has been deleted successfully.`,
          variant: 'success',
        });
      },
      onError: () => {
        toast({
          title: 'Delete failed',
          description:
            'Something went wrong while deleting the recycling center.',
          variant: 'danger',
        });
      },
    });
  }

  return (
    <div className="space-y-6">
      <AdminHeading
        title="Recycling Centers"
        description="View and manage waste collection locations."
      />
      <div className="flex w-full justify-end">
        <Link href="/admin/recycling-centers/create">
          <Button size="sm" leftIcon={Plus}>
            <span className="text-sm">Add Recycling Center</span>
          </Button>
        </Link>
      </div>

      <WasteCollectionLocationsToolbar
        searchValue={search}
        onSearchChange={(value) => updateUrl({ search: value, page: '' })}
        materialTypeSlug={materialSlug}
        onMaterialTypeChange={(value) =>
          updateUrl({ material_slug: value, page: '' })
        }
        materialTypes={materialTypesQuery.data?.data ?? []}
      />

      {locationsQuery.isLoading ? (
        <TableSkeleton />
      ) : (
        <>
          <WasteCollectionLocationsTable
            data={locationsQuery.data?.data ?? []}
            onDelete={handleDelete}
          />

          {locationsQuery.data?.meta ? (
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-muted-foreground text-sm">
                {typeof locationsQuery.data.meta.total === 'number'
                  ? `${locationsQuery.data.meta.total} location${locationsQuery.data.meta.total === 1 ? '' : 's'} found`
                  : null}
              </p>

              <Pagination
                currentPage={locationsQuery.data.meta.current_page}
                totalPages={locationsQuery.data.meta.last_page}
                onPageChange={(nextPage) =>
                  updateUrl({ page: String(nextPage) })
                }
              />
            </div>
          ) : null}
        </>
      )}
      <ConfirmationDialog
        open={!!locationToDelete}
        onClose={() => setLocationToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete recycling center?"
        description={
          locationToDelete
            ? `This action cannot be undone. This will permanently delete "${locationToDelete.name}".`
            : ''
        }
        confirmLabel={deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
