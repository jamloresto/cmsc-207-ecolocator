'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  AdminUsersTable,
  useAdminUsers
} from '@/modules/admin-users';
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

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-foreground text-2xl font-semibold md:text-3xl">
            Admin Users
          </h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            View and manage admin accounts.
          </p>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-14 text-center">
            <div className="bg-destructive/10 text-destructive flex h-12 w-12 items-center justify-center rounded-full">
              <ShieldAlert className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <h2 className="text-foreground text-lg font-semibold">
                Unable to load admin users
              </h2>
              <p className="text-muted-foreground text-sm leading-6">
                Something went wrong while fetching the admin users list.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-semibold md:text-3xl">
          Admin Users
        </h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          View and manage admin accounts. This page is accessible to super
          admins only.
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>
            <div className='w-full flex'>
              <Link
                href={`/admin/admin-users/create`}
                title="View message"
                className='ml-auto'
              >
                <Button size='sm' leftIcon={Plus}>
                  <span className='text-sm'>
                    Create New Admin
                  </span>
                </Button>
              </Link>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          Filtered: {role} {status}
          <AdminUsersTable
            data={data?.data ?? []}
            currentPage={data?.meta?.current_page ?? 1}
            totalPages={data?.meta?.last_page ?? 1}
            totalItems={data?.meta?.total}
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
        </CardContent>
      </Card>
    </div>
  );
}
