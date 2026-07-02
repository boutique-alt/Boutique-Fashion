-- Allow checkout payment screenshots for local-auth users (no Supabase JWT)
drop policy if exists "payment_screenshots_public_read" on storage.objects;
drop policy if exists "payment_screenshots_authenticated_insert" on storage.objects;
drop policy if exists "payment_screenshots_anon_insert" on storage.objects;

create policy "payment_screenshots_public_read" on storage.objects
  for select
  using (bucket_id = 'payment-screenshots');

create policy "payment_screenshots_authenticated_insert" on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'payment-screenshots');

create policy "payment_screenshots_anon_insert" on storage.objects
  for insert
  to anon
  with check (bucket_id = 'payment-screenshots');
