-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Treatment categories
CREATE TABLE treatment_categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  name_en     TEXT,
  slug        TEXT NOT NULL UNIQUE,
  icon        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Clinics
CREATE TABLE clinics (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  address       TEXT NOT NULL,
  district      TEXT NOT NULL,
  city          TEXT NOT NULL DEFAULT '台北市',
  phone         TEXT,
  website       TEXT,
  facebook_url  TEXT,
  instagram_url TEXT,
  line_url      TEXT,
  description   TEXT,
  rating        NUMERIC(2,1) DEFAULT 0.0,
  review_count  INTEGER DEFAULT 0,
  location      geography(POINT, 4326) NOT NULL,
  opening_hours JSONB,
  image_url     TEXT,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX clinics_location_gist ON clinics USING GIST (location);
CREATE INDEX clinics_district_idx ON clinics (city, district);

-- Treatments
CREATE TABLE treatments (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id        UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  category_id      UUID NOT NULL REFERENCES treatment_categories(id),
  name             TEXT NOT NULL,
  description      TEXT,
  price_min        INTEGER NOT NULL,
  price_max        INTEGER,
  price_unit       TEXT DEFAULT '次',
  duration_minutes INTEGER,
  is_popular       BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX treatments_category_idx ON treatments (category_id);
CREATE INDEX treatments_clinic_idx ON treatments (clinic_id);
CREATE INDEX treatments_price_idx ON treatments (price_min, price_max);

-- Search clinics within radius, optionally filtered by category and price range
CREATE OR REPLACE FUNCTION search_clinics(
  search_lat     FLOAT DEFAULT 25.033,
  search_lng     FLOAT DEFAULT 121.5654,
  radius_meters  FLOAT DEFAULT 5000,
  category_slugs TEXT[] DEFAULT NULL,
  min_price      INTEGER DEFAULT NULL,
  max_price      INTEGER DEFAULT NULL,
  filter_city    TEXT DEFAULT NULL
)
RETURNS TABLE (
  id                  UUID,
  name                TEXT,
  slug                TEXT,
  address             TEXT,
  district            TEXT,
  city                TEXT,
  phone               TEXT,
  rating              NUMERIC,
  review_count        INTEGER,
  image_url           TEXT,
  lat                 FLOAT,
  lng                 FLOAT,
  dist_meters         FLOAT,
  categories          TEXT[],
  min_treatment_price INTEGER
)
LANGUAGE sql STABLE
AS $$
  SELECT DISTINCT ON (c.id)
    c.id,
    c.name,
    c.slug,
    c.address,
    c.district,
    c.city,
    c.phone,
    c.rating,
    c.review_count,
    c.image_url,
    ST_Y(c.location::geometry) AS lat,
    ST_X(c.location::geometry) AS lng,
    ST_Distance(
      c.location,
      ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography
    ) AS dist_meters,
    ARRAY(
      SELECT DISTINCT tc.name
      FROM treatments t
      JOIN treatment_categories tc ON tc.id = t.category_id
      WHERE t.clinic_id = c.id
    ) AS categories,
    (SELECT MIN(t.price_min) FROM treatments t WHERE t.clinic_id = c.id) AS min_treatment_price
  FROM clinics c
  WHERE c.is_active = true
    AND (
      CASE
        WHEN filter_city IS NOT NULL THEN c.city = filter_city
        ELSE ST_DWithin(
          c.location,
          ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography,
          radius_meters
        )
      END
    )
    AND (
      category_slugs IS NULL
      OR EXISTS (
        SELECT 1
        FROM treatments t
        JOIN treatment_categories tc ON tc.id = t.category_id
        WHERE t.clinic_id = c.id AND tc.slug = ANY(category_slugs)
      )
    )
    AND (
      min_price IS NULL
      OR EXISTS (
        SELECT 1 FROM treatments t
        WHERE t.clinic_id = c.id AND t.price_min >= min_price
      )
    )
    AND (
      max_price IS NULL
      OR EXISTS (
        SELECT 1 FROM treatments t
        WHERE t.clinic_id = c.id AND t.price_min <= max_price
      )
    )
  ORDER BY c.id, dist_meters ASC;
$$;

-- ============================================================
-- Seed Data
-- ============================================================

-- Treatment Categories
INSERT INTO treatment_categories (name, name_en, slug) VALUES
  ('雷射美白', 'Laser Whitening', 'laser-whitening'),
  ('玻尿酸注射', 'Hyaluronic Acid', 'hyaluronic-acid'),
  ('肉毒桿菌', 'Botox', 'botox'),
  ('電波拉皮', 'Thermage', 'thermage'),
  ('皮秒雷射', 'Pico Laser', 'pico-laser'),
  ('音波拉提', 'Ultherapy', 'ultherapy'),
  ('隆鼻', 'Rhinoplasty', 'rhinoplasty'),
  ('雙眼皮', 'Double Eyelid', 'double-eyelid'),
  ('抽脂體雕', 'Liposuction', 'liposuction'),
  ('淨膚雷射', 'Gentle Laser', 'gentle-laser');

-- Clinics
INSERT INTO clinics (name, slug, address, district, city, phone, rating, review_count, location) VALUES
  ('悅美整形外科診所', 'yuemei-clinic',
   '台北市大安區忠孝東路四段128號5樓', '大安區', '台北市',
   '02-2711-1234', 4.5, 328,
   ST_SetSRID(ST_MakePoint(121.5495, 25.0418), 4326)::geography),

  ('星采整形外科診所', 'starclinic',
   '台北市中正區館前路12號3樓', '中正區', '台北市',
   '02-2381-5678', 4.3, 215,
   ST_SetSRID(ST_MakePoint(121.5151, 25.0461), 4326)::geography),

  ('晶華美醫診所', 'crystal-beauty',
   '台北市信義區松仁路28號6樓', '信義區', '台北市',
   '02-8780-9012', 4.7, 412,
   ST_SetSRID(ST_MakePoint(121.5677, 25.0360), 4326)::geography),

  ('米蘭時尚診所', 'milan-clinic',
   '台北市中山區南京東路一段2號8樓', '中山區', '台北市',
   '02-2567-3456', 4.1, 189,
   ST_SetSRID(ST_MakePoint(121.5225, 25.0527), 4326)::geography),

  ('美麗晶華診所', 'beautiful-crystal',
   '新北市板橋區文化路一段188號', '板橋區', '新北市',
   '02-2968-7890', 4.4, 267,
   ST_SetSRID(ST_MakePoint(121.4593, 25.0145), 4326)::geography),

  ('雅偲皮膚科診所', 'artskin-clinic',
   '台北市大安區忠孝東路三段305號', '大安區', '台北市',
   '02-2731-1111', 4.6, 345,
   ST_SetSRID(ST_MakePoint(121.5434, 25.0413), 4326)::geography);

-- Treatments
INSERT INTO treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '皮秒雷射全臉', 6000, 12000, '次', true
FROM clinics c, treatment_categories tc
WHERE c.slug = 'yuemei-clinic' AND tc.slug = 'pico-laser';

INSERT INTO treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '玻尿酸豐唇 1cc', 8000, 15000, 'cc', false
FROM clinics c, treatment_categories tc
WHERE c.slug = 'yuemei-clinic' AND tc.slug = 'hyaluronic-acid';

INSERT INTO treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '肉毒瘦小臉', 4000, 8000, '次', true
FROM clinics c, treatment_categories tc
WHERE c.slug = 'yuemei-clinic' AND tc.slug = 'botox';

INSERT INTO treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '電波拉皮全臉', 35000, 65000, '次', true
FROM clinics c, treatment_categories tc
WHERE c.slug = 'starclinic' AND tc.slug = 'thermage';

INSERT INTO treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '淨膚雷射', 2500, 4000, '次', false
FROM clinics c, treatment_categories tc
WHERE c.slug = 'starclinic' AND tc.slug = 'gentle-laser';

INSERT INTO treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '音波拉提全臉', 40000, 80000, '次', true
FROM clinics c, treatment_categories tc
WHERE c.slug = 'crystal-beauty' AND tc.slug = 'ultherapy';

INSERT INTO treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '結構式隆鼻', 50000, 120000, '次', true
FROM clinics c, treatment_categories tc
WHERE c.slug = 'crystal-beauty' AND tc.slug = 'rhinoplasty';

INSERT INTO treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '縫雙眼皮', 15000, 25000, '次', true
FROM clinics c, treatment_categories tc
WHERE c.slug = 'milan-clinic' AND tc.slug = 'double-eyelid';

INSERT INTO treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '雷射除斑', 3000, 8000, '次', false
FROM clinics c, treatment_categories tc
WHERE c.slug = 'milan-clinic' AND tc.slug = 'laser-whitening';

INSERT INTO treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '威塑抽脂', 60000, 150000, '區域', true
FROM clinics c, treatment_categories tc
WHERE c.slug = 'beautiful-crystal' AND tc.slug = 'liposuction';

INSERT INTO treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '皮秒雷射除斑', 5000, 10000, '次', true
FROM clinics c, treatment_categories tc
WHERE c.slug = 'artskin-clinic' AND tc.slug = 'pico-laser';

INSERT INTO treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '玻尿酸填補法令紋', 10000, 20000, 'cc', false
FROM clinics c, treatment_categories tc
WHERE c.slug = 'artskin-clinic' AND tc.slug = 'hyaluronic-acid';
