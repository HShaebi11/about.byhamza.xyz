import type { Block } from 'payload'

export const Captions: Block = {
  slug: 'captions',
  labels: {
    singular: 'Captions',
    plural: 'Captions',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
        },
      ],
    },
  ],
}
