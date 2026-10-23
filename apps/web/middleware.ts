import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add cache headers for static assets
  if (request.nextUrl.pathname.startsWith('/static/') ||
      request.nextUrl.pathname.match(/\.(css|js|woff|woff2|ttf|otf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  // Add cache headers for images
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=86400')
  }

  // Add cache headers for API GET requests (read-only)
  if (request.nextUrl.pathname.startsWith('/api/') && request.method === 'GET') {
    // Exclude webhooks from caching
    if (!request.nextUrl.pathname.includes('/webhook')) {
      response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=300')
    } else {
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
