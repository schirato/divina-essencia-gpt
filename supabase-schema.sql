-- Enable UUID
create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists public.profiles (
  uid uuid primary key references auth.users(id) on delete cascade,
  name text,
  archetype text check (archetype in ('afrodite','sereia','cleopatra','hera')),
  avatar_url text,
  created_at timestamp with time zone default now()
);
alter table public.profiles enable row level security;
create policy "Profiles are viewable by owner" on public.profiles for select using (auth.uid() = uid);
create policy "Profiles are insertable by owner" on public.profiles for insert with check (auth.uid() = uid);
create policy "Profiles are updatable by owner" on public.profiles for update using (auth.uid() = uid);

-- Planner entries
create table if not exists public.planner_entries (
  id uuid primary key default uuid_generate_v4(),
  uid uuid references auth.users(id) on delete cascade,
  date date not null,
  content text,
  created_at timestamp with time zone default now()
);
alter table public.planner_entries enable row level security;
create policy "Planner readable by owner" on public.planner_entries for select using (auth.uid() = uid);
create policy "Planner write by owner" on public.planner_entries for insert with check (auth.uid() = uid);
create policy "Planner update by owner" on public.planner_entries for update using (auth.uid() = uid);
create policy "Planner delete by owner" on public.planner_entries for delete using (auth.uid() = uid);

-- Achievements
create table if not exists public.achievements (
  id uuid primary key default uuid_generate_v4(),
  uid uuid references auth.users(id) on delete cascade,
  code text not null,
  created_at timestamp with time zone default now()
);
alter table public.achievements enable row level security;
create policy "Achievements by owner" on public.achievements for all using (auth.uid() = uid) with check (auth.uid() = uid);

-- Inspiration posts (optional community; require Storage rules for images)
create table if not exists public.inspiration_posts (
  id uuid primary key default uuid_generate_v4(),
  uid uuid references auth.users(id) on delete cascade,
  image_url text not null,
  caption text,
  created_at timestamp with time zone default now()
);
alter table public.inspiration_posts enable row level security;
create policy "Inspiration by owner" on public.inspiration_posts for all using (auth.uid() = uid) with check (auth.uid() = uid);
