'use client';

import {
  APIProvider,
  Map,
  Marker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GOOGLE_MAPS_API_KEY } from '@/lib/api';

type LocationPickerMapProps = {
  latitude?: string | number;
  longitude?: string | number;
  onChange: (coords: { latitude: string; longitude: string }) => void;
  disabled?: boolean;
};

const DEFAULT_CENTER = {
  lat: 14.5995,
  lng: 120.9842,
};

const DEFAULT_ZOOM = 12;

function SearchBox({
  onPlaceSelect,
  disabled = false,
}: {
  onPlaceSelect: (coords: { lat: number; lng: number }) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const map = useMap();
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !map || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['geometry', 'formatted_address', 'name'],
    });

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;

      if (!location) return;

      const lat = location.lat();
      const lng = location.lng();

      map.panTo({ lat, lng });
      map.setZoom(16);

      onPlaceSelect({ lat, lng });
    });

    return () => {
      if (listener) listener.remove();
    };
  }, [places, map, onPlaceSelect]);

  return (
    <div className="bg-background/95 border-border absolute top-3 left-3 z-10 w-[calc(100%-1.5rem)] rounded-xl border p-2 shadow-sm md:w-96">
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          ref={inputRef}
          placeholder="Search location"
          className="pl-9"
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export function LocationPickerMap({
  latitude,
  longitude,
  onChange,
  disabled = false,
}: LocationPickerMapProps) {
  const parsedLat =
    latitude !== '' && latitude !== undefined ? Number(latitude) : null;
  const parsedLng =
    longitude !== '' && longitude !== undefined ? Number(longitude) : null;

  const committedPosition = useMemo(() => {
    if (
      parsedLat !== null &&
      parsedLng !== null &&
      !Number.isNaN(parsedLat) &&
      !Number.isNaN(parsedLng)
    ) {
      return { lat: parsedLat, lng: parsedLng };
    }

    return null;
  }, [parsedLat, parsedLng]);

  const initialCenter = committedPosition ?? DEFAULT_CENTER;

  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(committedPosition);

  useEffect(() => {
    setSelectedPosition(committedPosition);
  }, [committedPosition]);

  function setTemporaryCoords(lat: number, lng: number) {
    setSelectedPosition({ lat, lng });
  }

  function commitSelectedPoint() {
    if (!selectedPosition) return;

    onChange({
      latitude: String(selectedPosition.lat),
      longitude: String(selectedPosition.lng),
    });
  }

  const hasPendingSelection =
    selectedPosition?.lat !== committedPosition?.lat ||
    selectedPosition?.lng !== committedPosition?.lng;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Pin location on map</p>
          <p className="text-muted-foreground text-xs">
            Search, click, or drag the marker. Save only when you click Use
            selected point.
          </p>
        </div>

        {selectedPosition ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={commitSelectedPoint}
            disabled={disabled || !hasPendingSelection}
          >
            Use selected point
          </Button>
        ) : null}
      </div>

      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
        <div className="border-border relative overflow-hidden rounded-2xl border">
          <SearchBox
            disabled={disabled}
            onPlaceSelect={({ lat, lng }) => setTemporaryCoords(lat, lng)}
          />

          <Map
            style={{ width: '100%', height: '420px' }}
            defaultCenter={initialCenter}
            defaultZoom={DEFAULT_ZOOM}
            gestureHandling="greedy"
            disableDefaultUI={false}
            onClick={(event) => {
              const latLng = event.detail.latLng;
              if (!latLng) return;

              setTemporaryCoords(latLng.lat, latLng.lng);
            }}
          >
            {selectedPosition ? (
              <Marker
                position={selectedPosition}
                draggable={!disabled}
                onDragEnd={(event) => {
                  const latLng = event.latLng;
                  if (!latLng) return;

                  setTemporaryCoords(latLng.lat(), latLng.lng());
                }}
              />
            ) : committedPosition ? (
              <Marker position={committedPosition} draggable={false} />
            ) : null}
          </Map>
        </div>
      </APIProvider>

      <div className="grid gap-3 md:grid-cols-2">
        <Input label="Latitude" value={latitude ?? ''} readOnly />
        <Input label="Longitude" value={longitude ?? ''} readOnly />
      </div>
    </div>
  );
}
