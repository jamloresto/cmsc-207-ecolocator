import { DashboardStats } from '@/modules/admin/dashboard/components/dashboard-stats';

export default function AdminDashboardPage() {
  return (
    <section className="space-y-6">
      <DashboardStats />

      <div className="border-border bg-card rounded-2xl border p-6">
        <h2 className="text-foreground text-lg font-semibold">
          Welcome back!
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Manage recycling centers, review suggestions, and respond to user
          inquiries.
        </p>
      </div>
    </section>
  );
}
