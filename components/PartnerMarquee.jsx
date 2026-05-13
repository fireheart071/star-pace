import React from 'react'
import { motion } from 'framer-motion'

const MULTINATIONAL_LOGOS = [
  { name: "Tullow Ghana Limited", url: "/tullow.png" },
  { name: "Anadarko WTCP Company", url: "/Anadarko-Petroleum-Corp.-logo.jpg" },
  { name: "Newmont Ghana Limited", url: "/newmont.jpg" },
  { name: "Guinness Ghana Limited", url: "/Refreshed-Logo_Guinness-Ghana-2.jpg" },
  { name: "Sinopec Company Limited", url: "/sinopec.png" },
  { name: "Cadbury Ghana Limited", url: "/_1705176524-10-cadbury-ghana-ltd.jpg" },
  { name: "Delta Airlines", url: "/Delta-Air-Lines-Logo-1966.png" },
  { name: "Quantum Terminals", url: "/quantum.png" },
  { name: "Tecnip", url: "/technip.jpg" },
  { name: "Korea Exim Bank", url: "/The_Export-Import_Bank_of_Korea_logo.png" },
  { name: "Pecan Energies", url: "/pecan energies.jpg" },
  { name: "LUKoil", url: "/lukoil.png" }
]

const LOCAL_LOGOS = [
  { name: "Oxfam Ghana", url: "/oxfarm.jpg" },
  { name: "Databank Ghana", url: "/databank.png" },
  { name: "NHIA", url: "/NHIA-696x411-1.webp" },
  { name: "Korle-Bu Teaching Hospital", url: "/korlebu.png" },
  { name: "Reime Ghana", url: "/reime.png" },
  { name: "ATS", url: "/ats.jpg" },
  { name: "Danish Embassy", url: "/danish embassy.png" },
  { name: "District Grand Lodge", url: "/DISTRICT GRAND LOGDE.jpg" },
  { name: "Claron Health International", url: "/CLARON health international.png" },
  { name: "Tonaton", url: "/tonaton.jpg" },
  { name: "Consika", url: "/consika.png" },
  { name: "Energem Ltd", url: "/energem.png" },
  { name: "Cardinal Petroleum", url: "/Cardinalpetroleumwhite.png" },
  { name: "Bayfields", url: "/bayfield.png" },
  { name: "Ecobank", url: "/ecobank.jpg" },
  { name: "Stanbic Bank", url: "/STANBIC_LOGO.webp" },
  { name: "Kulendi@Law", url: "/K@L+logo.webp" },
  { name: "Faibille & Faibille", url: "/FAIBILLE-AND-FAIBILLE-LOGO-PNG.png" },
  { name: "Charterhouse", url: "/charter house.jpg" }
]

const MarqueeRow = ({ items, direction = "left", duration = 60 }) => {
  const marqueeItems = [...items, ...items, ...items]
  const xValues = direction === "left" ? ["0%", "-33.33%"] : ["-33.33%", "0%"]

  return (
    <div style={{ display: 'flex', width: 'fit-content', marginBottom: '30px' }}>
      <motion.div
        animate={{ x: xValues }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: duration,
            ease: "linear",
          },
        }}
        style={{ display: 'flex', gap: 80, alignItems: 'center', whiteSpace: 'nowrap' }}
      >
        {marqueeItems.map((partner, i) => (
          <div key={i} style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            flexShrink: 0
          }}>
            <img 
              src={partner.url} 
              alt={`${partner.name} logo`}
              style={{ 
                height: '40px', 
                width: 'auto', 
                maxWidth: '160px',
                objectFit: 'contain',
                opacity: 0.8,
                transition: '0.4s ease'
              }} 
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function PartnerMarquee() {
  return (
    <section style={{ 
      background: '#f8fafc', 
      padding: '60px 0', 
      borderTop: '1px solid #f0f0f0', 
      borderBottom: '1px solid #f0f0f0',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Decorative Branding Label */}
      <div style={{ 
        position: 'absolute', 
        left: 0, 
        top: 0, 
        padding: '2px 12px', 
        background: 'var(--accent-gold)', 
        color: '#fff', 
        fontSize: '8px', 
        fontWeight: 900, 
        textTransform: 'uppercase', 
        letterSpacing: '0.2em',
        zIndex: 10
      }}>
        Affiliate Network
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h4 style={{ 
            fontSize: '11px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            color: '#64748b',
            marginBottom: '20px',
            fontWeight: 700,
            textAlign: 'center'
          }}>
            Multinational Partners
          </h4>
          <MarqueeRow items={MULTINATIONAL_LOGOS} direction="left" duration={80} />
        </div>

        <div>
          <h4 style={{ 
            fontSize: '11px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            color: '#64748b',
            marginBottom: '20px',
            fontWeight: 700,
            textAlign: 'center'
          }}>
            Local Partners
          </h4>
          <MarqueeRow items={LOCAL_LOGOS} direction="right" duration={90} />
        </div>
      </div>
      
      {/* Soft Fade Edges */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #f8fafc 0%, transparent 15%, transparent 85%, #f8fafc 100%)', pointerEvents: 'none' }} />
    </section>
  )
}
