'use client';

import { useState } from 'react';
import { CircleCheck, CircleX, List, Plus } from 'lucide-react';

import { AdminHeading } from '@/components/shared/admin-heading';
import { Pagination } from '@/components/shared/pagination';
import { TableToolbar } from '@/components/shared/table-toolbar';
import { Button } from '@/components/ui/button';
import { SelectCustom } from '@/components/ui/select-custom';

import {
  AdminMaterialTypesTable,
  CreateMaterialTypeModal,
  EditMaterialTypeModal,
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
    refetch,
  } = useAdminMaterialTypes();

  const statusOptions = [
    { label: 'All Status', value: '', icon: <List className="text-warning" /> },
    {
      label: 'Active',
      value: '1',
      icon: <CircleCheck className="text-success" />,
    },
    {
      label: 'Inactive',
      value: '0',
      icon: <CircleX className="text-destructive" />,
    },
  ];

  const [selectedMaterialTypeId, setSelectedMaterialTypeId] = useState<
    number | null
  >(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  function handleEdit(id: number) {
    setSelectedMaterialTypeId(id);
    setIsEditModalOpen(true);
  }

  return (
    <div className="space-y-6">
      <AdminHeading
        title="Material Types"
        description="View and manage material types."
      />
      <div className="flex w-full justify-end">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={Plus}
          size="sm"
        >
          <span className="text-sm">New Material Type</span>
        </Button>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
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
              className="min-w-48 md:min-w-72"
            />
          }
        />
      </div>

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
        onEdit={handleEdit}
      />

      {pagination ? (
        <Pagination
          currentPage={pagination.meta.current_page}
          totalPages={pagination.meta.last_page}
          onPageChange={(page) =>
            setParams((prev) => ({
              ...prev,
              page,
            }))
          }
        />
      ) : null}

      <CreateMaterialTypeModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSaved={refetch}
      />

      <EditMaterialTypeModal
        materialTypeId={selectedMaterialTypeId}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSaved={refetch}
      />
    </div>
  );
}
