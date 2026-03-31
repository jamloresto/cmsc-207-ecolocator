'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MaterialCheckboxGroup } from './material-checkbox-group';

type LocationSuggestionFormValues = {
  name: string;
  email: string;
  location_name: string;
  location_email: string;
  location_contact: string;
  address: string;
  province: string;
  city_municipality: string;
  materials_accepted: string[];
  materials_other: string;
};

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
};

export function LocationSuggestionForm() {
  const [values, setValues] =
    React.useState<LocationSuggestionFormValues>(initialValues);
  const [errors, setErrors] = React.useState<LocationSuggestionFormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

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

    if (isSuccess) {
      setIsSuccess(false);
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrors({});
    setIsSuccess(false);

    if (!validate()) return;

    setIsSubmitting(true);

    // UI only for now
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setValues(initialValues);
    }, 800);
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground text-xl font-semibold">
          Location Suggestion Form
        </CardTitle>
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
                label="Full Name"
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
                label="Email Address"
                value={values.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          <FormField
            htmlFor="location_name"
            helperText="Enter the name of the recycling or collection site."
            error={errors.location_name}
          >
            <Input
              id="location_name"
              name="location_name"
              label="Location Name"
              value={values.location_name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              htmlFor="location_email"
              helperText="Suggested location's Email Address."
              error={errors.location_email}
            >
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

            <FormField
              htmlFor="location_contact"
              helperText="Suggested Location's Contact Number"
              error={errors.name}
            >
              <Input
                id="location_contact"
                name="location_contact"
                label="Location's Contact Number."
                value={values.location_contact}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          <FormField
            htmlFor="address"
            helperText="Provide the full address or nearest landmark."
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
                label="Province"
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
                label="City / Municipality"
                value={values.city_municipality}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          <FormField
            htmlFor="materials_accepted"
            helperText="Select all materials accepted in this location."
            error={errors.materials_accepted}
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
              }}
              disabled={isSubmitting}
              error={Boolean(errors.materials_accepted)}
            />
          </FormField>

          {errors.general ? (
            <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm">
              {errors.general}
            </div>
          ) : null}

          {isSuccess ? (
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
              Your suggestion is ready for submission.
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
