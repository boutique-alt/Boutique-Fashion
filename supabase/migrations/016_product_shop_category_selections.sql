alter table public.products
  add column if not exists shop_category_selections text[] not null default '{}';
