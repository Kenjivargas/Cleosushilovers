-- =============================================================================
-- Menu schema (normalized to 4NF)
--
--   categories 1 ──< products >──< product_tags >── tags
--
-- * Every table has a single-attribute surrogate key; natural keys are kept
--   unique with constraints so no fact is stored twice.
-- * A product belongs to exactly one category (FD: product.id -> category_id).
-- * Tags are an independent multi-valued fact of a product, so they live in
--   their own junction table (4NF) instead of a repeating column or array.
-- * Image URLs are derived from `image_path` + bucket at read time; only the
--   storage path is stored.
-- =============================================================================

-- Keeps updated_at current on every row change.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- categories
-- -----------------------------------------------------------------------------
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint categories_name_length check (char_length(btrim(name)) between 1 and 60)
);

create unique index categories_name_unique on public.categories (lower(btrim(name)));

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- products
-- -----------------------------------------------------------------------------
create table public.products (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null references public.categories (id) on delete restrict,
  name          text not null,
  description   text,
  price         numeric(10, 2) not null,
  image_path    text,
  is_available  boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint products_name_length check (char_length(btrim(name)) between 1 and 80),
  constraint products_description_length check (description is null or char_length(description) <= 500),
  constraint products_price_non_negative check (price >= 0),
  constraint products_image_path_not_blank check (image_path is null or char_length(btrim(image_path)) > 0)
);

-- A product name is unique within its category.
create unique index products_category_name_unique on public.products (category_id, lower(btrim(name)));
create index products_category_id_idx on public.products (category_id);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- tags (e.g. "Best Seller", "Spicy") and the products <-> tags junction
-- -----------------------------------------------------------------------------
create table public.tags (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz not null default now(),
  constraint tags_name_length check (char_length(btrim(name)) between 1 and 30)
);

create unique index tags_name_unique on public.tags (lower(btrim(name)));

create table public.product_tags (
  product_id  uuid not null references public.products (id) on delete cascade,
  tag_id      uuid not null references public.tags (id) on delete cascade,
  primary key (product_id, tag_id)
);

-- The primary key already covers lookups by product_id.
create index product_tags_tag_id_idx on public.product_tags (tag_id);
