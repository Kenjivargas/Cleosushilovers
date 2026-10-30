-- =============================================================================
-- Roles: users <-> roles is many-to-many, resolved by the user_roles junction.
-- Accounts live in auth.users (Supabase Auth); this only records who may do what.
-- =============================================================================

create table public.roles (
  id    smallint generated always as identity primary key,
  name  text not null unique,
  constraint roles_name_format check (name ~ '^[a-z_]{2,30}$')
);

create table public.user_roles (
  user_id     uuid not null references auth.users (id) on delete cascade,
  role_id     smallint not null references public.roles (id) on delete cascade,
  granted_at  timestamptz not null default now(),
  primary key (user_id, role_id)
);

create index user_roles_role_id_idx on public.user_roles (role_id);

insert into public.roles (name) values ('admin');

-- True when the signed-in user holds the admin role. SECURITY DEFINER so RLS
-- policies can call it without exposing user_roles to everyone.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = (select auth.uid())
      and r.name = 'admin'
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
