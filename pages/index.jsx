import React from 'react'
import Hero from '../components/Hero'
import Products from '../components/Products'
import { motion, AnimatePresence } from 'framer-motion'
import { getTestimonials } from '../lib/siteContentApi'
import Link from 'next/link'
import { Heart, Car, Flag, MessageCircle, ArrowRight, Shield, Award } from 'lucide-react'
import { useInView } from 'framer-motion'
import PartnerMarquee from '../components/PartnerMarquee'
import Layout from '../components/Layout'
import Head from 'next/head'

// Fast, smooth counter for premium numbers
function Counter({ value, duration = 1.5 }) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value.replace(/[,.]/g, ''));
      if (start === end) return;

      let totalMiliseconds = duration * 1000;
      let step = Math.ceil(end / (totalMiliseconds / 30));

      let timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  const formatNumber = (num) => {
    if (value.includes('.')) {
      return num.toLocaleString('de-DE');
    }
    return num.toLocaleString();
  };

  return <span ref={ref}>{formatNumber(count)}</span>;
}

// Sovereign Statistics Dashboard Bar
function Statistics({ isMobile }) {
  const stats = [
    { icon: <Heart size={20} strokeWidth={1.5} />, value: '5,657', label: 'VIP GUESTS' },
    { icon: <Car size={20} strokeWidth={1.5} />, value: '657', label: 'FLEET & VILLAS' },
    { icon: <Flag size={20} strokeWidth={1.5} />, value: '1.255.657', label: 'MILES COMPLETED' },
    { icon: <MessageCircle size={20} strokeWidth={1.5} />, value: '1,255', label: 'CONCIERGE INQUIRIES' },
  ];

  return (
    <section style={{ 
      padding: isMobile ? '48px 24px' : '64px 80px', 
      backgroundColor: 'var(--bg-secondary)', 
      color: '#ffffff',
      borderBottom: '1px solid rgba(56, 189, 248, 0.08)'
    }}>
      <div style={{ 
        maxWidth: 1400, 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', 
        gap: isMobile ? '32px' : '40px'
      }}>
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              borderRight: (!isMobile && i < 3) ? '1px solid rgba(255,255,255,0.08)' : 'none',
              paddingRight: (!isMobile && i < 3) ? '40px' : '0px'
            }}
          >
            <div style={{ 
              marginBottom: 10, 
              color: 'var(--accent-gold)',
              opacity: 0.8
            }}>
              {s.icon}
            </div>
            <div style={{ 
              fontSize: isMobile ? '24px' : '36px', 
              fontWeight: 300, 
              color: '#ffffff', 
              marginBottom: 4, 
              letterSpacing: '-0.01em',
              fontFamily: "'Playfair Display', serif"
            }}>
              <Counter value={s.value} />+
            </div>
            <div style={{ 
              fontSize: '9px', 
              fontWeight: 800, 
              color: 'rgba(255,255,255,0.4)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.25em' 
            }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// Asymmetric Editorial Collage (Homepage Feature)
function CinematicPillars({ isMobile }) {
  return (
    <section style={{ 
      padding: isMobile ? '80px 24px' : '160px 80px', 
      backgroundColor: 'var(--bg-primary)',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        
        {/* Asymmetric Magazine Spread Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr 1.1fr',
          gap: isMobile ? '48px' : '64px',
          alignItems: 'center'
        }}>
          
          {/* Column 1: Tall Vertical Image Block */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              marginTop: isMobile ? 0 : '-40px'
            }}
          >
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              height: isMobile ? '380px' : '580px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1606148633266-06432b8966ba?q=80&w=800&fit=crop" 
                alt="Chauffeur Luxury Sedan" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ marginTop: '16px' }}>
              <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>01 / MOBILE COVERS</span>
              <h3 style={{ fontSize: '20px', margin: '4px 0 0', fontWeight: 800 }}>Chauffeur Discretion</h3>
            </div>
          </motion.div>

          {/* Column 2: Editorial Center Spacing & Text Narrative */}
          <div style={{ textAlign: isMobile ? 'left' : 'center', padding: isMobile ? 0 : '0 20px' }}>
            <span style={{ 
              fontSize: '10px', 
              fontWeight: 900, 
              color: 'var(--brand-fleet)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.3em',
              display: 'block',
              marginBottom: '16px'
            }}>
              The Pace Philosophy
            </span>
            <h2 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: isMobile ? '32px' : '48px', 
              fontWeight: 900, 
              color: 'var(--text-primary)', 
              margin: '0 0 24px',
              lineHeight: 1.15
            }}>
              Uncompromising Standards.
            </h2>
            <div style={{ width: '40px', height: '1px', background: 'var(--accent-gold)', margin: isMobile ? '0 0 24px 0' : '0 auto 24px' }} />
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px' }}>
              We curate private luxury encounters across West Africa. Combining high-armor executive vehicles, professional chauffeurs, and handpicked design sanctuaries to deliver absolute security and architectural bliss.
            </p>
            <Link href="/about" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--brand-fleet)', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Discover Our Heritage <ArrowRight size={14} />
              </span>
            </Link>
          </div>

          {/* Column 3: Landscape offset image block */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              marginTop: isMobile ? 0 : '80px'
            }}
          >
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              height: isMobile ? '280px' : '440px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&fit=crop" 
                alt="Elite Residence Master Suite" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ marginTop: '16px' }}>
              <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>02 / VIP ACCOMMODATION</span>
              <h3 style={{ fontSize: '20px', margin: '4px 0 0', fontWeight: 800 }}>Sovereign Sanctuaries</h3>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

