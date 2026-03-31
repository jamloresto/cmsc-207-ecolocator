'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type ContactFormValues = {
  name: string;
  email: string;
  contact_info: string;
  subject: string;
  message: string;
};

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
  const [values, setValues] = React.useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = React.useState<ContactFormErrors>({});
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
    const nextErrors: ContactFormErrors = {};

    if (!values.name.trim()) nextErrors.name = 'Name is required.';
    if (!values.email.trim()) nextErrors.email = 'Email is required.';
    if (!values.subject.trim()) nextErrors.subject = 'Subject is required.';
    if (!values.message.trim()) nextErrors.message = 'Message is required.';

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSuccess(false);
    setErrors({});

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
          Send a Message
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            htmlFor="name"
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

          <FormField
            htmlFor="contact_info"
            error={errors.contact_info}
          >
            <Input
              id="contact_info"
              name="contact_info"
              label="Contact Number"
              value={values.contact_info}
              onChange={handleChange}
              disabled={isSubmitting}
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
            />
          </FormField>

          <FormField
            htmlFor="message"
            error={errors.message}
          >
            <Textarea
              id="message"
              name="message"
              value={values.message}
              onChange={handleChange}
              disabled={isSubmitting}
              rows={6}
              label="Message*"
            />
          </FormField>

          {errors.general ? (
            <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm">
              {errors.general}
            </div>
          ) : null}

          {isSuccess ? (
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
              Your message has been prepared successfully.
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
