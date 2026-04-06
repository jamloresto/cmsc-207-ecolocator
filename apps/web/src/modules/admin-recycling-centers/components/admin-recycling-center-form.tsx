'use client';

import { useMemo, useState, SubmitEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { ActiveMaterialType } from '@/modules/admin-material-types';
import {
  WasteCollectionLocationPayload,
} from '@/modules/admin-recycling-centers';

type Props = {
  initialValues?: Partial<WasteCollectionLocationPayload>;
  materialOptions: ActiveMaterialType[];
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (values: WasteCollectionLocationPayload) => void;
};

const defaultValues: WasteCollectionLocationPayload = {
  name: '',
  country_code: 'PH',
  country_name: 'Philippines',
  state_province: '',
  state_code: '',
  city_municipality: '',
  region: '',
  street_address: '',
  postal_code: '',
  latitude: '',
  longitude: '',
  contact_number: '',
  email: '',
  operating_hours: '',
  notes: '',
  is_active: true,
  material_type_ids: [],
};

export function WasteCollectionLocationForm({
  initialValues,
  materialOptions,
  isSubmitting = false,
  submitLabel = 'Save',
  onSubmit,
}: Props) {
  const merged = useMemo(
    () => ({ ...defaultValues, ...initialValues }),
    [initialValues],
  );

  const [values, setValues] = useState<WasteCollectionLocationPayload>(merged);

  function updateField<K extends keyof WasteCollectionLocationPayload>(
    key: K,
    value: WasteCollectionLocationPayload[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleMaterialType(id: number) {
    setValues((prev) => {
      const exists = prev.material_type_ids.includes(id);

      return {
        ...prev,
        material_type_ids: exists
          ? prev.material_type_ids.filter((item) => item !== id)
          : [...prev.material_type_ids, id],
      };
    });
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(values);
  }

  console.log(values);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Location name"
          value={values.name}
          onChange={(e) => updateField('name', e.target.value)}
          required
        />

        <Input
          label="Country name"
          value={values.country_name}
          onChange={(e) => updateField('country_name', e.target.value)}
          required
        />

        <Input
          label="Country code"
          value={values.country_code}
          onChange={(e) => updateField('country_code', e.target.value)}
          required
        />

        <Input
          label="State / Province"
          value={values.state_province}
          onChange={(e) => updateField('state_province', e.target.value)}
          required
        />

        <Input
          label="State code"
          value={values.state_code ?? ''}
          onChange={(e) => updateField('state_code', e.target.value)}
        />

        <Input
          label="City / Municipality"
          value={values.city_municipality}
          onChange={(e) => updateField('city_municipality', e.target.value)}
          required
        />

        <Input
          label="Region"
          value={values.region ?? ''}
          onChange={(e) => updateField('region', e.target.value)}
        />

        <Input
          label="Postal code"
          value={values.postal_code ?? ''}
          onChange={(e) => updateField('postal_code', e.target.value)}
        />
      </div>

      <Input
        label="Street address"
        value={values.street_address}
        onChange={(e) => updateField('street_address', e.target.value)}
        required
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Latitude"
          type="number"
          step="any"
          value={values.latitude}
          onChange={(e) => updateField('latitude', e.target.value)}
          required
        />

        <Input
          label="Longitude"
          type="number"
          step="any"
          value={values.longitude}
          onChange={(e) => updateField('longitude', e.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Contact number"
          value={values.contact_number ?? ''}
          onChange={(e) => updateField('contact_number', e.target.value)}
        />

        <Input
          label="Email"
          type="email"
          value={values.email ?? ''}
          onChange={(e) => updateField('email', e.target.value)}
        />
      </div>

      <Input
        label="Operating hours"
        value={values.operating_hours ?? ''}
        onChange={(e) => updateField('operating_hours', e.target.value)}
      />

      <Textarea
        label="Notes"
        value={values.notes ?? ''}
        onChange={(e) => updateField('notes', e.target.value)}
        rows={4}
      />

      <div className="space-y-3">
        <p className="text-sm font-medium">Accepted material types</p>

        <div className="grid gap-3 md:grid-cols-2">
          {materialOptions.map((material) => (
            <label
              key={material.slug}
              className="border-border flex items-center gap-2 rounded-xl border px-3 py-2"
            >
              <Checkbox
                checked={values.material_type_ids.includes(material.id)}
                onChange={() => toggleMaterialType(material.id)}
              />
              <span className="text-sm">
                {material.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2">
        <Checkbox
          checked={values.is_active}
          onChange={(checked) => updateField('is_active', !values.is_active)}
        />
        <span className="text-sm">Active</span>
      </label>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
