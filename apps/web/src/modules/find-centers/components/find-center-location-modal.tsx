'use client';

import { Mail, MapPin, Phone } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import type { FindCenterLocationDetail } from '@/modules/find-centers';

type FindCenterLocationModalProps = {
  open: boolean;
  onClose: () => void;
  location: FindCenterLocationDetail | null;
  isLoading?: boolean;
};

function buildAddress(location: FindCenterLocationDetail) {
  return [
    location.street_address,
    location.city_municipality,
    location.state_province,
    location.postal_code,
    location.country_name,
  ]
    .filter(Boolean)
    .join(', ');
}

export function FindCenterLocationModal({
  open,
  onClose,
  location,
  isLoading = false,
}: FindCenterLocationModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={location?.name ?? 'Location details'}
      description={
        location
          ? [location.city_municipality, location.state_province]
              .filter(Boolean)
              .join(', ')
          : 'View recycling center details.'
      }
      className="max-w-2xl"
    >
      {isLoading ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground text-sm">Loading details...</p>
        </div>
      ) : !location ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground text-sm">
            Location details not found.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {location.material_types.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {location.material_types.map((material) => (
                <Badge key={material.slug}>{material.name}</Badge>
              ))}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-muted/40 rounded-xl p-4">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Address
              </p>
              <div className="mt-2 flex items-start gap-2">
                <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-foreground text-sm leading-6">
                  {buildAddress(location) || '—'}
                </p>
              </div>
            </div>

            <div className="bg-muted/40 rounded-xl p-4">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Contact Number
              </p>
              <div className="mt-2 flex items-start gap-2">
                <Phone className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-foreground text-sm leading-6">
                  {location.contact_number || '—'}
                </p>
              </div>
            </div>

            <div className="bg-muted/40 rounded-xl p-4">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Email
              </p>
              <div className="mt-2 flex items-start gap-2">
                <Mail className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-foreground text-sm leading-6 break-all">
                  {location.email || '—'}
                </p>
              </div>
            </div>

            <div className="bg-muted/40 rounded-xl p-4">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Operating Hours
              </p>
              <p className="text-foreground mt-2 text-sm leading-6">
                {location.operating_hours || '—'}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
