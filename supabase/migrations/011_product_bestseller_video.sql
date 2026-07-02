alter table public.products
  add column if not exists is_best_seller boolean default false,
  add column if not exists new_arrival_video text;
