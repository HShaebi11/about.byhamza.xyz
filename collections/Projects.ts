import type { CollectionConfig } from 'payload'

import { compositionBlocks } from '../blocks'
import { revalidateProjects } from '../lib/payload/revalidate'

function slugify(input?: string): string {
  return (input ?? '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'role', '_status', 'updatedAt'],
    preview: (doc) => {
      if (!doc?.slug) return null
      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
      const secret = process.env.PREVIEW_SECRET ?? ''
      return `${base}/api/preview?secret=${secret}&slug=/project/${doc.slug}`
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    // Anyone can read published projects; editors (authenticated) also see drafts.
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [() => revalidateProjects()],
    afterDelete: [() => revalidateProjects()],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Leave empty to generate one from the title.',
      },
      hooks: {
        beforeValidate: [({ value, data }) => value || slugify(data?.title)],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'One or two sentences shown at the top of the project.',
      },
    },
    {
      name: 'composition',
      type: 'blocks',
      blocks: compositionBlocks,
      admin: {
        description: 'Build the project body from the blocks below.',
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional cover image used for cards and previews.',
      },
    },
    {
      name: 'year',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'role',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'client',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Controls the order projects appear in the work list.',
      },
    },
  ],
}
