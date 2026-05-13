import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import IMAGES from '../data/images'
import { ArrowRight, ChevronRight, Search } from 'lucide-react'

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [pickUpDate, setPickUpDate] = useState('')
  const [category, setCategory] = useState('All')
  const heroBgUrl = IMAGES.hero || '/hero-placeholder.jpg'

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: `url('${heroBgUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: isMobile ? '85vh' : '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: isMobile ? '120px 24px 80px' : '0 72px',
        position: 'relative',
        marginTop: 0,
      }}
    >
      {/* Dynamic gradient overlay - deeper on mobile for text clarity */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: isMobile
          ? 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)'
          : 'linear-gradient(105deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.1) 100%)',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 880, width: '100%' }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 999,
            padding: '6px 16px',
            marginBottom: isMobile ? 20 : 28,
            backdropFilter: 'blur(8px)',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-gold)', display: 'inline-block' }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Ghana's Finest Fleet
          </span>
        </motion.div>

        {/* Headline */}
        <div style={{ marginBottom: isMobile ? 24 : 32 }}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: isMobile ? 42 : 76,
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              margin: 0,
            }}
          >
            Premium Rides,
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            style={{
              fontSize: isMobile ? 42 : 76,
              fontWeight: 900,
              fontStyle: 'italic',
              color: 'var(--accent-gold)',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              margin: 0,
            }}
          >
            Exceptional Service.
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          style={{
            fontSize: isMobile ? 14 : 17,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.6,
            marginBottom: isMobile ? 32 : 44,
            borderLeft: '2px solid var(--accent-gold)',
            paddingLeft: 16,
            maxWidth: isMobile ? '100%' : 480,
          }}
        >
          Experience the ultimate in private mobility. Premium vehicles, elite chauffeurs, and 24/7 assistance across Ghana.
        </motion.p>

        {/* Booking panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{
            width: '100%',
            maxWidth: isMobile ? '100%' : '1000px',
            marginTop: isMobile ? 12 : 48,
            position: 'relative',
            zIndex: 10
          }}
        >
          <div style={{
            display: isMobile ? 'flex' : 'grid',
            flexDirection: isMobile ? 'row' : 'unset',
            gridTemplateColumns: isMobile ? 'unset' : 'repeat(3, 1fr) auto',
            gap: isMobile ? 0 : 0,
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: isMobile ? '10px 8px' : '12px 12px 12px 24px',
            borderRadius: isMobile ? 18 : 24,
            boxShadow: isMobile ? '0 20px 40px rgba(0,0,0,0.4)' : '0 30px 60px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)'
          }}>
            {/* Field 1: Location */}
            <div style={{
              borderRight: '1px solid rgba(255, 255, 255, 0.15)',
              padding: isMobile ? '0 1px' : '0 20px',
              flex: isMobile ? 1.6 : 1,
              minWidth: 0
            }}>
              <label style={{
                display: 'block',
                fontSize: isMobile ? 8 : 10,
                fontWeight: 800,
                color: 'rgba(255, 255, 255, 0.6)',
                textTransform: 'uppercase',
                letterSpacing: isMobile ? '0.02em' : '0.1em',
                marginBottom: isMobile ? 2 : 4,
                whiteSpace: 'nowrap'
              }}>
                {isMobile ? 'Location' : 'PICK-UP LOCATION'}
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: isMobile ? '4px 0' : '8px 0',
                  border: 'none',
                  background: 'transparent',
                  fontWeight: 700,
                  fontSize: isMobile ? 9.5 : 14,
                  outline: 'none',
                  color: '#ffffff',
                  letterSpacing: isMobile ? '-0.03em' : 'normal'
                }}
              >
                <option value="" disabled style={{ color: '#000' }}>{isMobile ? 'City' : 'Select City'}</option>
                <option value="accra" style={{ color: '#000' }}>Accra</option>
                <option value="takoradi" style={{ color: '#000' }}>Takoradi</option>
                <option value="kumasi" style={{ color: '#000' }}>Kumasi</option>
              </select>
            </div>

            {/* Field 2: Date */}
            <div style={{
              borderRight: '1px solid rgba(255, 255, 255, 0.15)',
              padding: isMobile ? '0 1px' : '0 20px',
              flex: isMobile ? 1.5 : 1,
              minWidth: 0
            }}>
              <label style={{
                display: 'block',
                fontSize: isMobile ? 8 : 10,
                fontWeight: 800,
                color: 'rgba(255, 255, 255, 0.6)',
                textTransform: 'uppercase',
                letterSpacing: isMobile ? '0.02em' : '0.1em',
                marginBottom: isMobile ? 2 : 4,
                whiteSpace: 'nowrap'
              }}>
                {isMobile ? 'Date' : 'PICK-UP DATE'}
              </label>
              <input
                type="date"
                value={pickUpDate}
                onChange={(e) => setPickUpDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: isMobile ? '4px 0' : '8px 0',
                  border: 'none',
                  background: 'transparent',
                  fontWeight: 700,
                  fontSize: isMobile ? 9.5 : 14,
                  outline: 'none',
                  color: '#ffffff',
                  WebkitAppearance: 'none',
                  colorScheme: 'dark',
                  letterSpacing: isMobile ? '-0.03em' : 'normal'
                }}
              />
            </div>

            {/* Field 3: Category */}
            <div style={{
              borderRight: 'none',
              padding: isMobile ? '0 1px' : '0 20px',
              flex: isMobile ? 1.8 : 1,
              minWidth: 0
            }}>
              <label style={{
                display: 'block',
                fontSize: isMobile ? 8 : 10,
                fontWeight: 800,
                color: 'rgba(255, 255, 255, 0.6)',
                textTransform: 'uppercase',
                letterSpacing: isMobile ? '0.02em' : '0.1em',
                marginBottom: isMobile ? 2 : 4,
                whiteSpace: 'nowrap'
              }}>
                {isMobile ? 'Category' : 'VEHICLE CLASS'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: isMobile ? '4px 0' : '8px 0',
                  border: 'none',
                  background: 'transparent',
                  fontWeight: 700,
                  fontSize: isMobile ? 9.5 : 14,
                  outline: 'none',
                  color: '#ffffff',
                  letterSpacing: isMobile ? '-0.03em' : 'normal'
                }}
              >
                <option value="All" style={{ color: '#000' }}>{isMobile ? 'All' : 'All Categories'}</option>
                <option value="Premium Cars" style={{ color: '#000' }}>Premium</option>
                <option value="Luxury Cars" style={{ color: '#000' }}>Luxury</option>
                <option value="Business Cars" style={{ color: '#000' }}>Business</option>
                <option value="Economic Cars" style={{ color: '#000' }}>Economic</option>
              </select>
            </div>

            <button
              onClick={() => {
                if (category && category !== 'All') {
                  router.push(`/vehicles?category=${encodeURIComponent(category)}`)
                } else {
                  router.push('/vehicles')
                }
              }}
              style={{
                background: 'var(--accent-gold)',
                color: '#fff',
                border: 'none',
                padding: isMobile ? '0' : '18px 32px',
                borderRadius: isMobile ? 8 : 16,
                fontWeight: 800,
                fontSize: 14,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isMobile ? '0 8px 24px rgba(223, 151, 56, 0.4)' : '0 10px 20px rgba(223, 151, 56, 0.3)',
                width: isMobile ? '34px' : 'auto',
                height: isMobile ? '34px' : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginLeft: isMobile ? 1 : 0
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {isMobile ? <Search size={14} /> : 'Find Vehicle'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {!isMobile && (
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            zIndex: 1,
          }}
        >
          Scroll to explore
        </motion.div>
      )}
    </section>
  )
}