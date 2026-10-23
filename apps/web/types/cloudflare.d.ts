/// <reference types="@cloudflare/workers-types" />

declare global {
  interface CloudflareEnv {
    STUDIO?: Fetcher
    ASSETS?: Fetcher
    CMS_API_URL?: string
  }
}

export {}
