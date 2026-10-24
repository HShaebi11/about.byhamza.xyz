'use client'

import { DefaultEditView } from '@payloadcms/ui'
import React from 'react'

type EditViewProps = React.ComponentProps<typeof DefaultEditView>

export function ClientEditView(props: EditViewProps) {
  return (
    <div className="studio-editor studio-editor--client">
      <DefaultEditView {...props} />
    </div>
  )
}
