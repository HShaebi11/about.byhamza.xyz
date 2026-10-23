import type { CollectionConfig } from 'payload'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'invoiceNumber',
    defaultColumns: ['invoiceNumber', 'client', 'title', 'totalAmount', 'currency', 'status', 'dueDate'],
  },
  access: {
    // Authenticated admin can manage
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
          name: 'invoiceNumber',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            description: 'Custom ID, e.g. HS-2026-001',
            width: '50%',
          },
        },
        {
          name: 'client',
          type: 'relationship',
          relationTo: 'clients',
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
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Design Engineering Sprint',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Sent to Client', value: 'sent' },
            { label: 'Viewed by Client', value: 'viewed' },
            { label: 'Paid in Full', value: 'paid' },
            { label: 'Overdue', value: 'overdue' },
            { label: 'Void / Cancelled', value: 'void' },
          ],
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
          name: 'issueDate',
          type: 'date',
          admin: {
            width: '33.3%',
          },
        },
        {
          name: 'dueDate',
          type: 'date',
          admin: {
            width: '33.3%',
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
            width: '33.3%',
          },
        },
      ],
    },
    {
      name: 'lineItems',
      type: 'array',
      required: true,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'description',
              type: 'text',
              required: true,
              admin: {
                width: '60%',
              },
            },
            {
              name: 'quantity',
              type: 'number',
              defaultValue: 1,
              required: true,
              admin: {
                width: '20%',
              },
            },
            {
              name: 'rate',
              type: 'number',
              required: true,
              admin: {
                description: 'Unit / day rate',
                width: '20%',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'totalAmount',
          type: 'number',
          required: true,
          admin: {
            description: 'Total payable amount in selected currency',
            width: '50%',
          },
        },
        {
          name: 'stripePaymentIntentId',
          type: 'text',
          admin: {
            description: 'Stripe PaymentIntent / Checkout ID',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'paymentTerms',
      type: 'text',
      defaultValue: 'Payable within 14 days of issue. Accepted via Card, Apple Pay, or Direct Wire.',
      admin: {
        description: 'Terms printed at the bottom of the invoice',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Optional project deliverables summary or message to client',
      },
    },
  ],
}
