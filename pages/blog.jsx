import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import Link from 'next/link'
import { Search, Calendar, User, MessageSquare, ArrowRight, ChevronRight, Grid } from 'lucide-react'

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
        <div style={{ padding: '160px 64px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Curating Your Journal...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
        
        {/* Header Section */}
        <section style={{ padding: isMobile ? '120px 24px 60px' : '160px 64px 80px', background: 'var(--bg-secondary)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
                <div style={{ width: 4, height: 80, background: 'var(--accent)' }} />
                <div>
                   <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 16 }}>The Star Pace Muse</div>
                   <h1 style={{ fontSize: isMobile ? 36 : 64, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.04em', lineHeight: 1.1, margin: 0 }}>
                     Refined Travel <br/> <span style={{ color: 'var(--accent)' }}>& Living.</span>
                   </h1>
                </div>
            </div>
          </div>
        </section>

        {/* Main Blog Feed - Editorial Redesign */}
        <section style={{ padding: isMobile ? '60px 20px' : '100px 64px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            
            {/* Minimalist Search & Filter Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 80 }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: 600 }}>
                 <Search style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)', opacity: 0.5 }} size={20} />
                 <input 
                   type="text" 
                   placeholder="Discover stories, travel tips, and fleet news..."
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   style={{ 
                     width: '100%', 
                     padding: '20px 24px 20px 64px', 
                     borderRadius: 99, 
                     border: '1px solid rgba(127, 29, 29, 0.1)', 
                     background: 'rgba(127, 29, 29, 0.02)',
                     outline: 'none', 
                     fontSize: 16,
                     color: 'var(--accent)',
                     fontWeight: 500
                   }}
                 />
              </div>
            </div>

            {/* The Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
              gap: isMobile ? 40 : 80 
            }}>
              {filteredPosts.map((post, index) => {
                const isFeatured = !isMobile && index === 0;
                return (
                  <motion.article 
                    key={post.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: (index % 2) * 0.2 }}
                    viewport={{ once: true }}
                    style={{ 
                      gridColumn: isFeatured ? '1 / span 2' : 'auto',
                      marginBottom: isMobile ? 0 : 40
                    }}
                  >
                    <Link href={`/blog/${post.slug || post.id}`}>
                      <div style={{ cursor: 'pointer', group: 'true' }}>
                        {/* Image Container */}
                        <div style={{ 
                          height: isFeatured ? 600 : (isMobile ? 280 : 450), 
                          borderRadius: 32, 
                          overflow: 'hidden', 
                          background: 'var(--bg-secondary)',
                          position: 'relative',
                          marginBottom: 32,
                          boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
                        }}>
                          <motion.img 
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 1.2 }}
                            src={post.image || post.img} 
                            alt={post.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                          <div style={{ 
                            position: 'absolute', 
                            top: 32, 
                            left: 32, 
                            padding: '10px 20px', 
                            background: 'var(--accent)', 
                            color: '#fff', 
                            fontSize: 11, 
                            fontWeight: 900, 
                            textTransform: 'uppercase', 
                            borderRadius: 999,
                            letterSpacing: '0.1em'
                          }}>
                            {post.category || 'Lifestyle'}
                          </div>
                        </div>

                        {/* Text Content */}
                        <div style={{ maxWidth: isFeatured ? 800 : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                             <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={14} color="var(--accent)" /> {post.date}</span>
                             <span style={{ height: 4, width: 4, borderRadius: '50%', background: 'var(--accent)', opacity: 0.3 }} />
                             <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><User size={14} color="var(--accent)" /> {post.author}</span>
                          </div>
                          
                          <h2 style={{ 
                            fontSize: isFeatured ? (isMobile ? 32 : 56) : (isMobile ? 24 : 36), 
                            fontWeight: 900, 
                            color: 'var(--accent)', 
                            marginBottom: 24, 
                            lineHeight: 1.1, 
                            letterSpacing: '-0.02em' 
                          }}>
                            {post.title}
                          </h2>
                          
                          <div 
                            style={{ 
                              fontSize: isFeatured ? 20 : 18, 
                              color: 'var(--text-secondary)', 
                              lineHeight: 1.8, 
                              marginBottom: 32,
                              display: '-webkit-box', 
                              WebkitLineClamp: isFeatured ? 3 : 2, 
                              WebkitBoxOrient: 'vertical', 
                              overflow: 'hidden'
                            }}
                            dangerouslySetInnerHTML={{ __html: post.excerpt || post.content }}
                          />

                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Read the Story <ArrowRight size={18} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>

            {filteredPosts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>✧</div>
                <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent)' }}>No stories found in the collection.</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Try refining your search terms.</p>
              </div>
            )}

          </div>
        </section>

      </div>
      <style jsx global>{`
        .lexical-ul { padding-left: 32px; list-style-type: disc; margin: 16px 0; }
        .lexical-ol { padding-left: 32px; list-style-type: decimal; margin: 16px 0; }
        .lexical-paragraph { margin-bottom: 16px; }
      `}</style>
    </Layout>
  )
}
