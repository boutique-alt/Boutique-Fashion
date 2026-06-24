-- Allow customers to fetch their orders by billing email (local-auth users have no Supabase JWT)
create or replace function public.get_orders_by_email(lookup_email text)
returns setof public.orders
language sql
security definer
set search_path = public
stable
as $$
  select *
  from public.orders
  where lower(user_email) = lower(trim(lookup_email))
  order by created_at desc;
$$;

grant execute on function public.get_orders_by_email(text) to anon, authenticated;
