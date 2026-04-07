'use client';

import { useMemo, useState } from 'react';

import { TableSkeleton } from '@/components/common/loading/table-skeleton';
import { AdminHeading } from '@/components/shared/admin-heading';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

import { useToast } from '@/hooks/use-toast';
import {
  LocationSuggestionsFilters,
  LocationSuggestionsTable,
  useAdminLocationSuggestions,
  useApproveLocationSuggestion,
  useRejectLocationSuggestion,
} from '@/modules/admin-location-suggestions';

const PER_PAGE = 10;

export default function AdminLocationSuggestionsPage() {
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [suggestionToReject, setSuggestionToReject] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const params = useMemo(
    () => ({
      page,
      per_page: PER_PAGE,
      search,
      status,
      sort_by: 'created_at' as const,
      sort_order: 'desc' as const,
    }),
    [page, search, status],
  );

  const { data: suggestions, isLoading } = useAdminLocationSuggestions(params);

  console.log("suggestions: ", suggestions)

  const approveMutation = useApproveLocationSuggestion();
  const rejectMutation = useRejectLocationSuggestion();

  function handleSearchChange(value: string) {
    setPage(1);
    setSearch(value);
  }

  function handleStatusChange(value: string) {
    setPage(1);
    setStatus(value);
  }

  function handleApprove(id: number) {
    approveMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: 'Suggestion approved',
          description:
            'The location suggestion has been approved successfully.',
          variant: 'success',
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Approval failed',
          description:
            error?.response?.data?.message ||
            'Something went wrong while approving the suggestion.',
          variant: 'danger',
        });
      },
    });
  }

  function handleReject(id: number, name: string) {
    setSuggestionToReject({ id, name });
  }

  function confirmReject() {
    if (!suggestionToReject) return;

    const selected = suggestionToReject;
    setSuggestionToReject(null);

    rejectMutation.mutate(
      { id: selected.id },
      {
        onSuccess: () => {
          toast({
            title: 'Suggestion rejected',
            description: `${selected.name} has been rejected successfully.`,
            variant: 'success',
          });
        },
        onError: (error: any) => {
          toast({
            title: 'Rejection failed',
            description:
              error?.response?.data?.message ||
              'Something went wrong while rejecting the suggestion.',
            variant: 'danger',
          });
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeading
        title="Location Suggestions"
        description="Review, approve, and reject submitted location suggestions."
      />

      <LocationSuggestionsFilters
        search={search}
        status={status}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
      />

      {isLoading ? (
        <TableSkeleton />
      ) : suggestions ? (
        <LocationSuggestionsTable
          suggestions={suggestions}
          onApprove={handleApprove}
          onReject={(id) => {
            const selected = suggestions.data.find((item) => item.id === id);
            if (!selected) return;

            handleReject(id, selected.location_name);
          }}
          onPageChange={setPage}
          isApproving={approveMutation.isPending}
          isRejecting={rejectMutation.isPending}
        />
      ) : (
        <div className="border-border bg-card text-muted-foreground rounded-2xl border px-6 py-10 text-center">
          Failed to load location suggestions.
        </div>
      )}

      <ConfirmationDialog
        open={!!suggestionToReject}
        onClose={() => setSuggestionToReject(null)}
        onConfirm={confirmReject}
        title="Reject location suggestion?"
        description={
          suggestionToReject
            ? `This will mark "${suggestionToReject.name}" as rejected.`
            : ''
        }
        confirmLabel={rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
        cancelLabel="Cancel"
        variant="danger"
        loading={rejectMutation.isPending}
      />
    </div>
  );
}
