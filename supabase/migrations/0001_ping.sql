-- Minimal function for the daily keepalive job (cron-job.org).
-- Calling it runs a real database query, so the free plan does not pause the project.
-- It reads no table and exposes no data.
create or replace function public.ping()
returns integer
language sql
stable
as $$
  select 1;
$$;

grant execute on function public.ping() to anon;
