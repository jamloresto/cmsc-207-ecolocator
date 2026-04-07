import { Clock3, Mail, MapPin, Phone } from 'lucide-react';
import clsx from 'clsx';
import type { FindCenterLocation } from '@/modules/find-centers';

type FindCenterCardProps = {
  location: FindCenterLocation;
  isActive?: boolean;
  onClick?: () => void;
};

export function FindCenterCard({
  location,
  isActive = false,
  onClick,
}: FindCenterCardProps) {
  const subtitle = [
    location.city_municipality,
    location.state_province,
    location.country_name,
  ]
    .filter(Boolean)
    .join(', ');

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
          <p className="text-muted-foreground mt-1 text-xs">
            {subtitle || 'Location details unavailable'}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {location.street_address ? (
          <div className="text-muted-foreground flex items-start gap-2 text-xs">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{location.street_address}</span>
          </div>
        ) : null}

        {location.operating_hours ? (
          <div className="text-muted-foreground flex items-start gap-2 text-xs">
            <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{location.operating_hours}</span>
          </div>
        ) : null}

        {location.contact_number ? (
          <div className="text-muted-foreground flex items-start gap-2 text-xs">
            <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{location.contact_number}</span>
          </div>
        ) : null}

        {location.email ? (
          <div className="text-muted-foreground flex items-start gap-2 text-xs">
            <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{location.email}</span>
          </div>
        ) : null}
      </div>

      {location.material_types.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {location.material_types.map((material) => (
            <span
              key={material.id}
              className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-[11px] font-medium"
            >
              {material.name}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
}
