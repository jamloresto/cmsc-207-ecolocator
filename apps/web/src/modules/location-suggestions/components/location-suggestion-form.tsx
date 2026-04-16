'use client';

import { ChangeEvent, SubmitEvent, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';

import { SectionSubheading } from '@/components/shared/section-subheading';
import { LocationPickerMap } from '@/components/shared/location-picker-map';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import {
  getLocationSuggestionSubmitError,
  MaterialCheckboxGroup,
  useSubmitLocationSuggestion,
  type LocationSuggestionFormValues,
} from '@/modules/location-suggestions';
import { useMaterialTypes } from '@/modules/material-types';

type LocationSuggestionFormErrors = Partial<
  Record<
    | 'name'
    | 'email'
    | 'location_name'
    | 'location_email'
    | 'address'
    | 'province'
    | 'city_municipality'
    | 'materials_accepted',
    string
  >
> & {
  general?: string;
};

type LocationPickerValues = {
  latitude: string;
  longitude: string;
  country_code?: string;
  country_name?: string;
  state_province?: string;
  state_code?: string;
  city_municipality?: string;
  region?: string;
  street_address?: string;
  postal_code?: string;
};

const initialValues: LocationSuggestionFormValues = {
  name: '',
  email: '',
  location_name: '',
  location_email: '',
  location_contact: '',
  address: '',
  province: '',
  city_municipality: '',
  materials_accepted: [],
  materials_other: '',
  notes: '',

  latitude: '',
  longitude: '',
  country_code: '',
  country_name: '',
  state_code: '',
  region: '',
  postal_code: '',
};

export function LocationSuggestionForm() {
  const { materialTypes } = useMaterialTypes();
  const submitMutation = useSubmitLocationSuggestion();

  const [values, setValues] =
    useState<LocationSuggestionFormValues>(initialValues);
  const [errors, setErrors] = useState<LocationSuggestionFormErrors>({});
  const [isMapPointCommitted, setIsMapPointCommitted] = useState(false);

  const isSubmitting = submitMutation.isPending;
  const isSuccess = submitMutation.isSuccess;
  const successMessage = submitMutation.data?.message;

  function resetMutationState() {
    if (submitMutation.isError || submitMutation.isSuccess) {
      submitMutation.reset();
    }
  }

  function clearError(name: keyof LocationSuggestionFormErrors) {
    setErrors((prev) => ({
      ...prev,
      [name]: '',
      general: '',
    }));
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearError(name as keyof LocationSuggestionFormErrors);
    resetMutationState();
  }

  function handleLockedFieldChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    if (isMapPointCommitted) return;
    handleChange(e);
  }

  function handleMapPointChange(location: LocationPickerValues) {
    setValues((prev) => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
      country_code: location.country_code ?? '',
      country_name: location.country_name ?? '',
      province: location.state_province ?? '',
      state_code: location.state_code ?? '',
      city_municipality: location.city_municipality ?? '',
      region: location.region ?? '',
      address: location.street_address ?? '',
      postal_code: location.postal_code ?? '',
    }));

    setErrors((prev) => ({
      ...prev,
      address: '',
      province: '',
      city_municipality: '',
      general: '',
    }));

    setIsMapPointCommitted(true);
    resetMutationState();
  }

  function handleUnlockAddressFields() {
    setIsMapPointCommitted(false);
  }

  function validate() {
    const nextErrors: LocationSuggestionFormErrors = {};

    if (!values.name.trim()) nextErrors.name = 'Name is required.';
    if (!values.email.trim()) nextErrors.email = 'Email is required.';
    if (!values.location_name.trim()) {
      nextErrors.location_name = 'Location name is required.';
    }
    if (!values.address.trim()) {
      nextErrors.address = 'Street address is required.';
    }
    if (!values.province.trim()) nextErrors.province = 'Province is required.';
    if (!values.city_municipality.trim()) {
      nextErrors.city_municipality = 'City / Municipality is required.';
    }
    if (values.materials_accepted.length === 0) {
      nextErrors.materials_accepted = 'Select at least one material.';
    }
    if (
      values.materials_accepted.includes('others') &&
      !values.materials_other.trim()
    ) {
      nextErrors.materials_accepted = 'Please specify the other materials.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function buildMaterialsAccepted(): string {
    const selected = values.materials_accepted.filter(
      (item) => item !== 'others',
    );

    if (
      values.materials_accepted.includes('others') &&
      values.materials_other.trim()
    ) {
      selected.push(values.materials_other.trim());
    }

    return selected.join(', ');
  }

  function buildNotes(): string {
    const materialsAccepted = buildMaterialsAccepted();
    const trimmedNotes = values.notes.trim();

    if (!trimmedNotes) {
      return materialsAccepted
        ? `Materials Accepted: ${materialsAccepted}`
        : '';
    }

    return materialsAccepted
      ? `${trimmedNotes}\n\nMaterials Accepted: ${materialsAccepted}`
      : trimmedNotes;
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrors((prev) => ({
      ...prev,
      general: '',
    }));

    if (!validate()) return;

    submitMutation.mutate(
      {
        name: values.name.trim(),
        email: values.email.trim(),
        location_name: values.location_name.trim(),
        location_email: values.location_email.trim() || null,
        contact_number: values.location_contact.trim() || null,
        address: values.address.trim(),
        province: values.province.trim(),
        city_municipality: values.city_municipality.trim(),
        materials_accepted: buildMaterialsAccepted(),
        notes: buildNotes(),

        latitude: values.latitude.trim() || null,
        longitude: values.longitude.trim() || null,
        country_code: values.country_code.trim() || null,
        country_name: values.country_name.trim() || null,
        state_code: values.state_code.trim() || null,
        region: values.region.trim() || null,
        postal_code: values.postal_code.trim() || null,
      },
      {
        onSuccess: () => {
          setValues(initialValues);
          setErrors({});
          setIsMapPointCommitted(false);
        },
        onError: (error) => {
          const parsed = getLocationSuggestionSubmitError(error);

          setErrors((prev) => ({
            ...prev,
            ...parsed.fieldErrors,
            general: parsed.message,
          }));
        },
      },
    );
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle>Location Suggestion Form</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              htmlFor="name"
              helperText="Enter your full name."
              error={errors.name}
            >
              <Input
                id="name"
                name="name"
                label="Full Name*"
                value={values.name}
                onChange={handleChange}
                disabled={isSubmitting}
                error={errors.name}
              />
            </FormField>

            <FormField
              htmlFor="email"
              helperText="Use your active email address."
              error={errors.email}
            >
              <Input
                id="email"
                name="email"
                type="email"
                label="Email Address*"
                value={values.email}
                onChange={handleChange}
                disabled={isSubmitting}
                error={errors.email}
              />
            </FormField>
          </div>

          <SectionSubheading title="About the location" />

          <FormField htmlFor="location_name" error={errors.location_name}>
            <Input
              id="location_name"
              name="location_name"
              label="Name of the recycling or collection site*"
              value={values.location_name}
              onChange={handleChange}
              disabled={isSubmitting}
              error={errors.location_name}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField htmlFor="location_email">
              <Input
                id="location_email"
                name="location_email"
                type="email"
                label="Location's Email Address"
                value={values.location_email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </FormField>

            <FormField htmlFor="location_contact">
              <Input
                id="location_contact"
                name="location_contact"
                label="Location's Contact Number"
                value={values.location_contact}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          <div className="space-y-4 rounded-2xl border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">
                  Pin the location on the map
                </p>
                <p className="text-muted-foreground text-sm">
                  Select a point so EcoLocator can auto-fill the address more
                  accurately.
                </p>
              </div>

              {isMapPointCommitted ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUnlockAddressFields}
                  disabled={isSubmitting}
                >
                  Change location
                </Button>
              ) : null}
            </div>

            <LocationPickerMap
              latitude={values.latitude}
              longitude={values.longitude}
              onChange={handleMapPointChange}
              disabled={isSubmitting}
            />

            {isMapPointCommitted ? (
              <div className="bg-muted/50 flex items-start gap-2 rounded-xl border px-3 py-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-muted-foreground">
                  Address fields are locked based on the selected map point to
                  keep the location accurate. You may still edit the street
                  address if needed.
                </p>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              htmlFor="province"
              helperText={
                isMapPointCommitted
                  ? 'Auto-filled from the selected map point.'
                  : undefined
              }
              error={errors.province}
            >
              <Input
                id="province"
                name="province"
                label="Province*"
                value={values.province}
                onChange={handleLockedFieldChange}
                disabled={isSubmitting || isMapPointCommitted}
                error={errors.province}
              />
            </FormField>

            <FormField
              htmlFor="city_municipality"
              helperText={
                isMapPointCommitted
                  ? 'Auto-filled from the selected map point.'
                  : undefined
              }
              error={errors.city_municipality}
            >
              <Input
                id="city_municipality"
                name="city_municipality"
                label="City / Municipality*"
                value={values.city_municipality}
                onChange={handleLockedFieldChange}
                disabled={isSubmitting || isMapPointCommitted}
                error={errors.city_municipality}
              />
            </FormField>
          </div>

          <FormField
            htmlFor="address"
            helperText={
              isMapPointCommitted
                ? 'You may fine-tune the street address after selecting a point on the map.'
                : 'Provide the full address or nearest landmark.*'
            }
            error={errors.address}
          >
            <Textarea
              id="address"
              name="address"
              label="Street Address / Landmark*"
              rows={4}
              value={values.address}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Street, barangay, landmark, or full address"
              error={errors.address}
            />
          </FormField>

          <FormField
            htmlFor="materials_accepted"
            helperText="Select all materials accepted in this location.*"
            error={errors.materials_accepted}
            label="Materials Accepted"
          >
            <MaterialCheckboxGroup
              options={materialTypes}
              selectedValues={values.materials_accepted}
              otherValue={values.materials_other}
              onSelectedValuesChange={(nextValues) => {
                setValues((prev) => ({
                  ...prev,
                  materials_accepted: nextValues,
                }));

                setErrors((prev) => ({
                  ...prev,
                  materials_accepted: '',
                  general: '',
                }));

                resetMutationState();
              }}
              onOtherValueChange={(nextValue) => {
                setValues((prev) => ({
                  ...prev,
                  materials_other: nextValue,
                }));

                setErrors((prev) => ({
                  ...prev,
                  materials_accepted: '',
                  general: '',
                }));

                resetMutationState();
              }}
              disabled={isSubmitting}
              error={Boolean(errors.materials_accepted)}
            />
          </FormField>

          <FormField
            htmlFor="notes"
            helperText="Optional details like schedule, landmark notes, or instructions for pickup/drop-off."
          >
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              value={values.notes}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Additional notes"
            />
          </FormField>

          {errors.general ? (
            <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm">
              {errors.general}
            </div>
          ) : null}

          {isSuccess && successMessage ? (
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
              {successMessage}
            </div>
          ) : null}

          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Suggestion'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
