import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import { Phone, MapPin, Mail, Send, Clock, ShieldCheck } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet components for SSR compatibility
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

export default function ContactPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [L, setL] = useState(null)
  const [settings, setSettings] = useState({
    supportPhone: '+233 30 230 1081 / +233 20 222 5878',
    headquarters: 'Dansoman, Accra, Ghana',
    adminEmail: 'contact@starpaceghana.com'
  })

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)

    if (typeof window !== 'undefined') {
      const leaflet = require('leaflet')
      import('leaflet/dist/leaflet.css')

      delete leaflet.Icon.Default.prototype._getIconUrl
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })
      setL(leaflet)
    }

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings({
            supportPhone: data.supportPhone || '+233 30 230 1081 / +233 20 222 5878',
            headquarters: data.headquarters || 'Dansoman, Accra, Ghana',
            adminEmail: data.adminEmail || 'contact@starpaceghana.com'
          })
        }
      })
      .catch(console.error)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        setStatus({ type: 'success', message: 'Thank you! Your inquiry has been sent successfully.' })
        e.target.reset()
      } else {
        setStatus({ type: 'error', message: 'Failed to send message. Please try again or call us directly.' })
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'An error occurred. Please check your connection.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '120px' }}>

        {/* Editorial Contact Header */}
        <section style={{ padding: isMobile ? '120px 24px 60px' : '160px 80px 80px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: isMobile ? '20px' : '32px', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left' }}>
              <div style={{ width: isMobile ? '60px' : '4px', height: isMobile ? '4px' : '80px', background: 'var(--brand-fleet)' }} />
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', letterSpacing: '0.4em', display: 'block', marginBottom: '12px' }}>
                  Welcome to the Estate
                </span>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '36px' : '64px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
                  Contact <span style={{ color: 'var(--brand-fleet)' }}>Star Pace</span>.
                </h1>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '16px', maxHTMLWidth: 700, margin: 0 }}>
                  Whether you need bespoke luxury fleet, corporate logistics, or a private penthouse stay, our team is standing by to host your experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form Console & Info side Grid */}
        <section style={{ padding: isMobile ? '48px 20px' : '80px 80px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: isMobile ? '48px' : '100px' }}>

              {/* Interactive Reception Console (Form) */}
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '32px', margin: 0 }}>
                  Send an Inquiry
                </h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.05em' }}>Full Name *</label>
                    <input 
                      name="name" 
                      required 
                      type="text" 
                      placeholder="John Doe" 
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
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.05em' }}>Email Address *</label>
                    <input 
                      name="email" 
                      required 
                      type="email" 
                      placeholder="john@example.com" 
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
                  <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                    <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.05em' }}>Subject *</label>
                    <input 
                      name="subject" 
                      required 
                      type="text" 
                      placeholder="Luxury Rental Inquiry" 
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
                  <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                    <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.05em' }}>Your Message *</label>
                    <textarea 
                      name="message" 
                      required 
                      rows={isMobile ? 4 : 6} 
                      placeholder="How can we assist you today?" 
                      style={{ 
                        width: '100%', 
                        padding: '16px 20px', 
                        borderRadius: '16px', 
                        border: '1.5px solid var(--border-color)', 
                        background: '#ffffff', 
                        outline: 'none', 
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                        transition: 'border-color 0.3s' 
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand-fleet)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    />
                  </div>
                  <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                    <button
                      disabled={loading}
                      type="submit"
                      style={{
                        width: isMobile ? '100%' : 'auto',
                        padding: '16px 44px',
                        background: 'var(--brand-fleet)',
                        color: '#ffffff',
                        borderRadius: '99px',
                        border: 'none',
                        fontWeight: 800,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        opacity: loading ? 0.7 : 1,
                        transition: 'all 0.3s',
                        boxShadow: '0 10px 25px rgba(127,29,29,0.15)'
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Inquiry'} <Send size={14} color="#ffffff" />
                    </button>
                    {status && (
                      <div style={{ marginTop: '24px', padding: '16px 24px', borderRadius: '12px', background: status.type === 'success' ? '#ecfdf5' : '#fef2f2', color: status.type === 'success' ? '#059669' : '#dc2626', fontSize: '14px', fontWeight: 600 }}>
                        {status.message}
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Graphic Info Deck Side */}
              <div>
                <div style={{ display: 'grid', gap: '32px', position: isMobile ? 'relative' : 'sticky', top: '120px' }}>

                  {/* Rows */}
                  <div style={{ display: 'grid', gap: '24px' }}>
                    {/* Call Row */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(127, 29, 29, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(127, 29, 29, 0.1)', flexShrink: 0 }}>
                        <Phone size={16} color="var(--brand-fleet)" />
                      </div>
                      <div>
                        <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Call Us (24/7)</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {settings.supportPhone.split('/').map((p, i) => (
                            <a key={i} href={`tel:${p.replace(/\s/g, '')}`} style={{ fontSize: '15px', fontWeight: 900, color: 'var(--text-primary)', textDecoration: 'none', transition: 'color 0.3s' }}
                               onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-fleet)'}
                               onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                              {p.trim()}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mail Row */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(127, 29, 29, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(127, 29, 29, 0.1)', flexShrink: 0 }}>
                        <Mail size={16} color="var(--brand-fleet)" />
                      </div>
                      <div>
                        <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Email Support</div>
                        <a href={`mailto:${settings.adminEmail}`} style={{ fontSize: '15px', fontWeight: 900, color: 'var(--text-primary)', textDecoration: 'none', transition: 'color 0.3s' }}
                           onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-fleet)'}
                           onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                          {settings.adminEmail}
                        </a>
                      </div>
                    </div>

                    {/* Address Row */}
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(127, 29, 29, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(127, 29, 29, 0.1)', flexShrink: 0 }}>
                        <MapPin size={16} color="var(--brand-fleet)" />
                      </div>
                      <div>
                        <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Headquarters</div>
                        <div style={{ fontSize: '15px', fontWeight: 900, color: 'var(--text-primary)' }}>{settings.headquarters}</div>
                      </div>
                    </div>
                  </div>

                  {/* Operational Hours card */}
                  <div style={{ padding: '32px 24px', background: 'var(--brand-fleet)', borderRadius: '24px', color: '#ffffff', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: '24px', width: '32px', height: '4px', background: '#ffffff', opacity: 0.3 }} />
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '20px' }}>
                      <Clock size={16} color="#ffffff" />
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Operating Hours</span>
                    </div>
                    
                    <div style={{ display: 'grid', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 500 }}>Mon - Fri</span>
                        <span style={{ fontWeight: 800, fontSize: '14px' }}>8:00 AM - 6:00 PM</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 500 }}>Saturday</span>
                        <span style={{ fontWeight: 800, fontSize: '14px' }}>9:00 AM - 2:00 PM</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 500 }}>Sunday</span>
                        <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '14px', opacity: 0.8 }}>Pre-bookings Only</span>
                      </div>
                    </div>
                  </div>

                  {/* 24/7 SLA block */}
                  <div style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '8px' }}>
                      <ShieldCheck size={16} color="#10b981" />
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Corporate Guarantee
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      We operate a dedicated dispatch hotline unconditional for airport transits, embassy support, and stay emergencies.
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </Layout>
  )
}
