import type { CollectionConfig } from 'payload'

export const Tools: CollectionConfig = {
  slug: 'tools',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'order', 'published'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'software',
      options: [
        { label: 'Software', value: 'software' },
        { label: 'Hardware', value: 'hardware' },
        { label: 'Design', value: 'design' },
        { label: 'Development', value: 'development' },
        { label: 'AI', value: 'ai' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'Link to the tool/product website',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional logo/icon',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
