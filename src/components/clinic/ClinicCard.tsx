'use client';

import Link from 'next/link';
import type { ClinicSummary } from '@/types/clinic';
import { formatPrice } from '@/lib/utils';

interface ClinicCardProps {
  clinic: ClinicSummary;
  isSelected?: boolean;
  onSelect?: (clinic: ClinicSummary) => void;
}

export default function ClinicCard({ clinic, isSelected, onSelect }: ClinicCardProps) {
  return (
    <div
      onClick={() => onSelect?.(clinic)}
      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-blue-50 ${
        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-sm text-gray-900 leading-tight">{clinic.name}</h3>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <span className="text-yellow-500 text-sm">★</span>
          <span className="text-sm font-medium text-gray-700">{clinic.rating}</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-2">
        {clinic.district} · {clinic.city}
        <span className="text-gray-300 mx-1">|</span>
        {clinic.review_count} 則評論
      </p>

      {/* Category tags */}
      <div className="flex flex-wrap gap-1 mb-2">
        {clinic.categories.slice(0, 4).map((cat) => (
          <span
            key={cat}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
          >
            {cat}
          </span>
        ))}
        {clinic.categories.length > 4 && (
          <span className="text-xs text-gray-400">+{clinic.categories.length - 4}</span>
        )}
      </div>

      {/* Price and link */}
      <div className="flex items-center justify-between">
        {clinic.min_treatment_price ? (
          <span className="text-sm font-medium text-emerald-600">
            從 {formatPrice(clinic.min_treatment_price)} 起
          </span>
        ) : (
          <span className="text-sm text-gray-400">價格洽詢</span>
        )}
        <Link
          href={`/clinic/${clinic.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-blue-600 hover:underline"
        >
          詳情
        </Link>
      </div>
    </div>
  );
}
