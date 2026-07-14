-- Add optional product addons (pant, dupatta, etc.) as JSONB array
alter table public.products
  add column if not exists addons jsonb default null;
