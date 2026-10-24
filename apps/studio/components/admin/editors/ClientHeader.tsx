'use client'

import { useFormFields } from '@payloadcms/ui'
import React from 'react'

import { formatMoney } from '@/components/admin/formatMoney'

const STATUS_LABEL: Record<string, string> = {
  active_client: 'Active client',
  past_client: 'Past client',
  prospect: 'Prospect',
  retainer: 'Retainer',
}

function readString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

function readNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

export function ClientHeader() {
  const company = useFormFields(([fields]) => readString(fields.company?.value, 'New client'))
  const status = useFormFields(([fields]) => readString(fields.status?.value, ''))
  const revenue = useFormFields(([fields]) => readNumber(fields.lifetimeRevenue?.value))
  const currency = useFormFields(([fields]) => readString(fields.currency?.value, 'GBP'))

  return (
    <div className="studio-record">
      <div>
        <p className="studio-record__kicker">Client</p>
        <p className="studio-record__title">{company}</p>
      </div>
      <div className="studio-record__facts">
        <span>{STATUS_LABEL[status] || 'Status not set'}</span>
        <span>{formatMoney(revenue, currency)} lifetime</span>
      </div>
    </div>
  )
}
