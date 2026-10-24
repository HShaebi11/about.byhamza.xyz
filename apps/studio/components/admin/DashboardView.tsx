import Link from 'next/link'
import { sql as dsql } from '@payloadcms/db-d1-sqlite'
import React from 'react'
import type { AdminViewServerProps } from 'payload'

import { addAmount, formatMoney, formatTotals } from '@/components/admin/formatMoney'
import type { Inquiry, Invoice, Project } from '@repo/cms/generated/payload-types'

const OPEN_INVOICE_STATUSES = ['draft', 'sent', 'viewed'] as const
const ATTENTION_INQUIRY_STATUSES = ['new', 'reviewing'] as const

const INQUIRY_STATUS: Record<string, string> = {
  archived: 'Archived',
  lost: 'Lost',
  meeting_scheduled: 'Meeting scheduled',
  new: 'New lead',
  proposal_sent: 'Proposal sent',
  qualified: 'Qualified',
  reviewing: 'Under review',
  won: 'Won',
}

const INVOICE_STATUS: Record<string, string> = {
  draft: 'Draft',
  overdue: 'Overdue',
  paid: 'Paid',
  sent: 'Sent',
  viewed: 'Viewed',
  void: 'Void',
}

interface InvoiceSumRow {
  currency: string | null
  status: string | null
  total: number | null
}

function clientName(client: Invoice['client']): string {
  if (client && typeof client === 'object') return client.company
  return 'Client'
}

function pillClass(status: string | null | undefined): string {
  if (status === 'paid' || status === 'won') return 'studio-pill studio-pill--good'
  if (status === 'overdue' || status === 'lost') return 'studio-pill studio-pill--bad'
  if (status === 'new' || status === 'reviewing' || status === 'sent' || status === 'viewed') {
    return 'studio-pill studio-pill--attention'
  }
  return 'studio-pill'
}

function totalsFor(rows: InvoiceSumRow[], statuses: readonly string[]): Map<string, number> {
  const totals = new Map<string, number>()
  for (const row of rows) {
    if (!row.status || !statuses.includes(row.status)) continue
    addAmount(totals, Number(row.total) || 0, row.currency)
  }
  return totals
}

async function invoiceSums(payload: AdminViewServerProps['payload']): Promise<InvoiceSumRow[]> {
  const drizzle = (payload.db as { drizzle?: { all: (query: unknown) => Promise<unknown[]> } }).drizzle
  if (!drizzle) return []

  return (await drizzle.all(dsql`
    SELECT status, currency, SUM(total_amount) AS total
    FROM invoices
    WHERE status IN ('draft', 'sent', 'viewed', 'overdue', 'paid')
    GROUP BY status, currency
  `)) as InvoiceSumRow[]
}

export const DashboardView: React.FC<AdminViewServerProps> = async ({ payload }) => {
  let openTotals = new Map<string, number>()
  let overdueTotals = new Map<string, number>()
  let paidTotals = new Map<string, number>()
  let leads: Inquiry[] = []
  let unpaid: Invoice[] = []
  let recentProjects: Project[] = []

  try {
    const [leadResult, unpaidResult, projectResult, sums] = await Promise.all([
      payload.find({
        collection: 'inquiries',
        depth: 0,
        limit: 5,
        sort: '-createdAt',
        where: { status: { in: [...ATTENTION_INQUIRY_STATUSES] } },
      }),
      payload.find({
        collection: 'invoices',
        depth: 1,
        limit: 5,
        sort: 'dueDate',
        where: { status: { in: [...OPEN_INVOICE_STATUSES, 'overdue'] } },
      }),
      payload.find({
        collection: 'projects',
        depth: 0,
        limit: 5,
        sort: '-updatedAt',
      }),
      invoiceSums(payload),
    ])

    leads = leadResult.docs
    unpaid = unpaidResult.docs
    recentProjects = projectResult.docs
    openTotals = totalsFor(sums, OPEN_INVOICE_STATUSES)
    overdueTotals = totalsFor(sums, ['overdue'])
    paidTotals = totalsFor(sums, ['paid'])
  } catch (err) {
    payload.logger.error({ err }, 'Error loading Control Center')
  }

  const attentionEmpty = leads.length === 0 && unpaid.length === 0

  return (
    <div className="studio-home">
      <header className="studio-home__header">
        <div className="studio-home__intro">
          <h1>Control Center</h1>
          <p>Leads that need a reply, invoices still open, and recent work.</p>
        </div>
        <div className="studio-home__actions">
          <Link className="studio-button studio-button--primary" href="/admin/collections/inquiries">
            Inquiries
          </Link>
          <Link className="studio-button" href="/admin/collections/invoices/create">
            New invoice
          </Link>
        </div>
      </header>

      <section className="studio-home__money" aria-label="Invoice totals">
        <article>
          <span>Open</span>
          <strong>{formatTotals(openTotals)}</strong>
        </article>
        <article>
          <span>Overdue</span>
          <strong>{formatTotals(overdueTotals)}</strong>
        </article>
        <article>
          <span>Paid</span>
          <strong>{formatTotals(paidTotals)}</strong>
        </article>
      </section>

      <div className="studio-home__columns">
        <section className="studio-panel">
          <div className="studio-panel__header">
            <h2>Needs attention</h2>
            <Link href="/admin/collections/inquiries">View inquiries</Link>
          </div>

          {attentionEmpty ? (
            <p className="studio-empty">No new leads or unpaid invoices.</p>
          ) : (
            <ul className="studio-feed">
              {leads.map((lead) => (
                <li key={`inquiry-${lead.id}`}>
                  <Link href={`/admin/collections/inquiries/${lead.id}`}>
                    <span className="studio-feed__title">{lead.name}</span>
                    <span className="studio-feed__meta">{lead.company || lead.email}</span>
                  </Link>
                  <span className={pillClass(lead.status)}>{INQUIRY_STATUS[lead.status || ''] || lead.status}</span>
                </li>
              ))}
              {unpaid.map((invoice) => (
                <li key={`invoice-${invoice.id}`}>
                  <Link href={`/admin/collections/invoices/${invoice.id}`}>
                    <span className="studio-feed__title">{invoice.invoiceNumber}</span>
                    <span className="studio-feed__meta">
                      {clientName(invoice.client)} · {formatMoney(invoice.totalAmount, invoice.currency || 'GBP')}
                    </span>
                  </Link>
                  <span className={pillClass(invoice.status)}>
                    {INVOICE_STATUS[invoice.status || ''] || invoice.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="studio-panel">
          <div className="studio-panel__header">
            <h2>Recent projects</h2>
            <Link href="/admin/collections/projects">View all</Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="studio-empty">
              <p>No projects yet.</p>
              <Link className="studio-button studio-button--primary" href="/admin/collections/projects/create">
                New project
              </Link>
            </div>
          ) : (
            <div className="studio-table-wrap">
              <table className="studio-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Title</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.projectNumber || '—'}</td>
                      <td>
                        <Link href={`/admin/collections/projects/${project.id}`}>{project.title}</Link>
                      </td>
                      <td>
                        <span className={project.published ? 'studio-pill studio-pill--good' : 'studio-pill'}>
                          {project.published ? 'Live' : 'Draft'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
