import { unstable_noStore as noStore } from 'next/cache'
import { createCmsClient, DEFAULT_CMS_API_URL, type CmsClient } from '@repo/cms/client'
import { createD1CmsClient } from '@repo/cms/d1-reader'
import { getCloudflareContext } from '@opennextjs/cloudflare'

const httpCms = createCmsClient({
  baseUrl: process.env.CMS_API_URL || DEFAULT_CMS_API_URL,
})

async function getClient(): Promise<CmsClient> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    if (env?.DB) {
      return createD1CmsClient(env.DB)
    }
  } catch {
    // Plain `next dev` has no Cloudflare context.
  }
  return httpCms
}

export const cms: CmsClient = {
  getProjects: () => getClient().then((client) => client.getProjects()),
  getPosts: () => getClient().then((client) => client.getPosts()),
  getPostSlugs: () => getClient().then((client) => client.getPostSlugs()),
  getPost: (slug) => getClient().then((client) => client.getPost(slug)),
  getTools: () => getClient().then((client) => client.getTools()),
  getServices: () => getClient().then((client) => client.getServices()),
  getSiteSettings: () => getClient().then((client) => client.getSiteSettings()),
}

/** Use in page catch blocks so empty fallbacks are not stored in ISR. */
export function skipCmsCache(error: unknown, message: string): void {
  noStore()
  console.warn(message, error)
}
