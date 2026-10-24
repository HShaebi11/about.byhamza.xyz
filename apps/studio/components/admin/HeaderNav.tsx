'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logout, useAuth } from '@payloadcms/ui'
import posthog from 'posthog-js'

import type { User } from '@repo/cms/generated/payload-types'

interface NavItem {
  label: string
  href: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ label: 'Control Center', href: '/admin' }],
  },
  {
    label: 'Content',
    items: [
      { label: 'Projects', href: '/admin/collections/projects' },
      { label: 'Posts', href: '/admin/collections/posts' },
      { label: 'Media', href: '/admin/collections/media' },
      { label: 'Tools', href: '/admin/collections/tools' },
      { label: 'Services', href: '/admin/collections/services' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { label: 'Inquiries', href: '/admin/collections/inquiries' },
      { label: 'Clients', href: '/admin/collections/clients' },
      { label: 'Invoices', href: '/admin/collections/invoices' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Site Settings', href: '/admin/globals/site-settings' },
      { label: 'Users', href: '/admin/collections/users' },
    ],
  },
]

const LIVE_SITE_URL = 'https://about.byhamza.xyz'

export const HeaderNav: React.FC = () => {
  const pathname = usePathname()
  const { user } = useAuth<User>()
  const previousUserId = React.useRef<string | null>(null)
  const [menuOpen, setMenuOpen] = React.useState(false)
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

  // Close the mobile menu on route change or Escape
  const [lastPathname, setLastPathname] = React.useState(pathname)
  if (lastPathname !== pathname) {
    setLastPathname(pathname)
    setMenuOpen(false)
  }

  React.useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const handleLogout = () => {
    if (isPostHogConfigured) {
      posthog.reset()
    }
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const renderLink = (item: NavItem) => (
    <Link
      key={item.href}
      href={item.href}
      aria-current={isActive(item.href) ? 'page' : undefined}
      className={`topnav__link ${isActive(item.href) ? 'topnav__link--active' : ''}`}
    >
      {isActive(item.href) && <span className="topnav__link-dot" />}
      <span>{item.label}</span>
    </Link>
  )

  return (
    <nav className="topnav" aria-label="Admin navigation">
      <Link href="/admin" className="topnav__brand">
        <span className="topnav__brand-mark">HS</span>
        <span className="topnav__brand-text">Studio</span>
        <span className="topnav__brand-tag">Admin</span>
      </Link>

      {/* Desktop: scrollable grouped nav */}
      <div className="topnav__menu">
        {NAV_GROUPS.map((group) => (
          <div className="topnav__group" key={group.label}>
            <span className="topnav__group-label">{group.label}</span>
            <div className="topnav__group-items">{group.items.map(renderLink)}</div>
          </div>
        ))}
      </div>

      {/* Mobile: toggle + dropdown panel */}
      <button
        type="button"
        className="topnav__toggle"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="topnav__toggle-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>Menu</span>
      </button>

      <div
        className={`topnav__dropdown ${menuOpen ? 'topnav__dropdown--open' : ''}`}
        onClickCapture={() => setMenuOpen(false)}
      >
        {NAV_GROUPS.map((group) => (
          <div className="topnav__dropdown-group" key={group.label}>
            <span className="topnav__dropdown-label">{group.label}</span>
            <div className="topnav__dropdown-links">{group.items.map(renderLink)}</div>
          </div>
        ))}
      </div>

      <div className="topnav__end">
        <a
          href={LIVE_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="topnav__site"
          title="Open Live Portfolio in new tab"
        >
          <span>Live Site</span>
          <span aria-hidden="true">↗</span>
        </a>

        <div className="topnav__logout" onClickCapture={handleLogout}>
          <Logout />
        </div>
      </div>
    </nav>
  )
}
