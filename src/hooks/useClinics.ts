'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { ClinicSummary } from '@/types/clinic';
import type { FilterState } from '@/types/filters';
import { TAIPEI_CENTER, DEFAULT_RADIUS, PRICE_MIN, PRICE_MAX } from '@/lib/constants';
import { getCityByName } from '@/lib/cities';

interface UseClinicsOptions {
  filters: FilterState;
  center?: [number, number];
  initialData?: ClinicSummary[];
}

export function useClinics({ filters, center, initialData = [] }: UseClinicsOptions) {
  const [clinics, setClinics] = useState<ClinicSummary[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchClinics = useCallback(async () => {
    // Cancel previous request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      // Use city center if city is selected, otherwise use provided center or default
      const cityInfo = filters.city ? getCityByName(filters.city) : null;
      const [lat, lng] = cityInfo?.center || center || TAIPEI_CENTER;

      params.set('lat', lat.toString());
      params.set('lng', lng.toString());
      params.set('radius', DEFAULT_RADIUS.toString());

      if (filters.city) {
        params.set('city', filters.city);
      }

      if (filters.categories.length > 0) {
        params.set('categories', filters.categories.join(','));
      }
      if (filters.priceRange[0] > PRICE_MIN) {
        params.set('minPrice', filters.priceRange[0].toString());
      }
      if (filters.priceRange[1] < PRICE_MAX) {
        params.set('maxPrice', filters.priceRange[1].toString());
      }

      const res = await fetch(`/api/clinics?${params.toString()}`, {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error('Failed to fetch clinics');

      const data: ClinicSummary[] = await res.json();
      setClinics(data);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [filters, center]);

  useEffect(() => {
    // Skip initial fetch if we have server-provided data and no filters active
    const hasActiveFilters =
      filters.categories.length > 0 ||
      filters.priceRange[0] > PRICE_MIN ||
      filters.priceRange[1] < PRICE_MAX ||
      filters.city !== null;

    if (initialData.length > 0 && !hasActiveFilters && !center) {
      return;
    }

    fetchClinics();
  }, [fetchClinics, filters, center, initialData]);

  return { clinics, loading, error, refetch: fetchClinics };
}
