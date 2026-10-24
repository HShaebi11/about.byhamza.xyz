import type {
  Media,
  Post,
  Project,
  Service,
  SiteSetting,
  Tool,
} from './generated/payload-types'
import type { CmsClient } from './client'

/** Minimal D1 surface so this package does not depend on Workers types. */
export interface D1Statement {
  bind(...values: unknown[]): D1Statement
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>
  first<T = Record<string, unknown>>(): Promise<T | null>
}

export interface D1Queryable {
  prepare(query: string): D1Statement
}

interface MediaRow {
  id: number
  alt: string
  caption: string | null
  updated_at: string
  created_at: string
  url: string | null
  thumbnail_u_r_l: string | null
  filename: string | null
  mime_type: string | null
  filesize: number | null
  width: number | null
  height: number | null
  focal_x: number | null
  focal_y: number | null
}

interface ProjectRow {
  id: number
  title: string
  slug: string | null
  project_number: string | null
  description: string
  role: string | null
  year: string | null
  client: string | null
  status: string | null
  challenge: string | null
  hero_image_id: number | null
  order: number | null
  published: number | null
  updated_at: string
  created_at: string
}

interface GalleryRow {
  id: string
  _order: number
  _parent_id: number
  image_id: number | null
  caption: string | null
}

interface PostRow {
  id: number
  title: string
  slug: string | null
  excerpt: string | null
  content: string
  cover_image_id: number | null
  author_id: number | null
  published_date: string | null
  featured: number | null
  published: number | null
  updated_at: string
  created_at: string
}

interface PostTagRow {
  id: string
  _order: number
  _parent_id: number
  tag: string
}

interface ToolRow {
  id: number
  name: string
  category: string | null
  description: string | null
  url: string | null
  icon_id: number | null
  order: number | null
  published: number | null
  updated_at: string
  created_at: string
}

interface ServiceRow {
  id: number
  title: string
  slug: string | null
  key: string | null
  summary: string
  description: string | null
  price_label: string | null
  order: number | null
  published: number | null
  updated_at: string
  created_at: string
}

interface DeliverableRow {
  id: string
  _order: number
  _parent_id: number
  item: string
}

interface SiteSettingsRow {
  id: number
  name: string | null
  description: string | null
  intro_first_name: string | null
  intro_last_name: string | null
  about_anti: string | null
  about_design: string | null
  about_for_word: string | null
  about_arrows: string | null
  about_cultural: string | null
  about_practices: string | null
  location_city_primary: string | null
  location_city_secondary: string | null
  location_status: string | null
  footer_cta_text: string | null
  footer_cta_highlight_word: string | null
  socials_twitter: string | null
  socials_github: string | null
  socials_linkedin: string | null
  socials_say_hello: string | null
  updated_at: string | null
  created_at: string | null
}

function asBool(value: number | null | undefined): boolean {
  return Boolean(value)
}

function parseJson<T>(raw: string | null, label: string): T {
  if (!raw) {
    throw new Error(`CMS D1: missing JSON for ${label}`)
  }
  try {
    return JSON.parse(raw) as T
  } catch {
    throw new Error(`CMS D1: invalid JSON for ${label}`)
  }
}

function mediaFromRow(row: MediaRow): Media {
  const filename = row.filename
  const url = filename
    ? `/api/media/file/${encodeURIComponent(filename)}`
    : row.url
  return {
    id: row.id,
    alt: row.alt,
    caption: row.caption,
    updatedAt: row.updated_at,
    createdAt: row.created_at,
    url,
    thumbnailURL: row.thumbnail_u_r_l,
    filename,
    mimeType: row.mime_type,
    filesize: row.filesize,
    width: row.width,
    height: row.height,
    focalX: row.focal_x,
    focalY: row.focal_y,
  }
}

