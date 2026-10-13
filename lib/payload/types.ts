import type { Media, Project } from '@/payload-types'

/**
 * A serialized Lexical editor state. Kept structural so the client renderer
 * does not need to import from Payload.
 */
export type RichTextData = {
  root: {
    type: string
    children: SerializedLexicalNode[]
    [key: string]: unknown
  }
  [key: string]: unknown
}

export type SerializedLexicalNode = {
  children?: SerializedLexicalNode[]
  type: string
  version?: number
  [key: string]: unknown
}

export type MediaView = {
  url: string
  alt: string
  width?: number
  height?: number
  caption?: string
  aspectRatio?: number
}

export type BlockView =
  | { blockType: 'richText'; id?: string; content: RichTextData }
  | { blockType: 'image'; id?: string; image: MediaView; caption?: string; size?: string }
  | {
      blockType: 'imagePair'
      id?: string
      left: MediaView
      right: MediaView
      caption?: string
    }
  | {
      blockType: 'gallery'
      id?: string
      layout?: string
      images: { image: MediaView; caption?: string }[]
    }
  | { blockType: 'video'; id?: string; url: string; caption?: string; poster?: MediaView }
  | { blockType: 'captions'; id?: string; items: { label: string; value?: string }[] }
  | { blockType: 'divider'; id?: string; label?: string }

export type ProjectView = {
  id: number
  slug: string
  title: string
  description: string
  year?: string
  role?: string
  client?: string
  status: 'draft' | 'published'
  order?: number
  cover?: MediaView
  blocks: BlockView[]
}

function isMedia(value: unknown): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

export function toMediaView(value: number | Media | null | undefined): MediaView | undefined {
  if (!isMedia(value)) return undefined
  const url = value.url
  if (!url) return undefined
  return {
    url,
    alt: value.alt ?? '',
    width: value.width ?? undefined,
    height: value.height ?? undefined,
    caption: value.caption ?? undefined,
    aspectRatio:
      value.width && value.height ? Number((value.width / value.height).toFixed(4)) : undefined,
  }
}

function toBlockView(block: NonNullable<Project['composition']>[number]): BlockView | null {
  switch (block.blockType) {
    case 'richText':
      return {
        blockType: 'richText',
        id: block.id ?? undefined,
        content: block.content as unknown as RichTextData,
      }
    case 'image': {
      const image = toMediaView(block.image)
      if (!image) return null
      return {
        blockType: 'image',
        id: block.id ?? undefined,
        image,
        caption: block.caption ?? undefined,
        size: block.size ?? undefined,
      }
    }
    case 'imagePair': {
      const left = toMediaView(block.left)
      const right = toMediaView(block.right)
      if (!left || !right) return null
      return {
        blockType: 'imagePair',
        id: block.id ?? undefined,
        left,
        right,
        caption: block.caption ?? undefined,
      }
    }
    case 'gallery': {
      const images: { image: MediaView; caption?: string }[] = []
      for (const item of block.images) {
        const image = toMediaView(item.image)
        if (image) {
          images.push({ image, caption: item.caption ?? undefined })
        }
      }
      if (images.length === 0) return null
      return {
        blockType: 'gallery',
        id: block.id ?? undefined,
        layout: block.layout ?? undefined,
        images,
      }
    }
    case 'video':
      return {
        blockType: 'video',
        id: block.id ?? undefined,
        url: block.url,
        caption: block.caption ?? undefined,
        poster: toMediaView(block.poster),
      }
    case 'captions':
      return {
        blockType: 'captions',
        id: block.id ?? undefined,
        items: block.items.map((item) => ({
          label: item.label,
          value: item.value ?? undefined,
        })),
      }
    case 'divider':
      return {
        blockType: 'divider',
        id: block.id ?? undefined,
        label: block.label ?? undefined,
      }
    default:
      return null
  }
}

export function toProjectView(project: Project): ProjectView {
  const blocks = (project.composition ?? [])
    .map(toBlockView)
    .filter((block): block is BlockView => block !== null)

  return {
    id: project.id,
    slug: project.slug ?? String(project.id),
    title: project.title,
    description: project.description ?? '',
    year: project.year ?? undefined,
    role: project.role ?? undefined,
    client: project.client ?? undefined,
    status: (project._status ?? 'draft') as 'draft' | 'published',
    order: project.order ?? undefined,
    cover: toMediaView(project.cover),
    blocks,
  }
}
