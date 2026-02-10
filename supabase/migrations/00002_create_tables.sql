-- Treatment categories (e.g., 雷射, 注射, 拉皮, 體雕)
CREATE TABLE public.treatment_categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  name_en     TEXT,
  slug        TEXT NOT NULL UNIQUE,
  icon        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Clinics
CREATE TABLE public.clinics (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  address       TEXT NOT NULL,
  district      TEXT NOT NULL,
  city          TEXT NOT NULL DEFAULT '台北市',
  phone         TEXT,
  website       TEXT,
  description   TEXT,
  rating        NUMERIC(2,1) DEFAULT 0.0,
  review_count  INTEGER DEFAULT 0,
  location      extensions.geography(POINT, 4326) NOT NULL,
  opening_hours JSONB,
  image_url     TEXT,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Spatial index for geo queries
CREATE INDEX clinics_location_gist ON public.clinics USING GIST (location);
CREATE INDEX clinics_district_idx ON public.clinics (city, district);

-- Treatments (linked to clinic + category)
CREATE TABLE public.treatments (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id        UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  category_id      UUID NOT NULL REFERENCES public.treatment_categories(id),
  name             TEXT NOT NULL,
  description      TEXT,
  price_min        INTEGER NOT NULL,
  price_max        INTEGER,
  price_unit       TEXT DEFAULT '次',
  duration_minutes INTEGER,
  is_popular       BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX treatments_category_idx ON public.treatments (category_id);
CREATE INDEX treatments_clinic_idx ON public.treatments (clinic_id);
CREATE INDEX treatments_price_idx ON public.treatments (price_min, price_max);

-- Row Level Security (public read-only)
ALTER TABLE public.treatment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON public.treatment_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.clinics FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON public.treatments FOR SELECT USING (true);
