'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import ClinicMarker from './ClinicMarker';
import { TAIPEI_CENTER, DEFAULT_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '@/lib/constants';
import type { ClinicSummary } from '@/types/clinic';

// Fix Leaflet default icon paths (broken by bundlers)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapProps {
  clinics: ClinicSummary[];
  selectedClinicId?: string | null;
  onSelectClinic?: (clinic: ClinicSummary) => void;
  onBoundsChange?: (center: [number, number]) => void;
  center?: [number, number];
  zoom?: number;
}

function MapEvents({ onBoundsChange }: { onBoundsChange?: (center: [number, number]) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!onBoundsChange) return;
    const handler = () => {
      const center = map.getCenter();
      onBoundsChange([center.lat, center.lng]);
    };
    map.on('moveend', handler);
    return () => {
      map.off('moveend', handler);
    };
  }, [map, onBoundsChange]);

  return null;
}

function FlyToCenter({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (center) {
      map.flyTo(center, zoom || DEFAULT_ZOOM, { duration: 0.8 });
    }
  }, [center, zoom, map]);

  return null;
}

function FlyToClinic({ clinicId, clinics }: { clinicId?: string | null; clinics: ClinicSummary[] }) {
  const map = useMap();

  useEffect(() => {
    if (!clinicId) return;
    const clinic = clinics.find((c) => c.id === clinicId);
    if (clinic) {
      map.flyTo([clinic.lat, clinic.lng], 16, { duration: 0.5 });
    }
  }, [clinicId, clinics, map]);

  return null;
}

export default function Map({ clinics, selectedClinicId, onSelectClinic, onBoundsChange, center, zoom }: MapProps) {
  return (
    <MapContainer
      center={center || TAIPEI_CENTER}
      zoom={zoom || DEFAULT_ZOOM}
      className="h-full w-full z-0"
      scrollWheelZoom={true}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <MapEvents onBoundsChange={onBoundsChange} />
      <FlyToCenter center={center} zoom={zoom} />
      <FlyToClinic clinicId={selectedClinicId} clinics={clinics} />
      {clinics.map((clinic) => (
        <ClinicMarker
          key={clinic.id}
          clinic={clinic}
          isSelected={clinic.id === selectedClinicId}
          onSelect={onSelectClinic}
        />
      ))}
    </MapContainer>
  );
}
