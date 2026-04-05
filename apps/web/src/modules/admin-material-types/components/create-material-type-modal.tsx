'use client';

import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { useToastContext } from '@/components/providers/toast-provider';

import {
  createAdminMaterialType,
  type CreateMaterialTypePayload,
} from '@/modules/admin-material-types';
import { Switch } from '@/components/ui/switch';

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

type FormValues = {
  name: string;
  description: string;
  is_active: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: '',
  description: '',
  is_active: true,
};

export function CreateMaterialTypeModal({ open, onClose, onSaved }: Props) {
  const { toast } = useToastContext();

  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setValues(initialValues);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open]);

  function handleChange<K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const nextErrors: FormErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = 'Name is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload: CreateMaterialTypePayload = {
        name: values.name.trim(),
        description: values.description.trim() || null,
        is_active: values.is_active,
      };

      const response = await createAdminMaterialType(payload);

      toast({
        title: 'Material type created',
        description:
          response.message ||
          'The material type has been created successfully.',
        variant: 'success',
      });

      onSaved?.();
      onClose();
    } catch (error) {
      const err = error as AxiosError<{
        message?: string;
        errors?: Record<string, string[]>;
      }>;

      const fieldErrors = err.response?.data?.errors;

      if (fieldErrors) {
        setErrors({
          name: fieldErrors.name?.[0],
          description: fieldErrors.description?.[0],
        });
      }

      toast({
        title: 'Failed to create material type',
        description:
          err.response?.data?.message ||
          'Something went wrong. Please try again.',
        variant: 'warning',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Material Type"
      description="Add a new recyclable material type."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField error={errors.name}>
          <Input
            label="Name"
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Plastic"
          />
        </FormField>

        <FormField error={errors.description}>
          <Textarea
            label="Description"
            value={values.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
          />
        </FormField>
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

        <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Material Type'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
