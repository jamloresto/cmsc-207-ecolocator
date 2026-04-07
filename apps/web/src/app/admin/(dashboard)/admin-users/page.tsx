'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, ShieldAlert } from 'lucide-react';

import { ErrorState } from '@/components/common/states/error-state';
import { AdminHeading } from '@/components/shared/admin-heading';
import { Button } from '@/components/ui/button';

import { AdminUsersTable, useAdminUsers } from '@/modules/admin-users';
import { RoleGuard } from '@/modules/auth';
import { SortOrder } from '@/types/api.types';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { data, isLoading, isError } = useAdminUsers({
    page,
    per_page: 10,
    search,
    role: role as '' | 'super_admin' | 'editor',
    is_active: status as '' | 'true' | 'false',
    sort: sortBy,
    direction: sortOrder,
  });

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleRoleFilterChange(value: string) {
    setRole(value);
    setPage(1);
  }

  function handleStatusFilterChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
  }

  function handleSort(field: string) {
    setPage(1);

    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortBy(field);
    setSortOrder('asc');
  }

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <div className="space-y-6">
        <AdminHeading
          title="Admin Users"
          description="View and manage admin accounts."
        />

        {isError ? (
          <ErrorState title="Failed to load Admin Users data." />
        ) : (
          <>
            <div className="flex w-full">
              <Link
                href="/admin/admin-users/create"
                title="Create new admin user"
                className="ml-auto"
              >
                <Button size="sm" leftIcon={Plus}>
                  <span className="text-sm">Create New Admin</span>
                </Button>
              </Link>
            </div>

            <AdminUsersTable
              data={data?.data ?? []}
              currentPage={data?.meta?.current_page ?? 1}
              totalPages={data?.meta?.last_page ?? 1}
              totalItems={data?.meta?.total ?? data?.data?.length}
              searchValue={search}
              roleFilter={role}
              statusFilter={status}
              sortBy={sortBy}
              sortOrder={sortOrder}
              isLoading={isLoading}
              onSearchChange={handleSearchChange}
              onRoleFilterChange={handleRoleFilterChange}
              onStatusFilterChange={handleStatusFilterChange}
              onSort={handleSort}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </RoleGuard>
  );
}
