import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, X, Tag } from 'lucide-react'

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
    <div className="gallery-page">
      <Head>
        <title>Visual Gallery | Atlas Rent-A-Car</title>
        <meta name="description" content="Explore our premium fleet and corporate events through our visual gallery." />
      </Head>

      <main style={{ paddingTop: 120 }}>
        {/* Hero Section */}
        <section style={{ padding: '0 24px', marginBottom: 80 }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ maxWidth: 700 }}>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#24276F', letterSpacing: '-0.02em', marginBottom: 16 }}
              >
                Our Visual <span style={{ color: '#DF9738' }}>Journey</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                style={{ fontSize: 18, color: '#64748B', maxWidth: 600, lineHeight: 1.6, margin: 0 }}
              >
                A curated collection of our premium fleet, corporate milestones, and the exceptional experiences we deliver.
              </motion.p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 100,
                    border: '1px solid',
                    borderColor: filter === cat ? '#24276F' : '#E2E8F0',
                    background: filter === cat ? '#24276F' : 'transparent',
                    color: filter === cat ? '#fff' : '#64748B',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: '0.3s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section style={{ padding: '0 24px 120px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748B' }}>
                <div className="spinner" style={{ width: 40, height: 40, border: '3px solid #f3f3f3', borderTop: '3px solid #24276F', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }} />
                <p style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, fontSize: 12 }}>Loading Gallery...</p>
              </div>
            ) : (
              <motion.div 
                layout
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                  gap: 24 
                }}
              >
                <AnimatePresence mode='popLayout'>
                  {filtered.map(item => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => setSelected(item)}
                      style={{ 
                        position: 'relative', 
                        aspectRatio: '4/3', 
                        borderRadius: 24, 
                        overflow: 'hidden', 
                        cursor: 'pointer',
                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
                      }}
                      whileHover={{ y: -10 }}
                    >
                      <img 
                        src={item.image} 
                        alt={item.caption} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8), transparent)', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'flex-end', 
                        padding: 32,
                        opacity: 0,
                        transition: '0.3s'
                      }}
                      className="hover-overlay"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                          <Tag size={12} color="#DF9738" />
                          <span style={{ fontSize: 10, fontWeight: 800, color: '#DF9738', textTransform: 'uppercase', letterSpacing: 1 }}>{item.category}</span>
                        </div>
                        <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>{item.caption}</h3>
                      </div>
                      <div style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <Maximize2 size={18} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {!loading && filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '120px 0' }}>
                <h3 style={{ fontSize: 24, color: '#475569', fontWeight: 800 }}>No captures found</h3>
                <p style={{ color: '#94A3B8', marginTop: 8 }}>We haven't added any images to this category yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Lightbox */}
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
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 40
            }}
          >
            <button 
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', top: 40, right: 40, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ maxWidth: '100%', maxHeight: '100%', position: 'relative' }}
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={selected.image} 
                alt={selected.caption} 
                style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 16, boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)' }} 
              />
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#DF9738', textTransform: 'uppercase', letterSpacing: 2 }}>{selected.category}</span>
                <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginTop: 8 }}>{selected.caption}</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .gallery-page {
          background: #F8FAFC;
          min-height: 100vh;
        }
        .hover-overlay {
          opacity: 0;
        }
        div:hover > .hover-overlay {
          opacity: 1;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
