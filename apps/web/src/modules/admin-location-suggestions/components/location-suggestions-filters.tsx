'use client';

import { Input } from '@/components/ui/input';
import { SelectCustom } from '@/components/ui/select-custom';

type Option = {
  label: string;
  value: string;
};

type LocationSuggestionsFiltersProps = {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

const statusOptions: Option[] = [
  { label: 'All statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Archived', value: 'archived' },
];

export function LocationSuggestionsFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: LocationSuggestionsFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_220px]">
      <Input
        value={search}
        placeholder="Search by submitter, email, location, or address"
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <SelectCustom
        value={status}
        options={statusOptions}
        placeholder="Filter by status"
        onChange={onStatusChange}
      />
    </div>
  );
}
