import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'service', 'intentLabel', 'status', 'createdAt'],
  },
  access: {
    // Anyone can submit an inquiry via public API/form
    create: () => true,
    // Only authenticated admin users can read/update
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'company',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'website',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'service',
          type: 'select',
          defaultValue: 'design_engineering',
          options: [
            { label: 'Design Engineering Sprint', value: 'design_engineering' },
            { label: 'Consultancy & Advisory', value: 'consultancy' },
            { label: 'Interactive / Creative Tech', value: 'creative_tech' },
            { label: 'Design System Architecture', value: 'design_system' },
            { label: 'Full Production Build', value: 'full_production' },
            { label: 'Other', value: 'other' },
          ],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'budget',
          type: 'select',
          options: [
            { label: '< £5,000 / $6,500', value: 'under_5k' },
            { label: '£5,000 – £10,000', value: '5k_10k' },
            { label: '£10,000 – £25,000', value: '10k_25k' },
            { label: '£25,000+', value: '25k_plus' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Client project brief / message',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New Lead', value: 'new' },
        { label: 'Under Review', value: 'reviewing' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Meeting Scheduled', value: 'meeting_scheduled' },
        { label: 'Proposal Sent', value: 'proposal_sent' },
        { label: 'Won / Converting', value: 'won' },
        { label: 'Lost', value: 'lost' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'intentLabel',
      type: 'select',
      defaultValue: 'unscored',
      options: [
        { label: '🔥 Hot Lead', value: 'hot' },
        { label: '⚡ Warm Lead', value: 'warm' },
        { label: '❄️ Cold Lead', value: 'cold' },
        { label: 'Unscored', value: 'unscored' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Computed by Jev / TypeSafe decision model',
      },
    },
    {
      name: 'intentScore',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Jev Score (0-100)',
      },
    },
    {
      name: 'posthogDistinctId',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'PostHog visitor identifier',
      },
    },
    {
      name: 'posthogSessionUrl',
      type: 'text',
      admin: {
        description: 'Direct link to watch this visitor’s PostHog session replay',
      },
    },
    {
      name: 'topViewedProject',
      type: 'relationship',
      relationTo: 'projects',
      admin: {
        description: 'The project this visitor spent the most dwell time exploring',
      },
    },
    {
      name: 'aiSummary',
      type: 'textarea',
      admin: {
        description: 'AI-generated executive summary of the lead and intent signals',
      },
    },
    {
      name: 'aiDraftPitch',
      type: 'textarea',
      admin: {
        description: 'Claude-generated tailored pitch/proposal response',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes and follow-up reminders',
      },
    },
  ],
}
