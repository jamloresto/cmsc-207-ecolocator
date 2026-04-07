'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
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
import { Loader } from '@/components/common/loading/loader';

type FindCentersGoogleMapProps = {
  locations: MapFindCenterLocation[];
  activeLocationId: number | null;
  isLoading?: boolean;
  onLocationSelect: (locationId: number) => void;
  onBoundsChange: (bounds: MapBounds) => void;
};

const DEFAULT_CENTER = {
  lat: 14.5995,
  lng: 120.9842,
};

const DEFAULT_ZOOM = 15;
const BOUNDS_DEBOUNCE_MS = 400;

const options = {
  disableDefaultUI: true,
  gestureHandling: 'greedy',
  zoomControl: true,
  zoomControlOptions: {},
  minZoom: 13,
  maxZoom: 20,
};

export function FindCentersGoogleMap({
  locations,
  activeLocationId,
  isLoading = false,
  onLocationSelect,
  onBoundsChange,
}: FindCentersGoogleMapProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [, setHasResolvedLocation] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleCameraChanged = useCallback(
    (event: MapCameraChangedEvent) => {
      const nextCenter = event.detail.center;
      setCenter(nextCenter);

      const bounds = event.detail.bounds;
      if (!bounds) return;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        onBoundsChange({
          north: bounds.north,
          south: bounds.south,
          east: bounds.east,
          west: bounds.west,
        });
      }, BOUNDS_DEBOUNCE_MS);
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
      <div className="border-border max-h-80vh relative h-full w-full overflow-hidden rounded-2xl border">
        <Map
          style={{
            width: '100%',
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
                background={
                  activeLocationId === location.id
                    ? '#eab308'
                    : isDark
                      ? '#facc15'
                      : '#16a34a'
                }
                glyphColor={isDark ? '#163328' : '#0f172a'}
                borderColor={isDark ? '#163328' : '#0f172a'}
              />
            </AdvancedMarker>
          ))}
        </Map>

        {isLoading ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <Loader text="Loading locations..." />
          </div>
        ) : null}
      </div>
    </APIProvider>
  );
}
