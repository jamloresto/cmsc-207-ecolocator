import Link from 'next/link';
import { Eye, Mail, Archive } from 'lucide-react';
import { StatusPill } from '@/components/ui/status-pill';
import { cn } from '@/lib/utils';
import type { ContactMessage } from '../types/contact-message.types';
import { TableSkeleton } from '@/components/common/loading/table-skeleton';

interface AdminContactMessagesTableProps {
  messages: ContactMessage[];
  loading?: boolean;
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
}: AdminContactMessagesTableProps) {
  return (
    <div className="border-border bg-card overflow-hidden rounded-2xl border">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="text-foreground px-4 py-3 text-sm font-semibold">
                Sender
              </th>
              <th className="text-foreground px-4 py-3 text-sm font-semibold">
                Subject
              </th>
              <th className="text-foreground px-4 py-3 text-sm font-semibold">
                Message
              </th>
              <th className="text-foreground px-4 py-3 text-sm font-semibold">
                Status
              </th>
              <th className="text-foreground px-4 py-3 text-sm font-semibold">
                Date
              </th>
              <th className="text-foreground px-4 py-3 text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <TableSkeleton column={6}  rows={4} />
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-muted-foreground px-4 py-10 text-center text-sm"
                >
                  No contact messages found.
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr
                  key={message.id}
                  className={cn(
                    'border-border hover:bg-muted/20 border-t align-top transition',
                    message.status === 'new' && 'bg-primary/5',
                  )}
                >
                  <td className="px-4 py-4">
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
                  </td>

                  <td className="text-foreground px-4 py-4 text-sm font-medium">
                    {message.subject}
                  </td>

                  <td className="text-muted-foreground px-4 py-4 text-sm">
                    {truncate(message.message)}
                  </td>

                  <td className="px-4 py-4">
                    <StatusPill status={message.status} />
                  </td>

                  <td className="text-muted-foreground px-4 py-4 text-sm">
                    {formatDate(message.created_at)}
                  </td>

                  <td className="px-4 py-4">
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
                          className="hover:bg-muted inline-flex rounded-md p-1.5 transition"
                          title="Archive message"
                        >
                          <Archive className="text-muted-foreground hover:text-destructive h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
