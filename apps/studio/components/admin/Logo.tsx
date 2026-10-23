import React from 'react'

export const Logo: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          background: '#002fff',
          borderRadius: '7px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '0.5px',
          fontFamily: "'PP Neue Montreal Mono', monospace",
          flexShrink: 0,
        }}
      >
        HS
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span
          style={{
            fontFamily: "'PP Mondwest', sans-serif",
            fontSize: '17px',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          Hamza Shaebi
        </span>
        <span
          style={{
            fontSize: '10px',
            letterSpacing: '1px',
            fontFamily: "'PP Neue Montreal Mono', monospace",
            textTransform: 'uppercase',
            opacity: 0.65,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginTop: '3px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#10b981',
              display: 'inline-block',
            }}
          />
          CMS • Cloudflare D1
        </span>
      </div>
    </div>
  )
}
