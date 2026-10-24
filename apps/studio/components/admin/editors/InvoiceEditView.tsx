'use client'

import { DefaultEditView } from '@payloadcms/ui'
import React from 'react'

type EditViewProps = React.ComponentProps<typeof DefaultEditView>

export function InvoiceEditView(props: EditViewProps) {
  return (
    <div className="studio-editor studio-editor--invoice">
      <DefaultEditView {...props} />
    </div>
  )
}
