-- Match login email, user_email column, and billing form email (guest / mismatched checkout)
create or replace function public.get_orders_by_email(lookup_email text)
returns setof public.orders
language sql
security definer
set search_path = public
stable
as $$
  select *
  from public.orders
  where lower(trim(lookup_email)) <> ''
    and (
      lower(user_email) = lower(trim(lookup_email))
      or lower(coalesce(billing->>'email', '')) = lower(trim(lookup_email))
    )
  order by created_at desc;
$$;

create or replace function public.get_orders_by_ids(order_ids uuid[])
returns setof public.orders
language sql
security definer
set search_path = public
stable
as $$
  select *
  from public.orders
  where id = any(order_ids)
  order by created_at desc;
$$;

grant execute on function public.get_orders_by_email(text) to anon, authenticated;
grant execute on function public.get_orders_by_ids(uuid[]) to anon, authenticated;
