'use client';

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';

import { TableSkeleton } from '@/components/common/loading/table-skeleton';
import { TableFooterMeta } from '@/components/shared/table-footer-meta';
import { TableToolbar } from '@/components/shared/table-toolbar';
import { TableEmptyState } from '@/components/shared/table-empty-state';
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/shared/table';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusPill } from '@/components/ui/status-pill';
import { SelectCustom } from '@/components/ui/select-custom';

import type { WasteCollectionLocation } from '@/modules/admin-recycling-centers';

type Props = {
  data: WasteCollectionLocation[];
  isLoading: boolean;
  searchValue: string;
  materialTypeSlug: string;
  materialTypes: { id: number; name: string; slug: string }[];

  currentPage: number;
  totalPages: number;
  totalItems?: number;

  onSearchChange: (value: string) => void;
  onMaterialTypeChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onDelete: (location: { id: number; name: string }) => void;
};

export function WasteCollectionLocationsTable({
  data,
  isLoading,
  searchValue,
  materialTypeSlug,
  materialTypes,
  currentPage,
  totalPages,
  totalItems,
  onSearchChange,
  onMaterialTypeChange,
  onPageChange,
  onDelete,
}: Props) {
  const materialOptions = [
    { label: 'All Materials', value: '' },
    ...materialTypes.map((m) => ({
      label: m.name,
      value: m.slug,
    })),
  ];

  return (
    <div className="space-y-4">
      <TableToolbar
        searchValue={searchValue}
        searchPlaceholder="Search recycling centers..."
        onSearchChange={onSearchChange}
        filters={
          <SelectCustom
            options={materialOptions}
            value={materialTypeSlug}
            placeholder="Filter by material"
            onChange={onMaterialTypeChange}
          />
        }
      />

      {isLoading ? (
        <TableSkeleton columns={5} rows={6} />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="border-t-0">
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Location</TableHeaderCell>
                <TableHeaderCell>Materials</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>

            <tbody>
              {data.length === 0 ? (
                <TableEmptyState
                  colSpan={5}
                  title="No recycling centers found"
                  description="Try adjusting your filters or search."
                />
              ) : (
                data.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>
                      <div className="font-medium">{location.name}</div>
                      {location.contact_number && (
                        <div className="text-muted-foreground text-xs">
                          {location.contact_number}
                        </div>
                      )}
                      {location.email && (
                        <div className="text-muted-foreground text-xs">
                          {location.email}
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div>{location.street_address}</div>
                      <div className="text-muted-foreground text-xs">
                        {location.city_municipality}, {location.state_province},{' '}
                        {location.country_name}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {location.material_types?.length ? (
                          location.material_types.map((m) => (
                            <Badge key={m.id} variant="outline">
                              {m.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            No materials assigned
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <StatusPill
                        status={location.is_active ? 'active' : 'inactive'}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/recycling-centers/${location.id}/edit`}
                        >
                          <Button variant="outline" size="sm">
                            <Pencil className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                        </Link>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            onDelete({
                              id: location.id,
                              name: location.name,
                            })
                          }
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </tbody>
          </Table>
        </TableContainer>
      )}

      <TableFooterMeta
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems ?? data.length}
        singularLabel="recycling center"
        onPageChange={onPageChange}
      />
    </div>
  );
}
