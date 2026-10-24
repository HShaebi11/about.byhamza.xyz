'use client'

import { useFormFields } from '@payloadcms/ui'
import React from 'react'
import type { FormState } from 'payload'

import { formatMoney } from '@/components/admin/formatMoney'

function readNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

export function sumLineItems(fields: FormState): number {
  const quantities = new Map<string, number>()
  const rates = new Map<string, number>()

  for (const [path, field] of Object.entries(fields)) {
    const match = path.match(/^lineItems\.(\d+)\.(quantity|rate)$/)
    if (!match || !field) continue
    const amount = readNumber(field.value)
    if (match[2] === 'quantity') quantities.set(match[1], amount)
    else rates.set(match[1], amount)
  }

  let total = 0
  for (const [index, quantity] of quantities) {
    total += quantity * (rates.get(index) ?? 0)
  }
  return Math.round(total * 100) / 100
}

export function InvoiceTotal() {
  const total = useFormFields(([fields]) => sumLineItems(fields))
  const currency = useFormFields(([fields]) => {
    const value = fields.currency?.value
    return typeof value === 'string' && value.length > 0 ? value : 'GBP'
  })

  return (
    <div className="studio-total">
      <p className="studio-total__label">Total</p>
      <p className="studio-total__value">{formatMoney(total, currency)}</p>
      <p className="studio-total__hint">Calculated from the line items when you save.</p>
    </div>
  )
}
