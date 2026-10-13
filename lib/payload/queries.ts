import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'
import { cacheLife, cacheTag } from 'next/cache'
import { draftMode } from 'next/headers'

import { PROJECTS_CACHE_TAG } from './revalidate'
import { toProjectView, type ProjectView } from './types'

/**
 * Load every project, ordered for the work list.
 *
 * - In the cached (published) path this is served from the static shell and
 *   only refreshed when `revalidateTag('projects')` is called by the Payload
 *   `afterChange`/`afterDelete` hooks.
 * - In Draft Mode (preview) the cache is bypassed, drafts are included, and
 *   the latest content is read on every request.
 */
export async function getProjects(): Promise<ProjectView[]> {
  'use cache'
  cacheTag(PROJECTS_CACHE_TAG)
  cacheLife('max')

  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'projects',
    depth: 2,
    draft,
    overrideAccess: draft,
    pagination: false,
    sort: 'order',
  })

  return docs.map(toProjectView)
}
