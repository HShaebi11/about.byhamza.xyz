import type { Block } from 'payload'

export const Divider: Block = {
  slug: 'divider',
  labels: {
    singular: 'Divider',
    plural: 'Dividers',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
    },
  ],
}
