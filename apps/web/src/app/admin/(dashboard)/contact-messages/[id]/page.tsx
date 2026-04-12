'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { StatusPill } from '@/components/ui/status-pill';

import {
  ContactMessageReplyForm,
  getAdminContactMessageById,
} from '@/modules/admin-contact-messages';
import type { ContactMessage } from '@/modules/admin-contact-messages';
import { Loader } from '@/components/common/loading/loader';
import { Button } from '@/components/ui/button';

function formatDateTime(dateString?: string | null) {
  if (!dateString) return '—';

  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString));
}

export default function AdminContactMessageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadMessage() {
      try {
        const response = await getAdminContactMessageById(id);
        const item = response.data;

        if (!cancelled) {
          setMessage(item);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMessage();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className='mt-24 justify-items-center items-center'>
        <Loader text="Loading message..." />
      </div>
    );
  }

  if (!message) {
    return (
      <main className="p-4 md:p-6">
        <div className="border-border bg-card rounded-2xl border p-6">
          <p className="text-muted-foreground text-sm">Message not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            Contact Message Details
          </h1>
          <p className="text-muted-foreground text-sm">
            Review and respond to this inquiry.
          </p>
        </div>

        <Button type="button" variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <section className="border-border bg-card rounded-2xl border p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-foreground text-lg font-semibold">
                {message.subject}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Submitted on {formatDateTime(message.created_at)}
              </p>
            </div>

            <StatusPill status={message.status} />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-foreground text-sm font-medium">Sender</p>
              <p className="text-muted-foreground text-sm">{message.name}</p>
            </div>

            <div>
              <p className="text-foreground text-sm font-medium">Email</p>
              <p className="text-muted-foreground text-sm">{message.email}</p>
            </div>

            <div>
              <p className="text-foreground text-sm font-medium">
                Contact Info
              </p>
              <p className="text-muted-foreground text-sm">
                {message.contact_info || '—'}
              </p>
            </div>

            <div>
              <p className="text-foreground text-sm font-medium">Message</p>
              <div className="bg-muted/40 text-foreground mt-2 rounded-xl p-4 text-sm leading-7">
                {message.message}
              </div>
            </div>
          </div>
        </section>

        <ContactMessageReplyForm
          messageId={message.id}
          onReplied={(updatedMessage) => setMessage(updatedMessage)}
        />
      </div>
    </main>
  );
}
