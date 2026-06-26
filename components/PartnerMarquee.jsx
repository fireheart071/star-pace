import React from 'react'
import { motion } from 'framer-motion'

const ELITE_LOGOS = [
  '/clidownload.jpg',
  '/clidownload (1).jpg',
  '/clidownload (1).png',
  '/clidownload (2).png'
]

export default function PartnerMarquee() {
  // Duplicate logos list to ensure smooth infinite loop
  const marqueeItems = [...ELITE_LOGOS, ...ELITE_LOGOS, ...ELITE_LOGOS, ...ELITE_LOGOS]

  return (
    <section style={{ 
      background: 'var(--bg-secondary)', 
      padding: '32px 0', 
      borderBottom: '1px solid var(--border-color)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', width: 'fit-content' }}>
        <motion.div
          animate={{ x: ["0%", "-25%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
          style={{ display: 'flex', gap: 80, alignItems: 'center', whiteSpace: 'nowrap' }}
        >
          {marqueeItems.map((logo, i) => (
            <img 
              key={i} 
              src={logo}
              alt="Elite Client Logo"
              style={{ 
                height: '40px',
                width: 'auto',
                objectFit: 'contain',
                transition: 'all 0.3s ease'
              }}
            />
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
