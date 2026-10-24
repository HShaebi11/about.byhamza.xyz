import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

function totalFromLineItems(lineItems: unknown): number | null {
  if (!Array.isArray(lineItems)) return null
  const total = lineItems.reduce((sum, item) => {
    if (!item || typeof item !== 'object') return sum
    const row = item as { quantity?: unknown; rate?: unknown }
    const quantity = typeof row.quantity === 'number' ? row.quantity : Number(row.quantity)
    const rate = typeof row.rate === 'number' ? row.rate : Number(row.rate)
    const safeQuantity = Number.isFinite(quantity) ? quantity : 0
    const safeRate = Number.isFinite(rate) ? rate : 0
    return sum + safeQuantity * safeRate
  }, 0)
  return Math.round(total * 100) / 100
}

const calculateInvoiceTotal: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data
  const total = totalFromLineItems(data.lineItems)
  if (total === null) return data
  return {
    ...data,
    totalAmount: total,
  }
}

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'invoiceNumber',
    defaultColumns: ['invoiceNumber', 'client', 'title', 'totalAmount', 'currency', 'status', 'dueDate'],
    group: 'Studio',
    description: 'Drafts, sent invoices, and what has been paid.',
    components: {
      beforeListTable: ['@/components/admin/lists/InvoicesListSummary#InvoicesListSummary'],
      views: {
        edit: {
          default: {
            Component: '@/components/admin/editors/InvoiceEditView#InvoiceEditView',
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
  hooks: {
    beforeValidate: [calculateInvoiceTotal],
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
            width: '50%',
          },
        },
        {
          name: 'dueDate',
          type: 'date',
          admin: {
            width: '50%',
          },
        },
      ],
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
      name: 'invoiceTotal',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/editors/InvoiceTotal#InvoiceTotal',
        },
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        hidden: true,
        description: 'Calculated from line items on save',
      },
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Stripe PaymentIntent / Checkout ID',
      },
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
