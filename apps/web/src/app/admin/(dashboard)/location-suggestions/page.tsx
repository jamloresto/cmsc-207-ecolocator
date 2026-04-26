'use client';

import { useState } from 'react';

import { TableSkeleton } from '@/components/common/loading/table-skeleton';
import { ErrorState } from '@/components/common/states/error-state';
import { AdminHeading } from '@/components/shared/admin-heading';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

import { useToast } from '@/hooks/use-toast';
import {
  LocationSuggestionsFilters,
  LocationSuggestionsTable,
  useAdminLocationSuggestions,
  useRejectLocationSuggestion,
  type AdminLocationSuggestionStatus,
  type AdminLocationSuggestionsListParams,
} from '@/modules/admin-location-suggestions';

const PER_PAGE = 10;

export default function AdminLocationSuggestionsPage() {
  const { toast } = useToast();

  const [params, setParams] = useState<AdminLocationSuggestionsListParams>({
    page: 1,
    per_page: PER_PAGE,
    search: '',
    status: 'all',
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const [suggestionToReject, setSuggestionToReject] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { data: suggestions, isLoading } = useAdminLocationSuggestions(params);
  const rejectMutation = useRejectLocationSuggestion();

  function handleSearchChange(value: string) {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search: value,
    }));
  }

  function handleStatusChange(value: string) {
    setParams((prev) => ({
      ...prev,
      page: 1,
      status: value as AdminLocationSuggestionsListParams['status'],
    }));
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
        search={params.search ?? ''}
        status={params.status ?? 'all'}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
      />

      {isLoading ? (
        <TableSkeleton />
      ) : suggestions ? (
        <LocationSuggestionsTable
          suggestions={suggestions}
          params={params}
          setParams={setParams}
          onReject={(id) => {
            const selected = suggestions.data.data.find((item) => item.id === id);
            if (!selected) return;

            handleReject(id, selected.location_name);
          }}
          onPageChange={(page) =>
            setParams((prev) => ({
              ...prev,
              page,
            }))
          }
          isRejecting={rejectMutation.isPending}
        />
      ) : (
        <ErrorState title="Failed to load location suggestions." />
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
