create table if not exists public.shop_category_visibility (
  category_id text primary key,
  visible boolean not null default true,
  updated_at timestamptz default now()
);

alter table public.shop_category_visibility enable row level security;

drop policy if exists "shop_category_visibility_select" on public.shop_category_visibility;
drop policy if exists "shop_category_visibility_admin_insert" on public.shop_category_visibility;
drop policy if exists "shop_category_visibility_admin_update" on public.shop_category_visibility;
drop policy if exists "shop_category_visibility_admin_delete" on public.shop_category_visibility;

create policy "shop_category_visibility_select" on public.shop_category_visibility for select using (true);
create policy "shop_category_visibility_admin_insert" on public.shop_category_visibility for insert with check (public.is_admin());
create policy "shop_category_visibility_admin_update" on public.shop_category_visibility for update using (public.is_admin());
create policy "shop_category_visibility_admin_delete" on public.shop_category_visibility for delete using (public.is_admin());
