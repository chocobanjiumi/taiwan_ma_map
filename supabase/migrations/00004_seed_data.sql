-- Treatment Categories
INSERT INTO public.treatment_categories (name, name_en, slug) VALUES
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

-- Sample Clinics
INSERT INTO public.clinics (name, slug, address, district, city, phone, rating, review_count, location) VALUES
  ('悅美整形外科診所', 'yuemei-clinic',
   '台北市大安區忠孝東路四段128號5樓', '大安區', '台北市',
   '02-2711-1234', 4.5, 328,
   extensions.ST_SetSRID(extensions.ST_MakePoint(121.5495, 25.0418), 4326)::extensions.geography),

  ('星采整形外科診所', 'starclinic',
   '台北市中正區館前路12號3樓', '中正區', '台北市',
   '02-2381-5678', 4.3, 215,
   extensions.ST_SetSRID(extensions.ST_MakePoint(121.5151, 25.0461), 4326)::extensions.geography),

  ('晶華美醫診所', 'crystal-beauty',
   '台北市信義區松仁路28號6樓', '信義區', '台北市',
   '02-8780-9012', 4.7, 412,
   extensions.ST_SetSRID(extensions.ST_MakePoint(121.5677, 25.0360), 4326)::extensions.geography),

  ('米蘭時尚診所', 'milan-clinic',
   '台北市中山區南京東路一段2號8樓', '中山區', '台北市',
   '02-2567-3456', 4.1, 189,
   extensions.ST_SetSRID(extensions.ST_MakePoint(121.5225, 25.0527), 4326)::extensions.geography),

  ('美麗晶華診所', 'beautiful-crystal',
   '新北市板橋區文化路一段188號', '板橋區', '新北市',
   '02-2968-7890', 4.4, 267,
   extensions.ST_SetSRID(extensions.ST_MakePoint(121.4593, 25.0145), 4326)::extensions.geography),

  ('雅偲皮膚科診所', 'artskin-clinic',
   '台北市大安區忠孝東路三段305號', '大安區', '台北市',
   '02-2731-1111', 4.6, 345,
   extensions.ST_SetSRID(extensions.ST_MakePoint(121.5434, 25.0413), 4326)::extensions.geography);

-- Treatments
-- 悅美整形外科診所
INSERT INTO public.treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '皮秒雷射全臉', 6000, 12000, '次', true
FROM public.clinics c, public.treatment_categories tc
WHERE c.slug = 'yuemei-clinic' AND tc.slug = 'pico-laser';

INSERT INTO public.treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '玻尿酸豐唇 1cc', 8000, 15000, 'cc', false
FROM public.clinics c, public.treatment_categories tc
WHERE c.slug = 'yuemei-clinic' AND tc.slug = 'hyaluronic-acid';

INSERT INTO public.treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '肉毒瘦小臉', 4000, 8000, '次', true
FROM public.clinics c, public.treatment_categories tc
WHERE c.slug = 'yuemei-clinic' AND tc.slug = 'botox';

-- 星采整形外科診所
INSERT INTO public.treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '電波拉皮全臉', 35000, 65000, '次', true
FROM public.clinics c, public.treatment_categories tc
WHERE c.slug = 'starclinic' AND tc.slug = 'thermage';

INSERT INTO public.treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '淨膚雷射', 2500, 4000, '次', false
FROM public.clinics c, public.treatment_categories tc
WHERE c.slug = 'starclinic' AND tc.slug = 'gentle-laser';

-- 晶華美醫診所
INSERT INTO public.treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '音波拉提全臉', 40000, 80000, '次', true
FROM public.clinics c, public.treatment_categories tc
WHERE c.slug = 'crystal-beauty' AND tc.slug = 'ultherapy';

INSERT INTO public.treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '結構式隆鼻', 50000, 120000, '次', true
FROM public.clinics c, public.treatment_categories tc
WHERE c.slug = 'crystal-beauty' AND tc.slug = 'rhinoplasty';

-- 米蘭時尚診所
INSERT INTO public.treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '縫雙眼皮', 15000, 25000, '次', true
FROM public.clinics c, public.treatment_categories tc
WHERE c.slug = 'milan-clinic' AND tc.slug = 'double-eyelid';

INSERT INTO public.treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '雷射除斑', 3000, 8000, '次', false
FROM public.clinics c, public.treatment_categories tc
WHERE c.slug = 'milan-clinic' AND tc.slug = 'laser-whitening';

-- 美麗晶華診所
INSERT INTO public.treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '威塑抽脂', 60000, 150000, '區域', true
FROM public.clinics c, public.treatment_categories tc
WHERE c.slug = 'beautiful-crystal' AND tc.slug = 'liposuction';

-- 雅偲皮膚科診所
INSERT INTO public.treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '皮秒雷射除斑', 5000, 10000, '次', true
FROM public.clinics c, public.treatment_categories tc
WHERE c.slug = 'artskin-clinic' AND tc.slug = 'pico-laser';

INSERT INTO public.treatments (clinic_id, category_id, name, price_min, price_max, price_unit, is_popular)
SELECT c.id, tc.id, '玻尿酸填補法令紋', 10000, 20000, 'cc', false
FROM public.clinics c, public.treatment_categories tc
WHERE c.slug = 'artskin-clinic' AND tc.slug = 'hyaluronic-acid';
