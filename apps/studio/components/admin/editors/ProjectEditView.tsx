'use client'

import { DefaultEditView } from '@payloadcms/ui'
import React from 'react'

type EditViewProps = React.ComponentProps<typeof DefaultEditView>

export function ProjectEditView(props: EditViewProps) {
  return (
    <div className="studio-editor studio-editor--project">
      <DefaultEditView {...props} />
    </div>
  )
}
