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

type LocationAddressFields = {
  country_code?: string;
  country_name?: string;
  state_province?: string;
  state_code?: string;
  city_municipality?: string;
  region?: string;
  street_address?: string;
  postal_code?: string;
};

type LocationPickerChange = {
  latitude: string;
  longitude: string;
} & LocationAddressFields;

type LocationPickerMapProps = {
  latitude?: string | number;
  longitude?: string | number;
  onChange: (values: LocationPickerChange) => void;
  disabled?: boolean;
};

const DEFAULT_CENTER = {
  lat: 14.5995,
  lng: 120.9842,
};

const DEFAULT_ZOOM = 12;

type SelectedPoint = {
  lat: number;
  lng: number;
};

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

function extractAddressFields(
  result: google.maps.GeocoderResult,
): LocationAddressFields {
  const components = result.address_components ?? [];

  const getLongName = (...types: string[]) =>
    components.find((component) =>
      types.every((type) => component.types.includes(type)),
    )?.long_name ?? '';

  const getShortName = (...types: string[]) =>
    components.find((component) =>
      types.every((type) => component.types.includes(type)),
    )?.short_name ?? '';

  const plusCode = getLongName('plus_code');
  const establishment = getLongName('establishment');
  const streetNumber = getLongName('street_number');
  const route = getLongName('route');
  const barangay =
    getLongName('sublocality_level_1') ||
    getLongName('sublocality') ||
    getLongName('neighborhood');
  const city =
    getLongName('locality') ||
    getLongName('administrative_area_level_2');
  const province =
    getLongName('administrative_area_level_2') ||
    getLongName('administrative_area_level_1');
  const region =
    getLongName('administrative_area_level_1') ||
    getLongName('administrative_area_level_2');
  const countryName = getLongName('country');
  const countryCode = getShortName('country');
  const stateCode = getShortName('administrative_area_level_2');
  const postalCode = getShortName('postal_code');

  const streetAddress = [
    plusCode || establishment || streetNumber,
    route || barangay,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return {
    country_code: countryCode,
    country_name: countryName,
    state_province: province,
    state_code: stateCode,
    city_municipality: city,
    region,
    street_address: streetAddress,
    postal_code: postalCode,
  };
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

  const [selectedPosition, setSelectedPosition] = useState<SelectedPoint | null>(
    committedPosition,
  );
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);

  useEffect(() => {
    setSelectedPosition(committedPosition);
  }, [committedPosition]);

  function setTemporaryCoords(lat: number, lng: number) {
    setSelectedPosition({ lat, lng });
  }

  async function commitSelectedPoint() {
    if (!selectedPosition || !window.google?.maps) return;

    setIsResolvingAddress(true);

    try {
      const geocoder = new window.google.maps.Geocoder();

      const response = await geocoder.geocode({
        location: selectedPosition,
      });

      const firstResult = response.results?.[0];
      const addressFields = firstResult
        ? extractAddressFields(firstResult)
        : {};

      onChange({
        latitude: String(selectedPosition.lat),
        longitude: String(selectedPosition.lng),
        ...addressFields,
      });
    } catch {
      onChange({
        latitude: String(selectedPosition.lat),
        longitude: String(selectedPosition.lng),
      });
    } finally {
      setIsResolvingAddress(false);
    }
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
            Search, click, or drag the marker.
          </p>
          <p className="text-muted-foreground text-xs">
            Save only when you click &quot;Use selected point.&quot;
          </p>
        </div>

        {selectedPosition ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={commitSelectedPoint}
            disabled={disabled || !hasPendingSelection || isResolvingAddress}
          >
            <span className="whitespace-nowrap">
              {isResolvingAddress ? 'Filling address...' : 'Use selected point'}
            </span>
          </Button>
        ) : null}
      </div>

      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
        <div
          data-lenis-prevent
          className="border-border relative overflow-hidden rounded-2xl border"
        >
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