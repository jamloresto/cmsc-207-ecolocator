'use client';

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusPill } from '@/components/ui/status-pill';

import type { WasteCollectionLocation } from '@/modules/waste-collection-locations';

type Props = {
  data: WasteCollectionLocation[];
  onDelete: (location: { id: number; name: string }) => void;
};

export function WasteCollectionLocationsTable({ data, onDelete }: Props) {
  return (
    <div className="border-border bg-card overflow-hidden rounded-2xl border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Materials</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-muted-foreground px-4 py-10 text-center"
                >
                  No recycling centers found. Try adjusting your filters or
                  search.
                </td>
              </tr>
            ) : (
              data.map((location) => (
                <tr
                  key={location.id}
                  className="border-border border-t align-top"
                >
                  <td className="px-4 py-4">
                    <div className="font-medium">{location.name}</div>
                    {location.contact_number ? (
                      <div className="text-muted-foreground mt-1 text-xs">
                        {location.contact_number}
                      </div>
                    ) : null}
                    {location.email && location.email !== null ? (
                      <div className="text-muted-foreground text-xs">
                        {location.email}
                      </div>
                    ) : null}
                  </td>

                  <td className="px-4 py-4">
                    <div>{location.street_address}</div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {location.city_municipality}, {location.state_province},{' '}
                      {location.country_name}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {location.material_types?.length ? (
                        location.material_types.map((material) => (
                          <Badge key={material.id} variant="outline">
                            {material.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          No materials assigned
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <StatusPill
                      status={location.is_active ? 'active' : 'inactive'}
                    />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/recycling-centers/${location.id}/edit`}
                      >
                        <Button variant="outline" size="sm">
                          <Pencil className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          onDelete({ id: location.id, name: location.name })
                        }
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
