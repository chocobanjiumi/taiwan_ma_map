'use client';

import { useState } from 'react';
import type { TreatmentCategory } from '@/types/clinic';
import type { FilterState } from '@/types/filters';
import PriceRangeSlider from '@/components/ui/PriceRangeSlider';

interface FilterPanelProps {
  categories: TreatmentCategory[];
  filters: FilterState;
  onToggleCategory: (slug: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onReset: () => void;
}

export default function FilterPanel({
  categories,
  filters,
  onToggleCategory,
  onPriceChange,
  onReset,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasActiveFilters = filters.categories.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 200000 || filters.city !== null;

  return (
    <div className="border-b border-gray-200 bg-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span className="flex items-center gap-2">
          篩選條件
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              已篩選
            </span>
          )}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Treatment categories */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              療程類型
            </h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = filters.categories.includes(cat.slug);
                return (
                  <button
                    key={cat.id}
                    onClick={() => onToggleCategory(cat.slug)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      isActive
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price range */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              價格區間
            </h4>
            <PriceRangeSlider value={filters.priceRange} onChange={onPriceChange} />
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-xs text-gray-500 hover:text-red-500 underline"
            >
              清除所有篩選
            </button>
          )}
        </div>
      )}
    </div>
  );
}
