import type {
  Post,
  Project,
  Service,
  SiteSetting,
  Tool,
} from './generated/payload-types'

export const DEFAULT_CMS_API_URL =
	'https://portfolio-studio.hamza-personal.workers.dev/api'

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

export interface CmsClientOptions {
  /** Base URL of the Payload REST API, e.g. https://admin.byhamza.xyz/api */
  baseUrl?: string
  /** Custom fetcher — e.g. a Cloudflare service-binding fetch (env.STUDIO.fetch) */
  fetcher?: FetchLike
  /** ISR revalidation window in seconds (default: 3600) */
  revalidate?: number
}

interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
}

/**
 * Typed client for the studio's Payload REST API.
 * Used by the public web worker so it never needs Payload in its own bundle.
 */
export function createCmsClient(options: CmsClientOptions = {}) {
  const baseUrl = (options.baseUrl || DEFAULT_CMS_API_URL).replace(/\/+$/, '')
  const doFetch: FetchLike = options.fetcher || fetch
  const revalidate = options.revalidate ?? 3600

  async function api<T>(path: string): Promise<T> {
    const res = await doFetch(`${baseUrl}${path}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate },
    })
    if (!res.ok) {
      throw new Error(`CMS API request failed: ${res.status} ${path}`)
    }
    return res.json() as Promise<T>
  }

  return {
    /** Published projects, ordered by `order` field. depth=2 populates media URLs. */
    async getProjects(): Promise<Project[]> {
      const res = await api<PaginatedResponse<Project>>(
        '/projects?where[published][equals]=true&sort=order&depth=2&limit=100',
      )
      return res.docs
    },

    async getPosts(): Promise<Post[]> {
      const res = await api<PaginatedResponse<Post>>(
        '/posts?where[published][equals]=true&sort=-publishedDate&depth=2&limit=100',
      )
      return res.docs
    },

    async getPostSlugs(): Promise<string[]> {
      const res = await api<PaginatedResponse<Pick<Post, 'slug'>>>(
        '/posts?where[published][equals]=true&select[slug]=true&limit=200',
      )
      return res.docs.map((d) => d.slug).filter((s): s is string => Boolean(s))
    },

    async getPost(slug: string): Promise<Post | null> {
      const res = await api<PaginatedResponse<Post>>(
        `/posts?where[slug][equals]=${encodeURIComponent(slug)}&where[published][equals]=true&depth=2&limit=1`,
      )
      return res.docs[0] ?? null
    },

    async getTools(): Promise<Tool[]> {
      const res = await api<PaginatedResponse<Tool>>(
        '/tools?where[published][equals]=true&sort=order&depth=1&limit=200',
      )
      return res.docs
    },

    async getServices(): Promise<Service[]> {
      const res = await api<PaginatedResponse<Service>>(
        '/services?where[published][equals]=true&sort=order&depth=2&limit=100',
      )
      return res.docs
    },

    async getSiteSettings(): Promise<SiteSetting | null> {
      return api<SiteSetting>('/globals/site-settings?depth=1')
    },
  }
}

export type CmsClient = ReturnType<typeof createCmsClient>

/**
 * Resolves a media URL from the CMS to an absolute URL.
 * Payload returns relative paths like `/api/media/file/x.jpg` which only
 * resolve on the studio origin — prefix it so assets work on the web domain.
 */
export function mediaUrl(url?: string | null): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base = (
    (typeof process !== 'undefined' &&
      (process.env.NEXT_PUBLIC_CMS_API_URL || process.env.CMS_API_URL)) ||
    DEFAULT_CMS_API_URL
  ).replace(/\/api\/?$/, '')
  return `${base}${url.startsWith('/') ? url : `/${url}`}`
}
