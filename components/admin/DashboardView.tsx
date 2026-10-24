import Link from 'next/link'
import React from 'react'

import { addAmount, formatMoney, formatTotals } from '@/components/admin/formatMoney'
import type { Inquiry, Invoice, Project } from '@/payload-types'
import type { AdminViewServerProps } from 'payload'

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

function clientName(client: Invoice['client']): string {
  if (client && typeof client === 'object') return client.company
  return 'Client'
}

function pillClass(status: string | null | undefined): string {
  if (status === 'paid' || status === 'Live' || status === 'won') return 'studio-home__pill studio-home__pill--good'
  if (status === 'overdue' || status === 'lost') return 'studio-home__pill studio-home__pill--bad'
  if (status === 'new' || status === 'reviewing' || status === 'sent' || status === 'viewed') {
    return 'studio-home__pill studio-home__pill--attention'
  }
  return 'studio-home__pill'
}

export const DashboardView: React.FC<AdminViewServerProps> = async ({ payload }) => {
  let openTotals = new Map<string, number>()
  let overdueTotals = new Map<string, number>()
  let paidTotals = new Map<string, number>()
  let leads: Inquiry[] = []
  let unpaid: Invoice[] = []
  let recentProjects: Project[] = []

  try {
    const [leadResult, unpaidResult, openResult, overdueResult, paidResult, projectResult] = await Promise.all([
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
        collection: 'invoices',
        depth: 0,
        limit: 500,
        pagination: false,
        where: { status: { in: [...OPEN_INVOICE_STATUSES] } },
      }),
      payload.find({
        collection: 'invoices',
        depth: 0,
        limit: 500,
        pagination: false,
        where: { status: { equals: 'overdue' } },
      }),
      payload.find({
        collection: 'invoices',
        depth: 0,
        limit: 500,
        pagination: false,
        where: { status: { equals: 'paid' } },
      }),
      payload.find({
        collection: 'projects',
        depth: 0,
        limit: 5,
        sort: '-updatedAt',
      }),
    ])

    leads = leadResult.docs
    unpaid = unpaidResult.docs
    recentProjects = projectResult.docs
    openTotals = new Map()
    overdueTotals = new Map()
    paidTotals = new Map()
    for (const invoice of openResult.docs) addAmount(openTotals, invoice.totalAmount, invoice.currency)
    for (const invoice of overdueResult.docs) addAmount(overdueTotals, invoice.totalAmount, invoice.currency)
    for (const invoice of paidResult.docs) addAmount(paidTotals, invoice.totalAmount, invoice.currency)
  } catch (err) {
    payload.logger.error({ err }, 'Error loading Control Center')
  }

  const attentionEmpty = leads.length === 0 && unpaid.length === 0

  return (
    <div className="studio-home">
      <header className="studio-home__header">
        <div>
          <h1 className="studio-home__title">Control Center</h1>
          <p className="studio-home__subtitle">New leads, unpaid invoices, and the work on the live site.</p>
        </div>
        <div className="studio-home__actions">
          <Link className="studio-home__action studio-home__action--primary" href="/admin/collections/projects/create">
            New project
          </Link>
          <Link className="studio-home__action" href="/admin/collections/invoices/create">
            New invoice
          </Link>
          <Link className="studio-home__action" href="/admin/collections/clients/create">
            New client
          </Link>
        </div>
      </header>

      <section className="studio-home__money" aria-label="Invoice totals">
        <article className="studio-home__money-card">
          <span className="studio-home__money-label">Open</span>
          <strong className="studio-home__money-value">{formatTotals(openTotals)}</strong>
        </article>
        <article className="studio-home__money-card">
          <span className="studio-home__money-label">Overdue</span>
          <strong className="studio-home__money-value">{formatTotals(overdueTotals)}</strong>
        </article>
        <article className="studio-home__money-card">
          <span className="studio-home__money-label">Paid</span>
          <strong className="studio-home__money-value">{formatTotals(paidTotals)}</strong>
        </article>
      </section>

      <div className="studio-home__columns">
        <section className="studio-home__panel">
          <div className="studio-home__panel-header">
            <h2>Needs attention</h2>
            <Link href="/admin/collections/inquiries">Inquiries</Link>
          </div>

          {attentionEmpty ? (
            <p className="studio-home__empty">No new leads or unpaid invoices.</p>
          ) : (
            <ul className="studio-home__feed">
              {leads.map((lead) => (
                <li key={`inquiry-${lead.id}`}>
                  <Link href={`/admin/collections/inquiries/${lead.id}`}>
                    <span className="studio-home__feed-title">{lead.name}</span>
                    <span className="studio-home__feed-meta">{lead.company || lead.email}</span>
                  </Link>
                  <span className={pillClass(lead.status)}>{INQUIRY_STATUS[lead.status || ''] || lead.status}</span>
                </li>
              ))}
              {unpaid.map((invoice) => (
                <li key={`invoice-${invoice.id}`}>
                  <Link href={`/admin/collections/invoices/${invoice.id}`}>
                    <span className="studio-home__feed-title">{invoice.invoiceNumber}</span>
                    <span className="studio-home__feed-meta">
                      {clientName(invoice.client)} · {formatMoney(invoice.totalAmount, invoice.currency || 'GBP')}
                    </span>
                  </Link>
                  <span className={pillClass(invoice.status)}>{INVOICE_STATUS[invoice.status || ''] || invoice.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="studio-home__panel">
          <div className="studio-home__panel-header">
            <h2>Recent projects</h2>
            <Link href="/admin/collections/projects">View all</Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="studio-home__empty">
              <p>No projects yet.</p>
              <Link className="studio-home__action studio-home__action--primary" href="/admin/collections/projects/create">
                New project
              </Link>
            </div>
          ) : (
            <div className="studio-home__table-wrap">
              <table className="studio-home__table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Title</th>
                    <th>Year</th>
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
                      <td>{project.year || '—'}</td>
                      <td>
                        <span className={project.published ? 'studio-home__pill studio-home__pill--good' : 'studio-home__pill'}>
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
