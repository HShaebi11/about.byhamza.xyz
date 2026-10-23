'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logout, useAuth } from '@payloadcms/ui'
import posthog from 'posthog-js'

import type { User } from '@repo/cms/generated/payload-types'

interface HeaderNavItem {
  label: string
  href: string
}

const NAV_ITEMS: HeaderNavItem[] = [
  { label: 'Control Center', href: '/admin' },
  { label: 'Projects', href: '/admin/collections/projects' },
  { label: 'Posts', href: '/admin/collections/posts' },
  { label: 'Media', href: '/admin/collections/media' },
  { label: 'Tools', href: '/admin/collections/tools' },
  { label: 'Services', href: '/admin/collections/services' },
  { label: 'Inquiries', href: '/admin/collections/inquiries' },
  { label: 'Clients', href: '/admin/collections/clients' },
  { label: 'Invoices', href: '/admin/collections/invoices' },
  { label: 'Site Settings', href: '/admin/globals/site-settings' },
  { label: 'Users', href: '/admin/collections/users' },
]

export const HeaderNav: React.FC = () => {
  const pathname = usePathname()
  const { user } = useAuth<User>()
  const previousUserId = React.useRef<string | null>(null)
  const isPostHogConfigured = Boolean(
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST,
  )

  React.useEffect(() => {
    if (!isPostHogConfigured || user?.id == null) return

    const userId = String(user.id)

    if (previousUserId.current === userId) return

    if (previousUserId.current) {
      posthog.reset()
    }

    posthog.identify(userId, {
      email: user.email,
      ...(user.name ? { name: user.name } : {}),
    })
    previousUserId.current = userId
  }, [isPostHogConfigured, user])

  const handleLogout = () => {
    if (isPostHogConfigured) {
      posthog.reset()
    }
  }

  return (
    <div className="top-header-nav">
      {/* Sleek Segmented Navigation Bar */}
      <nav className="top-header-nav__segmented" aria-label="Primary admin navigation">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`top-header-nav__tab ${isActive ? 'top-header-nav__tab--active' : ''}`}
            >
              {isActive && <span className="top-header-nav__tab-dot" />}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="top-header-nav__separator" />

      {/* External Live Site Link */}
      <a
        href="https://about.byhamza.xyz"
        target="_blank"
        rel="noopener noreferrer"
        className="top-header-nav__live-link"
        title="Open Live Portfolio in new tab"
      >
        <span>Live Site</span>
        <span className="top-header-nav__live-arrow">↗</span>
      </a>

      {/* Logout Action */}
      <div className="top-header-nav__logout-wrap" onClickCapture={handleLogout}>
        <Logout />
      </div>
    </div>
  )
}
