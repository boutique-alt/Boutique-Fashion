-- Fix RLS for guest checkout + admin email matching
-- Run in Supabase SQL Editor after 001_initial_schema.sql

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.is_active = true
      and (
        au.id = auth.uid()
        or lower(au.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  );
$$;

drop policy if exists "orders_insert" on public.orders;
create policy "orders_insert" on public.orders
  for insert
  with check (true);

drop policy if exists "contact_insert" on public.contact_messages;
create policy "contact_insert" on public.contact_messages
  for insert
  with check (true);
