import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'company',
    defaultColumns: ['company', 'name', 'status', 'lifetimeRevenue', 'updatedAt'],
    group: 'Studio',
    description: 'People and companies you invoice.',
    components: {
      beforeListTable: ['@/components/admin/lists/ClientsListSummary#ClientsListSummary'],
      views: {
        edit: {
          default: {
            Component: '@/components/admin/editors/ClientEditView#ClientEditView',
          },
        },
      },
    },
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'clientHeader',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/editors/ClientHeader#ClientHeader',
        },
      },
    },
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
        position: 'sidebar',
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
        position: 'sidebar',
      },
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
    {
      name: 'clientInvoices',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/editors/ClientInvoices#ClientInvoices',
        },
      },
    },
  ],
}
