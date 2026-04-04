'use client';

import { FormEvent, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

import {
  getAdminMaterialType,
  updateAdminMaterialType,
  type AdminMaterialType,
} from '@/modules/admin-material-types';

type EditMaterialTypeModalProps = {
  materialTypeId: number | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

type FormValues = {
  name: string;
  description: string;
  is_active: boolean;
};

export function EditMaterialTypeModal({
  materialTypeId,
  open,
  onClose,
  onSaved,
}: EditMaterialTypeModalProps) {
  const [materialType, setMaterialType] = useState<AdminMaterialType | null>(
    null,
  );
  const [values, setValues] = useState<FormValues>({
    name: '',
    description: '',
    is_active: true,
  });
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
    setValues({
      name: '',
      description: '',
      is_active: true,
    });
    setIsLoading(false);
    setIsSaving(false);
    setError(null);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
        <form onSubmit={handleSubmit} className="space-y-5">
          {error ? (
            <div className="border-destructive/30 bg-destructive/5 text-destructive rounded-xl border p-3 text-sm">
              {error}
            </div>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="material-type-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="material-type-name"
              value={values.name}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Enter material type name"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="material-type-description"
              className="text-sm font-medium"
            >
              Description
            </label>
            <Textarea
              id="material-type-description"
              value={values.description}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter description"
              rows={4}
            />
          </div>

          <div className="border-border flex items-center justify-between rounded-xl border p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <p className="text-muted-foreground text-sm">
                Set whether this material type is active or inactive.
              </p>
            </div>

            <Switch
              checked={values.is_active}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  is_active: e.target.checked,
                }))
              }
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 md:flex-row md:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSaving || !values.name.trim()}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
