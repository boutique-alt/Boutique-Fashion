create table if not exists public.media_library (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  filename text not null,
  size_bytes bigint,
  created_at timestamptz default now()
);

alter table public.media_library enable row level security;

drop policy if exists "media_select" on public.media_library;
drop policy if exists "media_admin_insert" on public.media_library;
drop policy if exists "media_admin_delete" on public.media_library;

create policy "media_select" on public.media_library for select using (true);
create policy "media_admin_insert" on public.media_library for insert with check (public.is_admin());
create policy "media_admin_delete" on public.media_library for delete using (public.is_admin());
