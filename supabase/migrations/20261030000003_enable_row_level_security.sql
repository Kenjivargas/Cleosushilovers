-- =============================================================================
-- Row Level Security
--   * Anyone (anon or signed in) can read the menu.
--   * Only admins can change it.
--   * Users can see their own role rows; nobody can grant roles through the API.
-- =============================================================================

alter table public.categories   enable row level security;
alter table public.products     enable row level security;
alter table public.tags         enable row level security;
alter table public.product_tags enable row level security;
alter table public.roles        enable row level security;
alter table public.user_roles   enable row level security;

-- Explicit grants (RLS still decides which rows are visible / writable).
grant select on public.categories, public.products, public.tags, public.product_tags to anon, authenticated;
grant insert, update, delete on public.categories, public.products, public.tags, public.product_tags to authenticated;
grant select on public.roles, public.user_roles to authenticated;

-- categories ------------------------------------------------------------------
create policy "Menu categories are public"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "Admins can insert categories"
  on public.categories for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update categories"
  on public.categories for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete categories"
  on public.categories for delete
  to authenticated
  using ((select public.is_admin()));

-- products --------------------------------------------------------------------
create policy "Menu products are public"
  on public.products for select
  to anon, authenticated
  using (true);

create policy "Admins can insert products"
  on public.products for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update products"
  on public.products for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete products"
  on public.products for delete
  to authenticated
  using ((select public.is_admin()));

-- tags ------------------------------------------------------------------------
create policy "Tags are public"
  on public.tags for select
  to anon, authenticated
  using (true);

create policy "Admins can insert tags"
  on public.tags for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update tags"
  on public.tags for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete tags"
  on public.tags for delete
  to authenticated
  using ((select public.is_admin()));

-- product_tags ----------------------------------------------------------------
create policy "Product tags are public"
  on public.product_tags for select
  to anon, authenticated
  using (true);

create policy "Admins can insert product tags"
  on public.product_tags for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can delete product tags"
  on public.product_tags for delete
  to authenticated
  using ((select public.is_admin()));

-- roles / user_roles ----------------------------------------------------------
create policy "Signed-in users can read role names"
  on public.roles for select
  to authenticated
  using (true);

create policy "Users can read their own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = (select auth.uid()));
