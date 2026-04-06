'use client';

import { Edit, List, CircleCheck, CircleX } from 'lucide-react';

import { TableSkeleton } from '@/components/common/loading/table-skeleton';
import { TableEmptyState } from '@/components/shared/table-empty-state';
import { TableFooterMeta } from '@/components/shared/table-footer-meta';
import { TableToolbar } from '@/components/shared/table-toolbar';
import {
  SortableHeader,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/shared/table';
import { Button } from '@/components/ui/button';
import { SelectCustom } from '@/components/ui/select-custom';
import { StatusPill } from '@/components/ui/status-pill';

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
  currentPage: number;
  totalPages: number;
  totalItems?: number;
};

const statusOptions = [
  {
    label: 'All Status',
    value: '',
    icon: <List className="text-warning h-4" />,
  },
  {
    label: 'Active',
    value: '1',
    icon: <CircleCheck className="text-success h-4" />,
  },
  {
    label: 'Inactive',
    value: '0',
    icon: <CircleX className="text-destructive h-4" />,
  },
];

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
  currentPage,
  totalPages,
  totalItems,
}: AdminMaterialTypesTableProps) {
  function handleSort(field: string) {
    setParams((prev) => ({
      ...prev,
      page: 1,
      sort: field as 'name' | 'created_at' | 'updated_at',
      direction: getNextSortOrder(prev.sort, prev.direction, field),
    }));
  }

  function handleSearchChange(value: string) {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search: value,
    }));
  }

  function handleStatusFilterChange(value: string) {
    const typedValue = value as AdminMaterialTypesListParams['is_active'];

    setParams((prev) => ({
      ...prev,
      page: 1,
      is_active: typedValue,
    }));
  }

  function handlePageChange(page: number) {
    setParams((prev) => ({
      ...prev,
      page,
    }));
  }

  return (
    <div className="space-y-4">
      <TableToolbar
        searchValue={params.search ?? ''}
        searchPlaceholder="Search by name or description"
        onSearchChange={handleSearchChange}
        filters={
          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-1">
            <SelectCustom
              options={statusOptions}
              value={params.is_active ?? ''}
              placeholder="All Status"
              onChange={handleStatusFilterChange}
            />
          </div>
        }
      />

      {isLoading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : (
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
              {materialTypes.length === 0 ? (
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
                      <div className="flex flex-col items-start gap-3">
                        <MaterialTypeStatusToggle
                          checked={materialType.is_active}
                          onChange={() => void onToggleStatus(materialType)}
                        />

                        <Button
                          onClick={() => onEdit(materialType.id)}
                          variant="primary"
                          size="sm"
                          title="Edit Material Type"
                        >
                          <Edit className="h-4" />
                          Update
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
        totalItems={totalItems ?? materialTypes.length}
        singularLabel="material type"
        onPageChange={handlePageChange}
      />
    </div>
  );
}
