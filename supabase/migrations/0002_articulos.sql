-- Articles in the catalog (HU01).
-- Nothing is deleted: an article is retired by setting baja_en (soft delete).
create table public.articulos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 3 and 80),
  imagen_path text not null,
  disponible boolean not null default true,
  creado_en timestamptz not null default now(),
  baja_en timestamptz
);

alter table public.articulos enable row level security;

-- Anyone can read the articles that are not retired, with or without stock (R1).
-- There are no insert, update or delete policies yet, so those are rejected.
create policy "articulos visibles para todos"
  on public.articulos
  for select
  to anon, authenticated
  using (baja_en is null);

grant select on public.articulos to anon, authenticated;

-- Public bucket for the article photos: anyone can read them by their public URL.
-- Uploads come in HU04 together with the owner's write policies.
insert into storage.buckets (id, name, public)
values ('articulos', 'articulos', true)
on conflict (id) do nothing;
