-- Fix storage RLS for admin image uploads (run in Supabase SQL Editor)

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "product_images_public_read" on storage.objects;
drop policy if exists "product_images_admin_insert" on storage.objects;
drop policy if exists "product_images_admin_update" on storage.objects;
drop policy if exists "product_images_admin_delete" on storage.objects;
drop policy if exists "product_images_authenticated_insert" on storage.objects;
drop policy if exists "product_images_authenticated_update" on storage.objects;
drop policy if exists "product_images_authenticated_delete" on storage.objects;

create policy "product_images_public_read" on storage.objects
  for select
  using (bucket_id = 'product-images');

create policy "product_images_authenticated_insert" on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "product_images_authenticated_update" on storage.objects
  for update
  to authenticated
  using (bucket_id = 'product-images');

create policy "product_images_authenticated_delete" on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'product-images');
