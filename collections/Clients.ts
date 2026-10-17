import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'company',
    defaultColumns: ['company', 'name', 'status', 'lifetimeRevenue', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'company',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Primary contact person',
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
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
          name: 'status',
          type: 'select',
          defaultValue: 'active_client',
          options: [
            { label: 'Active Client', value: 'active_client' },
            { label: 'Retainer Partner', value: 'retainer' },
            { label: 'Prospect / Lead', value: 'prospect' },
            { label: 'Past Client / Alumni', value: 'past_client' },
          ],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'GBP',
          options: [
            { label: 'GBP (£)', value: 'GBP' },
            { label: 'USD ($)', value: 'USD' },
            { label: 'EUR (€)', value: 'EUR' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Stripe Customer identifier (cus_...)',
      },
    },
    {
      name: 'lifetimeRevenue',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Total revenue paid across all invoices',
      },
    },
    {
      name: 'billingAddress',
      type: 'textarea',
      admin: {
        description: 'Company billing address and tax/VAT details for custom invoices',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Client relationship notes, engagement history, and preferences',
      },
    },
  ],
}
