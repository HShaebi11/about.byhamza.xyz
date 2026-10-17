# Hamza Shaebi | Portfolio with Payload CMS (Cloudflare Native)

A high-performance portfolio for Hamza Shaebi built with **Next.js 16 (App Router)**, **GSAP**, and integrated with **Payload CMS 3.x**, running natively on **Cloudflare Workers**, **Cloudflare D1 (SQLite database)**, and **Cloudflare R2 (media storage)** via `@opennextjs/cloudflare`.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Deployment Platform**: Cloudflare Workers (Edge runtime via OpenNext)
- **CMS**: Payload CMS 3.x (Headless CMS running directly in Next.js on Cloudflare Workers)
- **Database**: Cloudflare D1 (Serverless SQLite at the edge) with local SQLite fallback
- **Object Storage**: Cloudflare R2 (S3-compatible bucket storage via `@payloadcms/storage-r2`)
- **Rich Text**: Lexical Editor (`@payloadcms/richtext-lexical`)
- **Animation**: GSAP (GreenSock) & SplitText
- **Styling**: Modern CSS Modules with Responsive Fluid Typography

---

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Cloudflare Worker                    │
│                                                        │
│  ┌───────────────────────┐  ┌───────────────────────┐  │
│  │     Next.js 16        │  │     Payload CMS 3     │  │
│  │   Portfolio Routes    │  │  Admin, REST, GraphQL │  │
│  │       app/(frontend)  │  │       app/(payload)   │  │
│  └───────────┬───────────┘  └───────────┬───────────┘  │
└──────────────┼──────────────────────────┼──────────────┘
               ▼                          ▼
     ┌──────────────────┐       ┌──────────────────┐
     │  Cloudflare D1   │       │  Cloudflare R2   │
     │  SQL Database    │       │  Media Storage   │
     └──────────────────┘       └──────────────────┘
```

---

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### 3. Seed Initial Data
```bash
npm run seed
```

---

## Cloudflare Preview (Local Simulation)

Test the compiled Cloudflare Worker locally with Miniflare running local D1 and R2 bindings:

```bash
# 1. Build Next.js & package for Cloudflare Workers
npm run build:worker

# 2. Initialize local D1 database schema (one-time setup for local simulation)
npx wrangler d1 execute portfolio-d1 --local --file=./migrations/0001_init.sql
npx wrangler d1 execute portfolio-d1 --local --file=./migrations/0002_seed.sql

# 3. Preview Worker locally
npm run preview
```
Open [http://localhost:8787](http://localhost:8787) to view the worker preview.

---

## Cloudflare Production Deployment Guide

### Step 1: Login to Cloudflare
```bash
npx wrangler login
```

### Step 2: Create Cloudflare D1 Database
Create the production D1 database:
```bash
npx wrangler d1 create portfolio-d1
```
This command outputs your database configuration:
```jsonc
{
  "binding": "DB",
  "database_name": "portfolio-d1",
  "database_id": "<YOUR-DATABASE-UUID>"
}
```
Update the `database_id` inside `wrangler.jsonc` with your `<YOUR-DATABASE-UUID>`.

### Step 3: Create Cloudflare R2 Bucket
Create the production media storage bucket:
```bash
npx wrangler r2 bucket create portfolio-media
```

### Step 4: Apply Database Migrations to Remote D1
Run the initial database schema against your live remote D1 database:
```bash
npx wrangler d1 execute portfolio-d1 --remote --file=./migrations/0001_init.sql
npx wrangler d1 execute portfolio-d1 --remote --file=./migrations/0002_seed.sql
```

### Step 5: Set Production Secrets
Set your production Payload secret on Cloudflare:
```bash
npx wrangler secret put PAYLOAD_SECRET
```
*(Enter a strong random 32+ character hex string)*.

### Step 6: Deploy to Cloudflare Workers
```bash
npm run deploy
```

---

## Payload CMS Admin Panel & APIs

- **Admin Panel**: `/admin` (create your first admin user upon first visit)
- **REST API**:
  - `GET /api/projects`: List all portfolio projects
  - `GET /api/globals/site-settings`: Fetch portfolio site settings
  - `GET /api/media`: Access uploaded media assets
- **GraphQL API**:
  - Endpoint: `POST /api/graphql`
  - Playground: `/api/graphql-playground`

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Next.js development server locally |
| `npm run build` | Compile Next.js production build |
| `npm run build:worker` | Package Next.js application into `.open-next/worker.js` for Cloudflare |
| `npm run preview` | Run local Wrangler preview of the compiled Worker with Miniflare D1/R2 |
| `npm run deploy` | Build and deploy directly to Cloudflare Workers |
| `npm run cf-typegen` | Regenerate TypeScript types for Cloudflare bindings |
| `npm run seed` | Seed initial projects and site settings |
| `npm run lint` | Run ESLint check |
