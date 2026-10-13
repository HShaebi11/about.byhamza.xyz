import { draftMode } from 'next/headers'

export default async function PreviewBanner() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return null

  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 14px',
        background: '#000',
        color: '#fff',
        borderRadius: 999,
        fontFamily: "'PP Neue Montreal Mono', monospace",
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
      }}
    >
      <span>Draft preview</span>
      <form action="/api/exit-preview" method="post">
        <button
          type="submit"
          style={{
            background: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: 999,
            padding: '4px 10px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            textTransform: 'inherit',
          }}
        >
          Exit
        </button>
      </form>
    </div>
  )
}
