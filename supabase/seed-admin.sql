-- Option 1 (easiest): Just login at /admin/login — app auto-creates Auth user + admin row.
-- Make sure this SQL was run first: supabase/migrations/003_admin_bootstrap.sql

-- Option 2 (manual): If user already exists in Supabase Auth, sign in once then run:
-- select public.bootstrap_admin('boutique@fashion.com');
