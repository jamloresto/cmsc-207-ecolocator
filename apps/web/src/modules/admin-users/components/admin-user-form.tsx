'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { SelectCustom } from '@/components/ui/select-custom';

import { useToast } from '@/hooks/use-toast';
import {
  useCreateAdminUser,
  type CreateAdminUserPayload,
} from '@/modules/admin-users';
import { AdminUserRole } from '@/modules/auth';

const roleOptions = [
  { label: 'Editor', value: 'editor' },
  { label: 'Super Admin', value: 'super_admin' },
];

const initialValues: CreateAdminUserPayload = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'editor',
  is_active: true,
};

export function AdminUserForm() {
  const router = useRouter();

  const { toast } = useToast();
  const createAdminUserMutation = useCreateAdminUser();

  const [values, setValues] = useState<CreateAdminUserPayload>(initialValues);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const isSubmitting = createAdminUserMutation.isPending;

  const generalError = useMemo(() => {
    return createAdminUserMutation.error?.response?.data?.message ?? '';
  }, [createAdminUserMutation.error]);

  function setField<K extends keyof CreateAdminUserPayload>(
    field: K,
    value: CreateAdminUserPayload[K],
  ) {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      if (!prev[field]) return prev;

      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    createAdminUserMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: 'Admin user created',
          description: 'Redirecting to admin users page in 3 seconds...',
          variant: 'success',
          duration: 3000,
        });

        setValues(initialValues);

        setTimeout(() => {
          router.push('/admin/admin-users');
        }, 3000);
      },

      onError: (error) => {
        const responseErrors = error.response?.data?.errors;

        if (responseErrors) {
          setErrors(responseErrors);
        }

        toast({
          title: 'Unable to create admin user',
          description:
            error.response?.data?.message ??
            'Please review the form fields and try again.',
          variant: 'warning',
        });
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {generalError ? (
        <div className="border-destructive/30 bg-destructive/5 text-destructive rounded-2xl border px-4 py-3 text-sm">
          {generalError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField error={errors.name?.[0]}>
          <Input
            label="Full name"
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Enter full name"
          />
        </FormField>

        <FormField error={errors.email?.[0]}>
          <Input
            label="Email address"
            type="email"
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="Enter email address"
          />
        </FormField>

        <FormField error={errors.password?.[0]}>
          <Input
            label="Password"
            type="password"
            value={values.password}
            onChange={(e) => setField('password', e.target.value)}
            placeholder="Enter password"
          />
        </FormField>

        <FormField error={errors.password_confirmation?.[0]}>
          <Input
            label="Confirm password"
            type="password"
            value={values.password_confirmation}
            onChange={(e) => setField('password_confirmation', e.target.value)}
            placeholder="Confirm password"
          />
        </FormField>

        <div className="md:col-span-2">
          <label className="text-foreground mb-2 block text-sm font-medium">
            Role
          </label>
          <SelectCustom
            value={values.role}
            options={roleOptions}
            placeholder="Select role"
            onChange={(value) => setField('role', value as AdminUserRole)}
          />
          {errors.role?.[0] ? (
            <p className="text-destructive mt-1 text-sm">{errors.role[0]}</p>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <label className="border-border flex items-center gap-3 rounded-2xl border px-4 py-3">
            <Checkbox
              checked={values.is_active}
              onChange={() => {
                setField('is_active', !values.is_active);
              }}
            />
            <span className="text-foreground text-sm">Set user as active</span>
          </label>
          {errors.is_active?.[0] ? (
            <p className="text-destructive mt-1 text-sm">
              {errors.is_active[0]}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create admin user'}
        </Button>
      </div>
    </form>
  );
}
