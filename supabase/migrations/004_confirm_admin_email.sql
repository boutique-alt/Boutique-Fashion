-- Confirm admin email so .env login works with Supabase (run once in SQL Editor)
-- Change the email below if your VITE_ADMIN_EMAIL is different

update auth.users
set
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  confirmed_at = coalesce(confirmed_at, now())
where lower(email) = lower('boutique@fashion.com');

create or replace function public.auto_confirm_admin_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $func$
begin
  if lower(new.email) = lower('boutique@fashion.com') then
    new.email_confirmed_at := coalesce(new.email_confirmed_at, now());
  end if;
  return new;
end;
$func$;

drop trigger if exists tr_auto_confirm_admin on auth.users;

create trigger tr_auto_confirm_admin
  before insert on auth.users
  for each row
  execute function public.auto_confirm_admin_user();
