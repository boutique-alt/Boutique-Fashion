-- ONE-TIME FIX: run in Supabase Dashboard → SQL Editor
-- Fixes "Email not confirmed" / auth 400 when saving products from admin.
-- Change the email below if your VITE_ADMIN_EMAIL is different.

update auth.users
set
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  confirmed_at = coalesce(confirmed_at, now())
where lower(email) = lower('boutique@fashion.com');
