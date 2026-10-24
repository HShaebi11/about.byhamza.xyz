import type { CollectionConfig } from 'payload'
import { slugHook } from '../lib/slug'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'key', 'priceLabel', 'order', 'published'],
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
        beforeValidate: [slugHook],
      },
    },
    {
      name: 'key',
      type: 'select',
      admin: {
        description: 'Maps this service to the inquiry form service option',
      },
      options: [
        { label: 'Design Engineering Sprint', value: 'design_engineering' },
        { label: 'Consultancy & Advisory', value: 'consultancy' },
        { label: 'Interactive / Creative Tech', value: 'creative_tech' },
        { label: 'Design System Architecture', value: 'design_system' },
        { label: 'Full Production Build', value: 'full_production' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'One-line summary shown on service cards',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'priceLabel',
      type: 'text',
      admin: {
        description: 'e.g. "from £5k", "£1200/day", "POA"',
      },
    },
    {
      name: 'deliverables',
      type: 'array',
      admin: {
        description: 'What the client receives',
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
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
