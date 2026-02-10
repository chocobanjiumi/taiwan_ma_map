-- Add social media link columns to clinics table
ALTER TABLE public.clinics ADD COLUMN facebook_url TEXT;
ALTER TABLE public.clinics ADD COLUMN instagram_url TEXT;
ALTER TABLE public.clinics ADD COLUMN line_url TEXT;
