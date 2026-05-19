import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react'

const VEHICLE_CATEGORIES = ['Premium Cars', 'Luxury Cars', 'Business Cars']
const EXECUTIVE_DAILY = ['Economic Cars']
const STAY_CATEGORIES = ['Luxury Residences', 'Premium Residences', 'Elite Suites', 'Coastal Villas']

export default function Products({ limit, isMobile: propIsMobile, endpoint = '/api/vehicles' }) {
  const isResidence = endpoint === '/api/residence' || endpoint === '/api/stays'
  // Show economic cars only on the full catalog page, keep the homepage spotlight pure luxury
  const CATEGORIES = isResidence ? STAY_CATEGORIES : (limit ? VEHICLE_CATEGORIES : [...VEHICLE_CATEGORIES, ...EXECUTIVE_DAILY])
  
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [internalIsMobile, setInternalIsMobile] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 16
  const [searchQuery, setSearchQuery] = useState('')

  const isMobile = propIsMobile !== undefined ? propIsMobile : internalIsMobile

  useEffect(() => {
    if (router.isReady && router.query.category) {
      setActiveCategory(router.query.category)
      setCurrentPage(1)
    }
  }, [router.isReady, router.query.category])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory, searchQuery])

  useEffect(() => {
    if (!limit) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentPage, limit])

  useEffect(() => {
    if (propIsMobile === undefined) {
      const handleResize = () => setInternalIsMobile(window.innerWidth <= 768)
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [propIsMobile])

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          let activeData = data.filter(i => i.status !== 'inactive')
          // If on homepage spotlight, hide any economic daily cars from the pristine visual grids
          if (limit) {
            activeData = activeData.filter(i => i.category !== 'Economic Cars')
          }
          setItems(activeData)
        }
      })
      .catch(e => console.error('Failed to load catalog', e))
      .finally(() => setLoading(false))
  }, [limit])

  if (loading) return null

  const filteredItems = items.filter(i => {
    if (activeCategory !== 'All' && i.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const specs = isResidence
        ? `${i.name || ''} ${i.specs?.bedrooms || '0'} beds ${i.specs?.bathrooms || '0'} baths ${i.specs?.guests || '0'} guests ${i.specs?.type || ''}`.toLowerCase()
        : `${i.name || ''} ${i.specs?.seats || '4'} seats ${i.specs?.transmission || ''} ${i.specs?.fuelType || ''} ${i.range || ''}`.toLowerCase();
      if (!specs.includes(q)) return false;
    }
    return true;
  })
    
  const totalPages = Math.ceil(filteredItems.length / pageSize)
  const displayedItems = limit 
    ? filteredItems.slice(0, limit) 
    : filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <section style={{ 
      background: 'var(--bg-primary)', 
      padding: limit ? '0px' : (isMobile ? '20px 24px 80px' : '20px 80px 100px')
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        
        {/* Elegant Flat Category Filter Bar */}
        {!limit && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '48px',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '16px',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            
            {/* Minimal Filter Tabs (Flat Links) */}
            <div className="no-scrollbar" style={{ 
              display: 'flex', 
              gap: '32px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              width: isMobile ? '100%' : 'auto'
            }}>
              {['All', ...CATEGORIES].map(cat => {
                const displayCat = cat.replace(/ (cars?|residences?)/i, '')
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      color: isActive ? 'var(--brand-fleet)' : 'var(--text-muted)',
                      fontSize: '11px', 
                      fontWeight: 800, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.25em',
                      transition: 'all 0.3s ease', 
                      position: 'relative',
                      paddingBottom: '16px',
                      flexShrink: 0
                    }}
                  >
                    {displayCat === 'All' ? 'View All' : displayCat}
                    {isActive && (
                      <motion.div 
                        layoutId="activeFilterBorder"
                        style={{ 
                          position: 'absolute', 
                          bottom: -1, 
                          left: 0, 
                          right: 0, 
                          height: '2px', 
                          background: 'var(--brand-fleet)' 
                        }} 
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Custom Search (Gold Hairline Bottom Border) */}
            <div style={{ position: 'relative', width: isMobile ? '100%' : '320px' }}>
              <input 
                type="text" 
                placeholder={isResidence ? "Search residences..." : "Search fleet..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 36px',
                  border: 'none',
                  borderBottom: '1.5px solid var(--accent-gold)',
                  background: 'transparent',
                  fontSize: '14px',
                  fontWeight: '700',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  transition: 'border-color 0.3s'
                }}
              />
              <Search 
                style={{ 
                  position: 'absolute', 
                  left: '8px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--brand-fleet)',
                  opacity: 0.8
                }} 
                size={16} 
              />
            </div>
          </div>
        )}

        {/* 2-Column Majestic Asymmetric Card Grid */}
        <div className="product-grid">
          {displayedItems.map(item => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>

        {/* Minimalist Editorial Pagination */}
        {!limit && totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: 24, 
            marginTop: '80px',
            paddingTop: '40px',
            borderTop: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                background: 'transparent',
                border: 'none',
                color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                fontWeight: '800',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              ← Previous
            </button>

            <div style={{ display: 'flex', gap: 12 }}>
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const isActive = currentPage === pageNum
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isActive ? 'var(--brand-fleet)' : 'var(--text-muted)',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      position: 'relative',
                      padding: '4px 8px',
                      transition: 'all 0.3s'
                    }}
                  >
                    {pageNum}
                    {isActive && (
                      <div style={{ position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--brand-fleet)' }} />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                background: 'transparent',
                border: 'none',
                color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                fontWeight: '800',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Next →
            </button>
          </div>
        )}

        {/* Homepage Spotlight Bottom CTA Button */}
        {limit && (
          <div style={{ textAlign: 'center', marginTop: isMobile ? '56px' : '80px' }}>
            <Link href={isResidence ? "/residence" : "/vehicles"} style={{ textDecoration: 'none' }}>
              <button 
                style={{
                  padding: '18px 44px',
                  background: 'var(--brand-fleet)',
                  color: '#070B18',             /* Deep navy readability on ice blue */
                  borderRadius: '99px',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  cursor: 'pointer',
                  boxShadow: '0 15px 35px rgba(56, 189, 248, 0.25)', /* Ice blue shadow */
                  transition: 'all 0.4s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.background = '#0ea5e9'  /* Sky blue on hover */
                  e.currentTarget.style.color = '#ffffff'       /* White text on hover */
                  e.currentTarget.style.boxShadow = '0 15px 45px rgba(56, 189, 248, 0.45)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.background = 'var(--brand-fleet)'
                  e.currentTarget.style.color = '#070B18'
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(56, 189, 248, 0.25)'
                }}
              >
                Explore Showcase <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
