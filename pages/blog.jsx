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
          <p style={{ color: '#94a3b8' }}>Accessing Journal Archives...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ background: '#fff', minHeight: '100vh' }}>
        
        {/* Header Section */}
        <section style={{ padding: isMobile ? '120px 24px 60px' : '160px 64px 80px', background: '#f8fafc' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
               <div style={{ width: 4, height: 80, background: 'var(--accent-gold)' }} />
               <div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 16 }}>The Atlas Journal</div>
                  <h1 style={{ fontSize: isMobile ? 36 : 64, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.04em', lineHeight: 1.1, margin: 0 }}>
                    Architectural <br/> <span style={{ color: 'var(--accent-gold)' }}>Insights.</span>
                  </h1>
               </div>
            </div>
          </div>
        </section>

        {/* Main Blog Feed */}
        <section style={{ padding: isMobile ? '60px 24px' : '100px 64px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.8fr 1fr', gap: isMobile ? 60 : 100 }}>
              
              {/* Posts Column */}
              <div style={{ display: 'grid', gap: 100 }}>
                {filteredPosts.map((post, index) => (
                  <motion.article 
                    key={post.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 100 }}
                  >
                    {(post.image || post.img) && (
                      <Link href={`/blog/${post.slug || post.id}`}>
                        <div style={{ 
                          height: isMobile ? 250 : 450, 
                          borderRadius: 32, 
                          overflow: 'hidden', 
                          background: '#f1f5f9',
                          position: 'relative',
                          cursor: 'pointer'
                        }}>
                          <img src={post.image || post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', top: 32, left: 32, padding: '8px 16px', background: 'var(--accent-gold)', color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', borderRadius: 999 }}>
                            {post.category || 'Article'}
                          </div>
                        </div>
                      </Link>
                    )}
                    
                    <div style={{ marginTop: 40 }}>
                      <div style={{ display: 'flex', gap: 24, marginBottom: 16, color: '#94a3b8', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                         <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={14} /> {post.date}</span>
                         <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><User size={14} /> {post.author}</span>
                         <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MessageSquare size={14} /> {post.comments_count || 0} Comments</span>
                      </div>
                      <Link href={`/blog/${post.slug || post.id}`}>
                        <h2 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 900, color: 'var(--accent)', marginBottom: 20, lineHeight: 1.2, cursor: 'pointer' }}>{post.title}</h2>
                      </Link>
                      <div 
                        style={{ 
                          fontSize: 18, color: '#64748b', lineHeight: 1.8, marginBottom: 32,
                          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                        }}
                        dangerouslySetInnerHTML={{ __html: post.excerpt || post.content }}
                      />
                      <Link href={`/blog/${post.slug || post.id}`}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 800, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          Read Continued <ArrowRight size={18} color="var(--accent-gold)" />
                        </button>
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Sidebar */}
              <aside>
                 <div style={{ position: 'sticky', top: 120, display: 'grid', gap: 60 }}>
                    
                    {/* Search */}
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24, color: 'var(--accent)' }}>Search</h4>
                      <div style={{ position: 'relative' }}>
                         <Search style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
                         <input 
                           type="text" 
                           placeholder="Type here..."
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', fontSize: 14 }}
                         />
                      </div>
                    </div>

                    {/* Recent Posts List */}
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24, color: 'var(--accent)' }}>Recent Posts</h4>
                      <div style={{ display: 'grid', gap: 20 }}>
                        {posts.slice(0, 5).map((p, i) => (
                          <Link key={i} href={`/blog/${p.slug}`}>
                            <div style={{ cursor: 'pointer', group: 'true' }}>
                               <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)', marginBottom: 4, transition: 'color 0.2s' }}>{p.title}</div>
                               <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{p.date}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Gallery Post Preview */}
                    {posts.some(p => p.image || p.img) && (
                      <div>
                        <h4 style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24, color: 'var(--accent)' }}>Post Gallery</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                          {posts.filter(p => p.image || p.img).map((p, i) => (
                            <Link key={i} href={`/blog/${p.slug || p.id}`}>
                              <div style={{ paddingTop: '100%', position: 'relative', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', background: '#f1f5f9' }}>
                                <img src={p.image || p.img} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="Gallery Snapshot" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                 </div>
              </aside>

            </div>
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
