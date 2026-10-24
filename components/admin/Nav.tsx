'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useNav } from '@payloadcms/ui'
import React from 'react'
import { createPortal } from 'react-dom'

interface NavItem {
  href: string
  label: string
}

interface NavGroup {
  items: NavItem[]
  label: string
}

const GROUPS: NavGroup[] = [
  {
    label: 'Work',
    items: [
      { label: 'Projects', href: '/admin/collections/projects' },
      { label: 'Media', href: '/admin/collections/media' },
    ],
  },
  {
    label: 'Studio',
    items: [
      { label: 'Inquiries', href: '/admin/collections/inquiries' },
      { label: 'Clients', href: '/admin/collections/clients' },
      { label: 'Invoices', href: '/admin/collections/invoices' },
    ],
  },
  {
    label: 'Site',
    items: [{ label: 'Site Settings', href: '/admin/globals/site-settings' }],
  },
  {
    label: 'Account',
    items: [{ label: 'Users', href: '/admin/collections/users' }],
  },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/admin') return pathname === '/admin'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export const Nav: React.FC = () => {
  const pathname = usePathname()
  const { navOpen, navRef, setNavOpen } = useNav()
  const [canPortal, setCanPortal] = React.useState(false)

  React.useEffect(() => {
    setCanPortal(true)
  }, [])

  const close = () => {
    setNavOpen(false)
  }

  return (
    <div className="nav studio-nav" ref={navRef}>
      <div className="studio-nav__scroll">
        <Link
          className={`studio-nav__home${isActive(pathname, '/admin') ? ' studio-nav__home--active' : ''}`}
          href="/admin"
          onClick={close}
        >
          Control Center
        </Link>

        {GROUPS.map((group) => (
          <div className="studio-nav__group" key={group.label}>
            <p className="studio-nav__group-label">{group.label}</p>
            <ul className="studio-nav__list">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      aria-current={active ? 'page' : undefined}
                      className={`studio-nav__link${active ? ' studio-nav__link--active' : ''}`}
                      href={item.href}
                      onClick={close}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="studio-nav__footer">
        <span>Cloudflare D1</span>
        <span>R2 media</span>
      </div>

      {canPortal && navOpen
        ? createPortal(
            <button
              aria-label="Close menu"
              className="studio-nav__backdrop"
              onClick={close}
              type="button"
            />,
            document.body,
          )
        : null}
    </div>
  )
}
