'use client';

import { SubmitEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export type MaterialTypeFormValues = {
  name: string;
  description: string;
  is_active: boolean;
};

type MaterialTypeFormProps = {
  values: MaterialTypeFormValues;
  isSaving?: boolean;
  error?: string | null;
  submitLabel: string;
  onChange: (values: MaterialTypeFormValues) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function MaterialTypeForm({
  values,
  isSaving = false,
  error = null,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: MaterialTypeFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
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
            onChange({
              ...values,
              name: e.target.value,
            })
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
            onChange({
              ...values,
              description: e.target.value,
            })
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
            onChange({
              ...values,
              is_active: e.target.checked,
            })
          }
        />
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 md:flex-row md:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSaving || !values.name.trim()}>
          {isSaving ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
