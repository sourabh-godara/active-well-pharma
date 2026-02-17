-- product_benefits table
create table if not exists product_benefits (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  benefit_text text not null check (char_length(benefit_text) <= 120),
  order_index integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(product_id, order_index)
);

-- Indexes
create index if not exists product_benefits_product_id_idx on product_benefits(product_id);
create index if not exists product_benefits_order_idx on product_benefits(product_id, order_index);

-- Trigger for updated_at
create trigger update_product_benefits_updated_at
    before update on product_benefits
    for each row
    execute function update_updated_at_column();

-- RLS
alter table product_benefits enable row level security;

create policy "Benefits are viewable by everyone"
  on product_benefits for select using (true);

create policy "Admins can manage benefits"
  on product_benefits for all
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
