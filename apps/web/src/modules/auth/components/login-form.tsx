'use client';

import { ChangeEvent, SubmitEvent, useMemo, useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';

import {
  getAdminLoginErrorMessage,
  useAdminLogin,
  type AdminLoginPayload,
} from '@/modules/auth';

type AdminLoginFormErrors = Partial<Record<keyof AdminLoginPayload, string>>;

const initialValues: AdminLoginPayload = {
  email: '',
  password: '',
};

export function AdminLoginForm() {
  const router = useRouter();
  const loginMutation = useAdminLogin();

  const [values, setValues] = useState<AdminLoginPayload>(initialValues);
  const [errors, setErrors] = useState<AdminLoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const serverError = useMemo(() => {
    if (!loginMutation.error) return '';
    return getAdminLoginErrorMessage(loginMutation.error);
  }, [loginMutation.error]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    if (loginMutation.isError) {
      loginMutation.reset();
    }
  }

  function validate() {
    const nextErrors: AdminLoginFormErrors = {};

    if (!values.email.trim()) {
      nextErrors.email = 'Email is required.';
    }

    if (!values.password.trim()) {
      nextErrors.password = 'Password is required.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) return;

    loginMutation.mutate(
      {
        email: values.email.trim(),
        password: values.password,
      },
      {
        onSuccess: () => {
          router.replace('/admin');
        },
      },
    );
  }

  const isLoading = loginMutation.isPending;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-foreground text-xl font-semibold">
          Admin Login
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Sign in using your admin credentials.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            htmlFor="email"
            helperText="Use your admin email address."
            error={errors.email}
          >
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={values.email}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete="email"
            />
          </FormField>

          <FormField
            htmlFor="password"
            helperText="Enter your account password."
            error={errors.password}
          >
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={values.password}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="current-password"
                className="pr-12"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isLoading}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FormField>

          {serverError ? (
            <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm">
              {serverError}
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
