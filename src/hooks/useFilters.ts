'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PRICE_MIN, PRICE_MAX } from '@/lib/constants';
import type { FilterState } from '@/types/filters';

export function useFilters(): {
  filters: FilterState;
  setCategories: (categories: string[]) => void;
  toggleCategory: (slug: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setCity: (city: string | null) => void;
  resetFilters: () => void;
} {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo<FilterState>(() => {
    const cats = searchParams.get('categories');
    const minP = searchParams.get('minPrice');
    const maxP = searchParams.get('maxPrice');
    const city = searchParams.get('city');

    return {
      categories: cats ? cats.split(',').filter(Boolean) : [],
      priceRange: [
        minP ? parseInt(minP, 10) : PRICE_MIN,
        maxP ? parseInt(maxP, 10) : PRICE_MAX,
      ],
      city: city || null,
    };
  }, [searchParams]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      const qs = params.toString();
      router.replace(qs ? `/?${qs}` : '/', { scroll: false });
    },
    [router, searchParams]
  );

  const setCategories = useCallback(
    (categories: string[]) => {
      updateParams({
        categories: categories.length > 0 ? categories.join(',') : null,
      });
    },
    [updateParams]
  );

  const toggleCategory = useCallback(
    (slug: string) => {
      const current = filters.categories;
      const next = current.includes(slug)
        ? current.filter((c) => c !== slug)
        : [...current, slug];
      setCategories(next);
    },
    [filters.categories, setCategories]
  );

  const setPriceRange = useCallback(
    (range: [number, number]) => {
      updateParams({
        minPrice: range[0] > PRICE_MIN ? range[0].toString() : null,
        maxPrice: range[1] < PRICE_MAX ? range[1].toString() : null,
      });
    },
    [updateParams]
  );

  const setCity = useCallback(
    (city: string | null) => {
      updateParams({ city });
    },
    [updateParams]
  );

  const resetFilters = useCallback(() => {
    router.replace('/', { scroll: false });
  }, [router]);

  return { filters, setCategories, toggleCategory, setPriceRange, setCity, resetFilters };
}
