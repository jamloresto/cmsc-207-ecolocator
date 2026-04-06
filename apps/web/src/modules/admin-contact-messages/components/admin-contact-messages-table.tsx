'use client';

import { useEffect, useState } from 'react';
import {
  Archive,
  Eye,
  Mail,
  MailCheck,
  MailMinus,
  MailOpen,
  MailPlus,
  Mails,
} from 'lucide-react';
import Link from 'next/link';

import { TableSkeleton } from '@/components/common/loading/table-skeleton';
import { TableToolbar } from '@/components/shared/table-toolbar';
import { TableFooterMeta } from '@/components/shared/table-footer-meta';
import { TableEmptyState } from '@/components/shared/table-empty-state';
import {
  SortableHeader,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/shared/table';
import { SelectCustom } from '@/components/ui/select-custom';
import { StatusPill } from '@/components/ui/status-pill';

import { cn } from '@/lib/utils';
import {
  archiveAdminContactMessage,
  type ContactMessage,
  type ContactMessageStatus,
} from '@/modules/admin-contact-messages';

interface AdminContactMessagesTableProps {
  messages: ContactMessage[];
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  searchValue: string;
  statusFilter: '' | ContactMessageStatus;
  loading?: boolean;
  className?: string;
  onArchived?: (updatedMessage: ContactMessage, archivedId: number) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

function truncate(text: string, max = 90) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

const statusOptions = [
  {
    label: 'All statuses',
    value: '',
    icon: <Mails className="text-warning h-4 w-4" />,
  },
  {
    label: 'New',
    value: 'new',
    icon: <MailCheck className="text-primary h-4 w-4" />,
  },
  {
    label: 'Read',
    value: 'read',
    icon: <MailOpen className="text-muted-foreground h-4 w-4" />,
  },
  {
    label: 'Replied',
    value: 'replied',
    icon: <MailPlus className="text-secondary-foreground h-4 w-4" />,
  },
  {
    label: 'Archived',
    value: 'archived',
    icon: <MailMinus className="text-muted-foreground h-4 w-4" />,
  },
];

export function AdminContactMessagesTable({
  messages,
  currentPage,
  totalPages,
  totalItems,
  searchValue,
  statusFilter,
  loading = false,
  className,
  onArchived,
  sortBy,
  sortOrder,
  onSort,
  onSearchChange,
  onStatusFilterChange,
  onPageChange,
}: AdminContactMessagesTableProps) {
  const [archivingId, setArchivingId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState(searchValue);

  useEffect(() => {
    setSearchInput(searchValue);
  }, [searchValue]);

  async function handleArchive(message: ContactMessage) {
    if (message.status === 'archived') return;

    try {
      setArchivingId(message.id);

      const response = await archiveAdminContactMessage(message.id);

      if (response.data && onArchived) {
        onArchived(response.data, message.id);
      }
    } catch (error) {
      console.error('Failed to archive message:', error);
    } finally {
      setArchivingId(null);
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <TableToolbar
        searchValue={searchInput}
        onSearchChange={(value) => {
          setSearchInput(value);
          onSearchChange(value);
        }}
        searchPlaceholder="Search name, email, subject..."
        filters={
          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-1">
            <SelectCustom
              value={statusFilter}
              onChange={onStatusFilterChange}
              options={statusOptions}
              placeholder="Filter by status"
            />
          </div>
        }
      />

      {loading ? (
        <TableSkeleton columns={6} rows={5} />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="border-t-0">
                <TableHeaderCell>
                  <SortableHeader
                    label="Sender"
                    field="name"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={onSort}
                  />
                </TableHeaderCell>

                <TableHeaderCell>
                  <SortableHeader
                    label="Subject"
                    field="subject"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={onSort}
                  />
                </TableHeaderCell>

                <TableHeaderCell>Message</TableHeaderCell>

                <TableHeaderCell>
                  <SortableHeader
                    label="Status"
                    field="status"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={onSort}
                  />
                </TableHeaderCell>

                <TableHeaderCell>
                  <SortableHeader
                    label="Date"
                    field="created_at"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={onSort}
                  />
                </TableHeaderCell>

                <TableHeaderCell>Action</TableHeaderCell>
              </TableRow>
            </TableHead>

            <tbody>
              {messages.length === 0 ? (
                <TableEmptyState
                  colSpan={6}
                  title="No contact messages"
                  description="No inquiries yet. New messages will appear here."
                />
              ) : (
                messages.map((message) => {
                  const isArchiving = archivingId === message.id;

                  return (
                    <TableRow
                      key={message.id}
                      className={cn(
                        'hover:bg-muted/50 cursor-pointer',
                        message.status === 'new' &&
                          'bg-primary/5 border-primary border-l-success! border-l-3',
                        isArchiving && 'opacity-60',
                      )}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-foreground text-sm font-semibold">
                            {message.name}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {message.email}
                          </p>
                          {message.contact_info ? (
                            <p className="text-muted-foreground text-xs">
                              {message.contact_info}
                            </p>
                          ) : null}
                        </div>
                      </TableCell>

                      <TableCell className="text-foreground font-medium">
                        {message.subject}
                      </TableCell>

                      <TableCell
                        className={cn(
                          'text-muted-foreground',
                          message.status === 'new' &&
                            'text-foreground font-medium',
                        )}
                      >
                        {truncate(message.message)}
                      </TableCell>

                      <TableCell>
                        <StatusPill status={message.status} />
                      </TableCell>

                      <TableCell>{formatDate(message.created_at)}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/admin/contact-messages/${message.id}`}
                            className="hover:bg-muted inline-flex rounded-md p-1.5 transition"
                            title="View message"
                          >
                            <Eye className="text-muted-foreground hover:text-foreground h-4 w-4" />
                          </Link>

                          <Link
                            href={`/admin/contact-messages/${message.id}`}
                            className="hover:bg-muted inline-flex rounded-md p-1.5 transition"
                            title="Reply to message"
                          >
                            <Mail className="text-muted-foreground hover:text-primary h-4 w-4" />
                          </Link>

                          {message.status !== 'archived' && (
                            <button
                              type="button"
                              onClick={() => handleArchive(message)}
                              disabled={isArchiving}
                              className="hover:bg-muted inline-flex rounded-md p-1.5 transition disabled:cursor-not-allowed disabled:opacity-50"
                              title="Archive message"
                            >
                              <Archive className="text-muted-foreground hover:text-destructive h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </tbody>
          </Table>
        </TableContainer>
      )}

      <TableFooterMeta
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems ?? messages.length}
        singularLabel="contact message"
        onPageChange={onPageChange}
      />
    </div>
  );
}
