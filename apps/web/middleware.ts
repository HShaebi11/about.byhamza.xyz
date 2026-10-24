import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/static/') ||
    pathname.match(/\.(css|js|woff2?|ttf|otf|eot)$/)
  ) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  if (pathname.match(/\.(jpe?g|png|gif|webp|avif|svg)$/)) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=86400, stale-while-revalidate=86400',
    )
  }

  return response
}

export const config = {
  matcher: [
    '/static/:path*',
    '/:path*.css',
    '/:path*.js',
    '/:path*.woff',
    '/:path*.woff2',
    '/:path*.ttf',
    '/:path*.otf',
    '/:path*.eot',
    '/:path*.jpg',
    '/:path*.jpeg',
    '/:path*.png',
    '/:path*.gif',
    '/:path*.webp',
    '/:path*.avif',
    '/:path*.svg',
  ],
}
