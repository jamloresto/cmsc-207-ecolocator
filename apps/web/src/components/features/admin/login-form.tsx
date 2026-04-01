'use client';

import * as React from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearAuthError, loginRequest } from '@/modules/auth/store/auth.slice';
import {
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
} from '@/modules/auth/store/auth.selectors';

type AdminLoginFormValues = {
  email: string;
  password: string;
};

type AdminLoginFormErrors = Partial<Record<keyof AdminLoginFormValues, string>>;

const initialValues: AdminLoginFormValues = {
  email: '',
  password: '',
};

export function AdminLoginForm() {
  const router = useRouter();
  
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [values, setValues] =
    React.useState<AdminLoginFormValues>(initialValues);
  const [errors, setErrors] = React.useState<AdminLoginFormErrors>({});
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    if (error) {
      dispatch(clearAuthError());
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) return;

    dispatch(
      loginRequest({
        email: values.email.trim(),
        password: values.password,
      }),
    );
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground text-xl font-semibold">
          Admin Login
        </CardTitle>
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

          {error ? (
            <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm">
              {error}
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
