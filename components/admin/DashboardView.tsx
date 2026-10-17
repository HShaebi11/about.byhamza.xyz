import React from 'react'
import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import type { Project, SiteSetting } from '@/payload-types'

export const DashboardView: React.FC<AdminViewServerProps> = async ({ payload }) => {
  let projectsTotal = 0
  let projectsPublished = 0
  let mediaTotal = 0
  let usersTotal = 0
  let siteTitle = 'Hamza Shaebi'
  let recentProjects: Project[] = []

  try {
    const [pCount, pPubCount, mCount, uCount, settings, recents] = await Promise.all([
      payload.count({ collection: 'projects' }),
      payload.count({
        collection: 'projects',
        where: { published: { equals: true } },
      }),
      payload.count({ collection: 'media' }),
      payload.count({ collection: 'users' }),
      payload.findGlobal({ slug: 'site-settings' }).catch(() => null) as Promise<SiteSetting | null>,
      payload.find({
        collection: 'projects',
        limit: 5,
        sort: '-updatedAt',
      }),
    ])

    projectsTotal = pCount.totalDocs
    projectsPublished = pPubCount.totalDocs
    mediaTotal = mCount.totalDocs
    usersTotal = uCount.totalDocs
    if (settings?.name) {
      siteTitle = settings.name
    }
    recentProjects = (recents.docs as Project[]) || []
  } catch (err) {
    payload.logger.error({ err }, 'Error loading DashboardView stats')
  }

  return (
    <div className="control-center">
      {/* 1. Header Banner & System Status */}
      <div className="control-center__banner">
        <div className="control-center__banner-left">
          <div className="control-center__badge">
            <span className="control-center__badge-dot" />
            <span>System Operational • Cloudflare Native</span>
          </div>
          <h1 className="control-center__title">Portfolio Control Center</h1>
          <p className="control-center__subtitle">
            Minimalist studio for managing case studies, live assets, site configuration, and edge persistence powered by Cloudflare D1 & R2.
          </p>
        </div>

        <div className="control-center__banner-right">
          <div className="control-center__status-card">
            <span className="control-center__status-card-label">Database</span>
            <span className="control-center__status-card-value">Cloudflare D1 (WEUR)</span>
          </div>
          <div className="control-center__status-card">
            <span className="control-center__status-card-label">Storage</span>
            <span className="control-center__status-card-value">Cloudflare R2 Bucket</span>
          </div>
        </div>
      </div>

      {/* 2. Quick Action Shortcuts */}
      <div className="control-center__shortcuts-bar">
        <span className="control-center__shortcuts-label">Quick Actions:</span>
        <div className="control-center__shortcuts-group">
          <Link
            href="/admin/collections/projects/create"
            className="control-center__shortcut-btn control-center__shortcut-btn--primary"
          >
            <span>+ New Project</span>
          </Link>
          <Link
            href="/admin/collections/media/create"
            className="control-center__shortcut-btn"
          >
            <span>+ Upload Media</span>
          </Link>
          <Link
            href="/admin/globals/site-settings"
            className="control-center__shortcut-btn"
          >
            <span>Edit Site Settings</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="control-center__shortcut-btn control-center__shortcut-btn--external"
          >
            <span>Live Portfolio</span>
            <span className="control-center__shortcut-arrow">↗</span>
          </a>
        </div>
      </div>

      {/* 3. Minimalist Control Center Cards Grid */}
      <div className="control-center__grid">
        {/* Projects Card */}
        <div className="control-center__card">
          <div className="control-center__card-header">
            <span className="control-center__card-label">Collection</span>
            <span className="control-center__card-tag">{projectsPublished} Live</span>
          </div>
          <h2 className="control-center__card-title">Projects</h2>
          <div className="control-center__card-metric">
            <span className="control-center__card-number">{projectsTotal}</span>
            <span className="control-center__card-subtext">Total Case Studies</span>
          </div>
          <div className="control-center__card-actions">
            <Link
              href="/admin/collections/projects"
              className="control-center__card-link"
            >
              Manage Projects →
            </Link>
            <Link
              href="/admin/collections/projects/create"
              className="control-center__card-link control-center__card-link--accent"
            >
              + Add
            </Link>
          </div>
        </div>

        {/* Site Settings Card */}
        <div className="control-center__card">
          <div className="control-center__card-header">
            <span className="control-center__card-label">Global Configuration</span>
            <span className="control-center__card-tag">Active</span>
          </div>
          <h2 className="control-center__card-title">Site Settings</h2>
          <div className="control-center__card-metric">
            <span className="control-center__card-val-text">{siteTitle}</span>
            <span className="control-center__card-subtext">Global Site Title & Profile</span>
          </div>
          <div className="control-center__card-actions">
            <Link
              href="/admin/globals/site-settings"
              className="control-center__card-link"
            >
              Edit Global Config →
            </Link>
          </div>
        </div>

        {/* Media Library Card */}
        <div className="control-center__card">
          <div className="control-center__card-header">
            <span className="control-center__card-label">Storage</span>
            <span className="control-center__card-tag">Cloudflare R2</span>
          </div>
          <h2 className="control-center__card-title">Media Assets</h2>
          <div className="control-center__card-metric">
            <span className="control-center__card-number">{mediaTotal}</span>
            <span className="control-center__card-subtext">Images & Video Files</span>
          </div>
          <div className="control-center__card-actions">
            <Link
              href="/admin/collections/media"
              className="control-center__card-link"
            >
              Open Media Library →
            </Link>
            <Link
              href="/admin/collections/media/create"
              className="control-center__card-link control-center__card-link--accent"
            >
              + Upload
            </Link>
          </div>
        </div>

        {/* System & Access Card */}
        <div className="control-center__card">
          <div className="control-center__card-header">
            <span className="control-center__card-label">Infrastructure</span>
            <span className="control-center__card-tag">workerd</span>
          </div>
          <h2 className="control-center__card-title">Users & Edge</h2>
          <div className="control-center__card-metric">
            <span className="control-center__card-number">{usersTotal}</span>
            <span className="control-center__card-subtext">Admin Accounts</span>
          </div>
          <div className="control-center__card-actions">
            <Link
              href="/admin/collections/users"
              className="control-center__card-link"
            >
              Manage Users →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Recent Case Studies / Projects Quick-Edit Table */}
      <div className="control-center__section">
        <div className="control-center__section-header">
          <h2 className="control-center__section-title">Recent Case Studies & Projects</h2>
          <Link
            href="/admin/collections/projects"
            className="control-center__section-link"
          >
            View All ({projectsTotal}) →
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="control-center__empty-state">
            <p>No projects created yet.</p>
            <Link
              href="/admin/collections/projects/create"
              className="control-center__shortcut-btn control-center__shortcut-btn--primary"
            >
              + Create First Project
            </Link>
          </div>
        ) : (
          <div className="control-center__table-wrap">
            <table className="control-center__table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Title</th>
                  <th>Role</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((proj) => (
                  <tr key={proj.id}>
                    <td className="control-center__table-no">
                      {proj.projectNumber || '—'}
                    </td>
                    <td className="control-center__table-title">
                      <Link
                        href={`/admin/collections/projects/${proj.id}`}
                        className="control-center__project-link"
                      >
                        {proj.title || 'Untitled Project'}
                      </Link>
                    </td>
                    <td>{proj.role || '—'}</td>
                    <td>{proj.year || '—'}</td>
                    <td>
                      <span
                        className={`control-center__status-pill ${
                          proj.published ? 'control-center__status-pill--live' : 'control-center__status-pill--draft'
                        }`}
                      >
                        {proj.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/admin/collections/projects/${proj.id}`}
                        className="control-center__table-action"
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
  )
}
