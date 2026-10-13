import Image from 'next/image'
import React from 'react'

import type { BlockView, MediaView } from '@/lib/payload/types'

import RichText from './RichText'
import styles from './Blocks.module.css'

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1)
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (host.endsWith('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) return url
      const id = parsed.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (host.endsWith('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean)[0]
      return id ? `https://player.vimeo.com/video/${id}` : null
    }

    return null
  } catch {
    return null
  }
}

function MediaImage({
  media,
  sizes,
  priority,
}: {
  media: MediaView
  sizes?: string
  priority?: boolean
}) {
  const hasDimensions = Boolean(media.width && media.height)

  if (hasDimensions) {
    return (
      <Image
        alt={media.alt}
        className={styles.image}
        height={media.height as number}
        priority={priority}
        sizes={sizes}
        src={media.url}
        width={media.width as number}
      />
    )
  }

  return (
    <div className={styles.imageFill} style={{ aspectRatio: media.aspectRatio ?? 16 / 9 }}>
      <Image alt={media.alt} className={styles.image} fill sizes={sizes} src={media.url} />
    </div>
  )
}

function Block({ block }: { block: BlockView }) {
  switch (block.blockType) {
    case 'richText':
      return <RichText className={styles.richText} data={block.content} />

    case 'image':
      return (
        <figure className={`${styles.figure} ${styles[`size_${block.size ?? 'full'}`] ?? ''}`}>
          <MediaImage media={block.image} sizes="(max-width: 768px) 100vw, 1200px" />
          {block.caption && <figcaption className={styles.caption}>{block.caption}</figcaption>}
        </figure>
      )

    case 'imagePair':
      return (
        <figure className={styles.figure}>
          <div className={styles.pair}>
            <div className={styles.pairItem}>
              <MediaImage media={block.left} sizes="(max-width: 768px) 100vw, 600px" />
            </div>
            <div className={styles.pairItem}>
              <MediaImage media={block.right} sizes="(max-width: 768px) 100vw, 600px" />
            </div>
          </div>
          {block.caption && <figcaption className={styles.caption}>{block.caption}</figcaption>}
        </figure>
      )

    case 'gallery':
      return (
        <div className={block.layout === 'masonry' ? styles.galleryMasonry : styles.gallery}>
          {block.images.map((item, index) => (
            <figure className={styles.figure} key={item.image.url + index}>
              <MediaImage media={item.image} sizes="(max-width: 768px) 100vw, 600px" />
              {item.caption && <figcaption className={styles.caption}>{item.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )

    case 'video': {
      const embed = getEmbedUrl(block.url)
      if (!embed) {
        return (
          <p className={styles.caption}>
            <a href={block.url} rel="noopener noreferrer" target="_blank">
              {block.caption || block.url}
            </a>
          </p>
        )
      }
      return (
        <figure className={styles.figure}>
          <div className={styles.videoFrame}>
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              src={embed}
              title={block.caption || 'Project video'}
            />
          </div>
          {block.caption && <figcaption className={styles.caption}>{block.caption}</figcaption>}
        </figure>
      )
    }

    case 'captions':
      return (
        <dl className={styles.captions}>
          {block.items.map((item, index) => (
            <div className={styles.captionRow} key={item.label + index}>
              <dt className={styles.captionLabel}>{item.label}</dt>
              {item.value && <dd className={styles.captionValue}>{item.value}</dd>}
            </div>
          ))}
        </dl>
      )

    case 'divider':
      return (
        <div className={styles.divider} role="separator">
          {block.label && <span className={styles.dividerLabel}>{block.label}</span>}
        </div>
      )

    default:
      return null
  }
}

export default function BlockRenderer({ blocks }: { blocks: BlockView[] }) {
  if (!blocks?.length) return null
  return (
    <div className={styles.blocks}>
      {blocks.map((block, index) => (
        <Block block={block} key={block.id ?? `${block.blockType}-${index}`} />
      ))}
    </div>
  )
}
