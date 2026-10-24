'use client'

import React from 'react'

type SectionLabelProps = {
  field?: {
    admin?: {
      custom?: {
        hint?: string
        label?: string
      }
    }
  }
}

export function SectionLabel({ field }: SectionLabelProps) {
  const label = field?.admin?.custom?.label
  const hint = field?.admin?.custom?.hint
  if (!label) return null

  return (
    <div className="studio-section">
      <p className="studio-section__label">{label}</p>
      {hint ? <p className="studio-section__hint">{hint}</p> : null}
    </div>
  )
}
