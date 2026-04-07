'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import type { FindCenterMaterialType } from '@/modules/find-centers';

type FindCentersToolbarProps = {
  searchValue: string;
  selectedMaterialSlug: string;
  materials: FindCenterMaterialType[];
  onSearchChange: (value: string) => void;
  onMaterialChange: (value: string) => void;
};

export function FindCentersToolbar({
  searchValue,
  selectedMaterialSlug,
  materials,
  onSearchChange,
  onMaterialChange,
}: FindCentersToolbarProps) {
  return (
    <div className="bg-background border-border flex flex-col gap-3 rounded-2xl border p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="text-muted-foreground h-4 w-4" />
        <p className="text-foreground text-sm font-semibold">
          Find recycling centers
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search city, address, or center name"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary h-11 w-full rounded-xl border pr-4 pl-10 text-sm outline-none focus:ring-2"
          />
        </div>

        <div className="w-full md:max-w-xs">
          <select
            value={selectedMaterialSlug}
            onChange={(e) => onMaterialChange(e.target.value)}
            className="border-border bg-background text-foreground focus:ring-primary h-11 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2"
          >
            <option value="">All materials</option>
            {materials.map((material) => (
              <option key={material.slug} value={material.slug}>
                {material.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
