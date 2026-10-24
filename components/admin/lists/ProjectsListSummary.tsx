import React from 'react'
import type { BeforeListTableServerProps } from 'payload'

import { ListSummary } from '@/components/admin/lists/ListSummary'

export async function ProjectsListSummary({ payload }: BeforeListTableServerProps) {
  const [total, live, inProgress] = await Promise.all([
    payload.count({ collection: 'projects' }),
    payload.count({ collection: 'projects', where: { published: { equals: true } } }),
    payload.count({ collection: 'projects', where: { status: { equals: 'In Progress' } } }),
  ])

  return (
    <ListSummary
      description="Case studies on the live portfolio."
      stats={[
        { label: 'Total', value: String(total.totalDocs) },
        { label: 'Live', value: String(live.totalDocs) },
        { label: 'In progress', value: String(inProgress.totalDocs) },
      ]}
    />
  )
}
