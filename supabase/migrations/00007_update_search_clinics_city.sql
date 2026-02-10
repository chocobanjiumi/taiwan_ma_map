-- Update search_clinics to support city filtering
CREATE OR REPLACE FUNCTION public.search_clinics(
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
    extensions.ST_Y(c.location::extensions.geometry) AS lat,
    extensions.ST_X(c.location::extensions.geometry) AS lng,
    extensions.ST_Distance(
      c.location,
      extensions.ST_SetSRID(extensions.ST_MakePoint(search_lng, search_lat), 4326)::extensions.geography
    ) AS dist_meters,
    ARRAY(
      SELECT DISTINCT tc.name
      FROM public.treatments t
      JOIN public.treatment_categories tc ON tc.id = t.category_id
      WHERE t.clinic_id = c.id
    ) AS categories,
    (SELECT MIN(t.price_min) FROM public.treatments t WHERE t.clinic_id = c.id) AS min_treatment_price
  FROM public.clinics c
  WHERE c.is_active = true
    AND (
      CASE
        WHEN filter_city IS NOT NULL THEN c.city = filter_city
        ELSE extensions.ST_DWithin(
          c.location,
          extensions.ST_SetSRID(extensions.ST_MakePoint(search_lng, search_lat), 4326)::extensions.geography,
          radius_meters
        )
      END
    )
    AND (
      category_slugs IS NULL
      OR EXISTS (
        SELECT 1
        FROM public.treatments t
        JOIN public.treatment_categories tc ON tc.id = t.category_id
        WHERE t.clinic_id = c.id AND tc.slug = ANY(category_slugs)
      )
    )
    AND (
      min_price IS NULL
      OR EXISTS (
        SELECT 1 FROM public.treatments t
        WHERE t.clinic_id = c.id AND t.price_min >= min_price
      )
    )
    AND (
      max_price IS NULL
      OR EXISTS (
        SELECT 1 FROM public.treatments t
        WHERE t.clinic_id = c.id AND t.price_min <= max_price
      )
    )
  ORDER BY c.id, dist_meters ASC;
$$;
