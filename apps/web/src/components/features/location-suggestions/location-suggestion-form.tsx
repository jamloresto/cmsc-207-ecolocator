'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { SectionSubheading } from '@/components/shared/section-subheading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MaterialCheckboxGroup } from './material-checkbox-group';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearLocationSuggestionState,
  submitLocationSuggestionRequest,
} from '@/modules/location-suggestions/store/location-suggestions.slice';
import {
  selectLocationSuggestionError,
  selectLocationSuggestionSubmitting,
  selectLocationSuggestionSuccess,
  selectLocationSuggestionSuccessMessage,
} from '@/modules/location-suggestions/store/location-suggestions.selectors';
import type { LocationSuggestionFormValues } from '@/modules/location-suggestions/types/location-suggestions.types';

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
};

export function LocationSuggestionForm() {
  const dispatch = useAppDispatch();

  const isSubmitting = useAppSelector(selectLocationSuggestionSubmitting);
  const isSuccess = useAppSelector(selectLocationSuggestionSuccess);
  const successMessage = useAppSelector(selectLocationSuggestionSuccessMessage);
  const error = useAppSelector(selectLocationSuggestionError);

  const [values, setValues] =
    React.useState<LocationSuggestionFormValues>(initialValues);
  const [errors, setErrors] = React.useState<LocationSuggestionFormErrors>({});

  React.useEffect(() => {
    return () => {
      dispatch(clearLocationSuggestionState());
    };
  }, [dispatch]);

  React.useEffect(() => {
    if (isSuccess) {
      setValues(initialValues);
    }
  }, [isSuccess]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
      general: '',
    }));

    if (error || isSuccess) {
      dispatch(clearLocationSuggestionState());
    }
  }

  function validate() {
    const nextErrors: LocationSuggestionFormErrors = {};

    if (!values.name.trim()) nextErrors.name = 'Name is required.';
    if (!values.email.trim()) nextErrors.email = 'Email is required.';
    if (!values.location_name.trim()) {
      nextErrors.location_name = 'Location name is required.';
    }
    if (!values.address.trim()) nextErrors.address = 'Address is required.';
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

    // Convert array to string
    return selected.join(', ');
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrors((prev) => ({
      ...prev,
      general: '',
    }));

    if (!validate()) return;

    dispatch(
      submitLocationSuggestionRequest({
        name: values.name.trim(),
        email: values.email.trim(),
        location_name: values.location_name.trim(),
        location_email: values.location_email.trim() || null,
        contact_number: values.location_contact.trim() || null,
        address: values.address.trim(),
        province: values.province.trim(),
        city_municipality: values.city_municipality.trim(),
        materials_accepted: buildMaterialsAccepted(),
        notes: values.notes.trim(),
      }),
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
            />
          </FormField>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField htmlFor="location_email" error={errors.location_email}>
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

          <FormField
            htmlFor="address"
            helperText="Provide the full address or nearest landmark.*"
            error={errors.address}
          >
            <Textarea
              id="address"
              name="address"
              rows={4}
              value={values.address}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Street, barangay, landmark, or full address"
            />
          </FormField>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField htmlFor="province" error={errors.province}>
              <Input
                id="province"
                name="province"
                label="Province*"
                value={values.province}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </FormField>

            <FormField
              htmlFor="city_municipality"
              error={errors.city_municipality}
            >
              <Input
                id="city_municipality"
                name="city_municipality"
                label="City / Municipality*"
                value={values.city_municipality}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          <FormField
            htmlFor="materials_accepted"
            helperText="Select all materials accepted in this location.*"
            error={errors.materials_accepted}
            label="Materials Accepted"
          >
            <MaterialCheckboxGroup
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
                }));

                if (error || isSuccess) {
                  dispatch(clearLocationSuggestionState());
                }
              }}
              onOtherValueChange={(nextValue) => {
                setValues((prev) => ({
                  ...prev,
                  materials_other: nextValue,
                }));

                setErrors((prev) => ({
                  ...prev,
                  materials_accepted: '',
                }));

                if (error || isSuccess) {
                  dispatch(clearLocationSuggestionState());
                }
              }}
              disabled={isSubmitting}
              error={Boolean(errors.materials_accepted)}
            />
          </FormField>

          <FormField htmlFor="notes">
            <Textarea
              id="notes"
              name="notes"
              rows={2}
              value={values.notes}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Additional Notes"
            />
          </FormField>

          {error ? (
            <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm">
              {error}
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
