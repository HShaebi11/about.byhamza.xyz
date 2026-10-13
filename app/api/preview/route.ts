import config from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

/**
 * Enables Draft Mode and redirects to a project so editors can preview
 * unpublished content.
 *
 * The Payload admin "Preview" button links to:
 *   /api/preview?secret=<PREVIEW_SECRET>&slug=<project-slug>
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET || !slug) {
    return new Response('Invalid preview token', { status: 401 })
  }

  // Normalise `/project/foo`, `foo`, `/foo` → `foo`.
  const cleanSlug = slug.replace(/^\/project\//, '').replace(/^\//, '')

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: cleanSlug } },
    draft: true,
    overrideAccess: true,
    limit: 1,
    depth: 0,
  })

  const project = docs[0]
  if (!project) {
    return new Response('Project not found', { status: 404 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(`/project/${project.slug}`)
}
