import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Compass, CheckCircle2, Users, Award, Shield, ArrowRight, UserCheck, Star, Briefcase } from 'lucide-react'
import { getTeam } from '../lib/siteContentApi'

export default function AboutPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [showAllBenefits, setShowAllBenefits] = useState(false)
  const [teamItems, setTeamItems] = useState([])
  const [selectedPerson, setSelectedPerson] = useState(null)


  const benefits = [
    { icon: <Users size={24} />, t: "Curation of Comfort", d: "From sleek executive sedans to spacious, homelike suites, our collection is handpicked for your serenity." },
    { icon: <Award size={24} />, t: "Value without Compromise", d: "Transparent, hospitable pricing that respects your investment and your journey." },
    { icon: <CheckCircle2 size={24} />, t: "Intuitive Care", d: "Our team anticipates your needs, ensuring every stay and ride is a memory of grace." },
    { icon: <Compass size={24} />, t: "Rooted in Hospitality", d: "With deep roots in Ghana, we offer local warmth with global standards." },
    { icon: <Shield size={24} />, t: "A Circle of Trust", d: "Your safety and privacy are the foundation of everything we do." }
  ]

  const extraBenefits = [
    { icon: <Shield size={24} />, t: "24/7 Roadside Assistance", d: "Support wherever your journey takes you." },
    { icon: <UserCheck size={24} />, t: "Vetted Chauffeurs", d: "Extensively trained in executive protocol and defensive operations." },
    { icon: <Star size={24} />, t: "Seamless Digital Booking", d: "Manage reservations effortlessly online." }
  ]

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)

    ;(async () => {
      const data = await getTeam()
      setTeamItems(Array.isArray(data) ? data : [])
    })()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      
      {/* 1. Cinematic Founder Hero Section */}
      <section style={{
        position: 'relative',
        height: isMobile ? '70vh' : '85vh',
        minHeight: '550px',
        display: 'flex',
        alignItems: 'center',
        background: '#000',
        overflow: 'hidden'
      }}>
        <img
          src="/araba_pace_founder_portrait_1778704289401.png"
          alt="Araba Pace"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 15%',
            zIndex: 0
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.85) 100%)',
          zIndex: 1
        }} />

        <div style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 1440,
          width: '100%',
          margin: '0 auto',
          padding: isMobile ? '120px 24px 40px' : '0 80px',
          color: '#ffffff'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: 650 }}
          >
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--brand-fleet)',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              display: 'block',
              marginBottom: '16px'
            }}>
              A Legacy of Perfection
            </span>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? '38px' : '68px',
              fontWeight: 900,
              lineHeight: 1.1,
              margin: '0 0 24px',
              textShadow: '0 4px 15px rgba(0,0,0,0.4)'
            }}>
              Hospitality <br />
              <span style={{ color: 'var(--brand-fleet)' }}>Redefined by Grace</span>
            </h1>
            <p style={{
              fontSize: isMobile ? '14px' : '18px',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.6,
              margin: 0
            }}>
              Founded by Araba Pace, Star Pace merges high-performance mobility with five-star luxury stays. We are your premium host in West Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Visual Narrative Split Grid */}
      <section style={{ padding: isMobile ? '80px 24px' : '140px 80px', background: 'transparent' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: isMobile ? '48px' : '100px', alignItems: 'center' }}>
            
            {/* Left: Poetic Brand Motto & Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--brand-fleet)',
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                display: 'block',
                marginBottom: '16px'
              }}>
                The Brand Mission
              </span>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: isMobile ? '30px' : '54px',
                fontWeight: 900,
                lineHeight: 1.15,
                margin: '0 0 32px'
              }}>
                We Don't Rent Assets. <br />
                <span style={{ color: 'var(--brand-fleet)' }}>We Host Journeys.</span>
              </h2>
              
              <div style={{
                borderLeft: '3px solid var(--brand-fleet)',
                paddingLeft: '24px',
                marginBottom: '32px'
              }}>
                <blockquote style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '20px',
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  "Luxury is in the details—the silent engine, the perfect room temperature, and the warm, knowing smile."
                </blockquote>
              </div>
              
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                From our corporate fleets catering to multinational oil companies, to elite beachfront properties curated for attachés and travelers, we guarantee absolute discretion, security, and effortless execution.
              </p>
            </motion.div>

            {/* Right: Big, Gorgeous Asset Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', height: isMobile ? '300px' : '520px' }}
            >
              <img
                src="/star_pace_luxury_fleet_estate_1778704315807.png"
                alt="Luxury Fleet"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </motion.div>
          </div>
        </div>
      </section>


      {/* 4. Elegant Interactive Leadership Roster */}
      {teamItems.length > 0 && (
        <section style={{ padding: isMobile ? '80px 24px' : '140px 80px', background: 'transparent' }}>
          <div style={{ maxWidth: 1440, margin: '0 auto' }}>
            
            <div style={{ marginBottom: '60px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--brand-fleet)',
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                display: 'block',
                marginBottom: '12px'
              }}>
                Operations Executives
              </span>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: isMobile ? '32px' : '48px',
                fontWeight: 900,
                margin: 0
              }}>
                Meet Our Leadership
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
              gap: isMobile ? '20px' : '40px'
            }}>
              {teamItems.map((person, i) => (
                <motion.div
                  key={person.id || i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                  onClick={() => setSelectedPerson(person)}
                  whileHover={{ y: -6 }}
                >
                  <div style={{
                    width: isMobile ? '110px' : '160px',
                    height: isMobile ? '110px' : '160px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    margin: '0 auto 20px',
                    border: '3px solid var(--brand-fleet)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {person.image ? (
                      <img src={person.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={person.name} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                        <Users size={32} />
                      </div>
                    )}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                    {person.name}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    {person.role}
                  </div>
                  
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '10px',
                    fontWeight: 800,
                    color: 'var(--brand-fleet)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    View Bio &rarr;
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Vetted Team Member Bio Modal */}
      <AnimatePresence>
        {selectedPerson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPerson(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 900,
                background: 'var(--bg-secondary)',
                borderRadius: '32px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                position: 'relative',
                border: '1px solid var(--border-color)',
                boxShadow: '0 40px 90px rgba(0,0,0,0.6)'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPerson(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(6, 10, 19, 0.85)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}
              >
                &times;
              </button>

              {/* Left Side Portrait */}
              <div style={{ flex: 1, position: 'relative', minHeight: isMobile ? '240px' : '450px', background: 'rgba(6, 10, 19, 0.5)' }}>
                {selectedPerson.image ? (
                  <img
                    src={selectedPerson.image}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    alt={selectedPerson.name}
                  />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={80} style={{ color: 'var(--text-muted)' }} />
                  </div>
                )}
              </div>

              {/* Right Side Bio info */}
              <div style={{ flex: 1.2, padding: isMobile ? '32px' : '48px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '8px' }}>
                  {selectedPerson.role}
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '26px' : '36px', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 24px' }}>
                  {selectedPerson.name}
                </h3>

                <div style={{ height: '2px', width: '50px', background: 'var(--brand-fleet)', marginBottom: '24px' }} />

                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>
                  {selectedPerson.bio}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Professional Advantages Cards (BROCHURE style) */}
      <section style={{ padding: isMobile ? '80px 24px' : '140px 80px', background: 'rgba(12, 18, 32, 0.65)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--brand-fleet)',
              textTransform: 'uppercase',
              letterSpacing: '0.4em',
              display: 'block',
              marginBottom: '12px'
            }}>
              Star Pace Brochure
            </span>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? '30px' : '48px',
              fontWeight: 900,
              margin: 0
            }}>
              Why Choose The Star Pace Experience?
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '32px' }}>
            {(showAllBenefits ? [...benefits, ...extraBenefits] : benefits).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  padding: '40px',
                  borderRadius: '24px',
                  background: 'rgba(6, 10, 19, 0.45)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                whileHover={{ y: -6, borderColor: 'var(--brand-fleet)' }}
              >
                <div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: 'var(--brand-fleet)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px'
                  }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 12px' }}>
                    {item.t}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {item.d}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <button
              onClick={() => setShowAllBenefits(!showAllBenefits)}
              style={{
                background: 'transparent',
                border: '1.5px solid var(--brand-fleet)',
                color: 'var(--brand-fleet)',
                padding: '12px 36px',
                borderRadius: '99px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-fleet)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--brand-fleet)'; }}
            >
              {showAllBenefits ? "Show Less" : "Discover All Advantages"}
            </button>
          </div>
        </div>
      </section>

      {/* 7. Vetted Hospitality Services Dashboard */}
      <section style={{ padding: isMobile ? '80px 24px' : '140px 80px', background: 'transparent' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexDirection: isMobile ? 'column' : 'row', gap: '20px', marginBottom: '60px' }}>
            <div>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--brand-fleet)',
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                display: 'block',
                marginBottom: '12px'
              }}>
                Bespoke Offerings
              </span>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: isMobile ? '32px' : '48px',
                fontWeight: 900,
                margin: 0
              }}>
                Bespoke Mobility Services
              </h2>
            </div>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: 450, margin: 0, textAlign: isMobile ? 'left' : 'right', lineHeight: 1.6 }}>
              We curate high-end logistics and stays designed around your professional and leisure timelines in Ghana.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { title: "Private Chauffeur", desc: "Professional, defensive-trained drivers at your disposal for full transit safety.", icon: <Users size={22} /> },
              { title: "Airport Concierge", desc: "VIP terminal meet-and-greets ensuring seamless flight-to-fleet transfers.", icon: <Compass size={22} /> },
              { title: "Corporate Suite", desc: "Dedicated long-term luxury vehicle leases with premium insurance plans.", icon: <Shield size={22} /> },
              { title: "Event Mobility", desc: "Coordinated VIP transport for state summits, weddings, and executive galas.", icon: <Award size={22} /> }
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  padding: '36px',
                  background: 'rgba(12, 18, 32, 0.7)',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                whileHover={{ y: -5, borderColor: 'var(--brand-fleet)' }}
              >
                <div>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--brand-fleet)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid var(--border-light)' }}>
                    {s.icon}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 10px' }}>{s.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}