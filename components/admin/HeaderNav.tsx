'use client'

import { Logout, useAuth } from '@payloadcms/ui'
import posthog from 'posthog-js'
import React from 'react'

import type { User } from '@/payload-types'

export const HeaderNav: React.FC = () => {
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
      <a
        className="top-header-nav__live-link"
        href="/"
        rel="noopener noreferrer"
        target="_blank"
        title="Open the live portfolio in a new tab"
      >
        <span>Live Site</span>
        <span className="top-header-nav__live-arrow">↗</span>
      </a>

      <div className="top-header-nav__logout-wrap" onClickCapture={handleLogout}>
        <Logout />
      </div>
    </div>
  )
}
