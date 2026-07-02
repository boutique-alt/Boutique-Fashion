-- Per-user cart and wishlist (replaces browser localStorage)

create table if not exists public.user_carts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  items jsonb not null default '[]',
  updated_at timestamptz default now()
);

create table if not exists public.user_wishlists (
  user_id uuid primary key references auth.users(id) on delete cascade,
  product_slugs text[] not null default '{}',
  updated_at timestamptz default now()
);

alter table public.user_carts enable row level security;
alter table public.user_wishlists enable row level security;

drop policy if exists "user_carts_select_own" on public.user_carts;
drop policy if exists "user_carts_insert_own" on public.user_carts;
drop policy if exists "user_carts_update_own" on public.user_carts;
drop policy if exists "user_carts_delete_own" on public.user_carts;

create policy "user_carts_select_own" on public.user_carts for select using (auth.uid() = user_id);
create policy "user_carts_insert_own" on public.user_carts for insert with check (auth.uid() = user_id);
create policy "user_carts_update_own" on public.user_carts for update using (auth.uid() = user_id);
create policy "user_carts_delete_own" on public.user_carts for delete using (auth.uid() = user_id);

drop policy if exists "user_wishlists_select_own" on public.user_wishlists;
drop policy if exists "user_wishlists_insert_own" on public.user_wishlists;
drop policy if exists "user_wishlists_update_own" on public.user_wishlists;
drop policy if exists "user_wishlists_delete_own" on public.user_wishlists;

create policy "user_wishlists_select_own" on public.user_wishlists for select using (auth.uid() = user_id);
create policy "user_wishlists_insert_own" on public.user_wishlists for insert with check (auth.uid() = user_id);
create policy "user_wishlists_update_own" on public.user_wishlists for update using (auth.uid() = user_id);
create policy "user_wishlists_delete_own" on public.user_wishlists for delete using (auth.uid() = user_id);
