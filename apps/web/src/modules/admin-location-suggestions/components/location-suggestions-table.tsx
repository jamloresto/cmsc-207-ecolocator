'use client';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import { TableEmptyState } from '@/components/shared/table-empty-state';
import { TableFooterMeta } from '@/components/shared/table-footer-meta';
import {
  SortableHeader,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/shared/table';

import type {
  AdminLocationSuggestionsListParams,
  AdminLocationSuggestionsResponse,
} from '@/modules/admin-location-suggestions';

type LocationSuggestionsTableProps = {
  suggestions: AdminLocationSuggestionsResponse;
  params: AdminLocationSuggestionsListParams;
  setParams: React.Dispatch<
    React.SetStateAction<AdminLocationSuggestionsListParams>
  >;
  isRejecting?: boolean;
  onReject: (id: number) => void;
  onPageChange: (page: number) => void;
};

function parseMaterialsAccepted(
  materials: string[] | string | null | undefined,
): string[] {
  if (!materials) return [];

  if (Array.isArray(materials)) {
    return materials.map((item) => item.trim()).filter(Boolean);
  }

  try {
    const parsed = JSON.parse(materials);

    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch {}

  return materials
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getNextSortOrder(
  currentSort?: string,
  currentOrder?: 'asc' | 'desc',
  field?: string,
): 'asc' | 'desc' {
  if (currentSort !== field) return 'asc';

  return currentOrder === 'asc' ? 'desc' : 'asc';
}

export function LocationSuggestionsTable({
  suggestions,
  params,
  setParams,
  isRejecting,
  onReject,
  onPageChange,
}: LocationSuggestionsTableProps) {
  const items = suggestions.data;
  const meta = suggestions.meta;

  function handleSort(field: string) {
    setParams((prev) => ({
      ...prev,
      page: 1,
      sort_by: field as
        | 'created_at'
        | 'updated_at'
        | 'status'
        | 'location_name'
        | 'city_municipality'
        | 'province',
      sort_order: getNextSortOrder(prev.sort_by, prev.sort_order, field),
    }));
  }

  return (
    <div className="space-y-4">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="border-t-0">
              <TableHeaderCell>Submitter</TableHeaderCell>

              <TableHeaderCell>
                <SortableHeader
                  label="Suggested Location"
                  field="location_name"
                  sortBy={params.sort_by}
                  sortOrder={params.sort_order}
                  onSort={handleSort}
                />
              </TableHeaderCell>

              <TableHeaderCell>Address</TableHeaderCell>

              <TableHeaderCell>Materials</TableHeaderCell>

              <TableHeaderCell>
                <SortableHeader
                  label="Status"
                  field="status"
                  sortBy={params.sort_by}
                  sortOrder={params.sort_order}
                  onSort={handleSort}
                />
              </TableHeaderCell>

              <TableHeaderCell>
                <SortableHeader
                  label="Submitted"
                  field="created_at"
                  sortBy={params.sort_by}
                  sortOrder={params.sort_order}
                  onSort={handleSort}
                />
              </TableHeaderCell>

              <TableHeaderCell>
                <div className="text-right">Actions</div>
              </TableHeaderCell>
            </TableRow>
          </TableHead>

          <tbody>
            {items.length === 0 ? (
              <TableEmptyState
                colSpan={7}
                title="No suggestions found."
                description="No suggested locations yet. New suggestions will appear here."
              />
            ) : (
              items.map((item) => {
                const materials = parseMaterialsAccepted(
                  item.materials_accepted,
                );

                const isReviewable =
                  item.status === 'pending' || item.status === 'under_review';

                const reviewLabel =
                  item.status === 'under_review' ? 'Continue Review' : 'Review';

                const canReject =
                  item.status !== 'approved' && item.status !== 'rejected';

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-foreground font-medium">
                          {item.name}
                        </p>
                        <p className="text-muted-foreground">{item.email}</p>
                        {item.contact_info ? (
                          <p className="text-muted-foreground text-xs">
                            {item.contact_info}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-foreground font-medium">
                          {item.location_name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {item.city_municipality || '—'}
                          {item.province ? `, ${item.province}` : ''}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-muted-foreground max-w-70 whitespace-normal">
                        {item.street_address}
                      </p>
                    </TableCell>

                    <TableCell>
                      <div className="flex max-w-55 flex-wrap gap-2">
                        {materials.length > 0 ? (
                          materials.map((material) => (
                            <Badge key={material} variant="outline">
                              {material}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <StatusPill status={item.status} />
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col justify-end gap-2">
                        {isReviewable ? (
                          <Link href={`/admin/location-suggestions/${item.id}`}>
                            <Button
                              type="button"
                              size="sm"
                              variant="primary"
                              className="w-full"
                            >
                              {reviewLabel}
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="w-full"
                            disabled
                          >
                            {item.status === 'approved'
                              ? 'Approved'
                              : item.status === 'rejected'
                                ? 'Rejected'
                                : 'Unavailable'}
                          </Button>
                        )}

                        <Button
                          type="button"
                          size="sm"
                          variant="danger"
                          className="w-full"
                          disabled={!canReject || isRejecting}
                          onClick={() => onReject(item.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </tbody>
        </Table>
      </TableContainer>

      <TableFooterMeta
        currentPage={meta.current_page}
        totalPages={meta.last_page}
        totalItems={meta.total}
        singularLabel="location suggestion"
        onPageChange={onPageChange}
      />
    </div>
  );
}
