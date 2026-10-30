# Database design

Schema lives in [`supabase/migrations`](../supabase/migrations) and is applied in filename order.

```
auth.users ──< user_roles >── roles                 (who is an admin)

categories ──< products ──< product_tags >── tags    (the menu)
```

| Table          | Key                     | Purpose                                                   |
| -------------- | ----------------------- | --------------------------------------------------------- |
| `categories`   | `id`                    | Menu sections, with `sort_order` for display order        |
| `products`     | `id`, FK `category_id`  | Name, description, price, photo path, availability        |
| `tags`         | `id`                    | Labels such as "Best Seller", "Spicy"                      |
| `product_tags` | (`product_id`,`tag_id`) | Junction: products ↔ tags (many-to-many)                   |
| `roles`        | `id`                    | Role names (`admin`)                                      |
| `user_roles`   | (`user_id`,`role_id`)   | Junction: Supabase Auth users ↔ roles (many-to-many)       |

## Normal forms

- **1NF**: every column is atomic. No comma-separated tag lists or arrays; tags are rows in `product_tags`.
- **2NF**: tables with composite keys (`product_tags`, `user_roles`) hold no column that depends on only part of the key.
- **3NF**: no transitive dependencies. A product stores `category_id`, never the category name. The photo's public URL isn't stored either: it's derived from `image_path` and the bucket at read time.
- **4NF**: a product's tags are an independent multi-valued fact, so they get their own junction table. Nothing else is multi-valued, so no table mixes two independent multi-valued facts.

## Integrity

- Unique, case- and space-insensitive names: categories, tags, and product names within a category.
- `CHECK` constraints on lengths and on `price >= 0` (`numeric(10,2)`, never a float).
- `ON DELETE RESTRICT` from products to categories, so a category with products can't be deleted. `ON DELETE CASCADE` on junction rows.
- `updated_at` is maintained by a trigger.

## Security (RLS)

- The menu tables are readable by everyone (`anon`, `authenticated`) and writable only when `public.is_admin()` is true.
- `user_roles` has no write policy, so roles can't be granted through the API, only with SQL in the dashboard.
- Storage bucket `product-images` is publicly readable, and only admins can upload, replace or delete.

Orders aren't stored yet. The order slip is created in the browser and sent via Messenger (see README for the next step).
