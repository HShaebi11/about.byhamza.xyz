import type { Block } from 'payload'

export const Video: Block = {
  slug: 'video',
  labels: {
    singular: 'Video',
    plural: 'Videos',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'A YouTube or Vimeo URL.',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
