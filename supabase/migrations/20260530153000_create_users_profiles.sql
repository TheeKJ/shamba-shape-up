create type public.app_user_role as enum ('investor', 'farmer', 'worker', 'admin');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role public.app_user_role not null,
  phone text,
  county text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index users_role_idx on public.users(role);
create index users_email_idx on public.users(email);

alter table public.users enable row level security;

create policy "Users can read their own profile"
  on public.users
  for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
