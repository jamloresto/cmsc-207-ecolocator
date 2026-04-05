'use client';

import { notFound, useParams } from 'next/navigation';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AdminUserForm, useAdminUser } from '@/modules/admin-users';

export default function EditAdminUserPage() {
  const params = useParams();
  const userId = Number(params.id);

  const { data, isLoading, isError } = useAdminUser(userId);

  if (!Number.isFinite(userId)) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="text-muted-foreground text-sm">Loading admin user...</div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="text-destructive text-sm">Unable to load admin user.</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit Admin User
        </h1>
        <p className="text-muted-foreground text-sm">
          Update account details, role, status, and password.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin user details</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminUserForm mode="edit" user={data.data} />
        </CardContent>
      </Card>
    </div>
  );
}
