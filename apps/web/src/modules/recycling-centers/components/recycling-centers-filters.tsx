'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

import { ActiveMaterialType } from '@/modules/recycling-centers';

type RecyclingCentersFiltersProps = {
  materialTypes: ActiveMaterialType[];
  selectedMaterialSlugs: string[];
  onMaterialChange: (slugs: string[]) => void;
};

const INITIAL_VISIBLE = 5;

export function RecyclingCentersFilters({
  materialTypes,
  selectedMaterialSlugs,
  onMaterialChange,
}: RecyclingCentersFiltersProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleMaterials = expanded
    ? materialTypes
    : materialTypes.slice(0, INITIAL_VISIBLE);

  const hasMore = materialTypes.length > INITIAL_VISIBLE;

  const hasSelected = selectedMaterialSlugs.length > 0;

  function toggleMaterial(slug: string) {
    const isChecked = selectedMaterialSlugs.includes(slug);

    if (isChecked) {
      onMaterialChange(selectedMaterialSlugs.filter((item) => item !== slug));
      return;
    }

    onMaterialChange([...selectedMaterialSlugs, slug]);
  }

  function handleClearAll() {
    onMaterialChange([]);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          disabled={!hasSelected}
        >
          Clear all
        </Button>
      </div>

      {visibleMaterials.map((material) => (
        <Checkbox
          key={material.slug}
          checked={selectedMaterialSlugs.includes(material.slug)}
          onChange={() => toggleMaterial(material.slug)}
          label={material.name}
          description={material.description ?? undefined}
          nowrap
        />
      ))}

      {hasMore ? (
        <Button
          variant="ghost"
          size="sm"
          className="justify-start px-0"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? (
            <>
              Show less
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show more ({materialTypes.length - INITIAL_VISIBLE} more)
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      ) : null}
    </div>
  );
}
