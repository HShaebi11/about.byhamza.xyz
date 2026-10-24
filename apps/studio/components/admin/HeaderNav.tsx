'use client'

import { Logout, useAuth } from '@payloadcms/ui'
import posthog from 'posthog-js'
import React from 'react'

import type { User } from '@repo/cms/generated/payload-types'

const LIVE_SITE_URL = 'https://about.byhamza.xyz'

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
    <div className="studio-header">
      <a
        className="studio-header__live"
        href={LIVE_SITE_URL}
        rel="noopener noreferrer"
        target="_blank"
      >
        Live site
      </a>
      <div className="studio-header__logout" onClickCapture={handleLogout}>
        <Logout />
      </div>
    </div>
  )
}
