import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [open])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHomePage = router.pathname === '/'
  const isTransparent = isHomePage && !scrolled && !open

  const menuItems = [
    { name: "Home", href: "/", num: "01", desc: "The Journey Begins" },
    { name: "Fleet", href: "/vehicles", num: "02", desc: "Elite Mobility Assets" },
    { name: "Residences", href: "/residence", num: "03", desc: "Premium Stays" },
    { name: "About", href: "/about", num: "04", desc: "Our Philosophy" },
    { name: "Gallery", href: "/gallery", num: "05", desc: "Visual Showcase" },
    { name: "FAQs", href: "/faqs", num: "06", desc: "Information Desk" }
  ]

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? 'scrolled' : ''} ${isTransparent ? 'transparent-nav-override' : ''}`}
        initial={{ y: -60, x: '-50%', opacity: 0 }}
        animate={{ y: 0, x: '-50%', opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: isMobile ? (scrolled ? '12px' : '16px') : (scrolled ? '16px' : '28px'),
          left: '50%',
          transform: 'translateX(-50%)',
          background: isTransparent ? 'rgba(0, 0, 0, 0.25)' : 'rgba(249, 246, 240, 0.85)',
          borderColor: isTransparent ? 'rgba(255, 255, 255, 0.15)' : 'var(--glass-border)',
          boxShadow: isTransparent ? 'none' : '0 20px 40px rgba(0, 0, 0, 0.02)',
          color: isTransparent ? '#ffffff' : 'var(--text-primary)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 1000
        }}
      >
        <style jsx global>{`
          .transparent-nav-override .links a:not(.cta) {
            color: #ffffff !important;
          }
          .transparent-nav-override .links a.active,
          .transparent-nav-override .links a:hover {
            color: #38BDF8 !important;
          }
          .transparent-nav-override .links a.cta {
            color: #38BDF8 !important;
            border-left: 1px solid rgba(255, 255, 255, 0.2) !important;
          }
          .transparent-nav-override .brand-logo-text {
            color: #ffffff !important;
          }
          .transparent-nav-override .brand-logo-text span {
            color: rgba(255, 255, 255, 0.6) !important;
          }
          .transparent-nav-override .theme-toggle {
            color: #ffffff !important;
          }
        `}</style>

        {/* Main Luxury Brand Link */}
        <Link href="/" onClick={() => setOpen(false)} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <img 
            src="/STARPACE.png" 
            alt="Star Pace Logo" 
            style={{ 
              height: isMobile ? '32px' : '44px', 
              objectFit: 'contain',
              transition: 'all 0.4s ease'
            }} 
          />
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Desktop Navigation Links */}
          {!isMobile && (
            <div className="links">
              <Link href="/" className={router.pathname === '/' ? 'active' : ''}>Home</Link>
              <Link href="/vehicles" className={router.pathname === '/vehicles' ? 'active' : ''}>Fleet</Link>
              <Link href="/residence" className={router.pathname === '/residence' ? 'active' : ''}>Residences</Link>
              <Link href="/about" className={router.pathname === '/about' ? 'active' : ''}>About</Link>
              <Link href="/gallery" className={router.pathname === '/gallery' ? 'active' : ''}>Gallery</Link>
              <Link href="/faqs" className={router.pathname === '/faqs' ? 'active' : ''}>FAQs</Link>
              
              <Link 
                href="/contact" 
                className="cta"
                style={{
                  borderLeft: '1px solid ' + (isTransparent ? 'rgba(255,255,255,0.2)' : 'var(--border-color)'),
                  paddingLeft: '24px'
                }}
              >
                Inquire Online
              </Link>
            </div>
          )}

          {/* Hamburger Menu Toggle (Mobile only) */}
          {isMobile && (
            <button
              className="theme-toggle"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isTransparent ? '#ffffff' : '#11223F', /* High-contrast navy when navbar is white */
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Menu size={22} />
            </button>
          )}
        </nav>
      </motion.header>

      {/* Stunning Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'linear-gradient(135deg, #060A13 0%, #0C1220 50%, #111A2E 100%)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '100px 32px 48px',
              overflowY: 'auto'
            }}
          >
            {/* Header Area inside mobile menu */}
            <div style={{
              position: 'absolute',
              top: '24px',
              left: '24px',
              right: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Link href="/" onClick={() => setOpen(false)} style={{ textDecoration: 'none' }}>
                <img 
                  src="/STARPACE.png" 
                  alt="Star Pace Logo" 
                  style={{ height: '36px', objectFit: 'contain' }} 
                />
              </Link>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Centered Navigation Links with numbers & descriptions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', margin: 'auto 0' }}>
              {menuItems.map((item, index) => {
                const isActive = router.pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -25 }}
                    transition={{ delay: index * 0.08, ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
                  >
                    <Link 
                      href={item.href} 
                      onClick={() => setOpen(false)} 
                      style={{ 
                        textDecoration: 'none', 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '16px' 
                      }}
                    >
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 900, 
                        color: isActive ? 'var(--brand-fleet)' : 'var(--text-muted)', 
                        fontFamily: 'monospace',
                        marginTop: '4px',
                        letterSpacing: '0.05em'
                      }}>
                        {item.num}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ 
                          fontSize: '28px', 
                          fontWeight: isActive ? 900 : 700, 
                          color: isActive ? 'var(--brand-fleet)' : '#ffffff', 
                          letterSpacing: '0.03em', 
                          fontFamily: "'Playfair Display', serif",
                          transition: 'color 0.3s'
                        }}>
                          {item.name}
                        </span>
                        <span style={{ 
                          fontSize: '10px', 
                          color: 'var(--text-secondary)', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.12em', 
                          marginTop: '4px' 
                        }}>
                          {item.desc}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Bottom Contact & CTA Area */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ delay: 0.48, ease: 'easeOut', duration: 0.6 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              <Link href="/contact" onClick={() => setOpen(false)} style={{ textDecoration: 'none' }}>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    padding: '18px',
                    borderRadius: '14px',
                    background: 'var(--brand-fleet)',
                    color: '#070B18',
                    border: 'none',
                    fontWeight: 900,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.22em',
                    cursor: 'pointer',
                    boxShadow: '0 12px 30px rgba(56, 189, 248, 0.25)'
                  }}
                >
                  Inquire Online
                </motion.button>
              </Link>

              <div style={{ 
                borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
                paddingTop: '24px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px' 
              }}>
                <span style={{ 
                  fontSize: '9px', 
                  fontWeight: 900, 
                  color: 'var(--text-muted)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.15em' 
                }}>
                  ACCRA, GHANA
                </span>
                <a 
                  href="tel:+233202225878" 
                  style={{ 
                    fontSize: '15px', 
                    color: '#ffffff', 
                    textDecoration: 'none', 
                    fontWeight: 700,
                    letterSpacing: '0.05em' 
                  }}
                >
                  +233 20 222 5878
                </a>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Airport Residential Area
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
