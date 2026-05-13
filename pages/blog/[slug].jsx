import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Layout from '../../components/Layout'
import Link from 'next/link'
import Head from 'next/head'
import { ArrowLeft, Calendar, User, MessageSquare, Facebook, Twitter, Linkedin, MessageCircle, Heart } from 'lucide-react'
import storage from '../../lib/api-storage'

export default function ArticlePage({ post: initialPost }) {
  const router = useRouter()
  const { slug } = router.query
  const [post, setPost] = useState(initialPost)
  const [comments, setComments] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [commentForm, setCommentForm] = useState({ author: '', email: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [likes, setLikes] = useState(initialPost?.likes || 0)
  const [isLiked, setIsLiked] = useState(false)

  // Ensure internal state syncs with server props
  useEffect(() => {
    setPost(initialPost);
    setLikes(initialPost?.likes || 0);
    
    // Check if previously liked
    if (initialPost && typeof window !== 'undefined') {
      const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
      if (likedPosts.includes(initialPost.id)) {
        setIsLiked(true);
      }
    }
  }, [initialPost]);

  const handleLike = async () => {
    if (isLiked || !post) return;
    
    try {
      const res = await fetch('/api/news/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id })
      });
      
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setIsLiked(true);
        
        // Save to local storage
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
        likedPosts.push(post.id);
        localStorage.setItem('liked_posts', JSON.stringify(likedPosts));
      }
    } catch (err) {
      console.error("Like failed", err);
    }
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = post ? encodeURIComponent(`Check out this article: ${post.title}`) : ''

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(currentUrl)}`
  }

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)

    if (post) {
      fetchComments()
    }

    return () => window.removeEventListener('resize', handleResize)
  }, [post])

  const fetchComments = async () => {
    if (!post || !post.id) return;
    try {
      const cRes = await fetch(`/api/comments?postId=${post.id}`)
      const commentsData = await cRes.json()
      setComments(Array.isArray(commentsData) ? commentsData : [])
    } catch (err) {
      console.error("Failed to load comments", err)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!post) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          ...commentForm
        })
      })

      if (res.ok) {
        const newComment = await res.json()
        setComments(prev => [newComment, ...prev])
        setCommentForm({ author: '', email: '', content: '' })
      }
    } catch (err) {
      console.error("Comment submission failed", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!post) {
    return (
      <Layout>
        <div style={{ padding: '160px 20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: 'var(--accent)' }}>Article Not Found</h2>
          <p style={{ color: '#94a3b8', marginTop: 16 }}>The content your are looking for may have been archived.</p>
          <Link href="/blog">
            <button style={{ marginTop: 24, padding: '12px 32px', background: 'var(--accent)', color: '#fff', borderRadius: 999, border: 'none', fontWeight: 700, cursor: 'pointer' }}>
              Back to Journal
            </button>
          </Link>
        </div>
      </Layout>
    )
  }

  // Handle OG Image logic with absolute URL support
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'https://atlasrentacar.com');
  const rawImage = post.image || post.img;
  const ogImage = rawImage 
    ? (rawImage.startsWith('http') ? rawImage : `${siteUrl}${rawImage}`)
    : `${siteUrl}/logo-transparent.png`;

  return (
    <Layout>
      <Head>
        <title>{`${post.title} | Atlas Rent-A-Car`}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>


      <div style={{ background: '#fff', minHeight: '100vh' }}>

        {/* Article Header */}
        <section style={{ padding: isMobile ? '100px 20px 40px' : '160px 64px 80px', background: '#f8fafc' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Link href="/blog">
              <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--accent-gold)', fontWeight: 800, cursor: 'pointer', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: isMobile ? 20 : 32 }}>
                <ArrowLeft size={16} /> Back to Journal
              </button>
            </Link>
            <h1 style={{ fontSize: isMobile ? 32 : 56, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: isMobile ? 24 : 32 }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 16 : 32, color: '#94a3b8', fontSize: isMobile ? 11 : 13, fontWeight: 700, textTransform: 'uppercase' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={14} /> {post.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><User size={14} /> {post.author}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MessageSquare size={14} /> {comments.length} Comments</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: isLiked ? '#ef4444' : '#94a3b8' }}><Heart size={14} fill={isLiked ? '#ef4444' : 'none'} /> {likes} Likes</span>
            </div>
          </div>
        </section>

        {/* Feature Image */}
        {(post.image || post.img) && (
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 20px' : '0 64px', marginTop: -40 }}>
            <div style={{ height: isMobile ? 320 : 600, borderRadius: isMobile ? 16 : 32, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.1)' }}>
              <img src={post.image || post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        )}

        {/* Article Content */}
        <section style={{ padding: isMobile ? '40px 20px' : '100px 64px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 280px', gap: isMobile ? 60 : 80 }}>

            {/* Body */}
            <div>
              <div
                className="editorial-narrative-container"
                style={{
                  fontSize: isMobile ? 17 : 18, color: '#64748b', lineHeight: isMobile ? 1.8 : 2,
                  marginBottom: isMobile ? 60 : 80, maxHeight: isMobile ? 'none' : '70vh', overflowY: isMobile ? 'visible' : 'auto', paddingRight: isMobile ? 0 : 24
                }}
                dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
              />

              {/* Comments Section */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: isMobile ? 60 : 80 }}>
                <h3 style={{ fontSize: isMobile ? 28 : 32, fontWeight: 900, color: 'var(--accent)', marginBottom: isMobile ? 24 : 40 }}>Leave a Reply</h3>
                <p style={{ fontSize: isMobile ? 13 : 14, color: '#94a3b8', marginBottom: 24 }}>Your email address will not be published. Required fields are marked *</p>

                <form onSubmit={handleCommentSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <textarea
                      required
                      value={commentForm.content}
                      onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                      placeholder="Your Comment*"
                      rows={isMobile ? 5 : 8}
                      style={{ width: '100%', padding: '20px', borderRadius: 16, border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontSize: 15 }}
                    ></textarea>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <input
                      required
                      type="text"
                      placeholder="Full Name*"
                      value={commentForm.author}
                      onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
                      style={{ width: '100%', padding: '16px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <input
                      required
                      type="email"
                      placeholder="Email Address*"
                      value={commentForm.email}
                      onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                      style={{ width: '100%', padding: '16px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <button
                      disabled={submitting}
                      type="submit"
                      style={{ width: isMobile ? '100%' : 'auto', padding: '18px 48px', background: 'var(--accent)', color: '#fff', borderRadius: 999, border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: 14, transition: 'transform 0.2s', opacity: submitting ? 0.7 : 1 }}>
                      {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>

                <div style={{ marginTop: isMobile ? 60 : 80 }}>
                  <h4 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 900, color: 'var(--accent)', marginBottom: 32 }}>{comments.length} Comments</h4>
                  <div style={{ display: 'grid', gap: 32 }}>
                    {comments.length === 0 ? (
                      <div style={{ padding: 32, border: '1px dashed #e2e8f0', borderRadius: 24, textAlign: 'center' }}>
                        <MessageSquare size={32} color="#94a3b8" style={{ marginBottom: 16, opacity: 0.5 }} />
                        <p style={{ color: '#94a3b8', margin: 0, fontSize: 14 }}>Be the first to share your thoughts!</p>
                      </div>
                    ) : (
                      comments.map((c, i) => (
                        <div key={c.id || i} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 24 }}>
                          <div style={{ fontWeight: 900, color: 'var(--accent)', marginBottom: 8, fontSize: 15 }}>{c.author}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>{new Date(c.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{c.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Meta Sidebar */}
            <aside>
              <div style={{ position: 'relative', top: isMobile ? 0 : 120, display: 'grid', gap: isMobile ? 32 : 48 }}>
                <div>
                  <h4 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold)', marginBottom: 12 }}>Published By</h4>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>{post.author}</div>
                </div>
                <div>
                  <h4 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold)', marginBottom: 12 }}>Category</h4>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>{post.category}</div>
                </div>
                <div>
                  <h4 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold)', marginBottom: 12 }}>Appreciate</h4>
                  <button 
                    onClick={handleLike}
                    disabled={isLiked}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 12, 
                      background: isLiked ? '#fef2f2' : '#f8fafc', 
                      border: isLiked ? '1px solid #fee2e2' : '1px solid #e2e8f0', 
                      padding: '12px 24px', 
                      borderRadius: 16, 
                      cursor: isLiked ? 'default' : 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    <Heart size={20} color={isLiked ? '#ef4444' : 'var(--accent)'} fill={isLiked ? '#ef4444' : 'none'} />
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>{likes} Likes</span>
                  </button>
                </div>
                <div>
                  <h4 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold)', marginBottom: 12 }}>Share This</h4>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <a href={shareLinks.facebook} target="_blank" rel="noreferrer"><Facebook size={20} style={{ cursor: 'pointer' }} color="var(--accent)" /></a>
                    <a href={shareLinks.twitter} target="_blank" rel="noreferrer"><Twitter size={20} style={{ cursor: 'pointer' }} color="var(--accent)" /></a>
                    <a href={shareLinks.linkedin} target="_blank" rel="noreferrer"><Linkedin size={20} style={{ cursor: 'pointer' }} color="var(--accent)" /></a>
                    <a href={shareLinks.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={20} style={{ cursor: 'pointer' }} color="var(--accent)" /></a>
                  </div>
                </div>
                <div style={{
                  marginTop: isMobile ? 24 : 40,
                  padding: isMobile ? '32px 24px' : '40px 32px',
                  background: '#f8fafc',
                  borderRadius: 24,
                  border: '1px solid #e2e8f0',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 32, width: 40, height: 4, background: 'var(--accent-gold)' }} />
                  <h4 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22,
                    fontWeight: 900,
                    marginBottom: 12,
                    color: 'var(--accent)',
                    letterSpacing: '-0.02em'
                  }}>Ready to Go?</h4>
                  <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.6, fontWeight: 500 }}>
                    Secure an elite vehicle from our curated collection for your next journey.
                  </p>
                  <Link href="/vehicles">
                    <button style={{
                      width: '100%',
                      height: 52,
                      padding: '0 24px',
                      background: 'var(--accent)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 14,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 12,
                      fontSize: 13,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      boxShadow: '0 10px 20px rgba(36, 39, 111, 0.1)'
                    }}>
                      Explore The Collection
                    </button>
                  </Link>
                </div>
              </div>
            </aside>

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

export async function getServerSideProps(context) {
  const { slug } = context.params;
  
  try {
    const posts = await storage.getNews();
    const post = posts.find(p => (p.slug === slug) || (String(p.id) === String(slug))) || null;

    return {
      props: { 
        post: JSON.parse(JSON.stringify(post)) // Simple deep clone to ensure serializable data
      }
    };
  } catch (error) {
    console.error("Error fetching post in getServerSideProps:", error);
    return {
      props: { post: null }
    };
  }
}
