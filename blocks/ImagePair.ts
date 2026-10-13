import type { Block } from 'payload'

export const ImagePair: Block = {
  slug: 'imagePair',
  labels: {
    singular: 'Image pair',
    plural: 'Image pairs',
  },
  fields: [
    {
      name: 'left',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'right',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
