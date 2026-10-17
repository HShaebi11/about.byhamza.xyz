import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig, type Plugin } from 'payload'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { r2Storage } from '@payloadcms/storage-r2'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { getCloudflareContext } from '@opennextjs/cloudflare'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Inquiries } from './collections/Inquiries'
import { Clients } from './collections/Clients'
import { Invoices } from './collections/Invoices'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function getCloudflare() {
  try {
    return await getCloudflareContext({ async: true })
  } catch {
    return null
  }
}

const cloudflare = await getCloudflare()

const databaseUrl = process.env.DATABASE_URL || 'file:./payload.db'

const dbAdapter = cloudflare?.env?.DB
  ? sqliteD1Adapter({
      binding: cloudflare.env.DB,
      push: false,
    })
  : sqliteAdapter({
      client: {
        url: databaseUrl,
      },
      push: true,
    })

const plugins: Plugin[] = []
if (cloudflare?.env?.R2) {
  plugins.push(
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: {
        media: true,
      },
    })
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Hamza Shaebi CMS',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo#Logo',
        Icon: '@/components/admin/Icon#Icon',
      },
      actions: ['@/components/admin/HeaderNav#HeaderNav'],
      Nav: '@/components/admin/Nav#Nav',
      views: {
        dashboard: {
          Component: '@/components/admin/DashboardView#DashboardView',
        },
      },
    },
  },
  collections: [Users, Media, Projects, Inquiries, Clients, Invoices],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '2a5b59a2cf84aab41b0eafe8f6ade2038d36678b99fdf6b3b82b93eed163e4c7',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: dbAdapter,
  plugins,
  graphQL: {
    disablePlaygroundInProduction: false,
  },
  debug: process.env.NODE_ENV === 'development',
  onInit: async (payload) => {
    try {
      const existing = await payload.find({
        collection: 'projects',
        limit: 1,
      })
      if (existing.totalDocs === 0) {
        payload.logger.info('Auto-seeding initial projects...')
        const initialProjects = [
          {
            projectNumber: '01',
            title: 'Project One',
            slug: 'project-one',
            description: 'A creative exploration of interactive design systems.',
            role: 'Design Engineer',
            year: '2024',
            client: 'Internal Exploration',
            status: 'Live' as const,
            challenge:
              'Crafting a seamless experience that bridges the gap between complex functionality and minimalistic design. The goal was to create an interface that feels invisible, allowing the content to take center stage while maintaining a strong, distinct brand identity.\n\nThrough meticulous attention to typography, spacing, and micro-interactions, we developed a system that scales elegantly across devices.',
            order: 1,
            published: true,
          },
          {
            projectNumber: '02',
            title: 'Dynamic Interface',
            slug: 'dynamic-interface',
            description: 'Building fluid components for modern web applications.',
            role: 'Design Engineer',
            year: '2024',
            client: 'Internal Exploration',
            status: 'Live' as const,
            challenge:
              'Creating responsive, physics-based interactions that feel organic and performant across devices of all form factors.',
            order: 2,
            published: true,
          },
          {
            projectNumber: '03',
            title: 'Visual Identity',
            slug: 'visual-identity',
            description: 'Defining brand language through minimal aesthetic.',
            role: 'Design Engineer',
            year: '2024',
            client: 'Internal Exploration',
            status: 'Live' as const,
            challenge:
              'Establishing a typography-led visual identity that communicates precision and creative craft without visual noise.',
            order: 3,
            published: true,
          },
          {
            projectNumber: '04',
            title: 'Design Engineering',
            slug: 'design-engineering',
            description: 'Bridging the gap between design and technical implementation.',
            role: 'Design Engineer',
            year: '2024',
            client: 'Internal Exploration',
            status: 'Live' as const,
            challenge:
              'Transforming high-fidelity concepts and animations into production-ready web software with GSAP and modern component systems.',
            order: 4,
            published: true,
          },
        ]
        for (const proj of initialProjects) {
          await payload.create({
            collection: 'projects',
            data: proj,
          })
        }
      }
    } catch (e) {
      payload.logger.error({ err: e }, 'Error during onInit auto-seed')
    }
  },
})
