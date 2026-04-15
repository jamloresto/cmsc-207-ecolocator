'use client';

import { SubmitEvent, useState } from 'react';

import { Textarea } from '@/components/ui/textarea';

import { replyToAdminContactMessage } from '@/modules/admin-contact-messages';
import type { ContactMessage } from '@/modules/admin-contact-messages';

interface ContactMessageReplyFormProps {
  messageId: number;
  onReplied?: (message: ContactMessage) => void;
}

export function ContactMessageReplyForm({
  messageId,
  onReplied,
}: ContactMessageReplyFormProps) {
  const [replyMessage, setReplyMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldError, setFieldError] = useState(''); // ✅ NEW

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage('');
    setErrorMessage('');
    setFieldError('');

    if (!replyMessage.trim()) {
      setFieldError('Reply message is required.');
      return;
    }

    try {
      setSubmitting(true);

      const response = await replyToAdminContactMessage(messageId, {
        reply_message: replyMessage.trim(),
      });

      setSuccessMessage(response.message || 'Reply sent successfully.');
      setReplyMessage('');

      if (response.data && onReplied) {
        onReplied(response.data);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to send reply.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="border-border bg-card rounded-2xl border p-6">
      <h2 className="text-foreground text-lg font-semibold">Reply</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Send a response to this inquiry.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <Textarea
            value={replyMessage}
            onChange={(event) => {
              setReplyMessage(event.target.value);
              setFieldError('');
              setErrorMessage('');
            }}
            placeholder="Write your reply here..."
            rows={8}
            error={fieldError}
          />

          {fieldError && (
            <p className="text-destructive mt-2 text-sm">{fieldError}</p>
          )}
        </div>

        {successMessage ? (
          <div className="border-success/20 bg-success/5 text-success rounded-xl border p-3 text-sm">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-xl border p-3 text-sm">
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting || !replyMessage.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Sending...' : 'Send Reply'}
        </button>
      </form>
    </section>
  );
}
