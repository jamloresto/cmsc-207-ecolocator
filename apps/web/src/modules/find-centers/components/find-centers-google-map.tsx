'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  APIProvider,
  AdvancedMarker,
  ColorScheme,
  Map,
  MapCameraChangedEvent,
} from '@vis.gl/react-google-maps';

import { GOOGLE_MAPS_API_KEY } from '@/lib/api';
import type { MapBounds, MapFindCenterLocation } from '@/modules/find-centers';
import { Loader } from '@/components/common/loading/loader';
import { ErrorState } from '@/components/common/states/error-state';

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
  gestureHandling: 'greedy' as const,
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
  const [hasResolvedLocation, setHasResolvedLocation] = useState(false);
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setHasResolvedLocation(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setCenter(coords);
        setUserCoords(coords);
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

      console.log('map bounds params', {
        bounds,
        latitude: userCoords?.lat,
        longitude: userCoords?.lng,
      });

      debounceTimerRef.current = setTimeout(() => {
        onBoundsChange({
          north: bounds.north,
          south: bounds.south,
          east: bounds.east,
          west: bounds.west,
          ...(userCoords
            ? {
                latitude: userCoords.lat,
                longitude: userCoords.lng,
              }
            : {}),
        });
      }, BOUNDS_DEBOUNCE_MS);
    },
    [onBoundsChange, userCoords],
  );

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <ErrorState
        title="Google Maps API key missing"
        description="Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables."
      />
    );
  }

  if (!hasResolvedLocation) {
    return (
      <div className="border-border flex h-full w-full justify-center items-center rounded-2xl border">
        <Loader text="Getting coordinates..." />
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
          }}
          center={center}
          defaultZoom={DEFAULT_ZOOM}
          onCameraChanged={handleCameraChanged}
          mapId="find-centers-map"
          options={options}
          colorScheme={isDark ? ColorScheme.DARK : ColorScheme.LIGHT}
        >
          {locations.map((location) => {
            const isActive = activeLocationId === location.id;

            return (
              <AdvancedMarker
                key={location.id}
                position={{
                  lat: location.latitude,
                  lng: location.longitude,
                }}
                onClick={() => onLocationSelect(location.id)}
              >
                {isDark ? (
                  <img
                    src={isActive ? './svg/dark-pin.svg' : './svg/dark-pin.svg'}
                    alt={location.name}
                  />
                ) : (
                  <img
                    src={
                      isActive ? './svg/light-pin.svg' : './svg/light-pin.svg'
                    }
                    alt={location.name}
                  />
                )}
              </AdvancedMarker>
            );
          })}
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
