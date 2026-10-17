import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['projectNumber', 'title', 'role', 'year', 'status', 'order'],
  },
  access: {
    read: () => true,
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
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data, operation, value }) => {
            if ((operation === 'create' || operation === 'update') && !value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'projectNumber',
      type: 'text',
      admin: {
        description: 'Formatted project number (e.g., 01, 02)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short project summary displayed on cards and sheet header',
      },
    },
    {
      name: 'role',
      type: 'text',
      defaultValue: 'Design Engineer',
    },
    {
      name: 'year',
      type: 'text',
      defaultValue: '2024',
    },
    {
      name: 'client',
      type: 'text',
      defaultValue: 'Internal Exploration',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'Live',
      options: [
        { label: 'Live', value: 'Live' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Archived', value: 'Archived' },
      ],
    },
    {
      name: 'challenge',
      type: 'textarea',
      admin: {
        description: 'The Challenge paragraph text',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
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
