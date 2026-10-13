import crypto from 'crypto'

import { getPayload } from 'payload'
import sharp from 'sharp'

import config from '../payload.config'
import type { Project } from '../payload-types'

async function makePng(
  width: number,
  height: number,
  background: { r: number; g: number; b: number },
): Promise<Buffer> {
  return sharp({
    create: { width, height, channels: 3, background },
  })
    .png()
    .toBuffer()
}

async function seed() {
  const payload = await getPayload({ config })

  // --- Admin user ---------------------------------------------------------
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@byhamza.xyz'
  const { totalDocs: userCount } = await payload.count({ collection: 'users' })

  if (userCount === 0) {
    const password = process.env.SEED_ADMIN_PASSWORD ?? crypto.randomBytes(9).toString('base64url')
    await payload.create({
      collection: 'users',
      data: { email, password, name: 'Hamza Shaebi' },
      overrideAccess: true,
    })
    payload.logger.info(`Created admin user: ${email}`)
    if (!process.env.SEED_ADMIN_PASSWORD) {
      payload.logger.info(`Generated admin password: ${password}`)
    }
  } else {
    payload.logger.info('Admin user already exists, skipping.')
  }

  // --- Media --------------------------------------------------------------
  async function ensureMedia(name: string, alt: string, buffer: Buffer) {
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: name } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs[0]) return existing.docs[0]

    return payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: buffer,
        mimetype: 'image/png',
        name,
        size: buffer.length,
      },
      overrideAccess: true,
    })
  }

  const cover = await ensureMedia(
    'postrun-cover.png',
    'POSTRUN — cover',
    await makePng(2048, 1152, { r: 18, g: 18, b: 18 }),
  )
  const stillA = await ensureMedia(
    'postrun-still-a.png',
    'POSTRUN — still A',
    await makePng(1200, 1500, { r: 232, g: 88, b: 40 }),
  )
  const stillB = await ensureMedia(
    'postrun-still-b.png',
    'POSTRUN — still B',
    await makePng(1200, 1500, { r: 40, g: 40, b: 230 }),
  )
  const wide = await ensureMedia(
    'postrun-wide.png',
    'POSTRUN — wide',
    await makePng(2048, 1152, { r: 240, g: 240, b: 240 }),
  )

  payload.logger.info('Media ready.')

  // --- Project ------------------------------------------------------------
  const slug = 'postrun'
  const projectData = {
    title: 'POSTRUN',
    slug,
    year: '2025',
    role: 'Design Engineer',
    client: 'Internal Exploration',
    order: 1,
    description:
      'A running companion that turns post-run recovery into a calm, focused ritual — problem, domains, all that.',
    _status: 'published' as const,
    cover: cover.id,
    composition: [
      {
        blockType: 'richText' as const,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr' as const,
            children: [
              {
                type: 'heading',
                tag: 'h2',
                format: '',
                indent: 0,
                version: 1,
                direction: 'ltr' as const,
                children: [{ type: 'text', text: 'The Challenge', format: 0, version: 1 }],
              },
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                direction: 'ltr' as const,
                children: [
                  {
                    type: 'text',
                    text: 'Crafting a seamless experience that bridges complex functionality and minimalistic design. The goal was an interface that feels invisible, letting the content take centre stage while keeping a distinct brand identity.',
                    format: 0,
                    version: 1,
                  },
                ],
              },
            ],
          },
        },
      },
      {
        blockType: 'image' as const,
        image: wide.id,
        size: 'full' as const,
        caption: 'Full-bleed hero still',
      },
      {
        blockType: 'imagePair' as const,
        left: stillA.id,
        right: stillB.id,
        caption: 'A pair of stills exploring contrast and colour',
      },
      {
        blockType: 'captions' as const,
        items: [
          { label: 'Role', value: 'Design Engineer' },
          { label: 'Year', value: '2025' },
          { label: 'Scope', value: 'Concept, UI, Build' },
        ],
      },
      { blockType: 'divider' as const, label: 'Process' },
      {
        blockType: 'gallery' as const,
        layout: 'grid' as const,
        images: [
          { image: stillA.id, caption: 'Exploration 01' },
          { image: stillB.id, caption: 'Exploration 02' },
          { image: wide.id, caption: 'Exploration 03' },
          { image: cover.id, caption: 'Exploration 04' },
        ],
      },
      {
        blockType: 'video' as const,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        caption: 'Walkthrough',
      },
    ],
  } as unknown as Project

  const existing = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'projects',
      id: existing.docs[0].id,
      data: projectData,
      overrideAccess: true,
    })
    payload.logger.info(`Updated project: ${slug}`)
  } else {
    await payload.create({
      collection: 'projects',
      data: projectData,
      overrideAccess: true,
    })
    payload.logger.info(`Created project: ${slug}`)
  }

  payload.logger.info('Seed complete.')
}

// `payload run` resolves the dynamic import as soon as module evaluation
// finishes, so we must await here (top-level await) for the work to complete.
try {
  await seed()
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
