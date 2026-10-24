import React from 'react'
import type { BeforeListTableServerProps } from 'payload'

import { ListSummary } from '@/components/admin/lists/ListSummary'

export async function ClientsListSummary({ payload }: BeforeListTableServerProps) {
  const [total, active, prospects] = await Promise.all([
    payload.count({ collection: 'clients' }),
    payload.count({ collection: 'clients', where: { status: { equals: 'active_client' } } }),
    payload.count({ collection: 'clients', where: { status: { equals: 'prospect' } } }),
  ])

  return (
    <ListSummary
      description="People and companies you invoice."
      stats={[
        { label: 'Total', value: String(total.totalDocs) },
        { label: 'Active', value: String(active.totalDocs) },
        { label: 'Prospects', value: String(prospects.totalDocs) },
      ]}
    />
  )
}
