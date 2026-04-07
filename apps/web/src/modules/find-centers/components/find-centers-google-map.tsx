'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  APIProvider,
  AdvancedMarker,
  ColorScheme,
  Map,
  MapCameraChangedEvent,
  Pin,
} from '@vis.gl/react-google-maps';

import { GOOGLE_MAPS_API_KEY } from '@/lib/api';
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

const DEFAULT_ZOOM = 15;

const options = {
  disableDefaultUI: true,
  gestureHandling: 'greedy',
  zoomControl: true,
  zoomControlOptions: {},
  minZoom: 13,
  maxZoom: 20,
  styles: [
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

export function FindCentersGoogleMap({
  locations,
  activeLocationId,
  onLocationSelect,
  onBoundsChange,
}: FindCentersGoogleMapProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [hasResolvedLocation, setHasResolvedLocation] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setHasResolvedLocation(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setHasResolvedLocation(true);
      },
      () => {
        setHasResolvedLocation(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, []);

  const handleCameraChanged = useCallback(
    (event: MapCameraChangedEvent) => {
      const nextCenter = event.detail.center;
      setCenter(nextCenter);

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

  if (!GOOGLE_MAPS_API_KEY) {
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
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="border-border max-h-80vh h-full w-full overflow-hidden rounded-2xl border">
        <Map
          style={{
            width: `100%`,
            height: '100%',
            minHeight: '55vh',
            minWidth: '70vw',
          }}
          center={center}
          defaultZoom={DEFAULT_ZOOM}
          onCameraChanged={handleCameraChanged}
          mapId="find-centers-map"
          options={options}
          colorScheme={isDark ? ColorScheme.DARK : ColorScheme.LIGHT}
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
              <Pin
                background={isDark ? '#facc15' : '#16a34a'}
                glyphColor={isDark ? '#163328' : '#0f172a'}
                borderColor={isDark ? '#163328' : '#0f172a'}
              />
            </AdvancedMarker>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}
