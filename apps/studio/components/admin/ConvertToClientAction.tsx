'use client'

import React from 'react'
import { useAllFormFields, useDocumentInfo, toast, Button } from '@payloadcms/ui'

export const ConvertToClientAction: React.FC = () => {
  const { id } = useDocumentInfo()
  const [fields] = useAllFormFields()

  const status = fields.status?.value
  const email = fields.email?.value

  const handleConvert = async () => {
    if (!id) {
      toast.error('Inquiry ID not found')
      return
    }

    if (status === 'won') {
      toast.warning('This inquiry has already been converted to a client')
      return
    }

    try {
      const response = await fetch('/api/convert-inquiry-to-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inquiryId: id }),
      })

      const data = (await response.json()) as { error?: string; clientId?: number | string }

      if (!response.ok) {
        throw new Error(data.error || 'Conversion failed')
      }

      toast.success(`Inquiry converted to client. Client ID: ${data.clientId}`)

      // Reload the page to show updated status
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Conversion Failed: ${message}`)
    }
  }

  return (
    <Button
      buttonStyle="primary"
      onClick={handleConvert}
      disabled={status === 'won' || !email}
      size="medium"
    >
      {status === 'won' ? 'Already Converted' : 'Convert to Client'}
    </Button>
  )
}
