'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CircleCheck,
  CircleX,
  Crown,
  List,
  Pencil,
  PenTool,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SelectCustom } from '@/components/ui/select-custom';
import { Pagination } from '@/components/shared/pagination';
import {
  SortableHeader,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/shared/table';
import { TableEmptyState } from '@/components/shared/table-empty-state';
import { TableToolbar } from '@/components/shared/table-toolbar';

import { cn } from '@/lib/utils';
import { AdminUser, AdminUserRole } from '@/modules/admin-users';
import { SortOrder } from '@/types/api.types';

type AdminUsersTableProps = {
  data: AdminUser[];
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  searchValue: string;
  roleFilter: string;
  statusFilter: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  isLoading?: boolean;
  className?: string;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onSort: (field: string) => void;
  onPageChange: (page: number) => void;
};

const roleOptions = [
  {
    label: 'All roles',
    value: '',
    icon: <List className="text-foreground h-4" />,
  },
  {
    label: 'Super Admin',
    value: 'super_admin',
    icon: <Crown className="text-success h-4" />,
  },
  {
    label: 'Editor',
    value: 'editor',
    icon: <PenTool className="text-warning h-4" />,
  },
];

const statusOptions = [
  {
    label: 'All statuses',
    value: '',
    icon: <List className="text-foreground h-4" />,
  },
  {
    label: 'Active',
    value: 'true',
    icon: <CircleCheck className="text-success h-4" />,
  },
  {
    label: 'Inactive',
    value: 'false',
    icon: <CircleX className="text-destructive h-4" />,
  },
];

function formatRole(role: AdminUserRole) {
  return role === 'super_admin' ? 'Super Admin' : 'Editor';
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

function RoleBadge({ role }: { role: AdminUserRole }) {
  return (
    <Badge
      variant={role === 'super_admin' ? 'default' : 'secondary'}
      className="whitespace-nowrap"
    >
      {formatRole(role)}
    </Badge>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? 'success' : 'danger'}>
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
}

export function AdminUsersTable({
  data,
  currentPage,
  totalPages,
  totalItems,
  searchValue,
  roleFilter,
  statusFilter,
  sortBy,
  sortOrder,
  isLoading = false,
  className,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
  onSort,
  onPageChange,
}: AdminUsersTableProps) {
  const [searchInput, setSearchInput] = useState(searchValue);

  useEffect(() => {
    setSearchInput(searchValue);
  }, [searchValue]);

  return (
    <div className={cn('space-y-4', className)}>
      <TableToolbar
        searchValue={searchInput}
        searchPlaceholder="Search by name or email..."
        onSearchChange={(value) => {
          setSearchInput(value);
          onSearchChange(value);
        }}
        filters={
          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
            <SelectCustom
              value={roleFilter}
              options={roleOptions}
              placeholder="Filter by role"
              onChange={onRoleFilterChange}
            />
            <SelectCustom
              value={statusFilter}
              options={statusOptions}
              placeholder="Filter by status"
              onChange={onStatusFilterChange}
            />
          </div>
        }
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="border-t-0">
              <TableHeaderCell>
                <SortableHeader
                  label="Name"
                  field="name"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </TableHeaderCell>

              <TableHeaderCell>
                <SortableHeader
                  label="Email"
                  field="email"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </TableHeaderCell>

              <TableHeaderCell>
                <SortableHeader
                  label="Role"
                  field="role"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </TableHeaderCell>

              <TableHeaderCell>
                <SortableHeader
                  label="Status"
                  field="is_active"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </TableHeaderCell>

              <TableHeaderCell>
                <SortableHeader
                  label="Created At"
                  field="created_at"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                />
              </TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="bg-muted h-4 w-44 animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="bg-muted h-6 w-24 animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="bg-muted h-6 w-20 animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="bg-muted h-4 w-28 animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableEmptyState
                colSpan={5}
                icon={<Users className="h-5 w-5" />}
                title="No admin users found"
                description="Try adjusting your search, filters, or sorting to find matching admin users."
              />
            ) : (
              data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="min-w-0">
                        <p className="text-foreground font-medium">
                          {user.name}
                        </p>
                        <p className="text-muted-foreground text-xs md:text-sm">
                          ID: {user.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <p className="text-foreground break-all">{user.email}</p>
                  </TableCell>

                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>

                  <TableCell>
                    <StatusBadge isActive={user.is_active} />
                  </TableCell>

                  <TableCell>
                    <p className="text-muted-foreground">
                      {formatDate(user.created_at)}
                    </p>
                  </TableCell>

                  <TableCell>
                    <Link href={`/admin/admin-users/${user.id}/edit`}>
                      <Button variant="outline" size="sm" leftIcon={Pencil}>
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </tbody>
        </Table>
      </TableContainer>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-muted-foreground text-sm">
          {typeof totalItems === 'number'
            ? `${totalItems} admin user${totalItems === 1 ? '' : 's'} found`
            : null}
        </p>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
