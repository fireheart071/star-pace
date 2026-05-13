import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import { Search, Phone, Mail, ChevronDown, HelpCircle } from 'lucide-react'

const FAQ_DATA = [
  { q: "What happens if I return the car late?", a: "Late returns may incur additional charges. Please notify us in advance if you need to extend your rental." },
  { q: "Where can I pick up and drop off the car?", a: "You can pick up and drop off the car at our office or choose a delivery option for an additional fee." },
  { q: "Can I return the car to a different location?", a: "One-way rentals are available for an additional fee. Contact us for details." },
  { q: "What types of cars do you offer for rent?", a: "We offer a wide range of vehicles, including sedans, SUVs, vans, and luxury cars. Check our fleet page for details." },
  { q: "How do I make a reservation?", a: "You can book online through our website, via phone, or in person at our office." },
  { q: "Can I modify or cancel my reservation?", a: "Yes, you can modify or cancel your reservation online or by contacting our customer service team." },
  { q: "Is there a minimum rental period?", a: "The minimum rental period is 24 hours. Longer rentals may qualify for discounts." },
  { q: "Do you offer long-term rentals?", a: "Yes, we offer discounts for long-term rentals. Contact us for more details." },
  { q: "What is included in the rental price?", a: "The rental price includes the base rate, taxes, and standard insurance. Additional fees may apply for extras like GPS or child seats." },
  { q: "Are there any hidden fees?", a: "No, all fees are transparent and listed during the booking process." },
  { q: "What payment methods do you accept?", a: "We accept card payments, Momo and bank transfers." },
  { q: "Do you offer discounts or promotions?", a: "Yes, we regularly offer discounts and promotions. Check our website or subscribe to our newsletter for updates." },
  { q: "Can I drive the rental car outside the city or country?", a: "Yes, but additional fees or restrictions may apply. Contact us for details." },
  { q: "What should I do in case of an accident or breakdown?", a: "In case of an accident or breakdown, contact our emergency hotline immediately. We’ll assist you with the next steps." },
  { q: "Is there a mileage limit?", a: "Most rentals include unlimited mileage. Check your rental agreement for details." },
  { q: "Can I drive myself?", a: "Yes, but only with certain cars, other cars require a driver. Contact us for more information." },
  { q: "How can I contact customer support?", a: "You can reach us by phone, email, or through the contact form on our website. Our support team is available 24/7." },
  { q: "Can I rent a car for a special event?", a: "Yes, we offer special rates for events like weddings, corporate functions, and more. Contact us for details." }
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
          <ChevronDown size={20} color="var(--accent-gold)" />
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
      <div style={{ background: '#fff', minHeight: '100vh' }}>
        
        {/* Header Section */}
        <section style={{ padding: isMobile ? '100px 20px 40px' : '160px 64px 80px', background: '#f8fafc' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'flex-start', gap: isMobile ? 20 : 40, marginBottom: isMobile ? 32 : 48 }}>
              <div style={{ width: 4, height: isMobile ? 40 : 80, background: 'var(--accent-gold)' }} />
              <div>
                <div style={{ fontSize: isMobile ? 11 : 13, fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 12 }}>Atlas Help Center</div>
                <h1 style={{ fontSize: isMobile ? 32 : 64, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                  Frequently Asked <br/> <span style={{ color: 'var(--accent-gold)' }}>Questions</span>.
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
                 background: '#fff', 
                 padding: isMobile ? '40px 0 0' : '40px 0', 
                 position: isMobile ? 'relative' : 'sticky', 
                 top: 120,
                 borderTop: '4px solid var(--accent-gold)'
               }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 16 }}>Official Support</div>
                  <h3 style={{ fontSize: isMobile ? 22 : 24, fontWeight: 900, color: 'var(--accent)', marginBottom: 16, letterSpacing: '-0.02em' }}>Need Personal Assistance?</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 32, borderLeft: '2px solid #f1f5f9', paddingLeft: 20 }}>
                     Contact us if you need help with anything. Our team is standing by.
                  </p>
                  
                  <div style={{ display: 'grid', gap: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <Phone size={18} color="var(--accent-gold)" />
                      <div>
                        <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.1em', marginBottom: 2 }}>Call Us</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>+233 30 230 1081</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 0' }}>
                      <Mail size={18} color="var(--accent-gold)" />
                      <div>
                        <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.1em', marginBottom: 2 }}>Email Support</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>contact@atlasrent-a-car.com</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 32, padding: 24, background: '#f8fafc', borderRadius: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>Available 24/7</div>
                    <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.6 }}>Our executive support team is standing by to ensure your journey is seamless.</p>
                  </div>
               </div>
            </aside>

          </div>
        </section>

      </div>
    </Layout>
  )
}
