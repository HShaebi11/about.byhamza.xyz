'use client'

import Link from 'next/link'
import { useDocumentInfo, usePayloadAPI } from '@payloadcms/ui'
import React from 'react'

import { formatMoney } from '@/components/admin/formatMoney'

interface InvoiceDoc {
  currency?: string | null
  id: number | string
  invoiceNumber?: string | null
  status?: string | null
  totalAmount?: number | null
}

interface InvoiceListResponse {
  docs?: InvoiceDoc[]
}

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  overdue: 'Overdue',
  paid: 'Paid',
  sent: 'Sent',
  viewed: 'Viewed',
  void: 'Void',
}

function ClientInvoiceList({ id }: { id: number | string }) {
  const [{ data, isLoading }] = usePayloadAPI('/api/invoices', {
    initialParams: {
      depth: 0,
      limit: 20,
      sort: '-createdAt',
      where: { client: { equals: id } },
    },
  })

  const docs = (data as InvoiceListResponse | undefined)?.docs ?? []

  return (
    <div className="studio-related">
      <div className="studio-related__header">
        <p className="studio-section__label">Invoices</p>
        <Link href="/admin/collections/invoices/create">New invoice</Link>
      </div>
      {isLoading ? <p className="studio-related__empty">Loading invoices…</p> : null}
      {!isLoading && docs.length === 0 ? <p className="studio-related__empty">No invoices for this client yet.</p> : null}
      {docs.length > 0 ? (
        <ul className="studio-related__list">
          {docs.map((invoice) => (
            <li key={invoice.id}>
              <Link href={`/admin/collections/invoices/${invoice.id}`}>{invoice.invoiceNumber || 'Invoice'}</Link>
              <span>{STATUS_LABEL[invoice.status || ''] || invoice.status || 'Draft'}</span>
              <span>{formatMoney(invoice.totalAmount || 0, invoice.currency || 'GBP')}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export function ClientInvoices() {
  const { id } = useDocumentInfo()

  if (!id) {
    return (
      <div className="studio-related">
        <p className="studio-section__label">Invoices</p>
        <p className="studio-related__empty">Save this client before attaching invoices.</p>
      </div>
    )
  }

  return <ClientInvoiceList id={id} />
}
