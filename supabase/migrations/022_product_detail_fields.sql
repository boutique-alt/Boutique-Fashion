-- Product detail fields used by admin form / productToDb
alter table public.products
  add column if not exists fabric text,
  add column if not exists wash_care text[],
  add column if not exists product_details jsonb,
  add column if not exists sku text,
  add column if not exists additional_images text[] default '{}'::text[],
  add column if not exists is_best_seller boolean default false,
  add column if not exists new_arrival_video text,
  add column if not exists stock_quantity integer not null default 0,
  add column if not exists shop_category_selections text[] not null default '{}'::text[];
