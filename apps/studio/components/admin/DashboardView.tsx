import React from 'react'
import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { sql as dsql } from '@payloadcms/db-d1-sqlite'
import type { Inquiry, Project, SiteSetting } from '@repo/cms/generated/payload-types'

interface OutstandingRow {
  currency: string | null
  total: number | null
}

const SERVICE_LABELS: Record<string, string> = {
  design_engineering: 'Design Engineering',
  consultancy: 'Consultancy',
  creative_tech: 'Creative Tech',
  design_system: 'Design System',
  full_production: 'Full Production',
  other: 'Other',
}

const INQUIRY_STATUS_LABELS: Record<string, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  qualified: 'Qualified',
  meeting_scheduled: 'Meeting',
  proposal_sent: 'Proposal',
  won: 'Won',
  lost: 'Lost',
  archived: 'Archived',
}

const inquiryStatusClass = (status?: string | null): string => {
  switch (status) {
    case 'new':
      return 'tag--new'
    case 'won':
      return 'tag--live'
    case 'qualified':
    case 'meeting_scheduled':
    case 'proposal_sent':
    case 'reviewing':
      return 'tag--warm'
    default:
      return 'tag--draft'
  }
}

const intentClass = (intent?: string | null): string => {
  switch (intent) {
    case 'hot':
      return 'tag--hot'
    case 'warm':
      return 'tag--warm'
    case 'cold':
      return 'tag--cold'
    default:
      return 'tag--draft'
  }
}

