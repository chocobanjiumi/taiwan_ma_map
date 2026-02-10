export interface FilterState {
  categories: string[]; // category slugs
  priceRange: [number, number]; // [min, max] in NTD
  city: string | null; // city name or null for all
}

export const DEFAULT_FILTERS: FilterState = {
  categories: [],
  priceRange: [0, 200000],
  city: null,
};