// Guestbook Testimonials Cards Grid
function Testimonials({ testimonials, isMobile }) {
  const [expanded, setExpanded] = React.useState(false);
  
  if (!testimonials || testimonials.length === 0) return null;

  const visibleTestimonials = expanded ? testimonials : testimonials.slice(0, 3);
  const hasMore = testimonials.length > 3;

  return (
    <section style={{ 
      padding: isMobile ? '80px 24px' : '140px 80px', 
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '48px' : '80px' }}>
          <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.3em', display: 'block', marginBottom: '12px' }}>
            VIP GUESTBOOK
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '32px' : '44px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Client <span style={{ color: 'var(--brand-fleet)' }}>Testimonials</span>.
          </h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '32px' 
        }}>
          {visibleTestimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              style={{
                background: 'rgba(6, 10, 19, 0.45)', // Slightly translucent background to let Starfield peak through
                padding: '40px',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              <span style={{ fontSize: '64px', fontFamily: "'Playfair Display', serif", color: 'var(--border-color)', height: '24px', lineHeight: 0, display: 'block', marginBottom: '24px', opacity: 0.6 }}>
                “
              </span>
              
              <blockquote style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: 1.6,
                color: 'var(--text-primary)',
                margin: '0 0 32px',
                fontStyle: 'italic',
                flex: 1
              }}>
                {testimonial.quote}
              </blockquote>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                <img 
                  src={testimonial.avatar || "https://images.unsplash.com/photo-1542362567-b054cd1321c1?q=80&w=150&fit=crop"} 
                  alt={testimonial.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {testimonial.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '4px' }}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '56px' }}>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background: 'transparent',
                border: '1px solid var(--accent-gold)',
                color: 'var(--accent-gold)',
                padding: '14px 32px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '10px',
                fontWeight: 900,
                letterSpacing: '0.25em',
                borderRadius: '30px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(0, 229, 255, 0.08)'
                e.currentTarget.style.boxShadow = 'var(--shadow-glow)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              }}
            >
              {expanded ? 'Collapse Reviews ↑' : `Show More Reviews (${testimonials.length - 3} More) ↓`}
            </button>
          </div>
        )}

      </div>
    </section>
  )
}

export default function Home() {
  const [testimonials, setTestimonials] = React.useState([])
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)

    let mounted = true
    ;(async () => {
      const t = await getTestimonials()
      if (!mounted) return
      setTestimonials(t)
    })()
    
    return () => { 
      mounted = false
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Layout>
      <Head>
        <title>Star Pace | Premium Private Chauffeur & Luxury Accommodations</title>
        <meta name="description" content="Redefining VIP mobility and stays across West Africa. Female-led bespoke fleet rentals and luxury villa services." />
      </Head>

      {/* 1. Cinematic Slideshow Hero */}
      <Hero />
      
      {/* 2. Text-only Infinite Partners Ribbon */}
      <PartnerMarquee />
      
      {/* 3. Sovereign Dashboard Statistics */}
      <Statistics isMobile={isMobile} />
      
      {/* 4. Cinematic Asymmetric Narrative Pillars */}
      <CinematicPillars isMobile={isMobile} />
      
      {/* 5. Elite Fleet Spotlight */}
      <section style={{ padding: isMobile ? '80px 24px' : '140px 80px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '64px' }}>
            <div style={{ width: '4px', height: '48px', background: 'var(--brand-fleet)' }} />
            <div>
              <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.3em', display: 'block', marginBottom: '4px' }}>
                PREMIUM MOBILITY
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '32px' : '44px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                The Elite <span style={{ color: 'var(--brand-fleet)' }}>Fleet</span>.
              </h2>
            </div>
          </div>

          <Products limit={4} isMobile={isMobile} />
        </div>
      </section>

      {/* 6. VIP Guestbook Split Spread */}
      <Testimonials testimonials={testimonials} isMobile={isMobile} />
      
      {/* 7. Exquisite Residences Spotlight */}
      <section style={{ padding: isMobile ? '80px 24px' : '140px 80px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '64px' }}>
            <div style={{ width: '4px', height: '48px', background: 'var(--brand-fleet)' }} />
            <div>
              <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.3em', display: 'block', marginBottom: '4px' }}>
                VIP ACCOMMODATION
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '32px' : '44px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                Sovereign <span style={{ color: 'var(--brand-fleet)' }}>Residences</span>.
              </h2>
            </div>
          </div>

          <Products limit={4} isMobile={isMobile} endpoint="/api/residence" />
        </div>
      </section>
    </Layout>
  )
}
