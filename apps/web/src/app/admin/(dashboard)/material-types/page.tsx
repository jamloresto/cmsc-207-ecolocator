'use client';

import { CircleCheck, CircleX, List } from 'lucide-react';

import { Pagination } from '@/components/shared/pagination';
import { TableToolbar } from '@/components/shared/table-toolbar';
import { SelectCustom } from '@/components/ui/select-custom';

import {
  AdminMaterialTypesTable,
  useAdminMaterialTypes,
  type AdminMaterialTypesListParams,
} from '@/modules/admin-material-types';

export default function AdminMaterialTypesPage() {
  const {
    materialTypes,
    pagination,
    isLoading,
    error,
    params,
    setParams,
    handleStatusToggle,
  } = useAdminMaterialTypes();

  const statusOptions = [
    { label: 'All Status', value: '', icon: <List className='text-warning' /> },
    { label: 'Active', value: '1', icon: <CircleCheck className='text-success' /> },
    { label: 'Inactive', value: '0', icon: <CircleX className='text-destructive' /> },
  ];

  return (
    <div className="space-y-6">
      <TableToolbar
        searchValue={params.search ?? ''}
        searchPlaceholder="Search by name or description"
        onSearchChange={(value) =>
          setParams((prev) => ({
            ...prev,
            page: 1,
            search: value,
          }))
        }
        filters={
          <SelectCustom
            options={statusOptions}
            value={params.is_active ?? ''}
            placeholder="All Status"
            onChange={(value) => {
              const typedValue =
                value as AdminMaterialTypesListParams['is_active'];

              setParams((prev) => ({
                ...prev,
                page: 1,
                is_active: typedValue,
              }));
            }}
            className="min-w-48 lg:min-w-72"
          />
        }
      />

      {error ? (
        <div className="border-destructive/30 bg-destructive/5 text-destructive rounded-xl border p-4 text-sm">
          {error}
        </div>
      ) : null}

      <AdminMaterialTypesTable
        materialTypes={materialTypes}
        isLoading={isLoading}
        params={params}
        setParams={setParams}
        onToggleStatus={handleStatusToggle}
      />

      {pagination ? (
        <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
          onPageChange={(page) =>
            setParams((prev) => ({
              ...prev,
              page,
            }))
          }
        />
      ) : null}
    </div>
  );
}
