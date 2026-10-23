import { createCmsClient, DEFAULT_CMS_API_URL } from '@repo/cms/client'
import { getCloudflareContext } from '@opennextjs/cloudflare'

/**
 * Fetches content from the studio worker's Payload REST API.
 * Prefers the STUDIO service binding (worker-to-worker, no public hop)
 * when deployed; falls back to HTTPS via CMS_API_URL locally.
 */
const studioFetcher = async (input: string, init?: RequestInit): Promise<Response> => {
  try {
    const { env } = await getCloudflareContext({ async: true })
    if (env?.STUDIO) {
      // Service bindings don't accept Next.js cache options — strip them;
      // page-level `export const revalidate` handles caching.
      const stripped = { ...(init ?? {}) } as Record<string, unknown>
      delete stripped.next
      return env.STUDIO.fetch(input, stripped as RequestInit)
    }
  } catch {
    // No Cloudflare context (plain next dev) — fall through to HTTPS
  }
  return fetch(input, init)
}

export const cms = createCmsClient({
  baseUrl: process.env.CMS_API_URL || DEFAULT_CMS_API_URL,
  fetcher: studioFetcher,
})
