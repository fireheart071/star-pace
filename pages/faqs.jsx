import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import Link from 'next/link'
import { Search, Phone, Mail, ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react'

const FAQ_DATA = [
  { q: "How do I make a reservation for a car or a stay?", a: "You can book directly through our website, or contact our elite concierge team via phone or email for a personalized booking experience." },
  { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, Mobile Money (Momo), and bank transfers for your convenience." },
  { q: "Can I modify or cancel my booking?", a: "Yes, modifications and cancellations are possible. Please refer to your specific booking terms or contact support for assistance with your changes." },
  { q: "Do you require a security deposit?", a: "A refundable security deposit is required for both vehicle rentals and property stays. This is processed at the time of booking and released upon successful return/check-out." },
  { q: "Do you offer self-drive options?", a: "Yes, self-drive is available for select vehicles in our fleet. Other premium vehicles may require a Star Pace certified chauffeur for your safety and comfort." },
  { q: "What are the requirements for renting a vehicle?", a: "You must be at least 21 years old, possess a valid driver's license, and provide a valid form of identification. International drivers may need an International Driving Permit." },
  { q: "Do you offer vehicle delivery and pickup?", a: "Yes. We can deliver your vehicle to your home, office, or directly to the airport. Fees may apply depending on the location." },
  { q: "What is your fuel policy?", a: "Our vehicles are delivered with a full tank of fuel. We ask that they are returned full. A refueling fee applies if the vehicle is returned with less than a full tank." },
  { q: "Can I drive the car outside of the city or country?", a: "Inter-city travel within Ghana is permitted. However, cross-border travel into neighboring countries requires prior written authorization and additional insurance coverage." },
  { q: "Can I rent a car for a special event or wedding?", a: "Absolutely. We specialize in luxury event logistics. Contact us for bespoke packages including decorated wedding cars and professional chauffeur service." },
  { q: "What are the standard check-in and check-out times?", a: "Standard check-in is at 2:00 PM and check-out is at 11:00 AM. Early check-in or late check-out can be arranged based on availability." },
  { q: "Are your stays fully furnished and serviced?", a: "Yes, all Star Pace Stays are fully furnished to elite standards and include regular housekeeping, high-speed Wi-Fi, and 24/7 security." },
  { q: "What is your policy on guests and parties?", a: "Our properties are designed for serene living. While visitors are welcome, large parties and loud events are strictly prohibited to respect the privacy of our neighbors." },
  { q: "Are pets allowed in your properties?", a: "We love animals, but to maintain the highest hygiene standards for all guests, pets are generally not allowed unless specifically stated for a 'pet-friendly' property." },
  { q: "Is smoking permitted inside the residences?", a: "All Star Pace Stays are strictly non-smoking. Guests may smoke in designated outdoor areas only." },
  { q: "Do the properties have backup power and water?", a: "Sustainability and comfort are key. All our properties are equipped with backup generators and water storage systems to ensure an uninterrupted experience." },
  { q: "Can I book a stay and a car rental together?", a: "Yes, we highly recommend our 'Stay & Drive' packages. Booking both together entitles you to exclusive concierge benefits and a seamless transition from airport to home." },
  { q: "Do you offer airport meet-and-greet services?", a: "Yes. For our elite clients, we offer a full meet-and-greet service where our chauffeur will meet you at the arrivals hall and assist with your luggage." },
  { q: "How do I reach the concierge in case of an emergency?", a: "Our elite support team is available 24/7. You can reach us via the emergency hotline provided in your booking confirmation or through our WhatsApp support." }
]

function Accordion({ question, answer, isOpen, onClick }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border-color)', overflow: 'hidden' }}>
      <button 
        onClick={onClick}
        style={{ 
          width: '100%', 
          padding: '24px 0', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <span style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '18px', 
          fontWeight: 900, 
          color: 'var(--text-primary)', 
          paddingRight: '20px',
          transition: 'color 0.3s'
        }}
        className="faq-q-text"
        >
          {question}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={18} color="var(--brand-fleet)" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ paddingBottom: '24px', margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '15px' }}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        button:hover .faq-q-text {
          color: var(--brand-fleet) !important;
        }
      `}</style>
    </div>
  )
}

export default function FAQPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [search, setSearch] = useState('')
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const filteredFaqs = FAQ_DATA.filter(f => 
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '120px' }}>
        
        {/* Editorial Title Header */}
        <section style={{ padding: isMobile ? '120px 24px 60px' : '160px 80px 80px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            
            <div style={{ display: 'flex', gap: isMobile ? '20px' : '32px', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left', marginBottom: '40px' }}>
              <div style={{ width: isMobile ? '60px' : '4px', height: isMobile ? '4px' : '80px', background: 'var(--brand-fleet)' }} />
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', letterSpacing: '0.4em', display: 'block', marginBottom: '12px' }}>
                  Star Pace Help Center
                </span>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '32px' : '64px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
                  Frequently Asked <br/> <span style={{ color: 'var(--brand-fleet)' }}>Questions.</span>
                </h1>
              </div>
            </div>
            
            {/* Search input floating box */}
            <div style={{ position: 'relative', maxWidth: 640 }}>
              <Search style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-fleet)', opacity: 0.6 }} size={18} />
              <input 
                type="text" 
                placeholder="Search for answers, booking requirements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '18px 24px 18px 60px', 
                  borderRadius: '99px', 
                  border: '1.5px solid var(--border-color)', 
                  background: '#ffffff',
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-sm)',
                  outline: 'none',
                  transition: 'all 0.3s'
                }} 
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--brand-fleet)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                }}
              />
            </div>
          </div>
        </section>

        {/* Accordions and Sidebar Grid */}
        <section style={{ padding: isMobile ? '48px 20px' : '80px 80px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2.5fr 1fr', gap: '80px' }}>
            
            {/* Main FAQ Board Accordion */}
            <div>
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, i) => (
                  <Accordion 
                    key={i} 
                    question={faq.q} 
                    answer={faq.a} 
                    isOpen={openIndex === i}
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                  <HelpCircle size={40} style={{ color: 'var(--brand-fleet)', marginBottom: '16px', opacity: 0.6 }} />
                  <h3 style={{ fontSize: '20px', fontFamily: "'Playfair Display', serif", fontWeight: 900, color: 'var(--text-primary)' }}>No matches found</h3>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>Please try search keywords like "fuel", "deposit" or "self-drive".</p>
                </div>
              )}
            </div>

            {/* Sticky Elite Concierge support sidebar */}
            <aside>
              <div style={{ 
                background: '#ffffff', 
                padding: '40px 32px', 
                position: isMobile ? 'relative' : 'sticky', 
                top: '120px',
                borderRadius: '24px',
                border: '1.5px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden'
              }}>
                {/* Gold Highlight Tag */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--brand-fleet)' }} />

                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', letterSpacing: '0.3em', display: 'block', marginBottom: '12px' }}>
                  Elite Concierge
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.2 }}>
                  Personalized Support
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>
                  At Star Pace, service is our core foundation. Our local team is ready to curate your logistics.
                </p>
                
                <div style={{ display: 'grid', gap: '24px' }}>
                  {/* Phone Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(127, 29, 29, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(127, 29, 29, 0.1)' }}>
                      <Phone size={16} color="var(--brand-fleet)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '2px' }}>Call Us Directly</div>
                      <a href="tel:+233302301081" style={{ fontSize: '15px', fontWeight: 900, color: 'var(--text-primary)', textDecoration: 'none', transition: 'color 0.3s' }}
                         onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-fleet)'}
                         onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                        +233 30 230 1081
                      </a>
                    </div>
                  </div>

                  {/* Mail Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(127, 29, 29, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(127, 29, 29, 0.1)' }}>
                      <Mail size={16} color="var(--brand-fleet)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '2px' }}>Digital Inquiry</div>
                      <a href="mailto:contact@starpaceghana.com" style={{ fontSize: '14px', fontWeight: 900, color: 'var(--text-primary)', textDecoration: 'none', transition: 'color 0.3s' }}
                         onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-fleet)'}
                         onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                        contact@starpaceghana.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* 24/7 SLA Banner */}
                <div style={{ marginTop: '40px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '8px' }}>
                    <ShieldCheck size={16} color="#10b981" />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Active Dispatch
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    Our luxury support fleet and hosts are available 24 hours a day, unconditional.
                  </p>
                </div>

                {/* Aesthetic Inquire CTA */}
                <Link href="/contact" style={{ textDecoration: 'none' }}>
                  <button 
                    style={{ 
                      width: '100%', 
                      marginTop: '24px', 
                      padding: '14px', 
                      borderRadius: '12px', 
                      fontSize: '12px', 
                      fontWeight: 800, 
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      border: '1.5px solid var(--brand-fleet)',
                      background: 'transparent',
                      color: 'var(--brand-fleet)',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-fleet)'; e.currentTarget.style.color = '#ffffff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--brand-fleet)'; }}
                  >
                    Inquire Online
                  </button>
                </Link>
              </div>
            </aside>

          </div>
        </section>

      </div>
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  )
}
