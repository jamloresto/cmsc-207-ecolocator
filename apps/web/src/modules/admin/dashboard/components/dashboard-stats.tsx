import { MapPinned, ClipboardList, Mail, Package } from 'lucide-react';

import { AdminStatCard } from '../../components/admin-stat-card';

export function DashboardStats() {
  // TODO: replace with real API later
  const stats = {
    recyclingCenters: 128,
    materialTypes: 12,
    pendingSuggestions: 15,
    unreadMessages: 6,
    inquiriesThisMonth: 42,
  };

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <AdminStatCard
        title="Recycling Centers"
        value={stats.recyclingCenters}
        icon={MapPinned}
        href="/admin/recycling-centers"
      />

      <AdminStatCard
        title="Material Types"
        value={stats.materialTypes}
        icon={Package}
        href="/admin/material-types"
      />

      <AdminStatCard
        title="Pending Suggestions"
        value={stats.pendingSuggestions}
        icon={ClipboardList}
        href="/admin/location-suggestions?status=pending"
        description="Awaiting review"
      />

      <AdminStatCard
        title="Contact Messages"
        value={stats.unreadMessages}
        icon={Mail}
        href="/admin/contact-messages"
        description={`${stats.inquiriesThisMonth} this month`}
      />
    </section>
  );
}
