import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { Search, ChevronRight, ChevronLeft, Calendar, MapPin, X } from 'lucide-react'

const SLIDES = [
  {
    image: '/img/hero-fleet-lineup.jpg',
    title: 'Precision Mobility.',
    subtitle: 'The Ultimate Chauffeur Fleet of Mercedes & Executive SUVs',
    tag: 'Elite Fleet'
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&fit=crop',
    title: 'Sovereign Living.',
    subtitle: 'Bespoke Private Villas & Ultra-Luxury Residences',
    tag: 'Exclusive Stays'
  },
  {
    image: '/img/hero-chauffeur-standing1.jpg',
    title: 'Refined Authority.',
    subtitle: 'Autobiography Range Rovers & Armored Sedans',
    tag: 'Professional Chauffeurs',
    position: '80% center'
  },
  {
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1920&fit=crop',
    title: 'Elite Sanctuaries.',
    subtitle: 'Sleek Penthouses & Ocean-facing Master Suites',
    tag: 'Bespoke Concierge'
  }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const router = useRouter()

  // Drawer States
  const [searchType, setSearchType] = useState('fleet')
  const [location, setLocation] = useState('')
  const [pickUpDate, setPickUpDate] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)

  return (
    <section
      className="hero-section"
      style={{
        height: '100vh',
        minHeight: '650px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: '#000'
      }}
    >
      {/* Background Slideshow */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url('${SLIDES[currentSlide].image}')`,
              backgroundSize: 'cover',
              backgroundPosition: SLIDES[currentSlide].position || 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </AnimatePresence>

        {/* Ambient Editorial Shadows */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.85) 100%)',
          zIndex: 1
        }} />
      </div>

      {/* Centered Majestic Content Block */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center'
      }}>

        {/* Gold Active Slide Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          key={`badge-${currentSlide}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1.5px solid var(--accent-gold)',
            borderRadius: '999px',
            padding: '8px 20px',
            marginBottom: '28px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
            {SLIDES[currentSlide].tag}
          </span>
        </motion.div>

        {/* Large Elegant Heading */}
        <div style={{ marginBottom: '40px' }}>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            key={`title-${currentSlide}`}
            style={{
              fontSize: isMobile ? '38px' : '76px',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
              textShadow: '0 4px 30px rgba(0,0,0,0.5)'
            }}
          >
            {SLIDES[currentSlide].title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.25 }}
            key={`sub-${currentSlide}`}
            style={{
              fontSize: isMobile ? '14px' : '18px',
              color: 'rgba(249, 246, 240, 0.9)',
              fontWeight: 400,
              lineHeight: 1.6,
              marginTop: '18px',
              maxWidth: '640px',
              margin: '18px auto 0',
              textShadow: '0 2px 15px rgba(0,0,0,0.4)',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {SLIDES[currentSlide].subtitle}
          </motion.p>
        </div>

        {/* Elite Centered Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              background: 'var(--brand-fleet)',
              color: '#070B18',             /* Deep navy for readability on ice blue */
              border: 'none',
              padding: '18px 44px',
              borderRadius: '99px',
              fontSize: '11px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              cursor: 'pointer',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 20px 40px rgba(56, 189, 248, 0.25)' /* Ice blue shadow */
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.background = '#0ea5e9'  /* Sky blue on hover */
              e.currentTarget.style.color = '#ffffff'       /* White text on hover */
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(56, 189, 248, 0.45)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.background = 'var(--brand-fleet)'
              e.currentTarget.style.color = '#070B18'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(56, 189, 248, 0.25)'
            }}
          >
            Curate Your Inquiry
          </button>
        </motion.div>
      </div>

      {/* Floating Side Arrows */}
      {!isMobile && (
        <>
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute',
              left: '40px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '1.5px solid rgba(255,255,255,0.15)',
              background: 'rgba(0,0,0,0.2)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              transition: 'all 0.4s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'rgba(0,0,0,0.2)'; }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              right: '40px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '1.5px solid rgba(255,255,255,0.15)',
              background: 'rgba(0,0,0,0.2)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              transition: 'all 0.4s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'rgba(0,0,0,0.2)'; }}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Editorial Vertical Scroll Line */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12
        }}>
          <span style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            SCROLL DOWN
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ width: '1px', height: '40px', background: 'var(--accent-gold)' }}
          />
        </div>
      )}

      {/* Majestic Glassmorphic Concierge Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Dark Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: '#000000',
                zIndex: 2000
              }}
            />

            {/* Side Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                maxWidth: '480px',
                background: 'rgba(28, 28, 28, 0.94)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                zIndex: 2001,
                padding: '60px 40px',
                display: 'flex',
                flexDirection: 'column',
                color: '#ffffff',
                overflowY: 'auto'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  position: 'absolute',
                  top: '30px',
                  right: '30px',
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  opacity: 0.6,
                  cursor: 'pointer',
                  transition: 'opacity 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.6}
              >
                <X size={24} />
              </button>

              <div style={{ marginBottom: '40px' }}>
                <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.3em', display: 'block', marginBottom: '8px' }}>
                  CONCIERGE DESK
                </span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Curate Your Journey
                </h2>
              </div>

              {/* Mode Selector Tab */}
              <div style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '4px',
                borderRadius: '99px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '32px'
              }}>
                <button
                  onClick={() => { setSearchType('fleet'); setCategory('All'); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '99px',
                    border: 'none',
                    background: searchType === 'fleet' ? 'var(--brand-fleet)' : 'transparent',
                    color: searchType === 'fleet' ? '#070B18' : '#ffffff', /* High contrast when active */
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  Elite Fleet
                </button>
                <button
                  onClick={() => { setSearchType('residence'); setCategory('All'); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '99px',
                    border: 'none',
                    background: searchType === 'residence' ? 'var(--brand-fleet)' : 'transparent',
                    color: searchType === 'residence' ? '#070B18' : '#ffffff', /* High contrast when active */
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  Residences
                </button>
              </div>

              {/* Form Fields */}
              <div style={{ display: 'grid', gap: '28px', flex: 1 }}>

                {/* Field 1: Destination City */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    <MapPin size={12} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Target City
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1.5px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="" style={{ background: '#1c1c1c' }}>Select Destination</option>
                    <option value="accra" style={{ background: '#1c1c1c' }}>Accra (Ghana)</option>
                    <option value="takoradi" style={{ background: '#1c1c1c' }}>Takoradi</option>
                    <option value="kumasi" style={{ background: '#1c1c1c' }}>Kumasi</option>
                  </select>
                </div>

                {/* Field 2: Date Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    <Calendar size={12} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Pick-up Date
                  </label>
                  <input
                    type="date"
                    value={pickUpDate}
                    onChange={(e) => setPickUpDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1.5px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      colorScheme: 'dark',
                      fontWeight: 700,
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                {/* Field 3: Tier/Category Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    {searchType === 'fleet' ? 'Class' : 'Stay Type'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1.5px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="All" style={{ background: '#1c1c1c' }}>All Classes</option>
                    {searchType === 'fleet' ? (
                      <>
                        <option value="Premium Cars" style={{ background: '#1c1c1c' }}>Premium Class</option>
                        <option value="Luxury Cars" style={{ background: '#1c1c1c' }}>Luxury Class</option>
                        <option value="Business Cars" style={{ background: '#1c1c1c' }}>Business Class</option>
                        <option value="Economic Cars" style={{ background: '#1c1c1c' }}>Executive Daily</option>
                      </>
                    ) : (
                      <>
                        <option value="Luxury Residences" style={{ background: '#1c1c1c' }}>Luxury Residence</option>
                        <option value="Premium Residences" style={{ background: '#1c1c1c' }}>Premium Residence</option>
                        <option value="Elite Suites" style={{ background: '#1c1c1c' }}>Elite Executive Suite</option>
                        <option value="Coastal Villas" style={{ background: '#1c1c1c' }}>Coastal Ocean Villa</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Submit Dispatch Action */}
              <div style={{ marginTop: '40px' }}>
                <button
                  onClick={() => {
                    setDrawerOpen(false)
                    const path = searchType === 'fleet' ? '/vehicles' : '/residence'
                    if (category && category !== 'All') {
                      router.push(`${path}?category=${encodeURIComponent(category)}`)
                    } else {
                      router.push(path)
                    }
                  }}
                  style={{
                    width: '100%',
                    background: 'var(--brand-fleet)',
                    color: '#070B18',             /* Deep navy readability on ice blue */
                    border: 'none',
                    padding: '18px',
                    borderRadius: '12px',
                    fontWeight: 900,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 10px 30px rgba(56, 189, 248, 0.25)', /* Ice blue shadow */
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0ea5e9'
                    e.currentTarget.style.color = '#ffffff'
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(56, 189, 248, 0.45)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--brand-fleet)'
                    e.currentTarget.style.color = '#070B18'
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(56, 189, 248, 0.25)'
                  }}
                >
                  Explore Showcase <ArrowRight size={16} />
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .btn-gold-editorial {
          background: transparent;
          border: 1.5px solid var(--accent-gold);
          color: #fff;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          padding: 16px 36px;
          border-radius: 99px;
          cursor: pointer;
          transition: all 0.4s;
        }
        .btn-gold-editorial:hover {
          background: var(--accent-gold);
          color: var(--text-primary);
        }
      `}</style>
    </section>
  )
}
