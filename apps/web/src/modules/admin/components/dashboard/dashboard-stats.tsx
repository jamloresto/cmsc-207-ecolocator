'use client';

import { ClipboardList, Mail, MapPinned, Recycle } from 'lucide-react';

import { AdminStatCard } from '../admin-stat-card';

import { useDashboardStats } from '@/modules/admin';

export function DashboardStats() {
  const { stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-card h-33 animate-pulse rounded-2xl border"
          />
        ))}
      </section>
    );
  }

  if (error || !stats) {
    return (
      <div className="border-destructive/20 bg-card text-destructive rounded-2xl border p-4 text-sm">
        Failed to load dashboard statistics.
      </div>
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        title="Recycling Centers"
        value={stats.recycling_centers_count}
        icon={MapPinned}
        href="/admin/recycling-centers"
      />

      <AdminStatCard
        title="Material Types"
        value={stats.material_types_count}
        icon={Recycle}
        href="/admin/material-types"
      />

      <AdminStatCard
        title="Pending Suggestions"
        value={stats.pending_location_suggestions_count}
        icon={ClipboardList}
        href="/admin/location-suggestions?status=pending"
        description="Awaiting review"
      />

      <AdminStatCard
        title="Contact Messages"
        value={stats.unread_contact_messages_count}
        icon={Mail}
        href="/admin/contact-messages?status=new"
        description={`${stats.contact_messages_this_month_count} this month`}
      />
    </section>
  );
}
