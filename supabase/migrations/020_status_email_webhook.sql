-- Auto-send status emails via Edge Function (server-side, works on production)

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_status_email_webhook()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  payload jsonb;
  webhook_secret text := 'bootiq-email-test-2026';
begin
  if TG_OP = 'UPDATE' and NEW.status is not distinct from OLD.status then
    return NEW;
  end if;

  payload := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'record', to_jsonb(NEW),
    'old_record', case when TG_OP = 'UPDATE' then to_jsonb(OLD) else null end
  );

  perform net.http_post(
    url := 'https://qfxcqsmayfwisnsruoab.supabase.co/functions/v1/send-status-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', webhook_secret
    ),
    body := payload
  );

  return NEW;
exception
  when others then
    return NEW;
end;
$$;

drop trigger if exists orders_notify_status_email on public.orders;
create trigger orders_notify_status_email
  after insert or update on public.orders
  for each row
  execute function public.notify_status_email_webhook();

drop trigger if exists returns_notify_status_email on public.returns;
create trigger returns_notify_status_email
  after insert or update on public.returns
  for each row
  execute function public.notify_status_email_webhook();
