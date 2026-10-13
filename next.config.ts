import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

function r2Hostname(): string | null {
  const url = process.env.R2_PUBLIC_URL
  if (!url) return null
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}

const r2Host = r2Hostname()

const nextConfig: NextConfig = {
  // The site is served from Next's cache and revalidated on demand from Payload.
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      // Vercel Blob
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      // Cloudflare R2 public bucket
      ...(r2Host ? [{ protocol: 'https' as const, hostname: r2Host }] : []),
      // Legacy/placeholder sources
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/project/:slug',
        destination: '/',
      },
    ]
  },
}

export default withPayload(nextConfig)
