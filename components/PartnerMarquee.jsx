import React from 'react'
import { motion } from 'framer-motion'

const ELITE_PARTNERS = [
  "TULLOW GHANA",
  "NEWMOUNT MINING",
  "DELTA AIRLINES",
  "KEMPINSKI HOTELS",
  "PECAN ENERGIES",
  "DATABANK",
  "QUANTUM TERMINALS",
  "KOREA EXIM BANK",
  "CLARON HEALTH",
  "KULENDI @ LAW",
  "SINOPEC CO.",
  "DANISH EMBASSY"
]

export default function PartnerMarquee() {
  const marqueeItems = [...ELITE_PARTNERS, ...ELITE_PARTNERS, ...ELITE_PARTNERS]

  return (
    <section style={{ 
      background: 'var(--bg-secondary)', 
      padding: '24px 0', 
      borderBottom: '1px solid var(--border-color)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', width: 'fit-content' }}>
        <motion.div
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
          style={{ display: 'flex', gap: 100, alignItems: 'center', whiteSpace: 'nowrap' }}
        >
          {marqueeItems.map((partner, i) => (
            <span 
              key={i} 
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontSize: '10px',
                fontWeight: 900,
                letterSpacing: '0.4em',
                color: 'var(--text-muted)',
                opacity: 0.6
              }}
            >
              {partner}
            </span>
          ))}
        </motion.div>
      </div>
      
      {/* Editorial Soft Side Fades */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(to right, var(--bg-secondary) 0%, transparent 15%, transparent 85%, var(--bg-secondary) 100%)', 
        pointerEvents: 'none' 
      }} />
    </section>
  )
}