async function loadMediaMap(
  db: D1Queryable,
  ids: Array<number | null | undefined>,
): Promise<Map<number, Media>> {
  const unique = [...new Set(ids.filter((id): id is number => typeof id === 'number'))]
  const map = new Map<number, Media>()
  if (unique.length === 0) return map
  const placeholders = unique.map(() => '?').join(', ')
  const { results } = await db
    .prepare(`SELECT * FROM media WHERE id IN (${placeholders})`)
    .bind(...unique)
    .all<MediaRow>()
  for (const row of results) {
    map.set(row.id, mediaFromRow(row))
  }
  return map
}

function populateMedia(
  id: number | null | undefined,
  media: Map<number, Media>,
): Media | number | null {
  if (id == null) return null
  return media.get(id) ?? id
}

/**
 * Reads published CMS rows from the Payload D1 schema without booting Payload.
 */
export function createD1CmsClient(db: D1Queryable): CmsClient {
  return {
    async getProjects(): Promise<Project[]> {
      const { results } = await db
        .prepare(
          'SELECT * FROM projects WHERE published = 1 ORDER BY "order" ASC, id ASC LIMIT 100',
        )
        .all<ProjectRow>()
      if (results.length === 0) return []

      const ids = results.map((row) => row.id)
      const idPlaceholders = ids.map(() => '?').join(', ')
      const { results: gallery } = await db
        .prepare(
          `SELECT * FROM projects_gallery WHERE _parent_id IN (${idPlaceholders}) ORDER BY _order ASC`,
        )
        .bind(...ids)
        .all<GalleryRow>()

      const media = await loadMediaMap(db, [
        ...results.map((row) => row.hero_image_id),
        ...gallery.map((row) => row.image_id),
      ])

      const galleryByParent = new Map<number, Project['gallery']>()
      for (const row of gallery) {
        const items = galleryByParent.get(row._parent_id) ?? []
        items.push({
          id: row.id,
          caption: row.caption,
          image: populateMedia(row.image_id, media),
        })
        galleryByParent.set(row._parent_id, items)
      }

      return results.map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        projectNumber: row.project_number,
        description: row.description,
        role: row.role,
        year: row.year,
        client: row.client,
        status: (row.status as Project['status']) ?? null,
        challenge: row.challenge,
        heroImage: populateMedia(row.hero_image_id, media),
        gallery: galleryByParent.get(row.id) ?? [],
        order: row.order,
        published: asBool(row.published),
        updatedAt: row.updated_at,
        createdAt: row.created_at,
      }))
    },

    async getPosts(): Promise<Post[]> {
      const { results } = await db
        .prepare(
          'SELECT * FROM posts WHERE published = 1 ORDER BY published_date DESC, id DESC LIMIT 100',
        )
        .all<PostRow>()
      return hydratePosts(db, results)
    },

    async getPostSlugs(): Promise<string[]> {
      const { results } = await db
        .prepare(
          'SELECT slug FROM posts WHERE published = 1 AND slug IS NOT NULL LIMIT 200',
        )
        .all<{ slug: string }>()
      return results.map((row) => row.slug).filter(Boolean)
    },

    async getPost(slug: string): Promise<Post | null> {
      const row = await db
        .prepare(
          'SELECT * FROM posts WHERE slug = ? AND published = 1 LIMIT 1',
        )
        .bind(slug)
        .first<PostRow>()
      if (!row) return null
      const [post] = await hydratePosts(db, [row])
      return post ?? null
    },

    async getTools(): Promise<Tool[]> {
      const { results } = await db
        .prepare(
          'SELECT * FROM tools WHERE published = 1 ORDER BY "order" ASC, id ASC LIMIT 200',
        )
        .all<ToolRow>()
      const media = await loadMediaMap(
        db,
        results.map((row) => row.icon_id),
      )
      return results.map((row) => ({
        id: row.id,
        name: row.name,
        category: (row.category as Tool['category']) ?? null,
        description: row.description,
        url: row.url,
        icon: populateMedia(row.icon_id, media),
        order: row.order,
        published: asBool(row.published),
        updatedAt: row.updated_at,
        createdAt: row.created_at,
      }))
    },

    async getServices(): Promise<Service[]> {
      const { results } = await db
        .prepare(
          'SELECT * FROM services WHERE published = 1 ORDER BY "order" ASC, id ASC LIMIT 100',
        )
        .all<ServiceRow>()
      if (results.length === 0) return []

      const ids = results.map((row) => row.id)
      const placeholders = ids.map(() => '?').join(', ')
      const { results: deliverables } = await db
        .prepare(
          `SELECT * FROM services_deliverables WHERE _parent_id IN (${placeholders}) ORDER BY _order ASC`,
        )
        .bind(...ids)
        .all<DeliverableRow>()

      const byParent = new Map<number, Service['deliverables']>()
      for (const row of deliverables) {
        const items = byParent.get(row._parent_id) ?? []
        items.push({ id: row.id, item: row.item })
        byParent.set(row._parent_id, items)
      }

      return results.map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        key: (row.key as Service['key']) ?? null,
        summary: row.summary,
        description: row.description
          ? parseJson<NonNullable<Service['description']>>(
              row.description,
              `service ${row.id} description`,
            )
          : null,
        priceLabel: row.price_label,
        deliverables: byParent.get(row.id) ?? [],
        order: row.order,
        published: asBool(row.published),
        updatedAt: row.updated_at,
        createdAt: row.created_at,
      }))
    },

    async getSiteSettings(): Promise<SiteSetting | null> {
      const row = await db
        .prepare('SELECT * FROM site_settings ORDER BY id ASC LIMIT 1')
        .first<SiteSettingsRow>()
      if (!row) return null
      return {
        id: row.id,
        name: row.name,
        description: row.description,
        intro: {
          firstName: row.intro_first_name,
          lastName: row.intro_last_name,
        },
        about: {
          anti: row.about_anti,
          design: row.about_design,
          forWord: row.about_for_word,
          arrows: row.about_arrows,
          cultural: row.about_cultural,
          practices: row.about_practices,
        },
        location: {
          cityPrimary: row.location_city_primary,
          citySecondary: row.location_city_secondary,
          status: row.location_status,
        },
        footer: {
          ctaText: row.footer_cta_text,
          ctaHighlightWord: row.footer_cta_highlight_word,
        },
        socials: {
          twitter: row.socials_twitter,
          github: row.socials_github,
          linkedin: row.socials_linkedin,
          sayHello: row.socials_say_hello,
        },
        updatedAt: row.updated_at,
        createdAt: row.created_at,
      }
    },
  }
}

async function hydratePosts(db: D1Queryable, rows: PostRow[]): Promise<Post[]> {
  if (rows.length === 0) return []
  const ids = rows.map((row) => row.id)
  const placeholders = ids.map(() => '?').join(', ')
  const { results: tags } = await db
    .prepare(
      `SELECT * FROM posts_tags WHERE _parent_id IN (${placeholders}) ORDER BY _order ASC`,
    )
    .bind(...ids)
    .all<PostTagRow>()
  const media = await loadMediaMap(
    db,
    rows.map((row) => row.cover_image_id),
  )
  const tagsByParent = new Map<number, Post['tags']>()
  for (const tag of tags) {
    const items = tagsByParent.get(tag._parent_id) ?? []
    items.push({ id: tag.id, tag: tag.tag })
    tagsByParent.set(tag._parent_id, items)
  }

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: parseJson<Post['content']>(row.content, `post ${row.id} content`),
    coverImage: populateMedia(row.cover_image_id, media),
    tags: tagsByParent.get(row.id) ?? [],
    author: row.author_id,
    publishedDate: row.published_date,
    featured: asBool(row.featured),
    published: asBool(row.published),
    updatedAt: row.updated_at,
    createdAt: row.created_at,
  }))
}
