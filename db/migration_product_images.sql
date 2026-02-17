-- Create product_images table
create table if not exists product_images (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  image_url text not null,
  order_index integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(product_id, order_index)
);

-- Indexes
create index if not exists product_images_product_id_idx on product_images(product_id);
create index if not exists product_images_order_idx on product_images(product_id, order_index);

-- Trigger for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_product_images_updated_at
    before update on product_images
    for each row
    execute function update_updated_at_column();

-- RLS
alter table product_images enable row level security;

create policy "Product images are viewable by everyone"
  on product_images for select using (true);

create policy "Admins can manage product images"
  on product_images for all
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
