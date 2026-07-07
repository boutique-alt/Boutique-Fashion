-- Add additional_images to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS additional_images text[] DEFAULT '{}'::text[];
