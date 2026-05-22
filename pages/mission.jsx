import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import Head from 'next/head'
import { ShieldCheck, CalendarRange, Medal, Sparkles } from 'lucide-react'

const fadeUp = { hidden: { y: 30, opacity: 0 }, show: { y: 0, opacity: 1 } }
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

export default function MissionPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Layout>
      <Head>
        <title>Our Mission | Star Pace</title>
        <meta name="description" content="Read about the founding mission, safety standards, and core values of Star Pace." />
      </Head>

      <section style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        padding: isMobile ? '120px 20px 60px' : '160px 80px 120px', 
        background: 'var(--bg-primary)',
        minHeight: '100vh'
      }}>
        
        {/* Cinematic Radial Accent Grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 10% 20%, rgba(127, 29, 29, 0.03) 0%, transparent 40%)',
          zIndex: 0
        }} />

        <div style={{ 
          maxWidth: 1400, 
          margin: '0 auto', 
          position: 'relative', 
          zIndex: 1, 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr', 
          gap: isMobile ? '48px' : '96px', 
          alignItems: 'center' 
        }}>

          {/* Left Column: Narrative Values */}
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp} style={{
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: '99px',
              padding: '6px 18px',
              marginBottom: '24px',
              background: 'rgba(127, 29, 29, 0.05)',
              border: '1.5px solid rgba(127, 29, 29, 0.1)',
              color: 'var(--brand-fleet)',
              fontSize: '10px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              fontWeight: 900
            }}>
              Our Mission
            </motion.div>

            <motion.h1 variants={fadeUp} style={{ 
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? '36px' : '56px', 
              fontWeight: 900, 
              lineHeight: 1.15, 
              marginBottom: '24px', 
              color: 'var(--text-primary)', 
              letterSpacing: '-0.02em' 
            }}>
              Setting the Standard for <br/> <span style={{ color: 'var(--brand-fleet)' }}>Premium Transport.</span>
            </motion.h1>

            <motion.p variants={fadeUp} style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.8', marginBottom: '40px' }}>
              Founded on the principles of empathy, elegance, and efficiency, Star Pace is a female-led enterprise dedicated to redefining the hospitality and logistics landscape in West Africa. We don't just provide transport; we ensure your journey is safe, serene, and perfectly tailored to your premium lifestyle.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: 'grid', gap: '20px' }}>
              
              {/* Safety Card */}
              <div style={{ padding: '24px', background: '#ffffff', borderRadius: '16px', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '12px' }}>
                  <ShieldCheck size={18} color="var(--brand-fleet)" />
                  <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: 800, margin: 0 }}>Uncompromising Safety</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
                  All vehicles are comprehensively insured with 24-hour tracked monitoring and driven by rigorously trained defensive drivers.
                </p>
              </div>

              {/* Reliability Card */}
              <div style={{ padding: '24px', background: '#ffffff', borderRadius: '16px', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '12px' }}>
                  <CalendarRange size={18} color="var(--brand-fleet)" />
                  <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: 800, margin: 0 }}>Reliability & Flexibility</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
                  Unlimited mileage, flexible digital payments, and quick vehicle replacement guarantees peace of mind unconditionally.
                </p>
              </div>

            </motion.div>
          </motion.div>

          {/* Right Column: Hero Cover Photo & Floating Stats Badge */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)'
            }}>
              <img 
                src="/img/mission-prado-driveway.jpeg" 
                alt="Luxury Mercedes Fleet" 
                style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
            </div>

            {/* Floating Insured Badge */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                position: 'absolute',
                bottom: isMobile ? '-16px' : '-32px',
                left: isMobile ? '16px' : '-32px',
                background: '#ffffff',
                backdropFilter: 'blur(20px)',
                padding: '20px 28px',
                borderRadius: '16px',
                border: '1.5px solid var(--brand-fleet)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: 'var(--shadow-md)',
                zIndex: 2
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(127, 29, 29, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Medal size={20} color="var(--brand-fleet)" />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '2px', lineHeight: 1 }}>100%</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>Insured Fleet</div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>
    </Layout>
  )
}
