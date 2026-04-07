'use client';

import { useCallback } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  Map,
  MapCameraChangedEvent,
} from '@vis.gl/react-google-maps';

import type { MapBounds, MapFindCenterLocation } from '@/modules/find-centers';

type FindCentersGoogleMapProps = {
  locations: MapFindCenterLocation[];
  activeLocationId: number | null;
  onLocationSelect: (locationId: number) => void;
  onBoundsChange: (bounds: MapBounds) => void;
};

const DEFAULT_CENTER = {
  lat: 14.5995,
  lng: 120.9842,
};

const DEFAULT_ZOOM = 11;

export function FindCentersGoogleMap({
  locations,
  activeLocationId,
  onLocationSelect,
  onBoundsChange,
}: FindCentersGoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handleCameraChanged = useCallback(
    (event: MapCameraChangedEvent) => {
      const bounds = event.detail.bounds;

      if (!bounds) return;

      onBoundsChange({
        north: bounds.north,
        south: bounds.south,
        east: bounds.east,
        west: bounds.west,
      });
    },
    [onBoundsChange],
  );

  if (!apiKey) {
    return (
      <div className="bg-muted/40 border-border flex h-full min-h-80 items-center justify-center rounded-2xl border p-6 text-center">
        <div>
          <p className="text-foreground text-sm font-semibold">
            Google Maps API key missing
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="border-border h-full min-h-80 overflow-hidden rounded-2xl border">
        <Map
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={DEFAULT_ZOOM}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapId="find-centers-map"
          onCameraChanged={handleCameraChanged}
        >
          {locations.map((location) => (
            <AdvancedMarker
              key={location.id}
              position={{
                lat: location.latitude,
                lng: location.longitude,
              }}
              onClick={() => onLocationSelect(location.id)}
            >
              <div
                className={[
                  'bg-background rounded-full border px-3 py-1 text-xs font-semibold shadow-sm',
                  activeLocationId === location.id
                    ? 'border-primary text-primary'
                    : 'border-border text-foreground',
                ].join(' ')}
              >
                {location.name}
              </div>
            </AdvancedMarker>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}
