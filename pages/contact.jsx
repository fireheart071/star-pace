import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import { Phone, MapPin, Mail, Send, Clock, Globe, ArrowUpRight } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet components for SSR compatibility
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

const HUBS = [
  {
    city: 'Takoradi Branch',
    title: 'Star Pace',
    rating: 4.8,
    reviews: 42,
    category: 'Premium Fleet & Stays',
    status: 'Open',
    address: 'Chapel Hill Junction, Adwoa Frema Mall, Takoradi',
    phone: '+233 31 200 1320 / +233 20 533 7122',
    coords: [4.8933068, -1.7617523],
    photoUrl: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEUFLBC7JfhRCZb9a5Ck56wqViGUcy699iSxGT0fH5tGevfl-Uktzm1s0WstnKANv8hdagz3e-pHrOA7mZMaBIC0jeYdJteg1TIIIUy8JYQPhCnSXzvHqjkuOV1sRaFhot2e4rK=s1600',
    googleMapsUrl: 'https://www.google.com/maps/place/Star+Pace/@4.8933068,-1.7617523,17z'
  },
  {
    city: 'Kumasi Branch',
    title: 'Star Pace',
    rating: 4.9,
    reviews: 7,
    category: 'Premium Fleet & Stays',
    address: 'H/NO PLT 14 BLOCK 18, New Amakom, Kumasi',
    phone: '+233 32 204 6740 / +233 50 149 6242',
    coords: [6.6826469, -1.6038393],
    photoUrl: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHpyjzykpLErGsIR9d4RTGzLca8hghf0OPiALrxZCY81b9LznU4GCb5Z96dH4-hmhtvl61DBeF-Vns0l4Zybyjqx3ROqVZZizX0WJgl7PDgJ6_fnEugkgPoahb8d7ggJEVgSZhLZA=s1600',
    googleMapsUrl: 'https://www.google.com/maps/place/Star+Pace/@6.6826469,-1.6038393,17z'
  },
  {
    city: 'Accra Headquarters',
    title: 'Star Pace',
    rating: 4.8,
    reviews: 25,
    category: 'Corporate Logistics & Stays',
    address: 'Dansoman Estate, Accra, Ghana',
    phone: '+233 30 230 1081 / +233 20 222 5878',
    coords: [5.5585636, -0.2629432],
    photoUrl: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFWn5jGRDXYe_mIDuShwFzlFUMpZisNCJt4gKHJ-pElmvGSKB4Co7B8YZmHat53CyGjnjHH0W6bX1jU7FI5NdkhMcLp3NhQzgMxFgSwK6334O7udVwHktufJL6QlX06syuNr7opyw=s1600',
    googleMapsUrl: 'https://www.google.com/maps/place/Star+Pace/@5.5585689,-0.2655181,17z'
  }
]

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
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>

        {/* Header Section */}
        <section style={{ padding: isMobile ? '100px 20px 40px' : '160px 64px 80px', background: 'var(--bg-secondary)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'flex-start', gap: isMobile ? 20 : 40 }}>
              <div style={{ width: 4, height: isMobile ? 40 : 80, background: 'var(--accent-gold)' }} />
              <div>
                <div style={{ fontSize: isMobile ? 11 : 13, fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 12 }}>Welcome to the Estate</div>
                <h1 style={{ fontSize: isMobile ? 32 : 64, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 20 }}>
                  Contact <span style={{ color: 'var(--accent)' }}>Star Pace</span>.
                </h1>
                <p style={{ fontSize: isMobile ? 16 : 18, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 700, margin: 0 }}>
                  Whether you need bespoke luxury, corporate logistics, or a private chauffeur, the team at Star Pace is standing by to assist with your journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section style={{ padding: isMobile ? '40px 20px' : '100px 64px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: isMobile ? 40 : 100 }}>

              {/* Form Side */}
              <div>
                <h2 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 900, color: 'var(--accent)', marginBottom: 32 }}>Send an Inquiry</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Full Name *</label>
                    <input name="name" required type="text" placeholder="John Doe" style={{ width: '100%', padding: '16px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', transition: 'border 0.3s' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Email Address *</label>
                    <input name="email" required type="email" placeholder="john@example.com" style={{ width: '100%', padding: '16px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }} />
                  </div>
                  <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Subject *</label>
                    <input name="subject" required type="text" placeholder="Rental Inquiry" style={{ width: '100%', padding: '16px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }} />
                  </div>
                  <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Your Message *</label>
                    <textarea name="message" required rows={isMobile ? 4 : 6} placeholder="How can we assist you today?" style={{ width: '100%', padding: '20px', borderRadius: 16, border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontSize: 15 }}></textarea>
                  </div>
                  <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                    <button
                      disabled={loading}
                      type="submit"
                      style={{
                        width: isMobile ? '100%' : 'auto',
                        padding: '18px 48px',
                        background: 'var(--accent)',
                        color: '#fff',
                        borderRadius: 999,
                        border: 'none',
                        fontWeight: 800,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 12,
                        opacity: loading ? 0.7 : 1
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Inquiry'} <Send size={18} color="#fff" />
                    </button>
                    {status && (
                      <div style={{ marginTop: 24, padding: '16px 24px', borderRadius: 12, background: status.type === 'success' ? '#ecfdf5' : '#fef2f2', color: status.type === 'success' ? '#059669' : '#dc2626', fontSize: 14, fontWeight: 600 }}>
                        {status.message}
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Info Side */}
              <div>
                <div style={{ display: 'grid', gap: isMobile ? 32 : 40, position: isMobile ? 'relative' : 'sticky', top: isMobile ? 0 : 120 }}>

                  {/* Contact Blocks */}
                  <div style={{ display: 'grid', gap: 24 }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(127, 29, 29, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Phone size={18} color="var(--accent)" />
                      </div>
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Call Us (24/7)</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {settings.supportPhone.split('/').map((p, i) => (
                            <a key={i} href={`tel:${p.replace(/\s/g, '')}`} style={{ fontSize: 17, fontWeight: 800, color: 'var(--accent)', textDecoration: 'none' }}>{p.trim()}</a>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(127, 29, 29, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Mail size={18} color="var(--accent)" />
                      </div>
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Email Support</div>
                        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--accent)' }}>{settings.adminEmail}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(127, 29, 29, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <MapPin size={18} color="var(--accent)" />
                      </div>
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Visit Us</div>
                        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--accent)' }}>{settings.headquarters}</div>
                      </div>
                    </div>
                  </div>

                  {/* Hours Block */}
                  <div style={{ padding: isMobile ? '32px 24px' : '40px 32px', background: 'var(--accent)', borderRadius: 24, color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, color: '#fff' }}>
                      <Clock size={18} color="#fff" />
                      <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Operating Hours</span>
                    </div>
                    <div style={{ display: 'grid', gap: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 10 }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Mon - Fri</span>
                        <span style={{ fontWeight: 800, fontSize: 14 }}>8:00 AM - 6:00 PM</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 10 }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Saturday</span>
                        <span style={{ fontWeight: 800, fontSize: 14 }}>9:00 AM - 2:00 PM</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Sunday</span>
                        <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 14 }}>Pre-bookings Only</span>
                      </div>
                    </div>
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
