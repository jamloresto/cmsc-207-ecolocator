import Link from 'next/link';
import { Archive, Eye, Mail, MailOpen } from 'lucide-react';

import { StatusPill } from '@/components/ui/status-pill';

import { cn } from '@/lib/utils';
import type { ContactMessage } from '@/modules/admin-contact-messages';

interface AdminContactMessagesTableProps {
  messages: ContactMessage[];
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

function truncate(text: string, max = 80) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

export function AdminContactMessagesTable({
  messages,
}: AdminContactMessagesTableProps) {
  return (
    <div className="border-border bg-card overflow-hidden rounded-2xl border">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-muted/60">
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
            {messages.length === 0 ? (
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
                    'border-border hover:bg-muted/30 border-t align-top transition',
                    message.status === 'new' && 'bg-primary/5',
                  )}
                >
                  <td className="px-4 py-4">
                    <div className="max-w-32 space-y-1">
                      <p className="text-foreground truncate text-sm font-semibold">
                        {message.name}
                      </p>
                      <p className="text-muted-foreground w-full truncate text-sm">
                        {message.email}
                      </p>
                      {message.contact_info ? (
                        <p className="text-muted-foreground text-xs">
                          {message.contact_info}
                        </p>
                      ) : null}
                    </div>
                  </td>

                  <td className="text-foreground px-4 py-4 text-sm">
                    <span className="font-medium">{message.subject}</span>
                  </td>

                  <td className="text-muted-foreground px-4 py-4 text-sm">
                    {truncate(message.message, 90)}
                  </td>

                  <td className="px-4 py-4">
                    <StatusPill status={message.status} />
                  </td>

                  <td className="text-muted-foreground px-4 py-4 text-sm whitespace-nowrap">
                    {formatDate(message.created_at)}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {/* View */}
                      <button title="View message">
                        <Eye className="text-muted-foreground hover:text-foreground h-4 w-4" />
                      </button>

                      {/* Reply */}
                      {message.status !== 'replied' &&
                        message.status !== 'archived' && (
                          <button title="Reply to message">
                            <Mail className="text-muted-foreground hover:text-primary h-4 w-4" />
                          </button>
                        )}

                      {/* Mark as Read */}
                      {message.status === 'new' && (
                        <button title="Mark as read">
                          <MailOpen className="text-muted-foreground hover:text-warning h-4 w-4" />
                        </button>
                      )}

                      {/* Archive */}
                      {message.status !== 'archived' && (
                        <button title="Archive message">
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
