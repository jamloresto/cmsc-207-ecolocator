'use client';

import { useState } from 'react';
import { Archive, Eye, Mail } from 'lucide-react';
import Link from 'next/link';

import { StatusPill } from '@/components/ui/status-pill';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableCell,
  SortableHeader,
} from '@/components/shared/table';

import { cn } from '@/lib/utils';
import { archiveAdminContactMessage } from '@/modules/admin-contact-messages';
import type { ContactMessage } from '@/modules/admin-contact-messages';
import { TableEmptyState } from '@/components/shared/table-empty-state';

interface AdminContactMessagesTableProps {
  messages: ContactMessage[];
  loading?: boolean;
  onArchived?: (updatedMessage: ContactMessage, archivedId: number) => void;

  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
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

export function AdminContactMessagesTable({
  messages,
  loading = false,
  onArchived,
  sortBy,
  sortOrder,
  onSort,
}: AdminContactMessagesTableProps) {
  const [archivingId, setArchivingId] = useState<number | null>(null);

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
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
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
                field="create_at"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={onSort}
              />
            </TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </TableRow>
        </TableHead>

        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-36" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-56" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : messages.length === 0 ? (
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
                      message.status === 'new' && 'text-foreground font-medium',
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
  );
}
