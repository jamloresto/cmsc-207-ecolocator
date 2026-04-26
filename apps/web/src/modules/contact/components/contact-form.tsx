'use client';

import { ChangeEvent, SubmitEvent, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import {
  getContactSubmitError,
  useSubmitContactMessage,
  type ContactFormValues,
} from '@/modules/contact';

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>> & {
  general?: string;
};

const initialValues: ContactFormValues = {
  name: '',
  email: '',
  contact_info: '',
  subject: '',
  message: '',
};

export function ContactForm() {
  const submitMutation = useSubmitContactMessage();

  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});

  const isSubmitting = submitMutation.isPending;
  const isSuccess = submitMutation.isSuccess;
  const successMessage = submitMutation.data?.message;

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

    if (submitMutation.isError || submitMutation.isSuccess) {
      submitMutation.reset();
    }
  }

  function validate() {
    const nextErrors: ContactFormErrors = {};

    if (!values.name.trim()) nextErrors.name = 'Name is required.';
    if (!values.email.trim()) nextErrors.email = 'Email is required.';
    if (!values.subject.trim()) nextErrors.subject = 'Subject is required.';
    if (!values.message.trim()) nextErrors.message = 'Message is required.';

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
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
        contact_info: values.contact_info.trim() || null,
        subject: values.subject.trim(),
        message: values.message.trim(),
      },
      {
        onSuccess: () => {
          setValues(initialValues);
          setErrors({});
        },
        onError: (error) => {
          const parsed = getContactSubmitError(error);

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
        <CardTitle className="text-foreground text-xl font-semibold">
          Send a Message
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField htmlFor="name" error={errors.name}>
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

          <FormField htmlFor="email" error={errors.email}>
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

          <FormField htmlFor="contact_info" error={errors.contact_info}>
            <Input
              id="contact_info"
              name="contact_info"
              label="Contact Number"
              value={values.contact_info}
              onChange={handleChange}
              disabled={isSubmitting}
              error={errors.contact_info}
            />
          </FormField>

          <FormField
            htmlFor="subject"
            helperText="Briefly tell us what this is about."
            error={errors.subject}
          >
            <Input
              id="subject"
              name="subject"
              label="Subject*"
              value={values.subject}
              onChange={handleChange}
              disabled={isSubmitting}
              error={errors.subject}
            />
          </FormField>

          <FormField htmlFor="message" error={errors.message}>
            <Textarea
              id="message"
              name="message"
              value={values.message}
              onChange={handleChange}
              disabled={isSubmitting}
              rows={6}
              label="Message*"
              error={errors.message}
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
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
