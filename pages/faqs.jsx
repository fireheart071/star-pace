import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import { Search, Phone, Mail, ChevronDown, HelpCircle } from 'lucide-react'

const FAQ_DATA = [
  // General & Booking
  { q: "How do I make a reservation for a car or a stay?", a: "You can book directly through our website, or contact our elite concierge team via phone or email for a personalized booking experience." },
  { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, Mobile Money (Momo), and bank transfers for your convenience." },
  { q: "Can I modify or cancel my booking?", a: "Yes, modifications and cancellations are possible. Please refer to your specific booking terms or contact support for assistance with your changes." },
  { q: "Do you require a security deposit?", a: "A refundable security deposit is required for both vehicle rentals and property stays. This is processed at the time of booking and released upon successful return/check-out." },
  
  // Fleet (Car Rentals)
  { q: "Do you offer self-drive options?", a: "Yes, self-drive is available for select vehicles in our fleet. Other premium vehicles may require a Star Pace certified chauffeur for your safety and comfort." },
  { q: "What are the requirements for renting a vehicle?", a: "You must be at least 21 years old, possess a valid driver's license, and provide a valid form of identification. International drivers may need an International Driving Permit." },
  { q: "Do you offer vehicle delivery and pickup?", a: "Yes. We can deliver your vehicle to your home, office, or directly to the airport. Fees may apply depending on the location." },
  { q: "What is your fuel policy?", a: "Our vehicles are delivered with a full tank of fuel. We ask that they are returned full. A refueling fee applies if the vehicle is returned with less than a full tank." },
  { q: "Can I drive the car outside of the city or country?", a: "Inter-city travel within Ghana is permitted. However, cross-border travel into neighboring countries requires prior written authorization and additional insurance coverage." },
  { q: "Can I rent a car for a special event or wedding?", a: "Absolutely. We specialize in luxury event logistics. Contact us for bespoke packages including decorated wedding cars and professional chauffeur service." },

  // Stays (Airbnb/Accommodations)
  { q: "What are the standard check-in and check-out times?", a: "Standard check-in is at 2:00 PM and check-out is at 11:00 AM. Early check-in or late check-out can be arranged based on availability." },
  { q: "Are your stays fully furnished and serviced?", a: "Yes, all Star Pace Stays are fully furnished to elite standards and include regular housekeeping, high-speed Wi-Fi, and 24/7 security." },
  { q: "What is your policy on guests and parties?", a: "Our properties are designed for serene living. While visitors are welcome, large parties and loud events are strictly prohibited to respect the privacy of our neighbors." },
  { q: "Are pets allowed in your properties?", a: "We love animals, but to maintain the highest hygiene standards for all guests, pets are generally not allowed unless specifically stated for a 'pet-friendly' property." },
  { q: "Is smoking permitted inside the residences?", a: "All Star Pace Stays are strictly non-smoking. Guests may smoke in designated outdoor areas only." },
  { q: "Do the properties have backup power and water?", a: "Sustainability and comfort are key. All our properties are equipped with backup generators and water storage systems to ensure an uninterrupted experience." },
  { q: "Can I book a stay and a car rental together?", a: "Yes, we highly recommend our 'Stay & Drive' packages. Booking both together entitles you to exclusive concierge benefits and a seamless transition from airport to home." },
  
  // Support
  { q: "Do you offer airport meet-and-greet services?", a: "Yes. For our elite clients, we offer a full meet-and-greet service where our chauffeur will meet you at the arrivals hall and assist with your luggage." },
  { q: "How do I reach the concierge in case of an emergency?", a: "Our elite support team is available 24/7. You can reach us via the emergency hotline provided in your booking confirmation or through our WhatsApp support." }
]

function Accordion({ question, answer, isOpen, onClick }) {
  return (
    <div style={{ borderBottom: '1px solid #f1f5f9', overflow: 'hidden' }}>
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
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)', paddingRight: 20 }}>{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={20} color="var(--accent)" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ paddingBottom: 24, margin: 0, color: '#64748b', lineHeight: 1.7, fontSize: 15 }}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
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
    f.q.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
        
        {/* Header Section */}
        <section style={{ padding: isMobile ? '100px 20px 40px' : '160px 64px 80px', background: 'var(--bg-secondary)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'flex-start', gap: isMobile ? 20 : 40, marginBottom: isMobile ? 32 : 48 }}>
              <div style={{ width: 4, height: isMobile ? 40 : 80, background: 'var(--accent)' }} />
              <div>
                <div style={{ fontSize: isMobile ? 11 : 13, fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 12 }}>Star Pace Help Center</div>
                <h1 style={{ fontSize: isMobile ? 32 : 64, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                  Frequently Asked <br/> <span style={{ color: 'var(--accent)' }}>Questions</span>.
                </h1>
              </div>
            </div>
            
            {/* Search Bar */}
            <div style={{ position: 'relative', maxWidth: 650 }}>
               <Search style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
               <input 
                 type="text" 
                 placeholder="Search for answers..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 style={{ 
                   width: '100%', 
                   padding: isMobile ? '16px 20px 16px 56px' : '20px 24px 20px 64px', 
                   borderRadius: 999, 
                   border: '1px solid #e2e8f0', 
                   background: '#fff',
                   fontSize: isMobile ? 15 : 16,
                   boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                   outline: 'none'
                 }} 
               />
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section style={{ padding: isMobile ? '40px 20px' : '100px 64px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2.5fr 1fr', gap: isMobile ? 60 : 80 }}>
            
            {/* FAQ List */}
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
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
                  <HelpCircle size={32} style={{ marginBottom: 16, opacity: 0.5 }} />
                  <p style={{ fontSize: 14 }}>No matching questions found.</p>
                </div>
              )}
            </div>

            {/* Support Sidebar */}
            <aside>
               <div style={{ 
                 background: 'var(--bg-primary)', 
                 padding: isMobile ? '40px 24px' : '48px 32px', 
                 position: isMobile ? 'relative' : 'sticky', 
                 top: 120,
                 borderRadius: 32,
                 border: '1px solid var(--border-color)',
                 boxShadow: 'var(--shadow-sm)',
                 overflow: 'hidden'
               }}>
                  {/* Decorative Accent */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'var(--accent)' }} />

                  <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 16 }}>Elite Concierge</div>
                  <h3 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, color: 'var(--accent)', marginBottom: 16, letterSpacing: '-0.03em', lineHeight: 1.2 }}>Personalized Assistance</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40 }}>
                     At Star Pace, hospitality is our heartbeat. Our concierge team is ready to curate your perfect journey.
                  </p>
                  
                  <div style={{ display: 'grid', gap: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(127, 29, 29, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(127, 29, 29, 0.1)' }}>
                        <Phone size={18} color="var(--accent)" />
                      </div>
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.12em', marginBottom: 2 }}>Call Us Directly</div>
                        <a href="tel:+233302301081" style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)', textDecoration: 'none' }}>+233 30 230 1081</a>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(127, 29, 29, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(127, 29, 29, 0.1)' }}>
                        <Mail size={18} color="var(--accent)" />
                      </div>
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.12em', marginBottom: 2 }}>Digital Inquiry</div>
                        <a href="mailto:contact@starpaceghana.com" style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)', textDecoration: 'none' }}>contact@starpaceghana.com</a>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 48, padding: 24, background: 'var(--bg-secondary)', borderRadius: 24, border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                      <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Available 24/7</div>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>Our executive support team is standing by unconditionally to ensure your journey is seamless.</p>
                  </div>

                  {/* Aesthetic Footer Link */}
                  <button className="btn-outline" style={{ width: '100%', marginTop: 24, padding: '14px', borderRadius: 16, fontSize: 13, fontWeight: 700 }}>
                    Inquire Online
                  </button>
               </div>
            </aside>

          </div>
        </section>

      </div>
    </Layout>
  )
}
