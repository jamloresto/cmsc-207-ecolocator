'use client';

import { useMemo, useState, SubmitEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LocationPickerMap } from '@/components/shared/location-picker-map';

import { ActiveMaterialType } from '@/modules/admin-material-types';
import { WasteCollectionLocationPayload } from '@/modules/admin-recycling-centers';
import { GOOGLE_MAPS_API_KEY } from '@/lib/api';

type FormAction = 'draft' | 'approve' | 'save';

type Props = {
  initialValues?: Partial<WasteCollectionLocationPayload>;
  materialOptions: ActiveMaterialType[];
  isSubmitting?: boolean;
  submitLabel?: string;
  showDraftActions?: boolean;
  onSubmit: (
    values: WasteCollectionLocationPayload,
    action: FormAction,
  ) => void;
};

type FormErrors = Partial<
  Record<
    | 'name'
    | 'latitude'
    | 'longitude'
    | 'country_name'
    | 'country_code'
    | 'state_province'
    | 'city_municipality'
    | 'street_address'
    | 'email'
    | 'material_type_ids',
    string
  >
>;

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
  showDraftActions = false,
  onSubmit,
}: Props) {
  const merged = useMemo(
    () => ({ ...defaultValues, ...initialValues }),
    [initialValues],
  );

  const router = useRouter();

  const [values, setValues] = useState<WasteCollectionLocationPayload>(merged);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setValues(merged);
    setErrors({});
  }, [merged]);

  function updateField<K extends keyof WasteCollectionLocationPayload>(
    key: K,
    value: WasteCollectionLocationPayload[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));

    setErrors((prev) => {
      if (!prev[key as keyof FormErrors]) return prev;
      const next = { ...prev };
      delete next[key as keyof FormErrors];
      return next;
    });
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

    setErrors((prev) => {
      if (!prev.material_type_ids) return prev;
      const next = { ...prev };
      delete next.material_type_ids;
      return next;
    });
  }

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validate() {
    const nextErrors: FormErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = 'Location name is required.';
    }

    if (!String(values.country_name).trim()) {
      nextErrors.country_name = 'Country name is required.';
    }

    if (!String(values.country_code).trim()) {
      nextErrors.country_code = 'Country code is required.';
    }

    if (!String(values.state_province).trim()) {
      nextErrors.state_province = 'State / Province is required.';
    }

    if (!String(values.city_municipality).trim()) {
      nextErrors.city_municipality = 'City / Municipality is required.';
    }

    if (!String(values.street_address).trim()) {
      nextErrors.street_address = 'Street address is required.';
    }

    if (!GOOGLE_MAPS_API_KEY) {
      if (values.latitude === '' || values.latitude === null) {
        nextErrors.latitude = 'Latitude is required.';
      }

      if (values.longitude === '' || values.longitude === null) {
        nextErrors.longitude = 'Longitude is required.';
      }
    }

    if (values.email && !isValidEmail(String(values.email).trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (values.material_type_ids.length === 0) {
      nextErrors.material_type_ids = 'Select at least one material type.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function submitForm(action: FormAction) {
    if (!validate()) return;
    onSubmit(values, action);
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    submitForm(showDraftActions ? 'draft' : 'save');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Location name"
          value={values.name}
          onChange={(e) => updateField('name', e.target.value)}
          error={errors.name}
        />
        {errors.name ? (
          <p className="text-destructive mt-2 text-sm">{errors.name}</p>
        ) : null}
      </div>

      {GOOGLE_MAPS_API_KEY ? (
        <LocationPickerMap
          latitude={values.latitude}
          longitude={values.longitude}
          onChange={({
            latitude,
            longitude,
            country_code,
            country_name,
            state_province,
            state_code,
            city_municipality,
            region,
            street_address,
            postal_code,
          }) => {
            setValues((prev) => ({
              ...prev,
              latitude,
              longitude,
              country_code: country_code || prev.country_code,
              country_name: country_name || prev.country_name,
              state_province: state_province || prev.state_province,
              state_code: state_code || prev.state_code,
              city_municipality: city_municipality || prev.city_municipality,
              region: region || prev.region,
              street_address: street_address || prev.street_address,
              postal_code: postal_code || prev.postal_code,
            }));

            setErrors((prev) => {
              const next = { ...prev };
              delete next.latitude;
              delete next.longitude;
              delete next.country_name;
              delete next.country_code;
              delete next.state_province;
              delete next.city_municipality;
              delete next.street_address;
              return next;
            });
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Input
              label="Latitude"
              type="number"
              step="any"
              value={values.latitude}
              onChange={(e) => updateField('latitude', e.target.value)}
              error={errors.latitude}
            />
            {errors.latitude ? (
              <p className="text-destructive mt-2 text-sm">{errors.latitude}</p>
            ) : null}
          </div>

          <div>
            <Input
              label="Longitude"
              type="number"
              step="any"
              value={values.longitude}
              onChange={(e) => updateField('longitude', e.target.value)}
              error={errors.longitude}
            />
            {errors.longitude ? (
              <p className="text-destructive mt-2 text-sm">
                {errors.longitude}
              </p>
            ) : null}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Input
            label="Country name"
            value={values.country_name}
            onChange={(e) => updateField('country_name', e.target.value)}
            error={errors.country_name}
          />
          {errors.country_name ? (
            <p className="text-destructive mt-2 text-sm">
              {errors.country_name}
            </p>
          ) : null}
        </div>

        <div>
          <Input
            label="Country code"
            value={values.country_code}
            onChange={(e) => updateField('country_code', e.target.value)}
            error={errors.country_code}
          />
          {errors.country_code ? (
            <p className="text-destructive mt-2 text-sm">
              {errors.country_code}
            </p>
          ) : null}
        </div>

        <Input
          label="Region"
          value={values.region ?? ''}
          onChange={(e) => updateField('region', e.target.value)}
        />

        <div>
          <Input
            label="State / Province"
            value={values.state_province}
            onChange={(e) => updateField('state_province', e.target.value)}
            error={errors.state_province}
          />
          {errors.state_province ? (
            <p className="text-destructive mt-2 text-sm">
              {errors.state_province}
            </p>
          ) : null}
        </div>

        <Input
          label="State code"
          value={values.state_code ?? ''}
          onChange={(e) => updateField('state_code', e.target.value)}
        />

        <Input
          label="Postal code"
          value={values.postal_code ?? ''}
          onChange={(e) => updateField('postal_code', e.target.value)}
        />
      </div>

      <div>
        <Input
          label="City / Municipality"
          value={values.city_municipality}
          onChange={(e) => updateField('city_municipality', e.target.value)}
          error={errors.city_municipality}
        />
        {errors.city_municipality ? (
          <p className="text-destructive mt-2 text-sm">
            {errors.city_municipality}
          </p>
        ) : null}
      </div>

      <div>
        <Input
          label="Street address"
          value={values.street_address}
          onChange={(e) => updateField('street_address', e.target.value)}
          error={errors.street_address}
        />
        {errors.street_address ? (
          <p className="text-destructive mt-2 text-sm">
            {errors.street_address}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Contact number"
          value={values.contact_number ?? ''}
          onChange={(e) => updateField('contact_number', e.target.value)}
        />

        <div>
          <Input
            label="Email"
            type="email"
            value={values.email ?? ''}
            onChange={(e) => updateField('email', e.target.value)}
            error={errors.email}
          />
          {errors.email ? (
            <p className="text-destructive mt-2 text-sm">{errors.email}</p>
          ) : null}
        </div>
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
              <span className="text-sm">{material.name}</span>
            </label>
          ))}
        </div>

        {errors.material_type_ids ? (
          <p className="text-destructive text-sm">{errors.material_type_ids}</p>
        ) : null}
      </div>

      <label className="flex items-center gap-2">
        <Checkbox
          checked={values.is_active}
          onChange={() => updateField('is_active', !values.is_active)}
        />
        <span className="text-sm">Active</span>
      </label>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        {showDraftActions ? (
          <>
            <Button type="submit" variant="outline" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </Button>

            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => submitForm('approve')}
            >
              {isSubmitting ? 'Processing...' : 'Approve Suggestion'}
            </Button>
          </>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
