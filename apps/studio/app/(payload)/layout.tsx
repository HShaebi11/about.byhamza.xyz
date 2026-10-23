import configPromise from '@payload-config'
import '@payloadcms/ui/styles.css'
import React from 'react'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => (
  <RootLayout
    config={configPromise}
    importMap={importMap}
    serverFunction={async function (args) {
      'use server'
      return handleServerFunctions({
        ...args,
        config: configPromise,
        importMap,
      })
    }}
  >
    {children}
  </RootLayout>
)

export default Layout
