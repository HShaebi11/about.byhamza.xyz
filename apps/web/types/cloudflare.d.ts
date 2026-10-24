/// <reference types="@cloudflare/workers-types" />

declare global {
  interface CloudflareEnv {
    ASSETS?: Fetcher
    DB?: D1Database
    R2?: R2Bucket
    CMS_API_URL?: string
    NEXT_PUBLIC_SITE_URL?: string
    NEXT_INC_CACHE_R2_BUCKET?: R2Bucket
    WORKER_SELF_REFERENCE?: Fetcher
    NEXT_CACHE_DO_QUEUE?: DurableObjectNamespace
  }
}

export {}
