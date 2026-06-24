import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '../components/Layout'
import { Star, MessageSquare, CheckCircle, ArrowRight, StarHalf } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ReviewSubmissionPage() {
  const router = useRouter()
  const { bookingId } = router.query || {}

  const [form, setForm] = useState({
    name: '',
    comment: '',
    rating: 5
  })
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function updateField(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) {
      setError('Please provide your name.')
      return
    }
    if (!form.comment.trim()) {
      setError('Please write a comment about your experience.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          rating: form.rating,
          comment: form.comment,
          bookingId: bookingId || null
        })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review')
      }
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Share Your Feedback | Star Pace</title>
        <meta name="description" content="Share your experience and review your booking with Star Pace." />
      </Head>
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative'
      }}>
        
        <div style={{ 
          maxWidth: 580, 
          width: '100%', 
          background: 'var(--glass-bg)', 
          border: '1px solid var(--glass-border)', 
          padding: '40px 32px', 
          borderRadius: '24px', 
          boxShadow: 'var(--shadow-glow), var(--shadow-lg)',
          zIndex: 10
        }}>
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <div style={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: '50%', 
                    background: 'rgba(223, 151, 56, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 16px',
                    border: '1px solid rgba(223, 151, 56, 0.2)'
                  }}>
                    <MessageSquare size={24} style={{ color: 'var(--accent-gold)' }} />
                  </div>
                  <h1 style={{ 
                    fontFamily: "'Playfair Display', serif", 
                    fontSize: 32, 
                    fontWeight: 700, 
                    color: '#ffffff', 
                    margin: '0 0 8px 0',
                    fontStyle: 'italic'
                  }}>
                    Client Feedback
                  </h1>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Thank you for choosing Star Pace. We would love to hear your thoughts on our premium hospitality and mobility services.
                  </p>
                  {bookingId && (
                    <div style={{ 
                      display: 'inline-block', 
                      marginTop: 12, 
                      padding: '4px 12px', 
                      background: 'rgba(255,255,255,0.05)', 
                      borderRadius: 99, 
                      fontSize: 11, 
                      color: 'var(--brand-fleet)', 
                      fontWeight: 700 
                    }}>
                      Booking Reference: #{bookingId}
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 24 }}>
                  <div className="input-group">
                    <label style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, display: 'block' }}>
                      YOUR NAME
                    </label>
                    <input 
                      name="name" 
                      required 
                      value={form.name} 
                      onChange={updateField} 
                      placeholder="e.g. Samuel Amponsah" 
                      className="luxury-input" 
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="input-group">
                    <label style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12, display: 'block' }}>
                      RATING
                    </label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = star <= (hoverRating || form.rating)
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, rating: star }))}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer', 
                              padding: 4, 
                              transition: '0.2s',
                              transform: active ? 'scale(1.1)' : 'scale(1)'
                            }}
                          >
                            <Star 
                              size={28} 
                              fill={active ? 'var(--accent-gold)' : 'none'} 
                              stroke={active ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.2)'} 
                              strokeWidth={1.5}
                            />
                          </button>
                        )
                      })}
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginLeft: 8 }}>
                        {form.rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  <div className="input-group">
                    <label style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, display: 'block' }}>
                      YOUR REVIEW
                    </label>
                    <textarea 
                      name="comment" 
                      required 
                      value={form.comment} 
                      onChange={updateField} 
                      placeholder="Describe your overall experience with our service..." 
                      className="luxury-input" 
                      rows={5}
                      style={{ 
                        width: '100%', 
                        padding: '16px 20px', 
                        height: 'auto', 
                        fontFamily: 'inherit',
                        lineHeight: 1.6
                      }}
                    />
                  </div>

                  {error && <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 700 }}>{error}</div>}

                  <button 
                    disabled={submitting} 
                    type="submit" 
                    className="primary" 
                    style={{ 
                      width: '100%', 
                      padding: '18px', 
                      fontSize: 12, 
                      fontWeight: 900, 
                      borderRadius: 14, 
                      background: 'var(--brand-fleet)', 
                      color: '#070B18', 
                      border: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      cursor: 'pointer',
                      transition: '0.3s',
                      opacity: submitting ? 0.7 : 1
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center', padding: '24px 0' }}
              >
                <div style={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: '50%', 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 24px',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <CheckCircle size={32} style={{ color: '#10B981' }} />
                </div>
                <h2 style={{ 
                  fontFamily: "'Playfair Display', serif", 
                  fontSize: 28, 
                  fontWeight: 700, 
                  color: '#ffffff', 
                  marginBottom: 16,
                  fontStyle: 'italic'
                }}>
                  Feedback Received
                </h2>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 36 }}>
                  Thank you for taking the time to share your feedback. Your review has been successfully submitted to our team.
                </p>
                <button 
                  onClick={() => router.push('/')}
                  className="primary"
                  style={{ 
                    padding: '16px 36px', 
                    borderRadius: 12, 
                    background: 'transparent', 
                    color: '#ffffff', 
                    fontWeight: 700, 
                    border: '1px solid var(--glass-border)',
                    cursor: 'pointer',
                    transition: '0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--brand-fleet)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                >
                  Return to Home
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

ReviewSubmissionPage.noLayout = true

