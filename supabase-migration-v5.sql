-- v5 non-destructive migration
create table if not exists public.archetypes (
  id text primary key,
  name text not null,
  summary text,
  created_at timestamptz default now()
);

insert into public.archetypes (id, name, summary) values
  ('mae','Mãe','Cuidado, nutrição e proteção.'),
  ('donzela','Donzela','Frescor, leveza e começo.'),
  ('mistica','Mística','Intuição, mistério, espiritualidade.'),
  ('amante','Amante','Sensualidade, magnetismo e conexão.'),
  ('soberana','Soberana','Liderança, sofisticação, poder.'),
  ('cacadora','Caçadora','Foco, autonomia, movimento.'),
  ('sabia','Sábia','Conhecimento, serenidade, visão.')
on conflict (id) do nothing;

do $$
begin
  if exists (
    select 1 from information_schema.constraint_column_usage
    where table_schema='public' and table_name='profiles'
      and constraint_name like 'profiles_archetype_check%'
  ) then
    alter table public.profiles drop constraint if exists profiles_archetype_check;
  end if;
exception when undefined_table then null;
end $$;

alter table public.profiles
  add column if not exists archetype text,
  add constraint profiles_archetype_fk
    foreign key (archetype) references public.archetypes(id)
    on update cascade on delete set null;

update public.profiles set archetype='amante'
  where archetype in ('afrodite')
    and not exists (select 1 from public.archetypes where id=public.profiles.archetype);
update public.profiles set archetype='mistica'
  where archetype in ('sereia')
    and not exists (select 1 from public.archetypes where id=public.profiles.archetype);
update public.profiles set archetype='soberana'
  where archetype in ('cleopatra')
    and not exists (select 1 from public.archetypes where id=public.profiles.archetype);
update public.profiles set archetype='mae'
  where archetype in ('hera')
    and not exists (select 1 from public.archetypes where id=public.profiles.archetype);

do $$
begin
  if not exists (select 1 from pg_policies where polname = 'Profiles are viewable by owner') then
    create policy "Profiles are viewable by owner" on public.profiles for select using (auth.uid() = uid);
  end if;
  if not exists (select 1 from pg_policies where polname = 'Profiles are insertable by owner') then
    create policy "Profiles are insertable by owner" on public.profiles for insert with check (auth.uid() = uid);
  end if;
  if not exists (select 1 from pg_policies where polname = 'Profiles are updatable by owner') then
    create policy "Profiles are updatable by owner" on public.profiles for update using (auth.uid() = uid);
  end if;
end $$;
