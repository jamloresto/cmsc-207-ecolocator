import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AdminUserForm } from '@/modules/admin-users';

export default function CreateAdminUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Create Admin User
        </h1>
        <p className="text-muted-foreground text-sm">
          Add a new admin account for the EcoLocator dashboard.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin user details</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminUserForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
