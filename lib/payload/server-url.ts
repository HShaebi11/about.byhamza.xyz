/**
 * Resolves the public URL of the running site.
 *
 * Order of precedence:
 * 1. `NEXT_PUBLIC_SERVER_URL` — explicit override (e.g. a custom domain).
 * 2. The deployment's own domain on Vercel:
 *    - production deployments use `VERCEL_PROJECT_PRODUCTION_URL`
 *    - preview deployments use `VERCEL_URL` (per-deployment host)
 * 3. `http://localhost:3000` for local development.
 *
 * This keeps admin preview links and Payload's `serverURL` correct across local
 * development, preview deployments, and production without hardcoding a host.
 */
export function getServerURL(): string {
  const explicit = process.env.NEXT_PUBLIC_SERVER_URL
  if (explicit) return explicit

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const deployment = process.env.VERCEL_URL

  if (process.env.VERCEL_ENV === 'production' && production) {
    return `https://${production}`
  }
  if (deployment) return `https://${deployment}`
  if (production) return `https://${production}`

  return 'http://localhost:3000'
}
