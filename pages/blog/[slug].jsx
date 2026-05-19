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

  useEffect(() => {
    setPost(initialPost);
    setLikes(initialPost?.likes || 0);
    
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
        <div style={{ padding: '160px 20px', textAlign: 'center', background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 900, color: 'var(--brand-fleet)' }}>Article Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>The content you are looking for may have been archived.</p>
          <Link href="/blog">
            <button style={{ marginTop: '24px', padding: '12px 32px', background: 'var(--brand-fleet)', color: '#ffffff', borderRadius: '99px', border: 'none', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>
              Back to Journal
            </button>
          </Link>
        </div>
      </Layout>
    )
  }

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'https://starpaceghana.com');
  const rawImage = post.image || post.img;
  const ogImage = rawImage 
    ? (rawImage.startsWith('http') ? rawImage : `${siteUrl}${rawImage}`)
    : `${siteUrl}/logo-transparent.png`;

  return (
    <Layout>
      <Head>
        <title>{`${post.title} | Star Pace`}</title>
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

      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '120px' }}>

        {/* Editorial Heading Section */}
        <section style={{ padding: isMobile ? '120px 24px 60px' : '160px 80px 80px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Link href="/blog" style={{ textDecoration: 'none' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--brand-fleet)', fontWeight: 900, cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px', padding: 0 }}>
                <ArrowLeft size={14} /> Back to Journal
              </button>
            </Link>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '32px' : '56px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px', margin: 0 }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={13} color="var(--brand-fleet)" /> {post.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><User size={13} color="var(--brand-fleet)" /> {post.author}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MessageSquare size={13} color="var(--brand-fleet)" /> {comments.length} Comments</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: isLiked ? '#ef4444' : 'var(--text-muted)' }}><Heart size={13} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : 'var(--brand-fleet)'} /> {likes} Likes</span>
            </div>
          </div>
        </section>

        {/* Feature Image Banner */}
        {(post.image || post.img) && (
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: isMobile ? '0 20px' : '0 60px', marginTop: '-40px' }}>
            <div style={{ height: isMobile ? '280px' : '560px', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)' }}>
              <img src={post.image || post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        )}

        {/* Narrative Columns layout */}
        <section style={{ padding: isMobile ? '40px 20px' : '80px 60px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 280px', gap: '60px' }}>

            {/* Main Article Body */}
            <div>
              <article
                className="editorial-narrative-container"
                style={{
                  fontSize: '17px', 
                  color: 'var(--text-secondary)', 
                  lineHeight: '1.9',
                  marginBottom: '60px',
                  paddingRight: isMobile ? 0 : '16px'
                }}
                dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
              />

              {/* Dynamic Comments Board */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '60px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '26px' : '32px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '12px', margin: 0 }}>
                  Share Your Thoughts
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
                  Your email address will not be published. Required fields are marked *
                </p>

                <form onSubmit={handleCommentSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <textarea
                      required
                      value={commentForm.content}
                      onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                      placeholder="Your Comment*"
                      rows={isMobile ? 5 : 8}
                      style={{ 
                        width: '100%', 
                        padding: '16px 20px', 
                        borderRadius: '16px', 
                        border: '1.5px solid var(--border-color)', 
                        background: '#ffffff', 
                        outline: 'none', 
                        fontSize: '15px',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                        transition: 'border-color 0.3s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand-fleet)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    />
                  </div>
                  <div style={{ gridColumn: isMobile ? 'span 2' : 'auto' }}>
                    <input
                      required
                      type="text"
                      placeholder="Full Name*"
                      value={commentForm.author}
                      onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
                      style={{ 
                        width: '100%', 
                        padding: '14px 20px', 
                        borderRadius: '12px', 
                        border: '1.5px solid var(--border-color)', 
                        background: '#ffffff', 
                        outline: 'none',
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        transition: 'border-color 0.3s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand-fleet)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    />
                  </div>
                  <div style={{ gridColumn: isMobile ? 'span 2' : 'auto' }}>
                    <input
                      required
                      type="email"
                      placeholder="Email Address*"
                      value={commentForm.email}
                      onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                      style={{ 
                        width: '100%', 
                        padding: '14px 20px', 
                        borderRadius: '12px', 
                        border: '1.5px solid var(--border-color)', 
                        background: '#ffffff', 
                        outline: 'none',
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        transition: 'border-color 0.3s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand-fleet)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <button
                      disabled={submitting}
                      type="submit"
                      style={{ 
                        width: isMobile ? '100%' : 'auto', 
                        padding: '16px 40px', 
                        background: 'var(--brand-fleet)', 
                        color: '#ffffff', 
                        borderRadius: '99px', 
                        border: 'none', 
                        fontWeight: 800, 
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        cursor: 'pointer', 
                        transition: 'all 0.3s', 
                        opacity: submitting ? 0.7 : 1 
                      }}
                    >
                      {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>

                <div style={{ marginTop: '60px' }}>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '32px' }}>
                    {comments.length} Comments
                  </h4>
                  <div style={{ display: 'grid', gap: '24px' }}>
                    {comments.length === 0 ? (
                      <div style={{ padding: '40px', border: '1.5px dashed var(--border-color)', borderRadius: '24px', textAlign: 'center' }}>
                        <MessageSquare size={32} color="var(--brand-fleet)" style={{ marginBottom: '16px', opacity: 0.6 }} />
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px', fontWeight: 700 }}>
                          Be the first to share your thoughts!
                        </p>
                      </div>
                    ) : (
                      comments.map((c, i) => (
                        <div key={c.id || i} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
                          <div style={{ fontWeight: 900, color: 'var(--text-primary)', marginBottom: '4px', fontSize: '15px' }}>{c.author}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 800, letterSpacing: '0.05em' }}>
                            {new Date(c.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{c.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Sidebar */}
            <aside>
              <div style={{ position: 'relative', top: isMobile ? 0 : '80px', display: 'grid', gap: '32px' }}>
                <div>
                  <h4 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--brand-fleet)', marginBottom: '8px' }}>
                    Published By
                  </h4>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: 'var(--text-primary)' }}>{post.author}</div>
                </div>
                
                <div>
                  <h4 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--brand-fleet)', marginBottom: '8px' }}>
                    Category
                  </h4>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: 'var(--text-primary)' }}>{post.category}</div>
                </div>

                <div>
                  <h4 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--brand-fleet)', marginBottom: '8px' }}>
                    Appreciate
                  </h4>
                  <button 
                    onClick={handleLike}
                    disabled={isLiked}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      background: isLiked ? 'rgba(127, 29, 29, 0.05)' : 'transparent', 
                      border: isLiked ? '1.5px solid rgba(127, 29, 29, 0.2)' : '1.5px solid var(--border-color)', 
                      padding: '10px 20px', 
                      borderRadius: '99px', 
                      cursor: isLiked ? 'default' : 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    <Heart size={16} color={isLiked ? '#ef4444' : 'var(--brand-fleet)'} fill={isLiked ? '#ef4444' : 'none'} />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-fleet)' }}>{likes} Likes</span>
                  </button>
                </div>

                <div>
                  <h4 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--brand-fleet)', marginBottom: '8px' }}>
                    Share This
                  </h4>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
                    <a href={shareLinks.facebook} target="_blank" rel="noreferrer" className="share-icon"><Facebook size={18} /></a>
                    <a href={shareLinks.twitter} target="_blank" rel="noreferrer" className="share-icon"><Twitter size={18} /></a>
                    <a href={shareLinks.linkedin} target="_blank" rel="noreferrer" className="share-icon"><Linkedin size={18} /></a>
                    <a href={shareLinks.whatsapp} target="_blank" rel="noreferrer" className="share-icon"><MessageCircle size={18} /></a>
                  </div>
                </div>

                {/* Call To Action Brochure Panel */}
                <div style={{
                  marginTop: '16px',
                  padding: '32px 24px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '24px',
                  border: '1.5px solid var(--border-color)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: 0, left: '24px', width: '32px', height: '4px', background: 'var(--brand-fleet)' }} />
                  <h4 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '20px',
                    fontWeight: 900,
                    marginBottom: '10px',
                    color: 'var(--text-primary)'
                  }}>
                    Ready to Go?
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
                    Secure an elite vehicle from our curated collection for your next journey.
                  </p>
                  <Link href="/vehicles" style={{ textDecoration: 'none' }}>
                    <button style={{
                      width: '100%',
                      padding: '14px',
                      background: 'var(--brand-fleet)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      boxShadow: '0 8px 20px rgba(127, 29, 29, 0.15)'
                    }}>
                      Explore Fleet
                    </button>
                  </Link>
                </div>
              </div>
            </aside>

          </div>
        </section>

      </div>
      <style jsx global>{`
        .editorial-narrative-container p { margin-bottom: 24px; }
        .editorial-narrative-container ul { padding-left: 24px; list-style-type: disc; margin-bottom: 24px; }
        .editorial-narrative-container ol { padding-left: 24px; list-style-type: decimal; margin-bottom: 24px; }
        .share-icon { color: var(--text-muted); transition: color 0.3s; }
        .share-icon:hover { color: var(--brand-fleet); }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
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
        post: JSON.parse(JSON.stringify(post))
      }
    };
  } catch (error) {
    console.error("Error fetching post in getServerSideProps:", error);
    return {
      props: { post: null }
    };
  }
}
