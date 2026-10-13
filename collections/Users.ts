import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  auth: true,
  access: {
    // Any logged-in user can read the list of users (needed for admin UI relations).
    read: ({ req }) => Boolean(req.user),
    // Allow creating the very first user (bootstrap) or any authenticated user.
    create: async ({ req }) => {
      if (req.user) return true
      const { totalDocs } = await req.payload.count({ collection: 'users' })
      return totalDocs === 0
    },
    update: ({ req, id }) => {
      if (!req.user) return false
      // Users may update themselves; keep it simple otherwise.
      return req.user.collection === 'users' && req.user.id === id
    },
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}
