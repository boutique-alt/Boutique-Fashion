-- Boutique Fashion — initial schema
-- Run in Supabase SQL Editor (full script at once)

-- Cleanup from failed partial runs
drop function if exists public.is_admin();

-- 1. Customer profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  phone text,
  avatar_url text,
  gender text,
  voluntary_consent boolean default false,
  address jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Admin allowlist
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 3. Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  user_email text not null,
  items jsonb not null,
  billing jsonb not null,
  subtotal numeric not null,
  shipping numeric default 0,
  total numeric not null,
  payment_method text not null,
  payment_status text not null,
  status text not null default 'pending',
  razorpay_payment_id text,
  razorpay_order_id text,
  status_updated_at timestamptz,
  created_at timestamptz default now()
);

-- 4. Returns
create table if not exists public.returns (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_email text not null,
  reason text not null,
  status text not null default 'requested',
  status_updated_at timestamptz,
  created_at timestamptz default now()
);

-- 5. Contact messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- 6. Page visits (analytics)
create table if not exists public.page_visits (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  product_slug text,
  product_name text,
  created_at timestamptz default now()
);

-- 7. Admin products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  price numeric not null,
  original_price numeric,
  image text not null,
  category_slug text not null,
  category_label text not null,
  category_path text not null,
  sizes text[] not null default '{}',
  short_description text not null,
  description text not null,
  on_sale boolean default false,
  is_new boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 8. Hidden static catalog slugs
create table if not exists public.catalog_hidden_slugs (
  slug text primary key,
  hidden_at timestamptz default now()
);

-- 9. Static catalog overrides
create table if not exists public.catalog_overrides (
  slug text primary key,
  override_data jsonb not null,
  updated_at timestamptz default now()
);

-- Admin helper (must run AFTER admin_users table exists)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  );
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.orders enable row level security;
alter table public.returns enable row level security;
alter table public.contact_messages enable row level security;
alter table public.page_visits enable row level security;
alter table public.products enable row level security;
alter table public.catalog_hidden_slugs enable row level security;
alter table public.catalog_overrides enable row level security;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id or public.is_admin());

-- admin_users
drop policy if exists "admin_users_select_own" on public.admin_users;
create policy "admin_users_select_own" on public.admin_users for select using (auth.uid() = id);

-- orders
drop policy if exists "orders_insert" on public.orders;
drop policy if exists "orders_select" on public.orders;
drop policy if exists "orders_update_admin" on public.orders;
create policy "orders_insert" on public.orders for insert with check (true);
create policy "orders_select" on public.orders for select using (
  public.is_admin() or user_email = (auth.jwt() ->> 'email')
);
create policy "orders_update_admin" on public.orders for update using (public.is_admin());

-- returns
drop policy if exists "returns_insert" on public.returns;
drop policy if exists "returns_select" on public.returns;
drop policy if exists "returns_update_admin" on public.returns;
create policy "returns_insert" on public.returns for insert with check (
  user_email = (auth.jwt() ->> 'email')
);
create policy "returns_select" on public.returns for select using (
  public.is_admin() or user_email = (auth.jwt() ->> 'email')
);
create policy "returns_update_admin" on public.returns for update using (public.is_admin());

-- contact_messages
drop policy if exists "contact_insert" on public.contact_messages;
drop policy if exists "contact_admin_select" on public.contact_messages;
drop policy if exists "contact_admin_update" on public.contact_messages;
create policy "contact_insert" on public.contact_messages for insert with check (true);
create policy "contact_admin_select" on public.contact_messages for select using (public.is_admin());
create policy "contact_admin_update" on public.contact_messages for update using (public.is_admin());

-- page_visits
drop policy if exists "visits_insert" on public.page_visits;
drop policy if exists "visits_select_admin" on public.page_visits;
create policy "visits_insert" on public.page_visits for insert with check (true);
create policy "visits_select_admin" on public.page_visits for select using (public.is_admin());

-- products
drop policy if exists "products_select" on public.products;
drop policy if exists "products_admin_insert" on public.products;
drop policy if exists "products_admin_update" on public.products;
drop policy if exists "products_admin_delete" on public.products;
create policy "products_select" on public.products for select using (true);
create policy "products_admin_insert" on public.products for insert with check (public.is_admin());
create policy "products_admin_update" on public.products for update using (public.is_admin());
create policy "products_admin_delete" on public.products for delete using (public.is_admin());

-- catalog_hidden_slugs
drop policy if exists "hidden_select" on public.catalog_hidden_slugs;
drop policy if exists "hidden_admin_insert" on public.catalog_hidden_slugs;
drop policy if exists "hidden_admin_update" on public.catalog_hidden_slugs;
drop policy if exists "hidden_admin_delete" on public.catalog_hidden_slugs;
create policy "hidden_select" on public.catalog_hidden_slugs for select using (true);
create policy "hidden_admin_insert" on public.catalog_hidden_slugs for insert with check (public.is_admin());
create policy "hidden_admin_update" on public.catalog_hidden_slugs for update using (public.is_admin());
create policy "hidden_admin_delete" on public.catalog_hidden_slugs for delete using (public.is_admin());

-- catalog_overrides
drop policy if exists "overrides_select" on public.catalog_overrides;
drop policy if exists "overrides_admin_insert" on public.catalog_overrides;
drop policy if exists "overrides_admin_update" on public.catalog_overrides;
drop policy if exists "overrides_admin_delete" on public.catalog_overrides;
create policy "overrides_select" on public.catalog_overrides for select using (true);
create policy "overrides_admin_insert" on public.catalog_overrides for insert with check (public.is_admin());
create policy "overrides_admin_update" on public.catalog_overrides for update using (public.is_admin());
create policy "overrides_admin_delete" on public.catalog_overrides for delete using (public.is_admin());
