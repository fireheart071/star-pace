import React from 'react'

export default function TrustBadges() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ padding: '10px 20px', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 999, color: '#D4AF37', fontWeight: 600, fontSize: 13, letterSpacing: '0.05em', textTransform: 'uppercase' }}>ISO 9001 Certified</div>
      <div style={{ padding: '10px 20px', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 999, color: '#D4AF37', fontWeight: 600, fontSize: 13, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Elite EV Fleet</div>
    </div>
  )
}
