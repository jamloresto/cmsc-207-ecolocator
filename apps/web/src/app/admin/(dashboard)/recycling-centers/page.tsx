'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';

import { AdminHeading } from '@/components/shared/admin-heading';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

import { useToast } from '@/hooks/use-toast';
import { useAdminMaterialTypes } from '@/modules/admin-material-types';
import {
  useDeleteWasteCollectionLocation,
  useWasteCollectionLocations,
  WasteCollectionLocationsTable,
} from '@/modules/admin-recycling-centers';
import type { WasteCollectionLocationsQueryParams } from '@/modules/admin-recycling-centers';

type SortField = NonNullable<WasteCollectionLocationsQueryParams['sort_by']>;
type SortOrder = NonNullable<WasteCollectionLocationsQueryParams['sort_order']>;

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

  const sortBy = (searchParams.get('sort_by') ?? 'name') as SortField;
  const sortOrder = (searchParams.get('sort_order') ?? 'asc') as SortOrder;

  const queryParams = useMemo<WasteCollectionLocationsQueryParams>(
    () => ({
      page,
      search,
      material_slug: materialSlug,
      sort_by: sortBy,
      sort_order: sortOrder,
    }),
    [page, search, materialSlug, sortBy, sortOrder],
  );

  const locationsQuery = useWasteCollectionLocations(queryParams);
  const materialTypesQuery = useAdminMaterialTypes();
  const deleteMutation = useDeleteWasteCollectionLocation();

  function updateUrl(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    if (!next.page) params.delete('page');

    const query = params.toString();
    router.push(
      query ? `/admin/recycling-centers?${query}` : '/admin/recycling-centers',
    );
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

  function handleSort(field: SortField) {
    const nextOrder: SortOrder =
      sortBy !== field ? 'asc' : sortOrder === 'asc' ? 'desc' : 'asc';

    updateUrl({
      sort_by: field,
      sort_order: nextOrder,
      page: '',
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

      <WasteCollectionLocationsTable
        data={locationsQuery.data?.data ?? []}
        isLoading={locationsQuery.isLoading}
        params={{
          search,
          material_slug: materialSlug,
          sort_by: sortBy,
          sort_order: sortOrder,
        }}
        onSearchChange={(value) => updateUrl({ search: value, page: '' })}
        onMaterialTypeChange={(value) =>
          updateUrl({ material_slug: value, page: '' })
        }
        onSort={handleSort}
        currentPage={locationsQuery.data?.meta?.current_page ?? 1}
        totalPages={locationsQuery.data?.meta?.last_page ?? 1}
        totalItems={
          locationsQuery.data?.meta?.total ?? locationsQuery.data?.data?.length
        }
        onPageChange={(nextPage) => updateUrl({ page: String(nextPage) })}
        materialTypes={materialTypesQuery.materialTypes ?? []}
        onDelete={handleDelete}
      />

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
