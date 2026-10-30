# Cleosushilovers

Online menu and ordering for Cleosushilovers. Customers browse the menu, build an order, enter delivery details, download an order slip image and send it to the shop's Facebook page on Messenger. Admins edit products, prices and photos.

**Stack:** React + Vite · Tailwind CSS v4 · Supabase (Postgres, Auth, RLS, Storage, SQL migrations)

## Setup

1. **Install**
   ```bash
   npm install
   ```
2. **Create a Supabase project** at <https://supabase.com>, then link this folder and apply the migrations:
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npm run db:push
   ```
   For sample menu data, paste [`supabase/seed.sql`](supabase/seed.sql) into the dashboard's SQL editor once.
3. **Environment**: copy `.env.example` to `.env.local` and fill in:
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Project Settings → API (anon/publishable key only, never `service_role`)
   - `VITE_FACEBOOK_MESSENGER_URL`: your page's link, e.g. `https://m.me/yourpagename`
4. **Create the admin account**
   - Dashboard → Authentication → Users → *Add user* (email + password).
   - Dashboard → Authentication → Sign In / Providers → turn **off** "Allow new users to sign up".
   - Grant the admin role in the SQL editor:
     ```sql
     insert into public.user_roles (user_id, role_id)
     select u.id, r.id from auth.users u, public.roles r
     where u.email = 'owner@example.com' and r.name = 'admin';
     ```
5. **Run**
   ```bash
   npm run dev
   ```
   Customer site: `/` · Admin: `/admin`

## Database changes

Every schema change is a new migration file. Never edit one that has already been pushed.

```bash
npm run db:new -- add_something   # creates supabase/migrations/<timestamp>_add_something.sql
npm run db:push                   # applies pending migrations to the linked project
```

See [docs/database.md](docs/database.md) for the schema and normalization notes.

## Project structure

```
src/
  app/                 routes, providers, public layout
  shared/              cross-feature building blocks
    components/ui/     Card, Button, TextField, PasswordField, SelectField, Dialog…
    lib/               supabase client, money, storage, design tokens (styles.js)
    theme/             dark/light theme provider + toggle
  features/
    menu/              public menu            ┐
    cart/              order review           │ each has
    checkout/          delivery + order slip  │ pages/ components/
    auth/              admin sign-in          │ services/ hooks/
    admin/             menu manager           ┘
supabase/
  migrations/          versioned SQL migrations
  seed.sql             sample menu
```

All cards, buttons and fields share one surface style defined in `src/shared/lib/styles.js`:
`rounded-3xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl`. Colors are theme tokens in `src/index.css`, taken from the logo.

## Deploying

This is a single-page app, so the host must serve `index.html` for every route. `vercel.json` (Vercel) and `public/_redirects` (Netlify) already handle this. Set the same `VITE_*` variables in the host's environment settings.
