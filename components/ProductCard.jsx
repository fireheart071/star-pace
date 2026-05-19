import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import CldOptimizedImage from './CldOptimizedImage'
import { ArrowRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductCard({ item }) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <article 
        className="product-card" 
        onClick={() => router.push(`/reservation/${item.id}`)} 
        style={{ 
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Tall Visual Panel (Borderless) */}
        <div 
          className="product-card-img-wrap"
          onClick={(e) => {
            if (isMobile) {
              e.stopPropagation()
              setLightboxOpen(true)
            }
          }}
          style={{
            width: '100%',
            background: 'var(--bg-secondary)',
            overflow: 'hidden',
            borderRadius: '16px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.5s ease'
          }}
        >
          <div style={{ width: '100%', height: '100%', transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)' }} className="card-image-scaler">
            <CldOptimizedImage
              width={600}
              height={500}
              src={item.image}
              alt={item.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transition: 'all 0.6s'
              }}
            />
          </div>

          {/* Cinematic Blur View Overlay */}
          <div 
            className="quick-view-badge"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(28, 28, 28, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.4s ease',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              zIndex: 2
            }}
          >
            <div style={{
              background: '#ffffff',
              color: 'var(--text-inverse)',
              padding: '10px 24px',
              borderRadius: '99px',
              fontWeight: 800,
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              Explore Details <ArrowRight size={12} />
            </div>
          </div>

          {/* Minimal Gold Floating Tag */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'rgba(28, 28, 28, 0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '4px 12px',
            borderRadius: '99px',
            fontSize: '8px',
            fontWeight: 900,
            color: 'var(--accent-gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            zIndex: 5
          }}>
            {item.category ? item.category.replace(/ cars?/i, '') : 'Luxury'}
          </div>
        </div>
        
        {/* Editorial Details below the cover image */}
        <div 
          className="product-card-content"
          style={{
            padding: '16px 0 0 0',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div>
            {/* Clean Fine Serif Name */}
            <h3 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '4px',
              lineHeight: 1.2,
              letterSpacing: '-0.01em'
            }}>
              {item.name}
            </h3>
            
            {/* Premium Antique Gold Price Tag */}
            <div className="product-price" style={{
              fontWeight: 800,
              color: 'var(--accent-gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              ₵{item.price || item.rate} / Day
            </div>
          </div>
          
          {/* Minimal text CTA indicator link */}
          <div 
            className="btn-outline" 
            style={{ 
              alignSelf: 'flex-start',
              color: 'var(--text-primary)',
              fontWeight: 900,
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'color 0.3s'
            }}
          >
            Book Reservation <span style={{ transition: 'transform 0.3s' }} className="cta-arrow">→</span>
          </div>
        </div>

        <style jsx global>{`
          .product-card:hover .card-image-scaler {
            transform: scale(1.04);
          }
          .product-card:hover .quick-view-badge {
            opacity: 1 !important;
          }
          .product-card:hover .btn-outline {
            color: var(--brand-fleet) !important;
          }
          .product-card:hover .cta-arrow {
            transform: translateX(4px);
          }
        `}</style>
      </article>

      {/* Cinematic Full-Screen Image Lightbox (Mobile only) */}
      <AnimatePresence>
        {isMobile && lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation()
              setLightboxOpen(false)
            }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(6, 10, 19, 0.95)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '24px'
            }}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxOpen(false)
              }}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#ffffff',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100000
              }}
            >
              <X size={20} />
            </button>

            {/* Lightbox Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
              
              {/* Bottom Caption Overlay */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(6,10,19,0.95) 0%, rgba(6,10,19,0) 100%)',
                padding: '28px 24px 20px',
                color: '#ffffff'
              }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', margin: '0 0 6px 0', fontWeight: 800 }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--accent-gold)', margin: 0, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  ₵{item.price || item.rate} / Day
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
