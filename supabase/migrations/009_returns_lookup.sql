-- Customer return reads (local-auth users have no Supabase JWT)
create or replace function public.get_returns_by_email(lookup_email text)
returns setof public.returns
language sql
security definer
set search_path = public
stable
as $$
  select *
  from public.returns
  where lower(trim(lookup_email)) <> ''
    and lower(user_email) = lower(trim(lookup_email))
  order by created_at desc;
$$;

create or replace function public.get_return_by_order_id(lookup_order_id uuid)
returns setof public.returns
language sql
security definer
set search_path = public
stable
as $$
  select *
  from public.returns
  where order_id = lookup_order_id
  limit 1;
$$;

grant execute on function public.get_returns_by_email(text) to anon, authenticated;
grant execute on function public.get_return_by_order_id(uuid) to anon, authenticated;

-- One return per order
create unique index if not exists returns_order_id_unique on public.returns(order_id);

-- Allow return requests without Supabase JWT (registered email is set in app)
drop policy if exists "returns_insert" on public.returns;
create policy "returns_insert" on public.returns
  for insert
  with check (true);
