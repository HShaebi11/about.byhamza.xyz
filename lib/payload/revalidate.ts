export const PROJECTS_CACHE_TAG = 'projects'

/**
 * Invalidate the cached project data.
 *
 * Uses a dynamic import so this module (imported by collection configs, which
 * are also loaded by the Payload CLI outside of a Next.js runtime) does not
 * hard-depend on `next/cache`.
 */
export async function revalidateProjects(): Promise<void> {
  try {
    const { revalidateTag } = await import('next/cache')
    revalidateTag(PROJECTS_CACHE_TAG, 'max')
  } catch {
    // Outside a Next.js request context (e.g. seeding via the CLI) there is
    // nothing to revalidate.
  }
}
