'use client';

import { Edit } from 'lucide-react';

import { TableSkeleton } from '@/components/common/loading/table-skeleton';
import { StatusPill } from '@/components/ui/status-pill';
import { Button } from '@/components/ui/button';
import { TableEmptyState } from '@/components/shared/table-empty-state';
import {
  SortableHeader,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/shared/table';

import {
  MaterialTypeStatusToggle,
  type AdminMaterialType,
  type AdminMaterialTypesListParams,
} from '@/modules/admin-material-types';

type AdminMaterialTypesTableProps = {
  materialTypes: AdminMaterialType[];
  isLoading: boolean;
  params: AdminMaterialTypesListParams;
  setParams: React.Dispatch<React.SetStateAction<AdminMaterialTypesListParams>>;
  onToggleStatus: (materialType: AdminMaterialType) => Promise<void>;
  onEdit: (id: number) => void;
};

function getNextSortOrder(
  currentSort?: string,
  currentOrder?: 'asc' | 'desc',
  field?: string,
): 'asc' | 'desc' {
  if (currentSort !== field) return 'asc';

  return currentOrder === 'asc' ? 'desc' : 'asc';
}

export function AdminMaterialTypesTable({
  materialTypes,
  isLoading,
  params,
  setParams,
  onToggleStatus,
  onEdit,
}: AdminMaterialTypesTableProps) {
  const handleSort = (field: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      sort: field as 'name' | 'created_at' | 'updated_at',
      direction: getNextSortOrder(prev.sort, prev.direction, field),
    }));
  };

  if (isLoading) {
    return <TableSkeleton rows={6} columns={5} />;
  }

  return (
    <TableContainer>
      <Table className="w-full">
        <TableHead>
          <TableRow className="border-t-0">
            <TableHeaderCell>
              <SortableHeader
                label="Name"
                field="name"
                sortBy={params.sort}
                sortOrder={params.direction}
                onSort={handleSort}
              />
            </TableHeaderCell>

            <TableHeaderCell>Description</TableHeaderCell>

            <TableHeaderCell>Status</TableHeaderCell>

            <TableHeaderCell>
              <SortableHeader
                label="Created"
                field="created_at"
                sortBy={params.sort}
                sortOrder={params.direction}
                onSort={handleSort}
              />
            </TableHeaderCell>

            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>

        <tbody>
          {!materialTypes.length ? (
            <TableEmptyState
              colSpan={5}
              title="No material types found"
              description="Try adjusting your search, status filter, or add a new material type."
            />
          ) : (
            materialTypes.map((materialType) => (
              <TableRow key={materialType.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-foreground font-medium">
                      {materialType.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {materialType.slug}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="text-muted-foreground max-w-85">
                  {materialType.description || '—'}
                </TableCell>

                <TableCell>
                  <StatusPill
                    status={materialType.is_active ? 'active' : 'inactive'}
                  />
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {new Date(materialType.created_at).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <MaterialTypeStatusToggle
                    checked={materialType.is_active}
                    onChange={() => void onToggleStatus(materialType)}
                  />
                  <Button
                    onClick={() => onEdit(materialType.id)}
                    variant="primary"
                    size="sm"
                    title="Edit Material Type"
                    className='mt-3'
                  >
                    <Edit
                      className="h-4"
                      onClick={() => onEdit(materialType.id)}
                    />
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
}
