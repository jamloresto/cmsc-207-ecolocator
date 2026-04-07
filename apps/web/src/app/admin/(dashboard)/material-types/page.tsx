'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { ErrorState } from '@/components/common/states/error-state';
import { AdminHeading } from '@/components/shared/admin-heading';
import { Button } from '@/components/ui/button';

import {
  AdminMaterialTypesTable,
  CreateMaterialTypeModal,
  EditMaterialTypeModal,
  useAdminMaterialTypes,
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

      {error ? (
        <ErrorState title="Failed to load material types." />
      ) : (
        <>
          <div className="flex w-full justify-end">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={Plus}
              size="sm"
            >
              <span className="text-sm">New Material Type</span>
            </Button>
          </div>
          <AdminMaterialTypesTable
            materialTypes={materialTypes}
            isLoading={isLoading}
            params={params}
            setParams={setParams}
            onToggleStatus={handleStatusToggle}
            onEdit={handleEdit}
            currentPage={pagination?.meta.current_page ?? 1}
            totalPages={pagination?.meta.last_page ?? 1}
            totalItems={pagination?.meta.total ?? materialTypes.length}
          />

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
        </>
      )}
    </div>
  );
}
