import type { CollectionConfig } from 'payload'
import { slugHook } from '../lib/slug'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['projectNumber', 'title', 'role', 'year', 'status', 'order'],
    group: 'Work',
    description: 'Case studies on the live portfolio.',
    components: {
      beforeListTable: ['@/components/admin/lists/ProjectsListSummary#ProjectsListSummary'],
      views: {
        edit: {
          default: {
            Component: '@/components/admin/editors/ProjectEditView#ProjectEditView',
          },
        },
      },
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'caseStudyLabel',
      type: 'ui',
      admin: {
        custom: {
          label: 'Case study',
          hint: 'Title, summary, and the challenge shown on the live project sheet.',
        },
        components: {
          Field: '@/components/admin/editors/SectionLabel#SectionLabel',
        },
      },
    },
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
      name: 'publishLabel',
      type: 'ui',
      admin: {
        position: 'sidebar',
        custom: {
          label: 'Publish',
          hint: 'What the live site uses to sort and show this project.',
        },
        components: {
          Field: '@/components/admin/editors/SectionLabel#SectionLabel',
        },
      },
    },
    {
      name: 'projectNumber',
      type: 'text',
      admin: {
        position: 'sidebar',
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'year',
      type: 'text',
      defaultValue: '2024',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'client',
      type: 'text',
      defaultValue: 'Internal Exploration',
      admin: {
        position: 'sidebar',
      },
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
      admin: {
        position: 'sidebar',
      },
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
      admin: {
        position: 'sidebar',
      },
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
