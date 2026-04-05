'use client';

import { SubmitEvent, useState } from 'react';

import { Modal } from '@/components/ui/modal';

import {
  MaterialTypeForm,
  createAdminMaterialType,
  type MaterialTypeFormValues,
} from '@/modules/admin-material-types';

type CreateMaterialTypeModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

const initialValues: MaterialTypeFormValues = {
  name: '',
  description: '',
  is_active: true,
};

export function CreateMaterialTypeModal({
  open,
  onClose,
  onSaved,
}: CreateMaterialTypeModalProps) {
  const [values, setValues] = useState<MaterialTypeFormValues>(initialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetState() {
    setValues(initialValues);
    setIsSaving(false);
    setError(null);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setError(null);

      await createAdminMaterialType({
        name: values.name.trim(),
        description: values.description.trim() || null,
        is_active: values.is_active,
      });

      await onSaved();
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create material type.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create Material Type"
      description="Add a new material type."
      className="max-w-2xl"
    >
      <MaterialTypeForm
        values={values}
        isSaving={isSaving}
        error={error}
        submitLabel="Create Material Type"
        onChange={setValues}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </Modal>
  );
}
