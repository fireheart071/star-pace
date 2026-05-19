import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import Link from 'next/link'
import { Search, Calendar, User, ArrowRight, BookOpen } from 'lucide-react'

export default function BlogPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [search, setSearch] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)

    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/news')
        const data = await res.json()
        setPosts(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Journal fetch failed", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const filteredPosts = posts.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) || 
    p.excerpt?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: '160px 64px', textAlign: 'center', background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 44, height: 44, border: '3.5px solid var(--border-color)', borderTop: '3.5px solid var(--brand-fleet)', borderRadius: '50%', marginBottom: 24, animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--brand-fleet)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '11px' }}>Curating Your Journal...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '120px' }}>
        
        {/* Editorial Journal Banner */}
        <section style={{ padding: isMobile ? '120px 24px 60px' : '160px 80px 80px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: isMobile ? '20px' : '32px', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left' }}>
              <div style={{ width: isMobile ? '60px' : '4px', height: isMobile ? '4px' : '80px', background: 'var(--brand-fleet)' }} />
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', letterSpacing: '0.4em', display: 'block', marginBottom: '12px' }}>
                  The Sovereign Journal
                </span>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '36px' : '64px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
                  Refined Travel <br/> <span style={{ color: 'var(--brand-fleet)' }}>& Living.</span>
                </h1>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Directory Feed */}
        <section style={{ padding: isMobile ? '48px 20px' : '80px 80px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            
            {/* Minimalist Floating Search Console */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: isMobile ? '48px' : '64px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: 640 }}>
                <Search style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-fleet)', opacity: 0.6 }} size={18} />
                <input 
                  type="text" 
                  placeholder="Search articles, lifestyle journals, and guides..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '18px 24px 18px 60px', 
                    borderRadius: '99px', 
                    border: '1.5px solid var(--border-color)', 
                    background: '#ffffff',
                    outline: 'none', 
                    fontSize: '15px',
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--brand-fleet)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                  }}
                />
              </div>
            </div>

            {/* Cinematic Editorial Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
              gap: '40px' 
            }}>
              {filteredPosts.map((post, index) => (
                <motion.article 
                  key={post.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                  viewport={{ once: true }}
                  style={{ height: '100%' }}
                >
                  <Link href={`/blog/${post.slug || post.id}`} style={{ textDecoration: 'none' }}>
                    <div 
                      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}
                      className="blog-grid-card"
                    >
                      {/* Panoramic Cover Image */}
                      <div style={{ 
                        height: '240px', 
                        borderRadius: '24px', 
                        overflow: 'hidden', 
                        background: 'var(--bg-secondary)',
                        position: 'relative',
                        marginBottom: '24px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-color)'
                      }}>
                        <img 
                          src={post.image || post.img || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800"} 
                          alt={post.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} 
                          className="blog-img-zoom"
                        />
                        <div style={{ 
                          position: 'absolute', 
                          top: '20px', 
                          left: '20px', 
                          padding: '6px 14px', 
                          background: 'rgba(255, 255, 255, 0.95)', 
                          backdropFilter: 'blur(5px)',
                          WebkitBackdropFilter: 'blur(5px)',
                          color: 'var(--brand-fleet)', 
                          fontSize: '9px', 
                          fontWeight: 900, 
                          textTransform: 'uppercase', 
                          borderRadius: '999px',
                          letterSpacing: '0.15em',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                          zIndex: 2
                        }}>
                          {post.category || 'Lifestyle'}
                        </div>
                      </div>

                      {/* Headline & Specs (Excerpts removed to make card visual first) */}
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} color="var(--brand-fleet)" /> {post.date}</span>
                            <span style={{ height: '4px', width: '4px', borderRadius: '50%', background: 'var(--brand-fleet)', opacity: 0.3 }} />
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={12} color="var(--brand-fleet)" /> {post.author}</span>
                          </div>
                          
                          <h2 style={{ 
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '22px', 
                            fontWeight: 900, 
                            color: 'var(--text-primary)', 
                            marginBottom: '16px', 
                            lineHeight: 1.3, 
                            letterSpacing: '-0.01em',
                            transition: 'color 0.3s'
                          }}
                          className="blog-title-text"
                          >
                            {post.title}
                          </h2>
                        </div>
                        
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 8, 
                          fontSize: '11px', 
                          fontWeight: 900, 
                          color: 'var(--brand-fleet)', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.15em',
                          borderTop: '1px solid var(--border-color)',
                          paddingTop: '16px',
                          marginTop: '8px'
                        }}>
                          Read Journal <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
                <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
                <h3 style={{ fontSize: '22px', fontFamily: "'Playfair Display', serif", fontWeight: 900 }}>No stories found in the collection.</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px' }}>Try refining your search terms.</p>
              </div>
            )}

          </div>
        </section>

      </div>
      <style jsx global>{`
        .blog-grid-card:hover .blog-img-zoom {
          transform: scale(1.08);
        }
        .blog-grid-card:hover .blog-title-text {
          color: var(--brand-fleet) !important;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  )
}
