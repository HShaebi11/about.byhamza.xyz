import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Users } from './collections/Users'
import { getServerURL } from './lib/payload/server-url'
import { storagePlugins } from './lib/payload/storage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · Hamza Shaebi',
    },
  },
  cors: [
    getServerURL(),
    'http://localhost:3000',
  ],
  csrf: [getServerURL(), 'http://localhost:3000'],
  collections: [Projects, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? '',
  serverURL: getServerURL(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL ?? '',
    },
    // Use migrations in every environment for a consistent, reviewable schema.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    ...storagePlugins(),
    mcpPlugin({
      userCollection: 'users',
      collections: {
        projects: {
          description:
            'Portfolio projects. Each project has metadata (title, year, role, client, description) and a composition of content blocks.',
          enabled: {
            find: true,
            create: true,
            update: true,
            delete: false,
          },
        },
        media: {
          description: 'Images uploaded for use inside project compositions.',
          enabled: {
            find: true,
            create: true,
            update: false,
            delete: false,
          },
        },
      },
    }),
  ],
})
