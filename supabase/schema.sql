-- ============================================================
-- KaelThrift Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Products table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text unique not null default ('KT-' || substr(gen_random_uuid()::text, 1, 8)),
  category text not null check (category in ('dresses','tops','jeans','shoes','bags','accessories')),
  size text not null,
  price numeric not null check (price > 0),
  condition text not null check (condition in ('New with tags','Excellent','Good')),
  quantity integer not null default 1 check (quantity >= 0),
  measurements jsonb default '{}',
  description text,
  status text not null default 'available' check (status in ('available','reserved','sold')),
  images text[] not null default '{}',
  sold_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Performance indexes
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_status on products(status);
create index if not exists idx_products_sku on products(sku);
create index if not exists idx_products_created_at on products(created_at desc);
create index if not exists idx_products_price on products(price);
create index if not exists idx_products_quantity on products(quantity);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table products enable row level security;

-- Public: can only read available (quantity > 0) and recently sold items
create policy "public_read_available" on products
  for select using (
    status = 'available' AND quantity > 0
  );

-- Authenticated admin: full access for all operations
create policy "admin_full_access" on products
  for all using (auth.role() = 'authenticated');

-- ============================================================
-- Triggers
-- ============================================================

-- Auto-update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- Auto-set sold_at when status changes to 'sold'
create or replace function set_sold_at()
returns trigger as $$
begin
  if new.status = 'sold' and (old.status is null or old.status != 'sold') then
    new.sold_at = now();
  elsif new.status != 'sold' then
    new.sold_at = null;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger products_set_sold_at
  before insert or update on products
  for each row execute function set_sold_at();

-- Auto-set status to 'sold' when quantity reaches 0
create or replace function auto_sold_on_zero_quantity()
returns trigger as $$
begin
  if new.quantity = 0 and new.status = 'available' then
    new.status = 'sold';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger products_auto_sold
  before insert or update on products
  for each row execute function auto_sold_on_zero_quantity();

-- ============================================================
-- Analytics Events (lightweight, no PII)
-- ============================================================
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  product_id uuid references products(id) on delete set null,
  created_at timestamptz default now()
);

alter table analytics_events enable row level security;

-- Public can insert events (rate limited by app logic)
create policy "public_insert_events" on analytics_events
  for insert with check (true);

-- Only admin can read analytics
create policy "admin_read_events" on analytics_events
  for select using (auth.role() = 'authenticated');

-- ============================================================
-- Storage: Create bucket for product images
-- Run this separately or use the Supabase Dashboard → Storage
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);
