import React from 'react'
import Hero from '../components/Hero'
import Products from '../components/Products'
import IMAGES from '../data/images'
import { motion, AnimatePresence } from 'framer-motion'
import CldOptimizedImage from '../components/CldOptimizedImage'
import { getTestimonials, getNews } from '../lib/siteContentApi'
import Link from 'next/link'
import { Heart, Car, Flag, MessageCircle, Shield } from 'lucide-react'
import { useInView } from 'framer-motion'
import PartnerMarquee from '../components/PartnerMarquee'

function Counter({ value, duration = 2 }) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value.replace(/[,.]/g, ''));
      if (start === end) return;

      let totalMiliseconds = duration * 1000;
      let incrementTime = (totalMiliseconds / end) * 5; // simplified logic

      let timer = setInterval(() => {
        start += Math.ceil(end / 100);
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

function Statistics() {
  const stats = [
    { icon: <Heart size={56} strokeWidth={1.5} />, value: '5657', label: 'HAPPY CUSTOMERS' },
    { icon: <Car size={56} strokeWidth={1.5} />, value: '657', label: 'TOTAL CAR COUNT' },
    { icon: <Flag size={56} strokeWidth={1.5} />, value: '1.255.657', label: 'TOTAL KM/MIL' },
    { icon: <MessageCircle size={56} strokeWidth={1.5} />, value: '1255', label: 'CALL CENTER SOLUTIONS' },
  ];

  return (
    <section style={{ padding: '100px 48px', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            style={{ textAlign: 'center', color: 'var(--text-secondary)' }}
          >
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center', color: '#94a3b8' }}>
              {s.icon}
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
              <Counter value={s.value} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Testimonials({ testimonials, isMobile }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const itemsPerPage = isMobile ? 1 : 3;

  React.useEffect(() => {
    if (!testimonials || testimonials.length <= itemsPerPage) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials?.length, itemsPerPage]);

  if (!testimonials || testimonials.length === 0) return null;

  let visibleTestimonials = [];
  if (testimonials.length <= itemsPerPage) {
    visibleTestimonials = testimonials;
  } else {
    for (let i = 0; i < itemsPerPage; i++) {
      visibleTestimonials.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
  }

  return (
    <section style={{ padding: isMobile ? '40px 0' : '80px 0', background: 'var(--bg-secondary)', textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
      <div className="section-header" style={{ marginBottom: isMobile ? 24 : 48 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 28 : 40, fontWeight: 900, margin: 0 }}>Client Experiences</h2>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : `repeat(${visibleTestimonials.length}, 1fr)`, 
              gap: 24,
              alignItems: 'stretch'
            }}
          >
            {visibleTestimonials.map((t, idx) => (
              <div key={`${t.name}-${idx}`} style={{ 
                background: '#fff', 
                padding: isMobile ? 24 : 32, 
                borderRadius: 16, 
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: 'left'
              }}>
                <div>
                  <div style={{ color: 'var(--accent-gold)', fontSize: 16, marginBottom: 16 }}>
                    ★★★★★
                  </div>
                  <p style={{
                    fontSize: isMobile ? 15 : 16,
                    lineHeight: 1.6,
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                    marginBottom: 24,
                    fontStyle: 'italic',
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    "{t.quote}"
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {t.avatar && (
                    <img src={t.avatar} alt={t.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                  )}
                  <div>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>{t.name}</h4>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {testimonials.length > itemsPerPage && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: isMobile ? 32 : 48 }}>
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: idx === currentIndex ? 24 : 8,
                  height: 8,
                  borderRadius: 999,
                  background: idx === currentIndex ? 'var(--accent)' : 'var(--border-color)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function News({ newsItems, isMobile }) {
  if (!newsItems || newsItems.length === 0) return null

  return (
    <section style={{ padding: isMobile ? '80px 24px' : '120px 48px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: isMobile ? 40 : 64, display: 'flex', alignItems: 'center', gap: isMobile ? 16 : 24 }}>
        <div style={{ width: 4, height: isMobile ? 32 : 40, background: 'var(--accent-gold)' }} />
        <div>
           <div style={{ fontSize: isMobile ? 9 : 11, fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 4 }}>The Atlas Journal</div>
           <h2 style={{ fontSize: isMobile ? 32 : 48, fontWeight: 900, color: 'var(--accent)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Latest Insights</h2>
        </div>
      </div>

      <div className="custom-horizontal-scroll" style={{ 
        display: 'flex', 
        overflowX: 'auto', 
        gap: isMobile ? 24 : 64, 
        paddingBottom: 24, 
        scrollSnapType: 'x mandatory',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {newsItems.slice(0, 6).map((n, i) => (
          <Link href={`/blog/${n.slug || n.id}`} key={n.id} style={{ textDecoration: 'none' }}>
            <motion.article 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{ 
                display: 'flex', 
                gap: isMobile ? 16 : 24, 
                alignItems: 'center', 
                minWidth: isMobile ? 280 : 420, 
                flex: `0 0 ${isMobile ? '280px' : '420px'}`, 
                scrollSnapAlign: 'start',
                cursor: 'pointer' 
              }}
            >
              {(n.image || n.img) && (
                <div style={{ 
                  width: isMobile ? 90 : 120, 
                  height: isMobile ? 60 : 80, 
                  flexShrink: 0, 
                  borderRadius: 8, 
                  overflow: 'hidden', 
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0'
                }}>
                   <img 
                     src={n.image || n.img} 
                     alt={n.title} 
                     style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) brightness(0.9)', transition: '0.4s ease' }} 
                   />
                </div>
              )}
              <div style={{ flex: 1 }}>
                 <div style={{ fontSize: isMobile ? 8 : 9, fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{n.category || 'Journal'}</div>
                 <h3 style={{ 
                   fontSize: isMobile ? 14 : 16, 
                   fontWeight: 800, 
                   color: 'var(--accent)', 
                   marginBottom: 4, 
                   lineHeight: 1.3,
                   textDecoration: 'none',
                   display: '-webkit-box', 
                   WebkitLineClamp: isMobile ? 2 : 1, 
                   WebkitBoxOrient: 'vertical', 
                   overflow: 'hidden' 
                 }}>{n.title}</h3>
                 {!isMobile && (
                   <p style={{ 
                     color: '#64748b', 
                     fontSize: 13, 
                     lineHeight: 1.5, 
                     margin: 0,
                     display: '-webkit-box', 
                     WebkitLineClamp: 2, 
                     WebkitBoxOrient: 'vertical', 
                     overflow: 'hidden' 
                   }}>{n.excerpt || n.content}</p>
                 )}
              </div>
            </motion.article>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Awards({ isMobile }) {
  const awards = [
    {
      icon: <Flag size={24} />,
      title: "Industry Excellence",
      subtitle: "CIMIG Hospitality & Allied Service Company of the Year",
      description: "Recognized for outstanding hospitality and professional service delivery across our national operations."
    },
    {
      icon: <Heart size={24} />,
      title: "Regional Distinction",
      subtitle: "Best Car Rental Company in Accra & Kumasi",
      description: "Voted as the premier car rental provider in Ghana's two largest metropolitan hubs for superior fleet quality."
    },
    {
      icon: <Shield size={24} />,
      title: "National Legacy",
      subtitle: "The Best Rental Company in Ghana 2018",
      description: "A prestigious national honor cementing our status as the country's most trusted vehicle rental partner."
    }
  ];

  return (
    <section style={{ 
      padding: isMobile ? '80px 24px' : '120px 64px', 
      backgroundColor: '#fff',
      color: 'var(--text-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Abstract background glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '30%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(223, 151, 56, 0.05) 0%, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: 0
      }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          alignItems: 'center', 
          gap: isMobile ? 48 : 100,
          marginBottom: isMobile ? 64 : 100 
        }}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ flex: 1 }}
          >
            <span style={{ 
              fontSize: 12, 
              fontWeight: 900, 
              color: 'var(--accent-gold)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.4em',
              display: 'block',
              marginBottom: 20
            }}>
              Distinction & Honor
            </span>
            <h2 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: isMobile ? 36 : 64, 
              fontWeight: 900, 
              color: 'var(--accent)', 
              margin: '0 0 32px',
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}>
              A Legacy of <br />
              <span style={{ color: 'var(--accent-gold)' }}>Award-Winning</span> Service
            </h2>
            <p style={{ 
              fontSize: 18, 
              color: 'var(--text-secondary)', 
              lineHeight: 1.7, 
              maxWidth: 500,
              margin: 0
            }}>
              We don't just set standards; we exceed them. Our commitment to excellence has been recognized by industry leaders and our valued clients worldwide.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ 
              width: isMobile ? 180 : 320, 
              height: isMobile ? 180 : 320, 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{
              position: 'absolute',
              inset: -20,
              border: '1px solid rgba(223, 151, 56, 0.1)',
              borderRadius: '50%',
              animation: 'spin 30s linear infinite'
            }} />
            <div style={{
              position: 'absolute',
              inset: -40,
              border: '1px dashed rgba(0, 0, 0, 0.05)',
              borderRadius: '50%',
              animation: 'spin-reverse 40s linear infinite'
            }} />
            <img 
              src="/assets/award.jpeg" 
              alt="Awards Icon" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                mixBlendMode: 'multiply'
              }} 
            />
          </motion.div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
          gap: 32 
        }}>
          {awards.map((award, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                padding: '48px 40px',
                borderRadius: 32,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              whileHover={{ 
                y: -12, 
                background: '#fff',
                borderColor: 'var(--accent-gold)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.06)'
              }}
            >
              <div style={{ 
                width: 64, 
                height: 64, 
                borderRadius: 20,
                background: 'linear-gradient(135deg, var(--accent-gold), #c9822a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 32,
                color: '#fff',
                boxShadow: '0 10px 20px rgba(223, 151, 56, 0.2)'
              }}>
                {award.icon}
              </div>
              
              <div style={{ 
                fontSize: 11, 
                fontWeight: 900, 
                color: 'var(--accent-gold)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.2em',
                marginBottom: 12
              }}>
                {award.title}
              </div>
              <h3 style={{ 
                fontSize: 22, 
                fontWeight: 800, 
                color: 'var(--accent)', 
                marginBottom: 20,
                lineHeight: 1.3,
                letterSpacing: '-0.01em'
              }}>
                {award.subtitle}
              </h3>
              <p style={{ 
                fontSize: 15, 
                color: 'var(--text-secondary)', 
                lineHeight: 1.6,
                margin: 0 
              }}>
                {award.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </section>
  )
}


export default function Home() {
  const [testimonials, setTestimonials] = React.useState([])
  const [newsItems, setNewsItems] = React.useState([])
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)

    let mounted = true
      ; (async () => {
        const [t, n] = await Promise.all([
          getTestimonials(),
          getNews()
        ])
        if (!mounted) return
        setTestimonials(t)
        setNewsItems(n)
      })()
    
    return () => { 
      mounted = false
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <Hero />
      <PartnerMarquee />
      <Statistics isMobile={isMobile} />
      <Awards isMobile={isMobile} />
      <Products limit={6} isMobile={isMobile} />
      <Testimonials testimonials={testimonials} isMobile={isMobile} />
      <News newsItems={newsItems} isMobile={isMobile} />
    </>
  )
}
