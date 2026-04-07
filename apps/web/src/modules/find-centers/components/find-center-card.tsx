import clsx from 'clsx';

import { Badge } from '@/components/ui/badge';

import type {
  MapFindCenterLocation,
  FindCenterMaterialType,
} from '@/modules/find-centers';

type FindCenterCardProps = {
  location: MapFindCenterLocation;
  isActive?: boolean;
  onClick?: () => void;
};

export function FindCenterCard({
  location,
  isActive = false,
  onClick,
}: FindCenterCardProps) {

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'bg-background border-border hover:border-primary/50 w-full rounded-2xl border p-4 text-left shadow-sm transition',
        isActive && 'border-primary ring-primary/15 ring-2',  
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-foreground text-sm font-semibold">
            {location.name}
          </h3>
        </div>
      </div>

      {location.material_types.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {location.material_types.map((material: FindCenterMaterialType) => (
            <Badge
              key={material.slug}
            >
              {material.name}
            </Badge>
          ))}
        </div>
      ) : null}
    </button>
  );
}
