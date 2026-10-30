-- Sample menu so the site has something to show on first run.
-- Runs automatically on `supabase db reset` (local). For a hosted project,
-- paste it into the SQL editor once. Edit prices and photos from /admin.

insert into public.categories (name, sort_order) values
  ('Maki Rolls', 1),
  ('Sushi Bake', 2),
  ('Sashimi & Nigiri', 3),
  ('Drinks', 4)
on conflict do nothing;

insert into public.tags (name) values
  ('Best Seller'),
  ('New'),
  ('Spicy')
on conflict do nothing;

insert into public.products (category_id, name, description, price, sort_order)
select c.id, p.name, p.description, p.price, p.sort_order
from (values
  ('Maki Rolls',       'California Maki (8 pcs)',  'Crabstick, mango, cucumber and Japanese mayo topped with roe.', 220.00, 1),
  ('Maki Rolls',       'Spicy Tuna Roll (8 pcs)',  'Fresh tuna tossed in spicy mayo with cucumber.',                  260.00, 2),
  ('Maki Rolls',       'Kani Mango Roll (8 pcs)',  'Kani salad and sweet ripe mango, finished with sesame.',          240.00, 3),
  ('Sushi Bake',       'Classic Sushi Bake (Small)', 'Baked rice, kani, salmon and mayo. Good for 2-3. Comes with nori sheets.', 350.00, 1),
  ('Sushi Bake',       'Classic Sushi Bake (Large)', 'Baked rice, kani, salmon and mayo. Good for 5-6. Comes with nori sheets.', 650.00, 2),
  ('Sashimi & Nigiri', 'Salmon Sashimi (6 slices)', 'Thick-cut fresh salmon with wasabi and soy.',                    320.00, 1),
  ('Sashimi & Nigiri', 'Salmon Nigiri (4 pcs)',     'Hand-pressed rice topped with fresh salmon.',                   210.00, 2),
  ('Drinks',           'Iced Green Tea',           'House-brewed and lightly sweetened.',                             60.00, 1)
) as p(category, name, description, price, sort_order)
join public.categories c on c.name = p.category
on conflict do nothing;

insert into public.product_tags (product_id, tag_id)
select pr.id, t.id
from (values
  ('California Maki (8 pcs)',    'Best Seller'),
  ('Spicy Tuna Roll (8 pcs)',    'Spicy'),
  ('Classic Sushi Bake (Large)', 'Best Seller'),
  ('Kani Mango Roll (8 pcs)',    'New')
) as x(product, tag)
join public.products pr on pr.name = x.product
join public.tags t on t.name = x.tag
on conflict do nothing;
