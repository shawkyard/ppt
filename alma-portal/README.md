# Alma Team Portal

A multi-tenant team hub for Alma Loyalty: **workspaces**, a **collateral library**,
a **pinned broadcast**, a **team message channel**, and a **team roster** — one place
where the team logs in, sees everything, and communicates.

## Two modes

| Mode | When | Where data lives |
|------|------|------------------|
| **Demo** (default) | No env keys set | This browser (localStorage). Great for a clickable, shareable preview. |
| **Supabase** (live) | `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` set | Real, shared, multi-tenant accounts. Messages reach the whole team. |

Demo mode is per-browser, so messages don't travel between people. Flip on Supabase
to make it a real team tool.

## Run locally

```bash
cd alma-portal
npm install
npm run dev
```

## Go live for the whole team (Supabase)

1. Create a free project at **supabase.com**.
2. In the Supabase **SQL editor**, run `supabase/schema.sql` (sets up workspaces,
   memberships, collateral, messages, and row-level security for tenant isolation).
3. Copy **Project Settings → API**: the Project URL and the `anon` public key.
4. Put them in `.env` (see `.env.example`):
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
5. Redeploy. The same portal is now live shared accounts for everyone.

## Deploy

Static SPA — build with `npm run build`, serve `dist/`.

- **Cloudflare Pages / Netlify / Vercel**: build command `npm run build`, output `dist`,
  base directory `alma-portal`. Set the two `VITE_SUPABASE_*` env vars in the host to go live.
- `netlify.toml` and `public/_redirects` are included for SPA routing.
