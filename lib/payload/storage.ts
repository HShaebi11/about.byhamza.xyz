import type { Plugin } from 'payload'

import { s3Storage } from '@payloadcms/storage-s3'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

/**
 * Which storage backend media uploads are written to.
 *
 * - `vercel-blob` — Vercel Blob (default on Vercel, token auto-injected).
 * - `r2`          — Cloudflare R2 (S3-compatible, no egress fees).
 * - `local`       — Payload's local disk storage (good for local development).
 *
 * The adapter is chosen from `STORAGE_ADAPTER`, falling back to auto-detection
 * based on which credentials are present.
 */
export type StorageAdapter = 'local' | 'r2' | 'vercel-blob'

export function resolveStorageAdapter(): StorageAdapter {
  const explicit = process.env.STORAGE_ADAPTER as StorageAdapter | undefined
  if (explicit === 'local' || explicit === 'r2' || explicit === 'vercel-blob') {
    return explicit
  }
  if (process.env.BLOB_READ_WRITE_TOKEN) return 'vercel-blob'
  if (process.env.R2_BUCKET && process.env.R2_ACCESS_KEY_ID) return 'r2'
  return 'local'
}

/**
 * Uploads happen directly from the browser to the storage provider. This
 * bypasses Vercel's ~4.5 MB request body limit and keeps large media off the
 * serverless function.
 */
const clientUploads = true

function vercelBlobStoragePlugin(): Plugin {
  return vercelBlobStorage({
    enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    token: process.env.BLOB_READ_WRITE_TOKEN,
    collections: {
      media: true,
    },
    clientUploads,
  })
}

function r2StoragePlugin(): Plugin {
  return s3Storage({
    enabled: Boolean(process.env.R2_BUCKET && process.env.R2_ACCESS_KEY_ID),
    bucket: process.env.R2_BUCKET ?? '',
    collections: {
      media: {
        prefix: 'media',
        generateFileURL: ({ filename, prefix }) => {
          const base = (process.env.R2_PUBLIC_URL ?? '').replace(/\/$/, '')
          return `${base}/${prefix ? `${prefix}/` : ''}${filename}`
        },
      },
    },
    config: {
      endpoint: process.env.R2_ENDPOINT,
      region: 'auto',
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
      },
    },
    clientUploads,
  })
}

/**
 * The storage plugins to register, based on the resolved adapter. `local`
 * requires no plugin — Payload writes uploads to disk in development.
 */
export function storagePlugins(): Plugin[] {
  switch (resolveStorageAdapter()) {
    case 'vercel-blob':
      return [vercelBlobStoragePlugin()]
    case 'r2':
      return [r2StoragePlugin()]
    default:
      return []
  }
}
