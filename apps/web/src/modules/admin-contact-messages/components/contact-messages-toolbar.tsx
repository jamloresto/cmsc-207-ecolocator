'use client';

import { Input } from '@/components/ui/input';
import { SelectCustom } from '@/components/ui/select-custom';
import { MailCheck, MailMinus, MailOpen, MailPlus, Mails } from 'lucide-react';
import type { ContactMessageStatus } from '../types/contact-message.types';

interface ContactMessagesToolbarProps {
  search: string;
  status: '' | ContactMessageStatus;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: '' | ContactMessageStatus) => void;
}

export function ContactMessagesToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: ContactMessagesToolbarProps) {
  return (
    <div className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-4">
      <div>
        <h2 className="text-foreground text-lg font-semibold">
          Contact Messages
        </h2>
        <p className="text-muted-foreground text-sm">
          Review submitted inquiries from the public.
        </p>
      </div>

      <div className="flex w-full flex-col gap-2 md:flex-row">
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search name, email, subject..."
        />

        <SelectCustom
          value={status}
          onChange={(value) =>
            onStatusChange(value as '' | ContactMessageStatus)
          }
          options={[
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
          ]}
        />
      </div>
    </div>
  );
}
