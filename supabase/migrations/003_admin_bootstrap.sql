-- Admin bootstrap (run this entire script in Supabase SQL Editor)

drop function if exists public.bootstrap_admin(text);

create or replace function public.bootstrap_admin(admin_email text)
returns void
language plpgsql
security definer
set search_path = public
as $func$
declare
  user_id uuid;
  caller_email text;
begin
  user_id := auth.uid();
  if user_id is null then
    raise exception 'Not authenticated';
  end if;

  caller_email := lower(coalesce(auth.jwt() ->> 'email', ''));
  if caller_email != lower(admin_email) then
    raise exception 'Can only bootstrap your own admin email';
  end if;

  insert into public.admin_users (id, email, name)
  values (user_id, lower(admin_email), 'Admin')
  on conflict (id) do update
    set email = excluded.email, is_active = true;
end;
$func$;

grant execute on function public.bootstrap_admin(text) to authenticated;
