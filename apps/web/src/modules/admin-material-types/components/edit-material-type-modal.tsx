'use client';

import { SubmitEvent, useEffect, useState } from 'react';

import { Modal } from '@/components/ui/modal';

import {
  ActiveMaterialType,
  getAdminMaterialType,
  MaterialTypeForm,
  updateAdminMaterialType,
  type MaterialTypeFormValues,
} from '@/modules/admin-material-types';

type EditMaterialTypeModalProps = {
  materialTypeId: number | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

const initialValues: MaterialTypeFormValues = {
  name: '',
  description: '',
  is_active: true,
};

export function EditMaterialTypeModal({
  materialTypeId,
  open,
  onClose,
  onSaved,
}: EditMaterialTypeModalProps) {
  const [materialType, setMaterialType] = useState<ActiveMaterialType | null>(
    null,
  );
  const [values, setValues] = useState<MaterialTypeFormValues>(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMaterialType() {
      if (!open || !materialTypeId) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await getAdminMaterialType(materialTypeId);
        const data = response.data;

        setMaterialType(data);
        setValues({
          name: data.name,
          description: data.description ?? '',
          is_active: data.is_active,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load material type.',
        );
      } finally {
        setIsLoading(false);
      }
    }

    void fetchMaterialType();
  }, [materialTypeId, open]);

  function resetState() {
    setMaterialType(null);
    setValues(initialValues);
    setIsLoading(false);
    setIsSaving(false);
    setError(null);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!materialTypeId) return;

    try {
      setIsSaving(true);
      setError(null);

      await updateAdminMaterialType(materialTypeId, {
        name: values.name.trim(),
        description: values.description.trim() || null,
        is_active: values.is_active,
      });

      await onSaved();
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update material type.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Edit Material Type"
      description={
        materialType
          ? `Update the details for ${materialType.name}.`
          : 'Update the material type details.'
      }
      className="max-w-2xl"
    >
      {isLoading ? (
        <div className="text-muted-foreground py-6 text-sm">
          Loading material type details...
        </div>
      ) : (
        <MaterialTypeForm
          values={values}
          isSaving={isSaving}
          error={error}
          submitLabel="Save Changes"
          onChange={setValues}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      )}
    </Modal>
  );
}
