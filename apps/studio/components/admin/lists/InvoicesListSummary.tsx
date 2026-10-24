import React from 'react'
import type { BeforeListTableServerProps } from 'payload'

import { addAmount, formatTotals } from '@/components/admin/formatMoney'
import { ListSummary } from '@/components/admin/lists/ListSummary'

export async function InvoicesListSummary({ payload }: BeforeListTableServerProps) {
  const [open, overdue, paid] = await Promise.all([
    payload.find({
      collection: 'invoices',
      depth: 0,
      limit: 500,
      pagination: false,
      where: { status: { in: ['draft', 'sent', 'viewed'] } },
    }),
    payload.count({ collection: 'invoices', where: { status: { equals: 'overdue' } } }),
    payload.count({ collection: 'invoices', where: { status: { equals: 'paid' } } }),
  ])

  const openTotals = new Map<string, number>()
  for (const invoice of open.docs) addAmount(openTotals, invoice.totalAmount, invoice.currency)

  return (
    <ListSummary
      description="Drafts, sent invoices, and what has been paid."
      stats={[
        { label: 'Open', value: formatTotals(openTotals) },
        { label: 'Overdue', value: String(overdue.totalDocs) },
        { label: 'Paid', value: String(paid.totalDocs) },
      ]}
    />
  )
}
