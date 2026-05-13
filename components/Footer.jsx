import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src="/favicon.png" alt="Atlas Rent-A-Car Logo" style={{ height: 48, objectFit: 'contain', marginBottom: 16 }} />
          <p>
            The premium standard for luxury vehicle rentals and private mobility across Ghana.
            Experience unrivaled comfort, safety, and exclusivity.
          </p>
          <div style={{ marginTop: 24, display: 'flex', gap: 12, fontSize: 13, fontWeight: 700 }}>
            <a href="https://www.google.com/maps/place/Atlas+Rent-A-Car/@5.5585689,-0.2655181,17z" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}>Accra</a>
            <span style={{ color: 'var(--text-secondary)' }}>·</span>
            <a href="https://www.google.com/maps/place/ATLAS+RENT+A+CAR/@4.8933068,-1.7617523,17z" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}>Takoradi</a>
            <span style={{ color: 'var(--text-secondary)' }}>·</span>
            <a href="https://www.google.com/maps/place/Atlas+Rent-A-Car/@6.6826469,-1.6038393,17z" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}>Kumasi</a>
          </div>
        </div>

        <div className="footer-links">
          <h5>Quick Links</h5>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/vehicles">Vehicles</Link></li>
            <li><Link href="/about">About Atlas</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/reservations">My Reservations</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h5>Legal</h5>
          <ul>
            <li><Link href="#">Terms & Conditions</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
            <li><Link href="#">Rental Guidelines</Link></li>
            <li><Link href="#">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-links" style={{ flex: isMobile ? '1' : '1.5' }}>
          <h5>Executive Support</h5>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 13, lineHeight: 1.6 }}>
            Our executive support team is available 24/7 to assist with your private mobility needs.
          </p>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: '8px', background: 'rgba(223, 151, 56, 0.1)', borderRadius: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.19-2.19a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <a href="tel:+233302301081" style={{ fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>+233 30 230 1081</a>
                <a href="tel:+233202225878" style={{ fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>+233 20 222 5878</a>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: '8px', background: 'rgba(223, 151, 56, 0.1)', borderRadius: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </div>
              <a href="mailto:contact@atlasrent-a-car.com" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none' }}>contact@atlasrent-a-car.com</a>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        marginTop: 64,
        paddingTop: 32,
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        color: 'var(--text-secondary)'
      }}>
        <div style={{ fontSize: 13 }}>
          © {new Date().getFullYear()} Atlas Rent-A-Car. All Rights Reserved.
        </div>

        <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
          <a href="https://www.instagram.com/atlasghana/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Instagram</a>
          <a href="https://x.com/atlasghana" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Twitter</a>
          <a href="https://www.facebook.com/AtlasGhana/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Facebook</a>
        </div>

        <div style={{ fontSize: 13 }}>
          Designed by <a href="https://skytechghana.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>SkyTech Ghana</a>
        </div>
      </div>
    </footer>
  )
}
