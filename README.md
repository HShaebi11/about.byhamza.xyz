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
│   apps/web worker        │        │   apps/studio worker     │
│   about-byhamza-xyz      │───────▶│   about-byhamza-xyz-     │
│                          │service │   studio                 │
│  / /blog /tools          │binding │                          │
│  /services /project/:slug│        │  /admin /api/* /graphql  │
└──────────────────────────┘        │  Stripe webhook, CRM     │
                                    └───────────┬──────────────┘
                                                ▼
                              ┌────────────────────────────┐
                              │  D1 portfolio-d1           │
                              │  R2 portfolio-media        │
                              └────────────────────────────┘
```

The web worker reads CMS content through the studio's REST API — via the
`STUDIO` service binding in production (no public hop), or `CMS_API_URL`
over HTTPS as a fallback. Responses are cached with ISR (`revalidate`).

## Local Development

```bash
npm install                     # installs all workspaces
npm run dev -w apps/studio      # studio on :3001 (Payload admin at /admin)
npm run dev -w apps/web         # web on :3000
```

For web to reach studio locally, `apps/web/.dev.vars` sets
`CMS_API_URL=http://localhost:8787/api` (Wrangler preview) — for `next dev`
use `http://localhost:3001/api`.

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

npm run preview -w apps/studio   # :8787 — web's STUDIO binding connects to it
npm run preview -w apps/web      # :8788 (pass -- --port 8788)
```

## Deployment

**Deploy order matters — studio first** (web depends on its API):

```bash
npm run deploy -w apps/studio
npm run deploy -w apps/web
```

- Studio: `about-byhamza-xyz-studio.hamza-9e2.workers.dev` (intended: `admin.byhamza.xyz`)
- Web: `about-byhamza-xyz.hamza-9e2.workers.dev` (intended: `about.byhamza.xyz`)

To attach the custom domains, `byhamza.xyz` must be added as a zone on the
Cloudflare account, then add to each `wrangler.jsonc`:

```jsonc
"routes": [{ "pattern": "admin.byhamza.xyz", "custom_domain": true }]
```

…and update `CMS_API_URL` / `NEXT_PUBLIC_CMS_API_URL` in
`apps/web/wrangler.jsonc` and `NEXT_PUBLIC_SERVER_URL` secret on studio.

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

Set via `wrangler secret bulk --name about-byhamza-xyz-studio` or
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
