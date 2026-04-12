'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  AdvancedMarker,
  ColorScheme,
  Map,
  MapCameraChangedEvent,
} from '@vis.gl/react-google-maps';

import type { MapBounds, MapFindCenterLocation } from '@/modules/find-centers';
import { Loader } from '@/components/common/loading/loader';

type FindCentersGoogleMapProps = {
  locations: MapFindCenterLocation[];
  activeLocationId: number | null;
  isLoading?: boolean;
  centerOverride?: {
    lat: number;
    lng: number;
  } | null;
  onLocationSelect: (locationId: number) => void;
  onBoundsChange: (bounds: MapBounds) => void;
};

const DEFAULT_CENTER = {
  lat: 14.5995,
  lng: 120.9842,
};

const DEFAULT_ZOOM = 14;
const FOCUSED_ZOOM = 16;
const BOUNDS_DEBOUNCE_MS = 400;

export function FindCentersGoogleMap({
  locations,
  activeLocationId,
  isLoading = false,
  centerOverride = null,
  onLocationSelect,
  onBoundsChange,
}: FindCentersGoogleMapProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const searchParams = useSearchParams();
  const hasQueryOverride =
    !!searchParams.get('lat') && !!searchParams.get('lng');

  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
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

        setUserCoords(coords);

        setCenter((currentCenter) => {
          if (hasQueryOverride) return currentCenter;
          return coords;
        });

        setZoom((currentZoom) => {
          if (hasQueryOverride) return currentZoom;
          return DEFAULT_ZOOM;
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
  }, [hasQueryOverride]);

  useEffect(() => {
    if (!centerOverride) return;

    setCenter(centerOverride);
    setZoom(FOCUSED_ZOOM);
  }, [centerOverride?.lat, centerOverride?.lng]);

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

      if (typeof event.detail.zoom === 'number') {
        setZoom(event.detail.zoom);
      }

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

  if (!hasResolvedLocation) {
    return (
      <div className="border-border flex h-full w-full items-center justify-center rounded-2xl border">
        <Loader text="Getting coordinates..." />
      </div>
    );
  }

  return (
    <div
      data-lenis-prevent
      className="border-border relative h-full w-full overflow-hidden rounded-2xl border"
    >
      <Map
        style={{
          width: '100%',
          height: '100%',
        }}
        center={center}
        zoom={zoom}
        onCameraChanged={handleCameraChanged}
        mapId="find-centers-map"
        disableDefaultUI={true}
        gestureHandling="greedy"
        zoomControl={true}
        minZoom={10}
        maxZoom={20}
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
                  src={isActive ? './svg/light-pin.svg' : './svg/light-pin.svg'}
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
  );
}
