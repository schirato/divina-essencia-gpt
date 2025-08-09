-- =====================================================
-- Divina Essência — RESET + FULL SCHEMA (v7)
-- Este script APAGA as tabelas existentes e recria tudo do zero.
-- Seguro para rodar em um projeto SUPABASE limpo. Se rodar novamente,
-- continuará funcional (policies/storage usam checagens "if not exists").
-- =====================================================

-- Extensões
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ==============================
-- RESET (tabelas deste app)
-- ==============================
drop table if exists public.inspiration_posts cascade;
drop table if exists public.achievements cascade;
drop table if exists public.planner_entries cascade;
drop table if exists public.profiles cascade;
drop table if exists public.archetypes cascade;

-- ==============================
-- LOOKUP: archetypes (DEUSAS)
-- ==============================
create table public.archetypes (
  id text primary key,
  name text not null,
  summary text,
  created_at timestamptz default now()
);

insert into public.archetypes (id, name, summary) values
  ('nefertiti','Nefertiti','Ícone de elegância, presença e sofisticação.'),
  ('cleopatra','Cleópatra','Poder, carisma e magnetismo estratégico.'),
  ('atena','Atena','Sabedoria prática, estratégia e liderança racional.'),
  ('afrodite','Afrodite','Amor, sensualidade e magnetismo criativo.'),
  ('lilith','Lilith','Independência, transgressão e poder pessoal.'),
  ('sereia','Sereia','Encanto, mistério e fascínio hipnótico.'),
  ('medusa','Medusa','Proteção, transformação e limites firmes.'),
  ('fada','Fada','Leveza, encanto lúdico e imaginação.')
on conflict (id) do nothing;

-- ==============================
-- profiles
-- ==============================
create table public.profiles (
  uid uuid primary key references auth.users(id) on delete cascade,
  name text,
  archetype text references public.archetypes(id),
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles_select_own'
  ) then
    create policy profiles_select_own on public.profiles
      for select using (auth.uid() = uid);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles_insert_own'
  ) then
    create policy profiles_insert_own on public.profiles
      for insert with check (auth.uid() = uid);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles_update_own'
  ) then
    create policy profiles_update_own on public.profiles
      for update using (auth.uid() = uid);
  end if;
end $$;

-- ==============================
-- planner_entries
-- ==============================
create table public.planner_entries (
  id uuid primary key default uuid_generate_v4(),
  uid uuid references auth.users(id) on delete cascade,
  date date not null,
  content text,
  updated_at timestamptz not null default now(),
  created_at timestamptz default now()
);
alter table public.planner_entries enable row level security;

create index if not exists idx_planner_uid_date on public.planner_entries (uid, date);

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='planner_entries' and policyname='planner_read_own'
  ) then
    create policy planner_read_own on public.planner_entries
      for select using (auth.uid() = uid);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='planner_entries' and policyname='planner_insert_own'
  ) then
    create policy planner_insert_own on public.planner_entries
      for insert with check (auth.uid() = uid);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='planner_entries' and policyname='planner_update_own'
  ) then
    create policy planner_update_own on public.planner_entries
      for update using (auth.uid() = uid) with check (auth.uid() = uid);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='planner_entries' and policyname='planner_delete_own'
  ) then
    create policy planner_delete_own on public.planner_entries
      for delete using (auth.uid() = uid);
  end if;
end $$;

-- ==============================
-- achievements
-- ==============================
create table public.achievements (
  id uuid primary key default uuid_generate_v4(),
  uid uuid references auth.users(id) on delete cascade,
  code text not null,
  created_at timestamptz default now(),
  unique (uid, code)
);
alter table public.achievements enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='achievements' and policyname='achievements_own_all'
  ) then
    create policy achievements_own_all on public.achievements
      for all using (auth.uid() = uid) with check (auth.uid() = uid);
  end if;
end $$;

-- ==============================
-- inspiration_posts (DB)
-- ==============================
create table public.inspiration_posts (
  id uuid primary key default uuid_generate_v4(),
  uid uuid references auth.users(id) on delete cascade,
  image_url text not null,
  caption text,
  created_at timestamptz default now()
);
alter table public.inspiration_posts enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='inspiration_posts' and policyname='inspiration_read_own'
  ) then
    create policy inspiration_read_own on public.inspiration_posts
      for select using (auth.uid() = uid);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='inspiration_posts' and policyname='inspiration_insert_own'
  ) then
    create policy inspiration_insert_own on public.inspiration_posts
      for insert with check (auth.uid() = uid);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='inspiration_posts' and policyname='inspiration_update_own'
  ) then
    create policy inspiration_update_own on public.inspiration_posts
      for update using (auth.uid() = uid) with check (auth.uid() = uid);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='inspiration_posts' and policyname='inspiration_delete_own'
  ) then
    create policy inspiration_delete_own on public.inspiration_posts
      for delete using (auth.uid() = uid);
  end if;
end $$;

-- ==============================
-- STORAGE (bucket 'inspiration')
-- ==============================
-- Algum ambiente pode não expor storage.create_bucket(); portanto, inserimos direto na tabela.
insert into storage.buckets (id, name, public)
values ('inspiration','inspiration', true)
on conflict (id) do nothing;

-- Policies no storage.objects (cria somente se não existirem)
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='inspiration_public_read'
  ) then
    create policy inspiration_public_read on storage.objects
      for select using (bucket_id = 'inspiration');
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='inspiration_upload_own'
  ) then
    create policy inspiration_upload_own on storage.objects
      for insert to authenticated
      with check (bucket_id = 'inspiration' and owner = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='inspiration_update_own'
  ) then
    create policy inspiration_update_own on storage.objects
      for update to authenticated
      using (bucket_id = 'inspiration' and owner = auth.uid())
      with check (bucket_id = 'inspiration' and owner = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='inspiration_delete_own'
  ) then
    create policy inspiration_delete_own on storage.objects
      for delete to authenticated
      using (bucket_id = 'inspiration' and owner = auth.uid());
  end if;
end $$;

-- ==============================
-- FIM
-- ==============================
