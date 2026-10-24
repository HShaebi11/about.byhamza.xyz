# Hamza Shaebi | Portfolio + Studio (Cloudflare Native Monorepo)

A high-performance portfolio for Hamza Shaebi, split into a lean public site and a separate Payload CMS studio — both running natively on **Cloudflare Workers** with **D1** and **R2**, via `@opennextjs/cloudflare`.

## Repository Layout

```
apps/
  web/        Public portfolio — Next.js 16, GSAP, no Payload in the bundle
  studio/     Payload CMS 3 + CRM (inquiries, clients, invoices, Stripe)
packages/
  cms/        Shared collections, globals, generated types, typed API client
```

## Architecture

```
┌──────────────────────────┐        ┌──────────────────────────┐
│   apps/web worker        │        │   apps/studio            │
│   portfolio-web          │        │   MacBook and/or Worker  │
│  / /blog /tools          │        │  /admin  CRM  Stripe     │
│  /services /api/media    │        └───────────┬──────────────┘
└────────────┬─────────────┘                    │
             │         both read/write D1 + R2    │
             └──────────────┬─────────────────────┘
                            ▼
              ┌────────────────────────────┐
              │  D1 portfolio-d1           │
              │  R2 portfolio-media        │
              │  R2 portfolio-web-cache    │
              └────────────────────────────┘
```

The public site reads **published** rows from D1 and files from R2. It does
not boot Payload, so visitors stay on the Workers Free CPU budget.

### Two ways to edit

1. **MacBook (works on Free):** `npm run dev -w apps/studio` on port 3001.
   For production data, run studio with Wrangler remote bindings so localhost
   writes to the live D1/R2.
2. **Internet `/admin`:** keep deploying `portfolio-studio`. On Workers Free
   the first load may Error 1102 (10ms CPU). Turn on **Workers Paid ($5)** in
   the Cloudflare dashboard when you want that URL to work; no code change.

Public pages revalidate once a day (`revalidate = 86400`). Failed CMS reads
are not cached.

## Local Development

```bash
npm install                     # installs all workspaces
npm run dev -w apps/studio      # studio on :3001 (Payload admin at /admin)
npm run dev -w apps/web         # web on :3000
```

For `next dev` on web (no D1), set `CMS_API_URL=http://localhost:3001/api`
so it can still talk to local Studio over HTTP. Production uses D1 directly.

Seed local data:

```bash
npm run seed -w apps/studio
```

## Cloudflare Preview

```bash
# Apply schema to local D1 (studio dir, one-time)
cd apps/studio
npx wrangler d1 execute portfolio-d1 --local --file=./migrations/0001_init.sql
npx wrangler d1 execute portfolio-d1 --local --file=./migrations/0002_seed.sql
npx wrangler d1 execute portfolio-d1 --local --file=./migrations/0003_content_expansion.sql

npm run preview -w apps/studio   # :8787 — Payload admin (may be heavy on Free)
npm run preview -w apps/web      # :8788 (pass -- --port 8788); uses local D1/R2
```

## Deployment

**Deploy order:** studio first is still fine (shared D1/R2), then web.
The public site no longer calls the studio Worker at request time.

```bash
npm run deploy -w apps/studio
npm run deploy -w apps/web
```

- Studio: `portfolio-studio.hamza-personal.workers.dev` (intended: `admin.byhamza.xyz`)
- Web: `portfolio-web.hamza-personal.workers.dev` (intended: `about.byhamza.xyz`)

### Cloudflare account layout

Resources live in the **Personal** account
(`d8029516e0a19fdd4d7fedeb1a44c6aa`, workers.dev subdomain
`hamza-personal`). The **Screening** account
(`9e23c4aff5c32a1fb7650453b7eee0fe`) holds the Screening platform, and
**Interfaces** (`8445a35064a3489bbeaae0003b888555`) is reserved for general
Interfaces Company work.

Deploys to Personal use the `portfolio-deploy` API token (Workers/D1/R2
read-write, scoped to that account) rather than the wrangler OAuth grant:

```bash
export CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=d8029516e0a19fdd4d7fedeb1a44c6aa
```

To attach the custom domains, `byhamza.xyz` must be added as a zone on the
Cloudflare account, then add to each `wrangler.jsonc`:

```jsonc
"routes": [{ "pattern": "admin.byhamza.xyz", "custom_domain": true }]
```

…and update `NEXT_PUBLIC_SITE_URL` in `apps/web/wrangler.jsonc` plus
`NEXT_PUBLIC_SERVER_URL` on studio.

### Remote D1 migrations

```bash
cd apps/studio
npx wrangler d1 execute portfolio-d1 --remote --file=./migrations/0003_content_expansion.sql
npx wrangler d1 execute portfolio-d1 --remote --file=./migrations/0004_seed_content.sql
```

Migration tracks: Payload TS migrations (`migrations/*.ts` + `index.ts`,
generated via `npm run payload migrate:create -w apps/studio`) are mirrored
by raw SQL files applied with `wrangler d1 execute`.

### Secrets (studio worker)

Set via `wrangler secret bulk --name portfolio-studio` or
`wrangler secret put`: `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`,
`DATABASE_URL`, `STORAGE_ADAPTER`, `PREVIEW_SECRET`, PostHog/Stripe/AI keys
as needed.

## Studio APIs

- Admin: `/admin`
- REST: `/api/projects`, `/api/posts`, `/api/tools`, `/api/services`,
  `/api/media`, `/api/inquiries`, `/api/clients`, `/api/invoices`,
  `/api/globals/site-settings`
- GraphQL: `/api/graphql`, playground `/api/graphql-playground`
- Webhooks: `POST /api/stripe/webhook`, `POST /api/convert-inquiry-to-client`

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev -w apps/{web,studio}` | Next.js dev server for one app |
| `npm run build -w apps/web` | Production Next.js build |
| `npm run build:worker -w apps/web` | Package into `.open-next/worker.js` |
| `npm run preview -w apps/studio` | Wrangler preview with local D1/R2 |
| `npm run deploy -w apps/studio` | Build + deploy worker |
| `npm run generate:types -w apps/studio` | Regenerate Payload types → `packages/cms/generated` |
| `npm run seed -w apps/studio` | Seed projects/settings/posts/tools/services |
| `npm run lint` | ESLint across the monorepo |
