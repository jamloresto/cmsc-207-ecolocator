'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { SelectCustom } from '@/components/ui/select-custom';

import { useToast } from '@/hooks/use-toast';
import {
  useCreateAdminUser,
  useUpdateAdminUser,
  type AdminUser,
  type AdminUserRole,
  type CreateAdminUserPayload,
  type UpdateAdminUserPayload,
} from '@/modules/admin-users';

type AdminUserFormMode = 'create' | 'edit';

type AdminUserFormProps = {
  mode: AdminUserFormMode;
  user?: AdminUser;
};

type AdminUserFormValues = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: AdminUserRole;
  is_active: boolean;
};

const roleOptions = [
  { label: 'Editor', value: 'editor' },
  { label: 'Super Admin', value: 'super_admin' },
];

const initialValues: AdminUserFormValues = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'editor',
  is_active: true,
};

export function AdminUserForm({ mode, user }: AdminUserFormProps) {
  const router = useRouter();

  const { toast } = useToast();
  const createAdminUserMutation = useCreateAdminUser();
  const updateAdminUserMutation = useUpdateAdminUser();

  const [values, setValues] = useState<AdminUserFormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (mode === 'edit' && user) {
      setValues({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
        is_active: user.is_active,
      });
    }
  }, [mode, user]);

  const isSubmitting =
    createAdminUserMutation.isPending || updateAdminUserMutation.isPending;

  const generalError = useMemo(() => {
    return (
      createAdminUserMutation.error?.response?.data?.message ??
      updateAdminUserMutation.error?.response?.data?.message ??
      ''
    );
  }, [createAdminUserMutation.error, updateAdminUserMutation.error]);

  function setField<K extends keyof AdminUserFormValues>(
    field: K,
    value: AdminUserFormValues[K],
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

  function buildCreatePayload(): CreateAdminUserPayload {
    return {
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      password_confirmation: values.password_confirmation,
      role: values.role,
      is_active: values.is_active,
    };
  }

  function buildUpdatePayload(): UpdateAdminUserPayload {
    const payload: UpdateAdminUserPayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      role: values.role,
      is_active: values.is_active,
    };

    if (values.password.trim()) {
      payload.password = values.password;
      payload.password_confirmation = values.password_confirmation;
    }

    return payload;
  }

  function redirectToUsersPage(title: string) {
    const redirectDelay = 3000;

    toast({
      title,
      description: 'Redirecting to admin users page...',
      variant: 'success',
      duration: redirectDelay,
    });

    setTimeout(() => {
      router.push('/admin/admin-users');
    }, redirectDelay);
  }

  function handleValidationErrors(responseErrors?: Record<string, string[]>) {
    if (responseErrors) {
      setErrors(responseErrors);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    if (mode === 'create') {
      createAdminUserMutation.mutate(buildCreatePayload(), {
        onSuccess: () => {
          setValues(initialValues);
          redirectToUsersPage('Admin user created');
        },
        onError: (error) => {
          handleValidationErrors(error.response?.data?.errors);

          toast({
            title: 'Unable to create admin user',
            description:
              error.response?.data?.message ??
              'Please review the form fields and try again.',
            variant: 'warning',
          });
        },
      });

      return;
    }

    if (!user) return;

    updateAdminUserMutation.mutate(
      {
        userId: user.id,
        payload: buildUpdatePayload(),
      },
      {
        onSuccess: () => {
          redirectToUsersPage('Admin user updated');
        },
        onError: (error) => {
          handleValidationErrors(error.response?.data?.errors);

          toast({
            title: 'Unable to update admin user',
            description:
              error.response?.data?.message ??
              'Please review the form fields and try again.',
            variant: 'warning',
          });
        },
      },
    );
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

        <FormField
          error={errors.password?.[0]}
          helperText={
            mode === 'edit'
              ? 'Leave blank to keep the current password.'
              : undefined
          }
        >
          <Input
            label={mode === 'edit' ? 'New password' : 'Password'}
            type="password"
            value={values.password}
            onChange={(e) => setField('password', e.target.value)}
            placeholder={
              mode === 'edit'
                ? 'Leave blank to keep current password'
                : 'Enter password'
            }
          />
        </FormField>

        <FormField error={errors.password_confirmation?.[0]}>
          <Input
            label={
              mode === 'edit' ? 'Confirm new password' : 'Confirm password'
            }
            type="password"
            value={values.password_confirmation}
            onChange={(e) => setField('password_confirmation', e.target.value)}
            placeholder={
              mode === 'edit' ? 'Confirm new password' : 'Confirm password'
            }
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

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/admin-users')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === 'create'
              ? 'Creating...'
              : 'Saving...'
            : mode === 'create'
              ? 'Create admin user'
              : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
