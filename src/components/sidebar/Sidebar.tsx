'use client';

import { Suspense } from 'react';
import type { ClinicSummary, TreatmentCategory } from '@/types/clinic';
import type { FilterState } from '@/types/filters';
import CitySelector from './CitySelector';
import FilterPanel from './FilterPanel';
import ClinicList from './ClinicList';

interface SidebarProps {
  clinics: ClinicSummary[];
  categories: TreatmentCategory[];
  filters: FilterState;
  loading?: boolean;
  selectedClinicId?: string | null;
  onSelectClinic?: (clinic: ClinicSummary) => void;
  onToggleCategory: (slug: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onCityChange: (city: string | null) => void;
  onResetFilters: () => void;
}

export default function Sidebar({
  clinics,
  categories,
  filters,
  loading,
  selectedClinicId,
  onSelectClinic,
  onToggleCategory,
  onPriceChange,
  onCityChange,
  onResetFilters,
}: SidebarProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      <CitySelector
        selectedCity={filters.city}
        onCityChange={onCityChange}
      />
      <Suspense>
        <FilterPanel
          categories={categories}
          filters={filters}
          onToggleCategory={onToggleCategory}
          onPriceChange={onPriceChange}
          onReset={onResetFilters}
        />
      </Suspense>
      <ClinicList
        clinics={clinics}
        loading={loading}
        selectedClinicId={selectedClinicId}
        onSelectClinic={onSelectClinic}
      />
    </div>
  );
}
