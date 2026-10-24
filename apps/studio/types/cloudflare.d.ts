/// <reference types="@cloudflare/workers-types" />

declare global {
  interface CloudflareEnv {
    DB?: D1Database
    R2?: R2Bucket
    ASSETS?: Fetcher
    PAYLOAD_SECRET?: string
    DATABASE_URL?: string
    NEXT_PUBLIC_SERVER_URL?: string
  }
}

export {}
