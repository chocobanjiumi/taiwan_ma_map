'use client';

import { Marker, Popup } from 'react-leaflet';
import Link from 'next/link';
import type { ClinicSummary } from '@/types/clinic';
import { formatPrice } from '@/lib/utils';

interface ClinicMarkerProps {
  clinic: ClinicSummary;
  isSelected?: boolean;
  onSelect?: (clinic: ClinicSummary) => void;
}

export default function ClinicMarker({ clinic, onSelect }: ClinicMarkerProps) {
  return (
    <Marker
      position={[clinic.lat, clinic.lng]}
      eventHandlers={{
        click: () => onSelect?.(clinic),
      }}
    >
      <Popup>
        <div className="min-w-[200px]">
          <h3 className="font-bold text-base mb-1">{clinic.name}</h3>
          <p className="text-sm text-gray-600 mb-1">{clinic.district} · {clinic.city}</p>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm font-medium">{clinic.rating}</span>
            <span className="text-xs text-gray-400">({clinic.review_count}則)</span>
          </div>
          {clinic.min_treatment_price && (
            <p className="text-sm text-emerald-600 font-medium mb-2">
              從 {formatPrice(clinic.min_treatment_price)} 起
            </p>
          )}
          <div className="flex flex-wrap gap-1 mb-2">
            {clinic.categories.slice(0, 3).map((cat) => (
              <span key={cat} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                {cat}
              </span>
            ))}
          </div>
          <Link
            href={`/clinic/${clinic.id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            查看詳情 →
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