const formatMoney = (amount: number, currency: string): string => {
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency} ${amount}`
  }
}

export const DashboardView: React.FC<AdminViewServerProps> = async ({ payload }) => {
  let projectsTotal = 0
  let projectsPublished = 0
  let mediaTotal = 0
  let usersTotal = 0
  let postsTotal = 0
  let postsPublished = 0
  let toolsTotal = 0
  let servicesTotal = 0
  let inquiriesNew = 0
  let inquiriesPipeline = 0
  let clientsTotal = 0
  let invoicesOutstanding = 0
  let invoicesOverdue = 0
  let outstandingLabel = '—'
  let siteTitle = 'Hamza Shaebi'
  let recentProjects: Project[] = []
  let recentInquiries: Inquiry[] = []

  try {
    const [
      pCount,
      pPubCount,
      mCount,
      uCount,
      postCount,
      postPubCount,
      tCount,
      sCount,
      iNewCount,
      iPipelineCount,
      cCount,
      invOutstandingCount,
      invOverdueCount,
      outstandingRows,
      settings,
      recents,
      recentLeads,
    ] = await Promise.all([
      payload.count({ collection: 'projects' }),
      payload.count({ collection: 'projects', where: { published: { equals: true } } }),
      payload.count({ collection: 'media' }),
      payload.count({ collection: 'users' }),
      payload.count({ collection: 'posts' }),
      payload.count({ collection: 'posts', where: { published: { equals: true } } }),
      payload.count({ collection: 'tools' }),
      payload.count({ collection: 'services' }),
      payload.count({ collection: 'inquiries', where: { status: { equals: 'new' } } }),
      payload.count({
        collection: 'inquiries',
        where: { status: { in: ['qualified', 'meeting_scheduled', 'proposal_sent'] } },
      }),
      payload.count({ collection: 'clients' }),
      payload.count({
        collection: 'invoices',
        where: { status: { in: ['sent', 'viewed', 'overdue'] } },
      }),
      payload.count({ collection: 'invoices', where: { status: { equals: 'overdue' } } }),
      // SQL aggregate instead of fetching+deserializing up to 200 invoice
      // docs — keeps dashboard CPU cost low on the Workers Free plan
      (async (): Promise<OutstandingRow[]> => {
        const drizzle = (
          payload.db as { drizzle?: { all: (q: unknown) => Promise<unknown[]> } }
        ).drizzle
        if (!drizzle) return []
        return (await drizzle.all(dsql`
          SELECT currency, SUM(total_amount) AS total
          FROM invoices
          WHERE status IN ('sent', 'viewed', 'overdue')
          GROUP BY currency
        `)) as OutstandingRow[]
      })(),
      payload.findGlobal({ slug: 'site-settings' }).catch(() => null) as Promise<SiteSetting | null>,
      payload.find({ collection: 'projects', limit: 5, sort: '-updatedAt' }),
      payload.find({ collection: 'inquiries', limit: 5, sort: '-createdAt' }),
    ])

    projectsTotal = pCount.totalDocs
    projectsPublished = pPubCount.totalDocs
    mediaTotal = mCount.totalDocs
    usersTotal = uCount.totalDocs
    postsTotal = postCount.totalDocs
    postsPublished = postPubCount.totalDocs
    toolsTotal = tCount.totalDocs
    servicesTotal = sCount.totalDocs
    inquiriesNew = iNewCount.totalDocs
    inquiriesPipeline = iPipelineCount.totalDocs
    clientsTotal = cCount.totalDocs
    invoicesOutstanding = invOutstandingCount.totalDocs
    invoicesOverdue = invOverdueCount.totalDocs

    const sums = new Map<string, number>()
    for (const row of outstandingRows) {
      const currency = row.currency || 'GBP'
      sums.set(currency, (sums.get(currency) || 0) + (Number(row.total) || 0))
    }
    if (sums.size === 1) {
      const [currency, amount] = [...sums.entries()][0]
      outstandingLabel = formatMoney(amount, currency)
    } else if (sums.size > 1) {
      outstandingLabel = [...sums.entries()]
        .map(([currency, amount]) => formatMoney(amount, currency))
        .join(' + ')
    } else {
      outstandingLabel = '—'
    }

    if (settings?.name) {
      siteTitle = settings.name
    }
    recentProjects = (recents.docs as Project[]) || []
    recentInquiries = (recentLeads.docs as Inquiry[]) || []
  } catch (err) {
    payload.logger.error({ err }, 'Error loading DashboardView stats')
  }

  return (
    <div className="dash">
      {/* Head — title + spec sheet */}
      <header className="dash__head">
        <div>
          <p className="dash__eyebrow">
            <span className="dash__eyebrow-dot" />
            <span>System Operational · Cloudflare Edge</span>
          </p>
          <h1 className="dash__title">Control Center</h1>
          <p className="dash__lede">
            Manage case studies, assets, inbound leads, and site configuration — powered by
            Cloudflare D1 &amp; R2 at the edge.
          </p>
        </div>

        <ul className="dash__spec">
          <li className="dash__spec-item">
            <span className="dash__spec-label">Database</span>
            <span className="dash__spec-value">D1 · WEUR</span>
          </li>
          <li className="dash__spec-item">
            <span className="dash__spec-label">Storage</span>
            <span className="dash__spec-value">R2 Bucket</span>
          </li>
          <li className="dash__spec-item">
            <span className="dash__spec-label">Runtime</span>
            <span className="dash__spec-value">workerd / OpenNext</span>
          </li>
          <li className="dash__spec-item">
            <span className="dash__spec-label">Site</span>
            <span className="dash__spec-value">{siteTitle}</span>
          </li>
        </ul>
      </header>

      {/* 01 — Metrics */}
      <section className="dash__section" aria-label="Key metrics">
        <div className="dash__section-head">
          <span className="dash__section-index">01</span>
          <h2 className="dash__section-title">Metrics</h2>
          <span className="dash__section-rule" />
          <span className="dash__section-meta">CRM + Content</span>
        </div>

        <div className="dash__stats">
          <Link href="/admin/collections/inquiries" className="metric">
            <span className="metric__top">
              New Inquiries
              {inquiriesNew > 0 ? (
                <span className="metric__flag metric__flag--accent">Triage</span>
              ) : (
                <span className="metric__flag metric__flag--ok">Clear</span>
              )}
            </span>
            <span className="metric__value">{inquiriesNew}</span>
            <span className="metric__sub">{inquiriesPipeline} in pipeline</span>
          </Link>

          <Link href="/admin/collections/invoices" className="metric">
            <span className="metric__top">
              Outstanding
              {invoicesOverdue > 0 && (
                <span className="metric__flag metric__flag--warn">{invoicesOverdue} overdue</span>
              )}
            </span>
            <span className="metric__value">{outstandingLabel}</span>
            <span className="metric__sub">{invoicesOutstanding} open invoices</span>
          </Link>

          <Link href="/admin/collections/clients" className="metric">
            <span className="metric__top">Clients</span>
            <span className="metric__value">{clientsTotal}</span>
            <span className="metric__sub">Active client records</span>
          </Link>

          <Link href="/admin/collections/projects" className="metric">
            <span className="metric__top">Live Projects</span>
            <span className="metric__value">
              {projectsPublished}
              <span className="metric__value-sub"> / {projectsTotal}</span>
            </span>
            <span className="metric__sub">Published case studies</span>
          </Link>

          <Link href="/admin/collections/posts" className="metric">
            <span className="metric__top">Live Posts</span>
            <span className="metric__value">
              {postsPublished}
              <span className="metric__value-sub"> / {postsTotal}</span>
            </span>
            <span className="metric__sub">Published blog entries</span>
          </Link>

          <Link href="/admin/collections/media" className="metric">
            <span className="metric__top">Media Assets</span>
            <span className="metric__value">{mediaTotal}</span>
            <span className="metric__sub">Images &amp; video in R2</span>
          </Link>
        </div>
      </section>

      {/* 02 — Quick actions */}
      <section className="dash__section" aria-label="Quick actions">
        <div className="dash__section-head">
          <span className="dash__section-index">02</span>
          <h2 className="dash__section-title">Actions</h2>
          <span className="dash__section-rule" />
        </div>

        <div className="dash__actions">
          <Link href="/admin/collections/projects/create" className="act act--primary">
            + New Project
          </Link>
          <Link href="/admin/collections/posts/create" className="act">
            + New Post
          </Link>
          <Link href="/admin/collections/media/create" className="act">
            + Upload Media
          </Link>
          <Link href="/admin/collections/invoices/create" className="act">
            + New Invoice
          </Link>
          <Link href="/admin/globals/site-settings" className="act">
            Site Settings
          </Link>
          <a
            href="https://about.byhamza.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="act"
          >
            Live Portfolio ↗
          </a>
        </div>
      </section>

      {/* 03 — Activity */}
      <section className="dash__section" aria-label="Recent activity">
        <div className="dash__section-head">
          <span className="dash__section-index">03</span>
          <h2 className="dash__section-title">Activity</h2>
          <span className="dash__section-rule" />
          <span className="dash__section-meta">Leads + Projects</span>
        </div>

        <div className="dash__grid">
          <div className="board">
            <div className="board__head">
              <h3 className="board__title">Recent Inquiries</h3>
              <Link href="/admin/collections/inquiries" className="board__link">
                View All →
              </Link>
            </div>

            {recentInquiries.length === 0 ? (
              <div className="board__empty">
                <p>No inquiries yet — leads from the contact form will appear here.</p>
              </div>
            ) : (
              <div className="dtable-wrap">
                <table className="dtable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Service</th>
                      <th>Intent</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInquiries.map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          <Link
                            href={`/admin/collections/inquiries/${lead.id}`}
                            className="dtable__link"
                          >
                            {lead.name || 'Unnamed'}
                          </Link>
                        </td>
                        <td>{SERVICE_LABELS[lead.service || 'other'] || '—'}</td>
                        <td>
                          <span className={`tag ${intentClass(lead.intentLabel)}`}>
                            {lead.intentLabel || 'unscored'}
                          </span>
                        </td>
                        <td>
                          <span className={`tag ${inquiryStatusClass(lead.status)}`}>
                            {INQUIRY_STATUS_LABELS[lead.status || 'new'] || 'New'}
                          </span>
                        </td>
                        <td>
                          <Link
                            href={`/admin/collections/inquiries/${lead.id}`}
                            className="dtable__action"
                          >
                            Open →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="board">
            <div className="board__head">
              <h3 className="board__title">Recent Projects</h3>
              <Link href="/admin/collections/projects" className="board__link">
                View All ({projectsTotal}) →
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <div className="board__empty">
                <p>No projects created yet.</p>
                <Link href="/admin/collections/projects/create" className="act act--primary">
                  + Create First Project
                </Link>
              </div>
            ) : (
              <div className="dtable-wrap">
                <table className="dtable">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Title</th>
                      <th>Year</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProjects.map((proj) => (
                      <tr key={proj.id}>
                        <td className="dtable__no">{proj.projectNumber || '—'}</td>
                        <td>
                          <Link
                            href={`/admin/collections/projects/${proj.id}`}
                            className="dtable__link"
                          >
                            {proj.title || 'Untitled Project'}
                          </Link>
                        </td>
                        <td>{proj.year || '—'}</td>
                        <td>
                          <span className={`tag ${proj.published ? 'tag--live' : 'tag--draft'}`}>
                            {proj.published ? 'Live' : 'Draft'}
                          </span>
                        </td>
                        <td>
                          <Link
                            href={`/admin/collections/projects/${proj.id}`}
                            className="dtable__action"
                          >
                            Edit →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 04 — System overview */}
      <section className="dash__section" aria-label="System overview">
        <div className="dash__section-head">
          <span className="dash__section-index">04</span>
          <h2 className="dash__section-title">System</h2>
          <span className="dash__section-rule" />
          <span className="dash__section-meta">{usersTotal} admin{usersTotal === 1 ? '' : 's'}</span>
        </div>

        <div className="dash__cards">
          <div className="oc">
            <div>
              <div className="oc__head">
                <span className="oc__label">Collection</span>
                <span className="oc__tag">{toolsTotal + servicesTotal} entries</span>
              </div>
              <h3 className="oc__title">Tools &amp; Services</h3>
              <div className="oc__metric">
                <span className="oc__number">
                  {toolsTotal} / {servicesTotal}
                </span>
                <span className="oc__sub">Tools / Services</span>
              </div>
            </div>
            <div className="oc__foot">
              <Link href="/admin/collections/tools" className="oc__link">
                Tools →
              </Link>
              <Link href="/admin/collections/services" className="oc__link oc__link--accent">
                Services →
              </Link>
            </div>
          </div>

          <div className="oc">
            <div>
              <div className="oc__head">
                <span className="oc__label">CRM</span>
                <span className="oc__tag">{inquiriesNew} new</span>
              </div>
              <h3 className="oc__title">Leads &amp; Clients</h3>
              <div className="oc__metric">
                <span className="oc__number">{clientsTotal}</span>
                <span className="oc__sub">
                  Client records · {inquiriesNew} leads awaiting triage
                </span>
              </div>
            </div>
            <div className="oc__foot">
              <Link href="/admin/collections/inquiries" className="oc__link">
                Inquiries →
              </Link>
              <Link href="/admin/collections/clients" className="oc__link oc__link--accent">
                Clients →
              </Link>
            </div>
          </div>

          <div className="oc">
            <div>
              <div className="oc__head">
                <span className="oc__label">Billing</span>
                <span className="oc__tag">Stripe</span>
              </div>
              <h3 className="oc__title">Invoices</h3>
              <div className="oc__metric">
                <span className="oc__text">{outstandingLabel}</span>
                <span className="oc__sub">
                  {invoicesOutstanding} outstanding · {invoicesOverdue} overdue
                </span>
              </div>
            </div>
            <div className="oc__foot">
              <Link href="/admin/collections/invoices" className="oc__link">
                Manage Invoices →
              </Link>
              <Link
                href="/admin/collections/invoices/create"
                className="oc__link oc__link--accent"
              >
                + New
              </Link>
            </div>
          </div>

          <div className="oc">
            <div>
              <div className="oc__head">
                <span className="oc__label">Global Configuration</span>
                <span className="oc__tag">Active</span>
              </div>
              <h3 className="oc__title">Site Settings</h3>
              <div className="oc__metric">
                <span className="oc__text">{siteTitle}</span>
                <span className="oc__sub">Global site title &amp; profile</span>
              </div>
            </div>
            <div className="oc__foot">
              <Link href="/admin/globals/site-settings" className="oc__link">
                Edit Global Config →
              </Link>
            </div>
          </div>

          <div className="oc">
            <div>
              <div className="oc__head">
                <span className="oc__label">Infrastructure</span>
                <span className="oc__tag">workerd</span>
              </div>
              <h3 className="oc__title">Users &amp; Access</h3>
              <div className="oc__metric">
                <span className="oc__number">{usersTotal}</span>
                <span className="oc__sub">Admin accounts</span>
              </div>
            </div>
            <div className="oc__foot">
              <Link href="/admin/collections/users" className="oc__link">
                Manage Users →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
