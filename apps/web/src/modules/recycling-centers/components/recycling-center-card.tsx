import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecyclingCenter } from '@/modules/recycling-centers';

type RecyclingCenterCardProps = {
  center: RecyclingCenter;
};

function buildLocationLabel(center: RecyclingCenter) {
  const parts = [
    center.street_address,
    center.city_municipality,
    center.state_province,
    center.country_name,
  ].filter(Boolean);

  return parts.join(', ');
}

export function RecyclingCenterCard({ center }: RecyclingCenterCardProps) {
  const locationAddress = buildLocationLabel(center);

  return (
    <Card className="gap-4">
      <CardHeader className="gap-2">
        <CardTitle>{center.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {center.material_types.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {center.material_types.map((material) => (
              <span
                key={material.slug}
                className="bg-primary/10 text-primary inline-flex rounded-full px-3 py-1 text-xs font-medium"
              >
                {material.name}
              </span>
            ))}
          </div>
        ) : null}

        {locationAddress ? (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{locationAddress}</span>
          </div>
        ) : null}

        <div className="space-y-2">
          {center.contact_number ? (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 shrink-0" />
              <span>{center.contact_number}</span>
            </div>
          ) : null}

          {center.email ? (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="break-all">{center.email}</span>
            </div>
          ) : null}

          {center.operating_hours ? (
            <div className="text-muted-foreground flex items-start gap-2 text-sm">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{center.operating_hours}</span>
            </div>
          ) : null}
        </div>
      </CardContent>

      <CardFooter>
        <Link
          href={`/find-centers?location_id=${center.id}&lat=${center.latitude}&lng=${center.longitude}`}
        >
          <Button variant="outline" size="sm">
            View at Map
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
