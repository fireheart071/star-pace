import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, X, Tag, Image as ImageIcon } from 'lucide-react'

export default function GalleryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categories = ['All', ...new Set(items.map(i => i.category || 'General'))]
  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter)

  return (
    <div className="gallery-page" style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '120px' }}>
      <Head>
        <title>The Collection | Star Pace</title>
        <meta name="description" content="Explore the Star Pace universe of elite mobility and hospitality through our visual gallery." />
      </Head>

      <main style={{ paddingTop: '140px' }}>
        
        {/* Header Block */}
        <section style={{ padding: '0 24px', marginBottom: '60px' }}>
          <div style={{ 
            maxWidth: 1400, 
            margin: '0 auto', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            gap: 40, 
            flexWrap: 'wrap',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '32px'
          }}>
            <div style={{ maxWidth: 700 }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--brand-fleet)',
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                display: 'block',
                marginBottom: '12px'
              }}>
                Visual Archive
              </span>
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                  fontWeight: 900, 
                  color: 'var(--text-primary)', 
                  letterSpacing: '-0.02em', 
                  margin: 0 
                }}
              >
                The <span style={{ color: 'var(--brand-fleet)' }}>Collection</span>
              </motion.h1>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '16px', margin: 0 }}>
                A curated archive of our elite fleet, bespoke stays, and the refined hospitality we provide across West Africa.
              </p>
            </div>

            {/* Premium Category Filters */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '100px',
                    border: '1.5px solid',
                    borderColor: filter === cat ? 'var(--brand-fleet)' : 'var(--border-color)',
                    background: filter === cat ? 'var(--brand-fleet)' : 'transparent',
                    color: filter === cat ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => {
                    if (filter !== cat) {
                      e.currentTarget.style.borderColor = 'var(--brand-fleet)'
                      e.currentTarget.style.color = 'var(--brand-fleet)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filter !== cat) {
                      e.currentTarget.style.borderColor = 'var(--border-color)'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section style={{ padding: '0 24px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--text-muted)' }}>
                <div style={{ 
                  width: 44, 
                  height: 44, 
                  border: '3.5px solid var(--border-color)', 
                  borderTop: '3.5px solid var(--brand-fleet)', 
                  borderRadius: '50%', 
                  margin: '0 auto 24px', 
                  animation: 'spin 1s linear infinite' 
                }} />
                <p style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '11px', color: 'var(--brand-fleet)' }}>
                  Loading the Visual Collection...
                </p>
              </div>
            ) : (
              <motion.div 
                layout
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', 
                  gap: '32px' 
                }}
              >
                <AnimatePresence mode='popLayout'>
                  {filtered.map(item => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      onClick={() => setSelected(item)}
                      style={{ 
                        position: 'relative', 
                        aspectRatio: '4/3', 
                        borderRadius: '24px', 
                        overflow: 'hidden', 
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)'
                      }}
                      whileHover={{ y: -8 }}
                      className="gallery-card-item"
                    >
                      {/* Photo Image */}
                      <img 
                        src={item.image} 
                        alt={item.caption} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                        }} 
                        className="gallery-img-scaler"
                      />

                      {/* Editorial Dark Overlay */}
                      <div 
                        style={{ 
                          position: 'absolute', 
                          inset: 0, 
                          background: 'linear-gradient(to top, rgba(127, 29, 29, 0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          justifyContent: 'flex-end', 
                          padding: '32px',
                          opacity: 0,
                          transition: 'opacity 0.4s ease',
                          zIndex: 2
                        }}
                        className="hover-overlay-block"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '8px' }}>
                          <Tag size={12} color="#ffffff" style={{ opacity: 0.8 }} />
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.9 }}>
                            {item.category || 'General'}
                          </span>
                        </div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontSize: '20px', fontWeight: 900, margin: 0, lineHeight: 1.25 }}>
                          {item.caption}
                        </h3>
                      </div>

                      {/* Expand Button */}
                      <div 
                        style={{ 
                          position: 'absolute', 
                          top: '24px', 
                          right: '24px', 
                          background: 'rgba(255,255,255,0.9)', 
                          backdropFilter: 'blur(5px)', 
                          WebkitBackdropFilter: 'blur(5px)',
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'var(--brand-fleet)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          zIndex: 3,
                          opacity: 0,
                          transition: 'opacity 0.4s ease'
                        }}
                        className="hover-overlay-btn"
                      >
                        <Maximize2 size={16} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {!loading && filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--text-secondary)' }}>
                <ImageIcon size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
                <h3 style={{ fontSize: '22px', fontFamily: "'Playfair Display', serif", fontWeight: 900 }}>No captures found</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px' }}>We haven't added any images to this category yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Cinematic Blur Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
          >
            <button 
              onClick={() => setSelected(null)}
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              <X size={24} />
            </button>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ maxWidth: '100%', maxHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={selected.image} 
                alt={selected.caption} 
                style={{ 
                  maxWidth: '90vw', 
                  maxHeight: '75vh', 
                  borderRadius: '16px', 
                  boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }} 
              />
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 800, 
                  color: 'var(--brand-fleet)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.25em',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '4px 16px',
                  borderRadius: '99px'
                }}>
                  {selected.category || 'General'}
                </span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontSize: '24px', fontWeight: 900, marginTop: '12px', margin: 0 }}>
                  {selected.caption}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .gallery-card-item:hover .gallery-img-scaler {
          transform: scale(1.08);
        }
        .gallery-card-item:hover .hover-overlay-block {
          opacity: 1 !important;
        }
        .gallery-card-item:hover .hover-overlay-btn {
          opacity: 1 !important;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
