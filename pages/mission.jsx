import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import IMAGES from '../data/images'

const fadeUp = { hidden: { y: 30, opacity: 0 }, show: { y: 0, opacity: 1 } }
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

export default function MissionPage() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Layout>
      <section style={{ position: 'relative', overflow: 'hidden', padding: isMobile ? '120px 20px 60px' : '160px 60px 100px', background: '#fff' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 10% 20%, rgba(36, 39, 111, 0.05), transparent 40%), radial-gradient(circle at 90% 80%, rgba(223, 151, 56, 0.05), transparent 50%)',
          zIndex: 0
        }}></div>

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems: 'center' }}>

          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp} style={{
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: 999,
              padding: '6px 16px',
              marginBottom: 24,
              background: 'rgba(36, 39, 111, 0.05)',
              border: '1px solid rgba(36, 39, 111, 0.1)',
              color: 'var(--accent)',
              fontSize: 12,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 700
            }}>Our Mission</motion.div>

            <motion.h1 variants={fadeUp} style={{ fontSize: isMobile ? 36 : 56, fontWeight: 900, lineHeight: 1.1, marginBottom: 24, color: 'var(--accent)', letterSpacing: '-0.02em' }}>
              Setting the Standard for <span className="gradient-text">Premium Transport</span>
            </motion.h1>

            <motion.p variants={fadeUp} style={{ color: 'var(--muted)', fontSize: isMobile ? 16 : 18, lineHeight: 1.8, marginBottom: 32 }}>
              We are committed to fully meeting and satisfying our customers' requirements and expectations by providing friendly, reliable, cost-effective, timely, and high-quality rental services across Ghana.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: 'grid', gap: 20 }}>
              <div style={{ padding: 24, background: '#f8fafc', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: 20, color: 'var(--accent-gold)', fontWeight: 800, marginBottom: 12 }}>Uncompromising Safety</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: 0, lineHeight: 1.6 }}>All vehicles are comprehensively insured with 24-hour tracked monitoring and are driven by rigorously trained defensive drivers.</p>
              </div>

              <div style={{ padding: 24, background: '#f8fafc', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: 20, color: 'var(--accent-gold)', fontWeight: 800, marginBottom: 12 }}>Reliability & Flexibility</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: 0, lineHeight: 1.6 }}>Unlimited mileage, flexible payment options, and quick vehicle replacement guarantees peace of mind unconditionally.</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--glass-border)'
            }}>
              <img src={IMAGES.featured1} alt="Luxury Car" style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
            </div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                position: 'absolute',
                bottom: isMobile ? -20 : -40,
                left: isMobile ? 20 : -40,
                background: 'var(--surface)',
                backdropFilter: 'blur(20px)',
                padding: 24,
                borderRadius: 16,
                border: '1px solid rgba(212, 175, 55, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                boxShadow: 'var(--shadow)'
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                🛡️
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>100%</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Insured Fleet</div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>
    </Layout>
  )
}
