'use client';

import { useState, Suspense, useCallback, useMemo } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import MapWrapper from '@/components/map/MapWrapper';
import { useFilters } from '@/hooks/useFilters';
import { useClinics } from '@/hooks/useClinics';
import { getCityByName } from '@/lib/cities';
import { TAIPEI_CENTER, DEFAULT_ZOOM } from '@/lib/constants';
import type { ClinicSummary, TreatmentCategory } from '@/types/clinic';

interface HomeContentProps {
  initialClinics: ClinicSummary[];
  categories: TreatmentCategory[];
}

export default function HomeContent({ initialClinics, categories }: HomeContentProps) {
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');

  return (
    <Suspense>
      <HomeContentInner
        initialClinics={initialClinics}
        categories={categories}
        selectedClinicId={selectedClinicId}
        setSelectedClinicId={setSelectedClinicId}
        mobileView={mobileView}
        setMobileView={setMobileView}
      />
    </Suspense>
  );
}

function HomeContentInner({
  initialClinics,
  categories,
  selectedClinicId,
  setSelectedClinicId,
  mobileView,
  setMobileView,
}: HomeContentProps & {
  selectedClinicId: string | null;
  setSelectedClinicId: (id: string | null) => void;
  mobileView: 'map' | 'list';
  setMobileView: (view: 'map' | 'list') => void;
}) {
  const { filters, toggleCategory, setPriceRange, setCity, resetFilters } = useFilters();
  const { clinics, loading } = useClinics({ filters, initialData: initialClinics });

  const mapCenter = useMemo(() => {
    if (filters.city) {
      const cityInfo = getCityByName(filters.city);
      return cityInfo?.center || TAIPEI_CENTER;
    }
    return TAIPEI_CENTER;
  }, [filters.city]);

  const mapZoom = useMemo(() => {
    if (filters.city) {
      const cityInfo = getCityByName(filters.city);
      return cityInfo?.zoom || DEFAULT_ZOOM;
    }
    return DEFAULT_ZOOM;
  }, [filters.city]);

  const handleSelectClinic = useCallback(
    (clinic: ClinicSummary) => {
      setSelectedClinicId(clinic.id);
      // On mobile, switch to map view when a clinic is selected from list
      if (mobileView === 'list') {
        setMobileView('map');
      }
    },
    [mobileView, setSelectedClinicId, setMobileView]
  );

  return (
    <>
      <main className="flex-1 flex overflow-hidden relative">
        {/* Sidebar - hidden on mobile when showing map */}
        <div
          className={`w-full md:w-[400px] md:shrink-0 md:border-r md:border-gray-200 ${
            mobileView === 'map' ? 'hidden md:flex' : 'flex'
          } flex-col`}
        >
          <Sidebar
            clinics={clinics}
            categories={categories}
            filters={filters}
            loading={loading}
            selectedClinicId={selectedClinicId}
            onSelectClinic={handleSelectClinic}
            onToggleCategory={toggleCategory}
            onPriceChange={setPriceRange}
            onCityChange={setCity}
            onResetFilters={resetFilters}
          />
        </div>

        {/* Map - hidden on mobile when showing list */}
        <div
          className={`flex-1 ${
            mobileView === 'list' ? 'hidden md:block' : 'block'
          }`}
        >
          <MapWrapper
            clinics={clinics}
            selectedClinicId={selectedClinicId}
            onSelectClinic={handleSelectClinic}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </main>

      {/* Mobile toggle button */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
        <button
          onClick={() => setMobileView(mobileView === 'map' ? 'list' : 'map')}
          className="bg-white text-gray-700 px-6 py-3 rounded-full shadow-lg border border-gray-200 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 active:bg-gray-100"
        >
          {mobileView === 'map' ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              顯示列表
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              顯示地圖
            </>
          )}
        </button>
      </div>
    </>
  );
}
