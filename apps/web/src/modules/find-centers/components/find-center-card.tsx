import clsx from 'clsx';

import { Badge } from '@/components/ui/badge';

import type {
  MapFindCenterLocation,
  FindCenterMaterialType,
} from '@/modules/find-centers';
import { Route } from 'lucide-react';

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
        'bg-background border-border hover:border-primary/50 flex w-full rounded-2xl border p-4 text-left shadow-sm transition',
        isActive && 'border-primary ring-primary/15 ring-2',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-foreground line-clamp-1 text-sm font-semibold">
            {location.name}
          </p>
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <Route className="text-primary w-4" /> {location.distance} km
          </p>
          {location.material_types.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {location.material_types
                .slice(0, 3)
                .map((material: FindCenterMaterialType) => (
                  <Badge
                    key={material.slug}
                    className="text-tiny max-w-32 truncate"
                  >
                    {material.name}
                  </Badge>
                ))}

              {location.material_types.length > 3 && (
                <span className="text-muted-foreground text-xs">
                  +{location.material_types.length - 3} more
                </span>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </button>
  );
}
