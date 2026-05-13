import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChevronRight } from 'lucide-react'

const CATEGORIES = ['Business Cars', 'Economic Cars', 'Luxury Cars', 'Premium Cars']

function HeritageShowcase({ items }) {
  const [activeCategory, setActiveCategory] = useState('Premium Cars')
  const [activeVehicleId, setActiveVehicleId] = useState(null)
  const [activeImgIdx, setActiveImgIdx] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const categoryItems = items.filter(item => item.category === activeCategory)
  
  useEffect(() => {
    if (categoryItems.length > 0) {
      if (!activeVehicleId || !categoryItems.find(i => i.id === activeVehicleId)) {
        setActiveVehicleId(categoryItems[0].id)
        setActiveImgIdx(0)
      }
    }
  }, [activeCategory, categoryItems, activeVehicleId])

  const current = categoryItems.find(i => i.id === activeVehicleId) || categoryItems[0]
  const gallery = current?.gallery?.length > 0 ? current.gallery : [current?.image]

  return (
    <section className="collection-showcase" style={{ background: '#fff', padding: isMobile ? '64px 0' : '160px 0' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        
        {/* Heritage Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 60 : 100 }}>
           <div style={{ fontSize: isMobile ? 11 : 13, fontWeight: 800, color: '#DF9738', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 16 }}>The Sovereign Selection</div>
           <h2 style={{ 
             fontSize: isMobile ? 32 : 64, 
             fontWeight: 400, 
             color: '#24276F', 
             fontFamily: 'serif', 
             letterSpacing: '-0.02em',
             fontStyle: 'italic',
             lineHeight: 1.1
           }}>
             The Atlas <span style={{ color: '#000' }}>Collection.</span>
           </h2>
        </div>

        {/* Ghost Category Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 32 : 60,
          marginBottom: isMobile ? 40 : 100,
          borderBottom: '1px solid #f1f5f9',
          overflowX: isMobile ? 'auto' : 'visible',
          whiteSpace: 'nowrap',
          paddingBottom: isMobile ? 8 : 0
        }} className="no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat} onClick={() => setActiveCategory(cat)}
              style={{
                padding: isMobile ? '16px 0' : '24px 0', background: 'none', border: 'none', cursor: 'pointer',
                color: activeCategory === cat ? '#24276F' : '#cbd5e1',
                fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em',
                transition: 'all 0.4s ease', position: 'relative',
                flexShrink: 0
              }}
            >
              {cat}
              {activeCategory === cat && <div style={{ position: 'absolute', bottom: -1, left: '50%', transform: 'translateX(-50%)', width: 40, height: 1, background: '#DF9738' }} />}
            </button>
          ))}
        </div>

        {/* Heritage Boutique Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '240px 1fr 300px', 
          gap: isMobile ? 40 : 100,
          alignItems: 'center'
        }}>
          
          {/* Sidebar: Lowercase & Spaced */}
          {!isMobile && (
            <div 
              className="no-scrollbar"
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 12, 
                maxHeight: '400px', 
                overflowY: 'auto',
                paddingRight: '12px',
                borderRight: '1px solid #f8fafc'
              }}
            >
              {categoryItems.map(item => (
                <button
                  key={item.id} onClick={() => setActiveVehicleId(item.id)}
                  style={{
                    textAlign: 'left', padding: '12px 0', cursor: 'pointer', border: 'none', background: 'none',
                    color: activeVehicleId === item.id ? '#24276f' : '#cbd5e1',
                    fontSize: 14, fontWeight: 700,
                    transition: 'all 0.3s',
                    display: 'flex', alignItems: 'center', gap: 16
                  }}
                >
                  <div style={{ 
                    width: 6, height: 6, 
                    transform: 'rotate(45deg)', 
                    background: activeVehicleId === item.id ? '#df9738' : 'transparent', 
                    transition: '0.4s' 
                  }} />
                  <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
                    <motion.div
                      whileHover={{ x: [0, -20, 0] }}
                      transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                    >
                      {item.name}
                    </motion.div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Mobile Vehicle Selection Carousel */}
          {isMobile && (
            <div 
              className="no-scrollbar"
              style={{ 
                display: 'flex', 
                gap: 24, 
                overflowX: 'auto', 
                paddingBottom: 20,
                borderBottom: '1px solid #f1f5f9',
                marginBottom: 32,
                width: '100%'
              }}
            >
              {categoryItems.map(item => (
                <button
                  key={item.id} onClick={() => setActiveVehicleId(item.id)}
                  style={{
                    padding: '8px 0', cursor: 'pointer', border: 'none', background: 'none',
                    color: activeVehicleId === item.id ? '#24276f' : '#cbd5e1',
                    fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
                    transition: 'all 0.3s',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    position: 'relative'
                  }}
                >
                  {item.name}
                  {activeVehicleId === item.id && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 2, background: '#df9738' }} />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Cinematic Image Stage */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: isMobile ? 32 : 60, height: isMobile ? 240 : 400 }}>
              <AnimatePresence mode="wait">
                <motion.img 
                   key={`${activeVehicleId}-${activeImgIdx}`}
                   initial={{ opacity: 0, scale: 0.99, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                   src={gallery[activeImgIdx]} 
                   style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                />
              </AnimatePresence>
            </div>
            
            {/* Heritage Pagers */}
            {gallery.length > 1 && (
              <div style={{ display: 'flex', gap: 16 }}>
                {gallery.map((_, i) => (
                  <button 
                    key={i} onClick={() => setActiveImgIdx(i)}
                    style={{ 
                      width: isMobile ? 32 : 50, height: 2, padding: 0, cursor: 'pointer',
                      border: 'none', background: activeImgIdx === i ? '#DF9738' : '#e2e8f0',
                      transition: '0.6s'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Detail Architecture */}
          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <div style={{ marginBottom: isMobile ? 32 : 60 }}>
               <div style={{ 
                 fontSize: isMobile ? 36 : 56, 
                 fontWeight: 400, 
                 color: '#24276F', 
                 fontFamily: 'serif',
                 letterSpacing: '-0.02em',
                 marginBottom: 4
               }}>
                  <span style={{ fontSize: isMobile ? 20 : 24, verticalAlign: 'top', color: '#DF9738', marginRight: 4 }}>₵</span>
                  {current?.price || current?.rate}
               </div>
               <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Daily Sovereign Rate</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid #f8fafc', alignItems: isMobile ? 'center' : 'flex-start' }}>
              {(current?.features || []).slice(0, 4).map((feat, i) => (
                <div key={i} style={{ fontSize: 13, fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: 12 }}>
                   <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#DF9738' }} />
                   {feat}
                </div>
              ))}
            </div>

            <Link href={`/reservation/${current?.id}`}>
               <button style={{ 
                 width: '100%', padding: '20px', background: '#24276f', color: '#fff', 
                 border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 13, 
                 textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                 boxShadow: '0 20px 40px rgba(36, 39, 111, 0.1)'
               }}>
                 RESERVE NOW <ChevronRight size={16} />
               </button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}

export default function Products({ limit, isMobile: propIsMobile }) {
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
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data.filter(i => i.status !== 'inactive'))
        }
      })
      .catch(e => console.error('Failed to load fleet', e))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null

  const filteredItems = items.filter(i => {
    if (activeCategory !== 'All' && i.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const specs = `
        ${i.name || ''} 
        ${i.specs?.seats || '4'} seats 
        ${i.specs?.transmission || 'Automatic'} 
        ${i.specs?.fuelType || 'Petrol / EV'} 
        ${i.range || 'Unlimited km'}
      `.toLowerCase();
      if (!specs.includes(q)) return false;
    }
    return true;
  })
    
  const totalPages = Math.ceil(filteredItems.length / pageSize)
  const displayedItems = limit 
    ? filteredItems.slice(0, limit) 
    : filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
     <section style={{ background: '#fff', padding: limit ? (isMobile ? '40px 16px' : '120px 48px') : (isMobile ? '16px 16px' : '32px 48px') }}>
       <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          {limit && (
            <div style={{ textAlign: 'center', marginBottom: isMobile ? 60 : 100 }}>
               <div style={{ fontSize: isMobile ? 11 : 13, fontWeight: 800, color: '#DF9738', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 16 }}>The Sovereign Selection</div>
               <h2 style={{ 
                 fontSize: isMobile ? 32 : 64, 
                 fontWeight: 400, 
                 color: '#24276F', 
                 fontFamily: 'serif', 
                 letterSpacing: '-0.02em',
                 fontStyle: 'italic',
                 lineHeight: 1.1
               }}>
                 The Atlas <span style={{ color: '#000' }}>Collection.</span>
               </h2>
            </div>
          )}

          {!limit && isMobile && (
            <div className="no-scrollbar" style={{ 
              display: 'flex', 
              justifyContent: 'flex-start',
              gap: 24,
              marginBottom: 24,
              borderBottom: '1px solid #f1f5f9',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              paddingBottom: 8
            }}>
              {['All', ...CATEGORIES].map(cat => {
                 const displayCat = cat.replace(/ cars?/i, '')
                 return (
                  <button
                    key={cat} onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer',
                      color: activeCategory === cat ? '#24276F' : '#cbd5e1',
                      fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em',
                      transition: 'all 0.4s ease', position: 'relative',
                      flexShrink: 0
                    }}
                  >
                    {displayCat === 'All' ? 'Our Fleet' : displayCat}
                    {activeCategory === cat && <div style={{ position: 'absolute', bottom: -1, left: '50%', transform: 'translateX(-50%)', width: '100%', height: 2, background: '#DF9738' }} />}
                  </button>
                 )
              })}
            </div>
          )}

          {!limit && (
            <div style={{ display: 'flex', justifyContent: isMobile ? 'flex-end' : 'space-between', marginBottom: 24, gap: 16 }}>
               
               {!isMobile && (
                 <div style={{ position: 'relative', width: '240px' }}>
                   <select 
                     value={activeCategory} 
                     onChange={e => setActiveCategory(e.target.value)}
                     style={{
                       width: '100%',
                       padding: '14px 40px 14px 20px',
                       borderRadius: '99px',
                       border: '1px solid #e2e8f0',
                       background: '#f8fafc',
                       fontSize: '14px',
                       fontWeight: '600',
                       outline: 'none',
                       color: '#0f172a',
                       cursor: 'pointer',
                       appearance: 'none',
                       boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                     }}
                   >
                     {['All', ...CATEGORIES].map(cat => (
                       <option key={cat} value={cat}>
                         {cat === 'All' ? 'Select Category : Our Fleet' : `Category : ${cat.replace(/ cars?/i, '')}`}
                       </option>
                     ))}
                   </select>
                   <svg style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                 </div>
               )}

               <div style={{ position: 'relative', width: isMobile ? '100%' : '360px' }}>
                 <input 
                   type="text" 
                   placeholder="Search models, seats, fuel type..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   style={{
                     width: '100%',
                     padding: '14px 16px 14px 44px',
                     borderRadius: '99px',
                     border: '1px solid #e2e8f0',
                     background: '#f8fafc',
                     fontSize: '14px',
                     fontWeight: '500',
                     outline: 'none',
                     color: '#0f172a',
                     transition: 'all 0.3s',
                     boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                   }}
                 />
                 <svg style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
               </div>
            </div>
          )}

          <div className="vehicle-grid">
             {displayedItems.map(i => <ProductCard key={i.id} item={i} i={0} />)}
          </div>

          {!limit && totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: 8, 
              marginTop: 60,
              paddingTop: 40,
              borderTop: '1px solid #f1f5f9'
            }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  color: currentPage === 1 ? '#cbd5e1' : '#24276f',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Previous
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        border: 'none',
                        background: currentPage === pageNum ? '#24276f' : '#f8fafc',
                        color: currentPage === pageNum ? '#fff' : '#64748b',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  color: currentPage === totalPages ? '#cbd5e1' : '#24276f',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}

          {limit && (
            <div style={{ textAlign: 'center', marginTop: isMobile ? 40 : 60 }}>
              <Link href="/vehicles">
                <button className="btn-premium">View Full Collection</button>
              </Link>
            </div>
          )}
       </div>
     </section>
  )
}
