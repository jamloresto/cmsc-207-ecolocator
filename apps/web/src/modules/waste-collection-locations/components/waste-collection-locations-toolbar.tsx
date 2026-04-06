'use client';

import { SelectCustom } from '@/components/ui/select-custom';
import { TableToolbar } from '@/components/shared/table-toolbar';

import type { MaterialType } from '@/modules/material-types';

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  materialTypeSlug: string;
  onMaterialTypeChange: (value: string) => void;
  materialTypes: MaterialType[];
};

export function WasteCollectionLocationsToolbar({
  searchValue,
  onSearchChange,
  materialTypeSlug,
  onMaterialTypeChange,
  materialTypes,
}: Props) {
  return (
    <TableToolbar
      searchValue={searchValue}
      searchPlaceholder="Search recycling centers..."
      onSearchChange={onSearchChange}
      filters={
          <SelectCustom
            value={materialTypeSlug}
            placeholder="Filter by material type"
            onChange={onMaterialTypeChange}
            options={[
              { label: 'All material types', value: '' },
              ...materialTypes.map((item) => ({
                label: item.name,
                value: item.slug,
              })),
            ]}
          />
      }
    />
  );
}
