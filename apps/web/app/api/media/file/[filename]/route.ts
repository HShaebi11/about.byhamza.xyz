import { getCloudflareContext } from '@opennextjs/cloudflare'

function isSafeFilename(filename: string): boolean {
  return filename.length > 0 && !filename.includes('..') && !filename.includes('\\')
}

async function objectFromR2(filename: string) {
  const { env } = await getCloudflareContext({ async: true })
  const bucket = env.R2
  if (!bucket) return null
  return (
    (await bucket.get(filename)) ??
    (await bucket.get(`media/${filename}`))
  )
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename: raw } = await context.params
  const filename = decodeURIComponent(raw)
  if (!isSafeFilename(filename)) {
    return new Response('Not found', { status: 404 })
  }

  try {
    const object = await objectFromR2(filename)
    if (!object) {
      return new Response('Not found', { status: 404 })
    }
    const headers = new Headers()
    headers.set(
      'Cache-Control',
      'public, max-age=86400, stale-while-revalidate=86400',
    )
    headers.set(
      'Content-Type',
      object.httpMetadata?.contentType || 'application/octet-stream',
    )
    if (object.httpEtag) headers.set('ETag', object.httpEtag)
    return new Response(object.body, { headers })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
