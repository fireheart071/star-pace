import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import Link from 'next/link'
import { Heart, CheckCircle2, MapPin, Users, Award, Shield, ArrowRight, Briefcase, GraduationCap, Scale } from 'lucide-react'

import { getTeam } from '../lib/siteContentApi'

export default function AboutPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [showAllBenefits, setShowAllBenefits] = useState(false)
  const [teamItems, setTeamItems] = useState([])
  const [selectedPerson, setSelectedPerson] = useState(null)
  
  const boardMembers = [
    {
      name: "Mr. Felix Gyekye",
      role: "Chairperson",
      bio: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span>Mr. Felix Gyekye chairs the Board of Atlas. He is a chartered accountant and banker by profession. He currently is the Chief Executive Officer(CEO) of the following companies;</span>
          <div style={{ paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {["Cardinal Petroleum", "Petrobay Ghana."].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-gold)', flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <span>He sits on the following Boards;</span>
          <div style={{ paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {["Glory Oil Ltd", "Sage Petroleum", "Quantum Terminal", "Sahel Sahara Bank"].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-gold)', flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <span>Prior to these, he worked with KPMG as an accountant/auditor and went on to work with Standard Chartered Ghana as the Chief Finance Officer (CFO) and then as Vice President, Standard Chartered USA</span>
        </div>
      ),
      icon: <Briefcase size={24} />
    },
    {
      name: "Mr. Kojo Addae-Mensah",
      role: "Member",
      bio: `Mr. Addae-Mensah was appointed as a member of the Board of Atlas Rent A Car in 2012. He is a banker by profession. He is currently the CEO of databank. He was the Chief Operating Officer (COO) at Ghana Commercial Bank ltd. He was appointed the COO in January 2012. Before his appointment he had worked diligently as the Chief Operating Officer at Barclays Bank Ghana Ltd from January 2009 to January 2012. Prior to Barclays Bank Ghana as the COO, he worked with Standard Chartered Bank in several capacities. He went to the University of Ghana, Legon. He serves on the Board of Atlas, Changing life's Endowment Fund, and Databank Balance Fund.`,
      icon: <Award size={24} />
    },
    {
      name: "Mr. Kenerick Akwasi Marfo",
      role: "A.G. Managing",
      bio: `Mr. Akwasi holds B.Sc. Degree in Biochemistry from the Kwame Nkrumah University Science and Technology, and Entrepreneurial Management Certificate from EMPRETEC. He has over ten years working experience in the transport service business, having founded Atlas-Rent-A-Car in 2003. Akwasi manages staff strength of 36 and has a hands-on approach to managing the company. He is also a director of Optimal Microfinance Ltd,a bank of Ghana licensed microfinance company.`,
      icon: <GraduationCap size={24} />
    },
    {
      name: "Mr. Joseph Bernard Ashalley",
      role: "Secretary",
      bio: `He is a Lawyer by Profession. He holdsLLB (Hons)) from the University of Buckingham England. He is a seniorassociate at Aelex Legal Practitioners & Arbitrators. He was also a senior associate at Kulendi@Law and also a Legal Assistant to Charles Allotey & Co Solicitors.`,
      icon: <Scale size={24} />
    }
  ]

  const MilestoneCard = () => (
    <div style={{
      background: 'var(--bg-secondary)',
      padding: 40,
      borderRadius: 32,
      border: '1px solid var(--border-color)',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--accent-gold)', marginBottom: 8 }}>2003</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Founded in Accra</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {[
          { t: "Elite Fleet", d: "Mitsubishi Pajero, Toyota Land Cruiser & Prado." },
          { t: "Oil & Gas Presence", d: "Strategic partners for Jubilee Fields operations." },
          { t: "24/7 Hotline", d: "Unwavering commitment to emergency assistance." }
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 16 }}>
            <div style={{ width: 4, background: 'var(--accent-gold)', borderRadius: 2 }} />
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>{item.t}</h4>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{item.d}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Decorative elements */}
      <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, border: '20px solid rgba(223, 151, 56, 0.05)', borderRadius: '50%', zIndex: 0 }} />
    </div>
  )

  const initialBenefits = [
    { col: 'span 4', icon: <Users />, t: "Wide Range of Vehicles", d: "From sleek sedans and spacious SUVs to rugged 4x4s and comfortable minivans." },
    { col: 'span 2', icon: <Award />, t: "Affordable Pricing", d: "Competitive rates with flexible rental options." },
    { col: 'span 2', icon: <CheckCircle2 />, t: "Exceptional Service", d: "Ensuring your experience is smooth and enjoyable." },
    { col: 'span 2', icon: <MapPin />, t: "Convenient Location", d: "Situated in Dansoman, we are easily accessible." },
    { col: 'span 2', icon: <Shield />, t: "Transparent Policies", d: "No hidden fees—just clear terms." }
  ]

  const extraBenefits = [
    { col: 'span 2', icon: <Shield />, t: "24/7 Roadside Assistance", d: "Support wherever your journey takes you." },
    { col: 'span 2', icon: <Users />, t: "Vetted Chauffeurs", d: "Extensively trained in executive protocol." },
    { col: 'span 2', icon: <CheckCircle2 />, t: "Seamless Digital Booking", d: "Manage reservations effortlessly online." }
  ]

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)

      // Fetch leadership data
      ; (async () => {
        const data = await getTeam()
        setTeamItems(Array.isArray(data) ? data : [])
      })()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ background: '#fcfcfd', color: '#24276F', overflowX: 'hidden' }}>

      <section style={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        minHeight: isMobile ? '60vh' : '85vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0c',
        color: '#fff',
        textAlign: 'center',
        padding: isMobile ? '0' : '100px 64px',
        overflow: 'hidden'
      }}>
        {/* background image */}
        <img
          src="/assets/ab0ut.jpeg"
          alt="Hero"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            /* push the image down more so faces are visible behind the heading */
            objectPosition: 'center center',
            zIndex: 0,
            display: 'block'
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(rgba(10, 10, 12, 0.6), rgba(15, 15, 20, 0.75))',
          zIndex: 1
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            maxWidth: 800,
            zIndex: 2,
            position: 'relative',
            padding: isMobile ? '80px 24px 40px' : '0'
          }}
        >
          <div style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(223, 151, 56, 0.15)', border: '1px solid var(--accent-gold)', borderRadius: 999, marginBottom: 24, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold)' }}>
            Our Story
          </div>
          <h1 style={{ fontSize: isMobile ? 32 : 85, fontWeight: 900, marginBottom: 16, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#fff' }}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ display: 'block' }}
            >
              Defining <span style={{ color: 'var(--accent-gold)' }}>Excellence</span>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ opacity: 0.6, fontSize: isMobile ? 18 : 60, display: 'block', marginTop: 8 }}
            >
              Since Day One
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            style={{ fontSize: isMobile ? 14 : 20, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', maxWidth: 650, margin: '0 auto' }}
          >
            Atlas Rent-a-Car is your trusted mobility partner in Dansoman. We provide reliable, high-end services tailored to your unique travel needs.
          </motion.p>
        </motion.div>
      </section>

      <section style={{
        position: 'relative',
        padding: isMobile ? '80px 24px' : '120px 64px',
        background: '#fff',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

          {/* Redesigned Asymmetric Title */}
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
                The Atlas Advantage
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
                Why Choose <br />
                <span style={{ color: 'var(--accent-gold)' }}>The Atlas Experience</span>?
              </h2>
              <p style={{
                fontSize: 18,
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: 500,
                margin: 0
              }}>
                We've redefined mobility by merging elite automotive performance with personalized concierge attention.
              </p>
            </motion.div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 32 }}>
            {(showAllBenefits ? [...initialBenefits, ...extraBenefits] : initialBenefits).map((item, i) => (
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
                  cursor: 'pointer',
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
                  {React.cloneElement(item.icon, { size: 24 })}
                </div>

                <div style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: 'var(--accent-gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  marginBottom: 12
                }}>
                  Premium Benefit
                </div>

                <h3 style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: 'var(--accent)',
                  marginBottom: 20,
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em'
                }}>
                  {item.t}
                </h3>

                <p style={{
                  fontSize: 15,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {item.d}
                </p>
              </motion.div>
            ))}
          </div>

          <div style={{ marginTop: 64, textAlign: 'center' }}>
            <button
              onClick={() => setShowAllBenefits(!showAllBenefits)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(223, 151, 56, 0.3)',
                color: 'var(--accent-gold)',
                padding: '16px 48px',
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 900,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                backdropFilter: 'blur(10px)'
              }}
              className="explore-btn"
            >
              {showAllBenefits ? "Show Less" : "Discover All Advantages"}
            </button>
          </div>
        </div>

        <style jsx>{`
            .liquid-glass-card:hover {
              border-color: var(--accent-gold);
              background: rgba(255, 255, 255, 0.6);
            }
            .liquid-glass-card:hover .glass-shine {
              opacity: 1;
              transform: rotate(45deg) translate(50%, 50%);
            }
            .liquid-glass-card:hover .icon-refraction {
              transform: scale(1.1) rotate(5deg);
              background: #fff;
              box-shadow: 0 20px 40px rgba(223, 151, 56, 0.3);
            }
            .mastery-card:hover {
              border-color: var(--accent);
              box-shadow: 0 40px 80px rgba(36, 39, 111, 0.1);
              transform: translateY(-16px);
            }
            .mastery-card:hover .card-accent-bar {
              transform: scaleX(1);
            }
            .shine-sweep {
              position: absolute;
              top: 0;
              left: -150%;
              width: 100%;
              height: 100%;
              background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.1),
                transparent
              );
              transition: 0.8s;
              z-index: 3;
              pointer-events: none;
            }
            .explore-btn:hover {
              background: var(--accent-gold);
              color: #fff;
              box-shadow: 0 20px 40px rgba(223, 151, 56, 0.3);
              border-color: var(--accent-gold);
              transform: translateY(-4px);
            }
          `}</style>
      </section>

      {/* New Section: The Atlas Narrative */}
      <section style={{ position: 'relative', padding: isMobile ? '60px 24px' : '120px 64px', background: '#fff', overflow: 'hidden' }}>
        {/* Background Watermark */}
        {!isMobile && (
          <div style={{
            position: 'absolute',
            bottom: -50,
            right: -100,
            fontSize: 280,
            fontWeight: 900,
            color: 'rgba(36, 39, 111, 0.02)',
            zIndex: 0,
            userSelect: 'none',
            whiteSpace: 'nowrap',
            fontFamily: 'Inter'
          }}>
            ATLAS
          </div>
        )}
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr', gap: isMobile ? 40 : 80, alignItems: 'flex-start' }}>

            {/* Left Column: Topic & Main Narrative */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 24 }}>The Atlas Narrative</div>
              <h2 style={{ fontSize: isMobile ? 32 : 54, fontWeight: 900, color: 'var(--accent)', marginBottom: isMobile ? 32 : 48, lineHeight: 1.1 }}>
                Over Two Decades of <br />
                <span style={{ color: 'var(--accent-gold)' }}>Pioneering</span> Mobility
              </h2>

              {/* Mobile Only Card Insertion */}
              {isMobile && (
                <div style={{ marginBottom: 40 }}>
                  <MilestoneCard />
                </div>
              )}

              <div style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <p>
                  Atlas Rent-A-Car began operations in 2003 with a team of experienced staff and a fleet of four vehicles. Over nearly 22 years, the company has focused on a vision of becoming a leading light in Ghana's car rental industry by treating the customer as king.
                </p>
                <p>
                  Their operational success is highlighted by long-term partnerships with <strong>Tullow Ghana Limited</strong> and <strong>Anadarko WTCP Company</strong>, for whom they provide 4X4 and cross-country vehicles to support operations in the Jubilee Fields. The company maintains a strong presence in the oil and gas sector and offers a 24-hour emergency assistance hotline as part of its commitment to quality service.
                </p>
                <p>
                  Strategically, Atlas operates three car ports located close to principal clients to decrease turnaround times and allow for the rapid replacement of vehicles on short notice. Their specialized fleet includes <strong>Mitsubishi Pajero, Toyota Land Cruiser, and Toyota Prado</strong> models, chosen for their reliability and off-road capabilities in the diverse terrain of Ghana and the West African sub-region.
                </p>
                {isMobile && (
                  <p>
                    Each vehicle is equipped with safety features such as anti-brake systems, high suspension capacity, and emergency kits including fire extinguishers and first aid supplies. Significant past achievements include being selected in 2008 as the transport provider for the <strong>SPORTFIVE</strong> film crew during the Confederation of African Nations Football tournament.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Right Column: Milestone Card & Supplementary Narrative (Desktop) */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                style={{ position: 'relative', paddingTop: 20 }}
              >
                <div style={{ marginBottom: 48 }}>
                  <MilestoneCard />
                </div>
                <div style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  <p>
                    Each vehicle is equipped with safety features such as anti-brake systems, high suspension capacity, and emergency kits including fire extinguishers and first aid supplies. Significant past achievements include being selected in 2008 as the transport provider for the <strong>SPORTFIVE</strong> film crew during the Confederation of African Nations Football tournament.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* New Section: Core Philosophy & Mission */}

      {/* New Section: Core Philosophy & Mission */}
      <section style={{ position: 'relative', padding: isMobile ? '80px 24px' : '160px 64px', background: '#fcfcfd', overflow: 'hidden' }}>
        {/* Decorative Floating Ring */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '10%', left: '-5%', width: 400, height: 400, border: '1px solid rgba(223, 151, 56, 0.1)', borderRadius: '50%', zIndex: 0 }}
        />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 60 : 100, alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ order: isMobile ? 2 : 1 }}
            >
              <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 24 }}>Our Core Philosophy</div>
              <h2 style={{ fontSize: isMobile ? 32 : 54, fontWeight: 900, color: 'var(--accent)', marginBottom: 32, lineHeight: 1.1 }}>
                A Commitment to <span style={{ color: 'var(--accent-gold)' }}>Uncompromising</span> Quality
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {[
                  { title: "Safety First", desc: "Every vehicle in our fleet undergoes a rigorous 120-point inspection before every rental to ensure your peace of mind." },
                  { title: "Elite Service", desc: "We don't just rent cars; we provide a concierge-level experience tailored to your specific travel requirements." },
                  { title: "Local Heritage", desc: "Proudly based in Dansoman, we understand the local landscape and provide insights that only a neighbor can." }
                ].map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    style={{ display: 'flex', gap: 20 }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fff', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                      <CheckCircle2 size={20} color="var(--accent-gold)" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>{v.title}</h4>
                      <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ order: isMobile ? 1 : 2, position: 'relative' }}
            >
              <div style={{ position: 'absolute', top: -30, right: -30, width: 200, height: 200, border: '40px solid rgba(223, 151, 56, 0.05)', borderRadius: '50%', zIndex: 0 }} />
              <img
                src="assets/transparent.jpg"
                style={{ width: '100%', borderRadius: 32, boxShadow: '0 40px 80px rgba(36, 39, 111, 0.15)', position: 'relative', zIndex: 1 }}
                alt="Luxury Interior"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section style={{
        position: 'relative',
        padding: isMobile ? '80px 24px' : '120px 64px',
        backgroundColor: '#fff',
        color: 'var(--text-primary)',
        overflow: 'hidden'
      }}>
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
                Technical Mastery
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
                The Science of <br />
                <span style={{ color: 'var(--accent-gold)' }}>Maintenance</span>
              </h2>
              <p style={{
                fontSize: 18,
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: 700,
                margin: 0
              }}>
                Our vehicles are precision-engineered assets, maintained by elite master technicians to ensure every engine purrs and every interior remains pristine.
              </p>
            </motion.div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { t: "Meticulous Detailing", d: "A multi-stage cleaning process that restores each vehicle to showroom condition after every journey.", icon: <Heart size={24} /> },
              { t: "Performance Testing", d: "Advanced diagnostic checks to ensure optimal braking, suspension, and engine performance at all times.", icon: <Shield size={24} /> },
              { t: "Premium Amenities", d: "We equip our premium collection with complimentary WiFi, refreshments, and modern climate controls.", icon: <Award size={24} /> }
            ].map((item, i) => (
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
                  cursor: 'pointer',
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
                  {item.icon}
                </div>

                <div style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: 'var(--accent-gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  marginBottom: 12
                }}>
                  Excellence Standard
                </div>

                <h3 style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: 'var(--accent)',
                  marginBottom: 20,
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em'
                }}>
                  {item.t}
                </h3>

                <p style={{
                  fontSize: 15,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {item.d}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Atlas Board Section - Timeless Minimalist Design */}
      <section style={{ 
        padding: isMobile ? '80px 24px' : '140px 64px', 
        background: '#fff', 
        color: 'var(--accent)', 
        position: 'relative'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'flex-end',
            marginBottom: isMobile ? 64 : 100,
            gap: 32,
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: isMobile ? 32 : 48
          }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span style={{ 
                fontSize: 11, 
                fontWeight: 900, 
                color: 'var(--accent-gold)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.4em',
                display: 'block',
                marginBottom: 16
              }}>
                Strategic Leadership
              </span>
              <h2 style={{ 
                fontFamily: "'Playfair Display', serif",
                fontSize: isMobile ? 42 : 72, 
                fontWeight: 900, 
                color: 'var(--accent)',
                margin: 0,
                lineHeight: 1
              }}>
                The Atlas <span style={{ color: 'var(--accent-gold)' }}>Board</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ 
                maxWidth: isMobile ? 'none' : 500,
                textAlign: isMobile ? 'left' : 'right',
                position: 'relative'
              }}
            >
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <p style={{ 
                  fontSize: isMobile ? 18 : 22, 
                  color: 'var(--accent)', 
                  fontStyle: 'italic',
                  lineHeight: 1.4,
                  margin: 0,
                  fontFamily: "'Playfair Display', serif"
                }}>
                  The Board of Directors is made up of the following experienced individuals:
                </p>
                {!isMobile && (
                  <div style={{ 
                    position: 'absolute', 
                    bottom: -12, 
                    right: 0, 
                    width: '60px', 
                    height: 2, 
                    background: 'var(--accent-gold)' 
                  }} />
                )}
              </div>
            </motion.div>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Timeline Line with Drawing Animation */}
            <motion.div 
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ 
                position: 'absolute', 
                left: 32, 
                top: 0, 
                bottom: 0, 
                width: 1, 
                background: 'linear-gradient(to bottom, var(--accent-gold), #f1f5f9)',
                originY: 0,
                zIndex: 1
              }} 
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 64 : 80 }}>
              {boardMembers.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.2, duration: 0.8, ease: "easeOut" }}
                  style={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 24 : 60,
                    position: 'relative'
                  }}
                >
                  {/* Icon and Connector with Hover Effect */}
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    style={{ 
                      flex: isMobile ? 'none' : '0 0 64px',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    <div style={{ 
                      width: 64, 
                      height: 64, 
                      borderRadius: '50%', 
                      background: '#fff', 
                      border: '2px solid var(--accent-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-gold)',
                      boxShadow: '0 10px 20px rgba(223, 151, 56, 0.1)',
                      cursor: 'pointer'
                    }}>
                      {member.icon}
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div style={{ 
                    flex: 1, 
                    paddingTop: isMobile ? 0 : 12,
                    paddingLeft: isMobile ? 64 : 0 
                  }}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i * 0.2) + 0.3 }}
                    >
                      <div style={{ 
                        fontSize: 11, 
                        fontWeight: 900, 
                        color: 'var(--accent-gold)', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.2em', 
                        marginBottom: 8 
                      }}>
                        {member.role}
                      </div>
                      <h3 style={{ 
                        fontSize: isMobile ? 24 : 32, 
                        fontWeight: 900, 
                        color: 'var(--accent)', 
                        marginBottom: 24,
                        fontFamily: "'Playfair Display', serif"
                      }}>
                        {member.name}
                      </h3>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ 
                        y: -8,
                        boxShadow: '0 20px 40px rgba(36, 39, 111, 0.05)',
                        borderColor: 'var(--accent-gold)'
                      }}
                      style={{ 
                        background: '#fcfcfd',
                        padding: isMobile ? '24px' : '40px',
                        borderRadius: 24,
                        border: '1px solid #f1f5f9',
                        color: 'var(--text-secondary)',
                        fontSize: 16,
                        lineHeight: 1.8,
                        transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        cursor: 'pointer'
                      }} 
                      className="board-profile-box"
                    >
                      {member.bio}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <style jsx>{`
          .board-profile-box:hover {
            border-color: var(--accent-gold);
            background: #fff;
            box-shadow: 0 20px 40px rgba(0,0,0,0.03);
          }
        `}</style>
      </section>

      {/* The Team Section - Interactive Modal Redesign */}
      {teamItems.length > 0 && (
        <section style={{ padding: isMobile ? '80px 24px' : '120px 64px', background: '#fff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ marginBottom: 64 }}
            >
              <h2 style={{ fontSize: isMobile ? 32 : 48, fontWeight: 900, color: '#1a1b1e', marginBottom: 16 }}>Meet Our <span style={{ color: 'var(--accent-gold)' }}>Leadership</span></h2>
              <p style={{ color: '#64748b', fontSize: 16 }}>The experts ensuring your safe and seamless travel.</p>
            </motion.div>

            <div className="leadership-grid">
              {teamItems.map((person, i) => (
                <motion.div
                  key={person.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="leadership-card"
                  style={{ textAlign: isMobile ? 'center' : 'left', cursor: 'pointer' }}
                  onClick={() => setSelectedPerson(person)}
                >
                  <div className="portrait-container">
                    {person.image ? (
                      <img src={person.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={person.name} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                        <Users size={48} strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a1b1e', marginBottom: 4, textAlign: isMobile ? 'center' : 'left' }}>{person.name}</h3>
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16, textAlign: isMobile ? 'center' : 'left' }}>{person.role}</div>
                  <div className="see-info-btn">
                    See Info <ArrowRight size={12} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <style jsx>{`
              .leadership-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 48px;
                row-gap: 48px;
              }
              .leadership-card {
                text-align: left;
                cursor: pointer;
              }
              .portrait-container {
                width: 140px;
                height: 140px;
                border-radius: 50%;
                overflow: hidden;
                margin: 0 0 20px;
                background: #f8fafc;
                border: 1px solid #f1f5f9;
              }
              .see-info-btn {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: 8px;
                fontSize: 11px;
                font-weight: 800;
                color: #999;
                text-transform: uppercase;
                letter-spacing: 0.1em;
              }
              @media (max-width: 768px) {
                .leadership-grid {
                  grid-template-columns: repeat(2, 1fr);
                  gap: 16px;
                  row-gap: 32px;
                }
                .leadership-card {
                  text-align: center;
                }
                .portrait-container {
                  width: 100px;
                  height: 100px;
                  margin: 0 auto 16px;
                }
                .see-info-btn {
                  justify-content: center;
                  font-size: 9px !important;
                  opacity: 0.8;
                }
                .leadership-card h3 {
                  font-size: 15px !important;
                }
                .leadership-card div:nth-child(3) {
                  font-size: 11px !important;
                }
              }
            `}</style>
        </section>
      )}

      {/* Bio Modal */}
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
              background: 'rgba(10, 10, 12, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 1000,
                background: '#fff',
                borderRadius: 32,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                position: 'relative',
                boxShadow: '0 50px 100px rgba(0,0,0,0.5)'
              }}
            >
              <button
                onClick={() => setSelectedPerson(null)}
                style={{ position: 'absolute', top: 24, right: 24, background: '#f8fafc', border: 'none', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
              >
                <Users size={20} style={{ transform: 'rotate(45deg)' }} />
              </button>

              <div style={{ flex: 1, position: 'relative', minHeight: isMobile ? 300 : 600, background: '#f8fafc' }}>
                {selectedPerson.image ? (
                  <img
                    src={selectedPerson.image}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    alt={selectedPerson.name}
                  />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={120} strokeWidth={1} style={{ color: '#cbd5e1' }} />
                  </div>
                )}
              </div>

              <div style={{ flex: 1.2, padding: isMobile ? 32 : 64, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 900, color: '#1a1b1e', marginBottom: 8 }}>{selectedPerson.name}</h3>
                <div style={{ fontSize: 16, color: '#64748b', marginBottom: 40 }}>{selectedPerson.role}</div>

                <div style={{ height: 1, width: 60, background: 'var(--accent-gold)', marginBottom: 32 }} />

                <p style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.8, margin: 0 }}>
                  {selectedPerson.bio}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Section: Bespoke Mobility Services */}
      <section style={{ padding: isMobile ? '60px 24px' : '120px 64px 60px', background: '#fcfcfd' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'flex-end',
              gap: 32,
              marginBottom: isMobile ? 40 : 80
            }}
          >
            <div style={{ maxWidth: 600 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 16 }}>Tailored Services</div>
              <h2 style={{ fontSize: isMobile ? 32 : 54, fontWeight: 900, color: 'var(--accent)', margin: 0, lineHeight: 1.1 }}>Elevating Every <br /><span style={{ color: 'var(--accent-gold)' }}>Interaction</span></h2>
            </div>
            <p style={{ maxWidth: 400, color: '#64748b', fontSize: 15, lineHeight: 1.8, marginBottom: 8 }}>
              Beyond standard rentals, we curate mobility solutions that align with the pace of your lifestyle and business requirements.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { title: "Private Chauffeur", desc: "Professional, discreet drivers trained in executive protocol for your safe transit.", icon: <Users size={24} /> },
              { title: "Airport Concierge", desc: "Meet-and-greet services at the terminal for a seamless transition to your vehicle.", icon: <MapPin size={24} /> },
              { title: "Corporate Suite", desc: "Tailored long-term leasing options for businesses requiring a dedicated fleet.", icon: <Shield size={24} /> },
              { title: "Event Mobility", desc: "Coordinated transportation management for high-profile weddings and corporate summits.", icon: <Award size={24} /> }
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                style={{
                  padding: '40px 32px',
                  background: '#fff',
                  borderRadius: 24,
                  border: '1px solid #f1f5f9',
                  transition: '0.4s ease',
                  cursor: 'default',
                }} className="service-card">
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(36, 39, 111, 0.03)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  {s.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a1b1e', marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <style jsx>{`
              .service-card:hover {
                 box-shadow: 0 30px 60px rgba(36, 39, 111, 0.08);
                 border-color: rgba(223, 151, 56, 0.2);
              }
           `}</style>
      </section>

      {/* Strategic Ecosystem & Memberships */}
      <section style={{ padding: isMobile ? '40px 24px 80px' : '60px 64px 120px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Strategic Partners Section */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 24 }}>Our Strategic Ecosystem</div>
            <h2 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 900, color: 'var(--accent)', marginBottom: 48 }}>Elite Partners & Clients</h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: isMobile ? 24 : 48, marginBottom: 80 }}>
              {[
                "Ghana Tourism Authority",
                "Enterprise Insurance",
                "Shell Ghana",
                "Kotoka International Airport",
                "GCRA",
                "ATLAS",
                "Various Diplomats",
                "High Net Worth Individuals"
              ].map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  style={{
                    fontSize: isMobile ? 12 : 14,
                    fontWeight: 800,
                    color: 'var(--accent)',
                    padding: '12px 24px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 12,
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {p}
                </motion.div>
              ))}
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>Third Party Fleet Agreements</div>
              <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
                Atlas Rent-A-Car also provides vehicles to the following companies based on professional third-party agreements:
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
                gap: 16,
                textAlign: 'left'
              }}>
                {[
                  "Pergah Transport",
                  "Ghana Limited",
                  "Conship Ghana Ltd",
                  "Technip",
                  "1st Star Car Rentals",
                  "J'S Car Rentals",
                  "Nageo Car Rentals",
                  "Worldlink Car Rentals",
                  "Jobesh Car Rentals",
                  "Hertz Car Rentals",
                  "Avis Car Rentals"
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-gold)' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Memberships & Licensing */}
          <div style={{
            marginTop: 100,
            padding: '40px',
            background: '#f8fafc',
            borderRadius: 32,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 32
          }}>
            <div style={{ maxWidth: isMobile ? '100%' : '50%' }}>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)', marginBottom: 12 }}>Strategic Memberships</h4>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                Our leadership is deeply integrated into the national transport ecosystem, with our CEO serving as the <strong>Vice President of the Ghana Car Rental Association (GCRA)</strong>.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { name: "GCRA Member", icon: <Shield size={18} /> },
                { name: "GTA Licensed", icon: <MapPin size={18} /> },
                { name: "ISO Standards", icon: <Award size={18} /> }
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                  <div style={{ color: 'var(--accent-gold)' }}>{m.icon}</div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1b1e' }}>{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>
    </div>
  )
}