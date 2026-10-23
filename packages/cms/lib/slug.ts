import type { FieldHook } from 'payload'

/**
 * Auto-generates a URL-friendly slug from the document's `title`
 * when no slug value is provided. Shared by all slugged collections.
 */
export const slugHook: FieldHook = ({ data, operation, value }) => {
  if ((operation === 'create' || operation === 'update') && !value && data?.title) {
    return String(data.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }
  return value
}
