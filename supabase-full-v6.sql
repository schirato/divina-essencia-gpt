-- =====================================================
-- Divina Essência — Supabase FULL schema (v6, idempotent)
-- Segura para rodar mais de uma vez.
-- Testada em Postgres 15 (Supabase). Ajuste nomes conforme necessário.
-- =====================================================

-- Extensões úteis
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ==============================
-- Lookups
-- ==============================
create table if not exists public.archetypes (
  id text primary key,
  name text not null,
  summary text,
  created_at timestamptz default now()
);

-- Seed das Deusas (upsert)
insert into public.archetypes (id, name, summary) values
  ('afrodite','Afrodite','Amor, sensualidade e magnetismo criativo.'),
  ('atena','Atena','Estratégia, sabedoria prática e liderança racional.'),
  ('artemis','Ártemis','Autonomia, foco e conexão com a natureza.'),
  ('hera','Hera','Soberania, compromisso e sofisticação clássica.'),
  ('demeter','Deméter','Nutrição, abundância e cuidado.'),
  ('persefone','Perséfone','Transformação, mistério e renovação cíclica.'),
  ('hestia','Héstia','Presença serena, autocuidado e centramento.')
on conflict (id) do nothing;

-- ==============================
-- Profiles
-- ==============================
create table if not exists public.profiles (
  uid uuid primary key references auth.users(id) on delete cascade,
  name text,
  archetype text references public.archetypes(id),
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

-- Policies (compat: PG 15 usa column 'policyname' em pg_policies)
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='Profiles select own'
  ) then
    create policy "Profiles select own" on public.profiles
      for select using (auth.uid() = uid);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='Profiles insert own'
  ) then
    create policy "Profiles insert own" on public.profiles
      for insert with check (auth.uid() = uid);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='Profiles update own'
  ) then
    create policy "Profiles update own" on public.profiles
      for update using (auth.uid() = uid);
  end if;
end $$;

-- ==============================
-- Planner entries
-- ==============================
create table if not exists public.planner_entries (
  id uuid primary key default uuid_generate_v4(),
  uid uuid references auth.users(id) on delete cascade,
  date date not null,
  content text,
  updated_at timestamptz not null default now(),
  created_at timestamptz default now()
);
alter table public.planner_entries enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='planner_entries' and policyname='Planner read own'
  ) then
    create policy "Planner read own" on public.planner_entries
      for select using (auth.uid() = uid);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='planner_entries' and policyname='Planner write own'
  ) then
    create policy "Planner write own" on public.planner_entries
      for insert with check (auth.uid() = uid);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='planner_entries' and policyname='Planner update own'
  ) then
    create policy "Planner update own" on public.planner_entries
      for update using (auth.uid() = uid) with check (auth.uid() = uid);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='planner_entries' and policyname='Planner delete own'
  ) then
    create policy "Planner delete own" on public.planner_entries
      for delete using (auth.uid() = uid);
  end if;
end $$;

-- Índice útil para consultas por usuário/data
create index if not exists idx_planner_uid_date on public.planner_entries (uid, date);

-- ==============================
-- Achievements
-- ==============================
create table if not exists public.achievements (
  id uuid primary key default uuid_generate_v4(),
  uid uuid references auth.users(id) on delete cascade,
  code text not null,
  created_at timestamptz default now()
);
alter table public.achievements enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='achievements' and policyname='Achievements own all'
  ) then
    create policy "Achievements own all" on public.achievements
      for all using (auth.uid() = uid) with check (auth.uid() = uid);
  end if;
end $$;

create index if not exists idx_achievements_uid_code on public.achievements (uid, code);

-- ==============================
-- Inspiration posts (DB)
-- ==============================
create table if not exists public.inspiration_posts (
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
    select 1 from pg_policies where schemaname='public' and tablename='inspiration_posts' and policyname='Inspiration read own'
  ) then
    create policy "Inspiration read own" on public.inspiration_posts
      for select using (auth.uid() = uid);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='inspiration_posts' and policyname='Inspiration write own'
  ) then
    create policy "Inspiration write own" on public.inspiration_posts
      for insert with check (auth.uid() = uid);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='inspiration_posts' and policyname='Inspiration update own'
  ) then
    create policy "Inspiration update own" on public.inspiration_posts
      for update using (auth.uid() = uid) with check (auth.uid() = uid);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='inspiration_posts' and policyname='Inspiration delete own'
  ) then
    create policy "Inspiration delete own" on public.inspiration_posts
      for delete using (auth.uid() = uid);
  end if;
end $$;

-- ==============================
-- Storage (bucket 'inspiration')
-- ==============================
-- Cria bucket apenas se não existir
do $$
begin
  if not exists (select 1 from storage.buckets where name = 'inspiration') then
    perform storage.create_bucket('inspiration', public => true);
  end if;
end $$;

-- Policies no storage.objects (public read, owner can write/update/delete)
-- Observação: Supabase já aplica RLS em storage.objects.
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='Inspiration public read'
  ) then
    create policy "Inspiration public read" on storage.objects
      for select using (bucket_id = 'inspiration');
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='Inspiration upload own'
  ) then
    create policy "Inspiration upload own" on storage.objects
      for insert to authenticated
      with check (bucket_id = 'inspiration' and owner = auth.uid());
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='Inspiration update own'
  ) then
    create policy "Inspiration update own" on storage.objects
      for update to authenticated
      using (bucket_id = 'inspiration' and owner = auth.uid())
      with check (bucket_id = 'inspiration' and owner = auth.uid());
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='Inspiration delete own'
  ) then
    create policy "Inspiration delete own" on storage.objects
      for delete to authenticated
      using (bucket_id = 'inspiration' and owner = auth.uid());
  end if;
end $$;

-- ==============================
-- Legacy mappings (opcional): normalize valores antigos de archetype
-- Sem apagar nada — só atualiza quando o id antigo não existir em archetypes
update public.profiles set archetype='afrodite'
  where archetype in ('amante','afrodite','sereia') and 'afrodite' in (select id from public.archetypes);
update public.profiles set archetype='artemis'
  where archetype in ('cacadora','artemis') and 'artemis' in (select id from public.archetypes);
update public.profiles set archetype='atena'
  where archetype in ('sabia','atena') and 'atena' in (select id from public.archetypes);
update public.profiles set archetype='demeter'
  where archetype in ('mae','demeter') and 'demeter' in (select id from public.archetypes);
update public.profiles set archetype='persefone'
  where archetype in ('donzela','mistica','persefone') and 'persefone' in (select id from public.archetypes);
update public.profiles set archetype='hera'
  where archetype in ('soberana','cleopatra','hera') and 'hera' in (select id from public.archetypes);
update public.profiles set archetype='hestia'
  where archetype in ('hestia') and 'hestia' in (select id from public.archetypes);
