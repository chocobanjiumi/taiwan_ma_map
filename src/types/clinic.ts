export interface TreatmentCategory {
  id: string;
  name: string;
  name_en: string | null;
  slug: string;
  icon: string | null;
}

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  address: string;
  district: string;
  city: string;
  phone: string | null;
  website: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  line_url: string | null;
  description: string | null;
  rating: number;
  review_count: number;
  opening_hours: Record<string, string> | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Treatment {
  id: string;
  clinic_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_min: number;
  price_max: number | null;
  price_unit: string;
  duration_minutes: number | null;
  is_popular: boolean;
  category?: TreatmentCategory;
}

// Result from search_clinics RPC
export interface ClinicSummary {
  id: string;
  name: string;
  slug: string;
  address: string;
  district: string;
  city: string;
  phone: string | null;
  rating: number;
  review_count: number;
  image_url: string | null;
  lat: number;
  lng: number;
  dist_meters: number;
  categories: string[];
  min_treatment_price: number | null;
}

// Full clinic detail with treatments
export interface ClinicDetail extends Clinic {
  treatments: Treatment[];
}
