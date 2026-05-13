import React from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { saveOrder as saveRental } from '../../lib/orders'
import { getVehicles } from '../../lib/vehiclesApi'
import CldOptimizedImage from '../../components/CldOptimizedImage'
import Layout from '../../components/Layout'
import { Calendar, MapPin, ChevronLeft, Shield, Clock, CreditCard, CheckCircle, Info, ArrowRight, Star, Anchor, User, Mail, Phone, MessageSquare } from 'lucide-react'

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
}

export default function RentalPage() {
  const router = useRouter()
  const { id } = router.query || {}
  const navigate = (to) => {
    if (typeof to === 'number') return router.back()
    return router.push(to)
  }

  const [vehicles, setVehicles] = React.useState([])
  const [vehiclesLoading, setVehiclesLoading] = React.useState(true)
  const [form, setForm] = React.useState({ 
    name: '', 
    email: '', 
    phone: '', 
    start: '', 
    end: '', 
    location: '', 
    addChauffeur: false,
    paymentMethod: 'Pay on Delivery',
    note: '' 
  })
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [rentalSuccess, setRentalSuccess] = React.useState(null)
  const [selectedImage, setSelectedImage] = React.useState(0)
  const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' && window.innerWidth <= 768)

  const model = vehicles.find(m => String(m.id) === String(id))

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await getVehicles()
      if (mounted) {
        setVehicles(data)
        setVehiclesLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  React.useEffect(() => {
    if (rentalSuccess) {
      window.scrollTo(0, 0)
    }
  }, [rentalSuccess])



  if (vehiclesLoading) return (
    <Layout>
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ fontSize: 13, fontWeight: 300, color: '#333', textTransform: 'uppercase', letterSpacing: '0.8em' }} className="animate-pulse">Curating Atmosphere...</div>
      </div>
    </Layout>
  )

  if (!model) return (
    <Layout>
      <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', gap: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 300, color: '#333', letterSpacing: '0.1em' }}>PRECISION LOST</div>
        <button className="primary" onClick={() => navigate('/vehicles')}>Return to Fleet</button>
      </div>
    </Layout>
  )

  const allImages = [model.image, ...(model.gallery || [])]
  const update = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  // Cost calculation logic
  const calculateTotal = () => {
    if (!form.start || !form.end) return { days: 0, baseTotal: 0, chauffeurTotal: 0, total: 0 }
    
    const start = new Date(form.start)
    const end = new Date(form.end)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1
    
    const dailyPrice = Number(model.price)
    const baseTotal = dailyPrice * diffDays
    const chauffeurTotal = form.addChauffeur ? (250 * diffDays) : 0
    const total = baseTotal + chauffeurTotal

    return { 
      days: diffDays, 
      dailyPrice,
      baseTotal, 
      chauffeurTotal, 
      total 
    }
  }

  const cost = calculateTotal()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.start || !form.end) {
      setError('Essential credentials (Name, Email, Dates) are required.')
      return
    }
    setLoading(true)
    const rental = saveRental({
      productId: model.id,
      productName: model.name,
      price: model.price,
      rate: model.rate,
      ...form,
      total: cost.total,
      days: cost.days,
      basePrice: cost.dailyPrice,
      chauffeurFee: cost.chauffeurTotal,
      createdAt: new Date().toISOString()
    })
    setLoading(false)
    setRentalSuccess(rental)
  }

  if (rentalSuccess) return (
    <Layout>
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '100vh', background: '#fcfcf9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 640, width: '100%', textAlign: 'center' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 24 }}>Order Confirmed</div>
            <h2 style={{ fontSize: isMobile ? 32 : 56, fontFamily: 'serif', fontWeight: 400, color: '#1a1a1a', marginBottom: 24, letterSpacing: '-0.02em', fontStyle: 'italic' }}>Thank you for your order!</h2>
            <p style={{ fontSize: 16, color: '#666', lineHeight: 1.8, marginBottom: 48 }}>
              Order ID: <span style={{ fontWeight: 800, color: '#1a1a1a' }}>#{rentalSuccess.id}</span>. We have received your request and will contact you shortly to confirm your booking.
            </p>
            <button className="primary" onClick={() => navigate('/vehicles')} style={{ padding: '20px 48px', width: '100%', borderRadius: 16 }}>Back to Vehicles</button>
          </motion.div>
        </div>
      </motion.section>
    </Layout>
  )

  return (
    <Layout>
      <div style={{ background: '#fff', minHeight: '100vh', color: '#1a1a1a' }}>

        {/* Navigation & Trace */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '160px 20px 20px' : '110px 64px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 101 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 24, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#999' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 900 }}>
              <ChevronLeft size={14} /> BACK
            </button>
            <div style={{ width: 1, height: 16, background: '#eee' }} />
            <span style={{ fontSize: 9 }}>{model.category} COLLECTION</span>
          </div>
        </div>

        {/* The Boutique Layout */}
        <section style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '0 20px 60px' : '0 64px 100px' }}>
          <motion.div initial="initial" animate="animate" variants={stagger} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 40 : 100, alignItems: 'start' }}>

            {/* Image & Context Column */}
            <div style={{ flex: 1, width: '100%', display: 'grid', gap: isMobile ? 24 : 48 }}>
              <motion.div variants={fadeInUp} style={{ position: 'relative', borderRadius: isMobile ? 16 : 24, overflow: 'hidden', background: '#fff', border: '1px solid #f0f0f0' }}>
                <CldOptimizedImage src={allImages[selectedImage]} alt={model.name} width={1000} height={250} style={{ width: '100%', height: 'auto', maxHeight: isMobile ? 'none' : 500, objectFit: 'contain', display: 'block' }} />
                <div style={{ position: 'absolute', bottom: isMobile ? 16 : 32, right: isMobile ? 16 : 32, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', padding: isMobile ? '8px 16px' : '12px 24px', borderRadius: 99, fontSize: 10, fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>
                  {selectedImage + 1}/{allImages.length}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} style={{ display: 'flex', alignItems: 'center', gap: 12, overflowX: 'auto', paddingBottom: 12 }} className="no-scrollbar">
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{ flexShrink: 0, width: isMobile ? 120 : 180, height: 'auto', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', border: selectedImage === idx ? '2px solid var(--accent-gold)' : '2px solid transparent', opacity: selectedImage === idx ? 1 : 0.6, transition: '0.3s' }}
                  >
                    <CldOptimizedImage src={img} alt="Thumbnail" width={200} height={100} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} style={{ padding: isMobile ? '32px 0' : '64px 0', borderTop: '1px solid #eee' }}>
                <h2 style={{ fontSize: isMobile ? 28 : 48, fontFamily: 'serif', fontWeight: 400, color: '#1a1a1a', fontStyle: 'italic', marginBottom: 24, lineHeight: 1.2 }}>Bespoke Executive Mobility.</h2>
                <p style={{ fontSize: 16, color: '#666', lineHeight: 1.8, maxWidth: 800 }}>{model.desc}</p>
              </motion.div>

              {/* Tech Attributes - Single row grid */}
              <motion.div variants={fadeInUp} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: isMobile ? 16 : 40, paddingBottom: isMobile ? 20 : 60 }}>
                <div style={{ padding: isMobile ? 20 : 32, background: '#fcfcf9', borderRadius: 16 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>CAPACITY</div>
                  <div style={{ fontSize: 18, fontWeight: 400 }}>{model.specs.seats} Seater</div>
                </div>
                <div style={{ padding: isMobile ? 20 : 32, background: '#fcfcf9', borderRadius: 16 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>PERFORMANCE</div>
                  <div style={{ fontSize: 18, fontWeight: 400 }}>{model.specs.drive}</div>
                </div>
              </motion.div>
            </div>

            {/* Concierge Desk - Optimised for Mobile Scroll */}
            <motion.div variants={fadeInUp} style={{ width: '100%', maxWidth: isMobile ? '100%' : 450, position: isMobile ? 'relative' : 'sticky', top: 120 }}>
              <div style={{ background: '#fff', padding: isMobile ? 32 : 48, borderRadius: isMobile ? 32 : 40, border: '1px solid #f0f0f0', boxShadow: '0 40px 100px rgba(0,0,0,0.03)' }}>

                <div style={{ marginBottom: 40 }}>
                  <h1 style={{ fontSize: isMobile ? 32 : 40, fontFamily: 'serif', fontWeight: 400, color: '#1a1a1a', margin: '0 0 12px', fontStyle: 'italic', lineHeight: 1 }}>{model.name}</h1>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    <div style={{ fontSize: 24, fontWeight: 300, color: 'var(--accent-gold)' }}>{model.rate}</div>
                    <div style={{ fontSize: 12, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Per Charter Day</div>
                  </div>
                </div>

                <form onSubmit={submit} style={{ display: 'grid', gap: isMobile ? 16 : 20 }}>

                  <div className="input-group">
                    <label style={{ fontSize: 9, fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, display: 'block' }}>NAME</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
                      <input name="name" required value={form.name} onChange={update} placeholder="Full Name" className="luxury-input" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                    <div className="input-group">
                      <label style={{ fontSize: 9, fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, display: 'block' }}>Email</label>
                      <input name="email" required type="email" value={form.email} onChange={update} placeholder="Email" className="luxury-input small" />
                    </div>
                    <div className="input-group">
                      <label style={{ fontSize: 9, fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, display: 'block' }}>Phone</label>
                      <input name="phone" type="tel" value={form.phone} onChange={update} placeholder="Phone" className="luxury-input small" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                    <div className="input-group">
                      <label style={{ fontSize: 9, fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, display: 'block' }}>PICK-UP DATE</label>
                      <input name="start" required type="date" value={form.start} onChange={update} min={new Date().toISOString().split('T')[0]} className="luxury-input small" />
                    </div>
                    <div className="input-group">
                      <label style={{ fontSize: 9, fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, display: 'block' }}>RETURN DATE</label>
                      <input name="end" required type="date" value={form.end} onChange={update} min={form.start || new Date().toISOString().split('T')[0]} className="luxury-input small" />
                    </div>
                  </div>

                  <div className="input-group">
                    <label style={{ fontSize: 9, fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, display: 'block' }}>PICK-UP LOCATION</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={16} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
                      <input name="location" value={form.location} onChange={update} placeholder="e.g. Kotoka Terminal 3" className="luxury-input" />
                    </div>
                  </div>

                  <div style={{ padding: '24px', background: '#fcfcf9', borderRadius: 20, border: '1px solid #f0f0f0', display: 'grid', gap: 24 }}>


                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>Add Chauffeur</div>
                        <div style={{ fontSize: 11, color: '#999' }}>+GHS 250/day · Professional driver</div>
                      </div>
                      <input 
                        type="checkbox" 
                        name="addChauffeur" 
                        checked={form.addChauffeur} 
                        onChange={update}
                        style={{ width: 24, height: 24, accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label style={{ fontSize: 9, fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12, display: 'block' }}>Payment Method</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <button 
                        type="button"
                        onClick={() => setForm(f => ({ ...f, paymentMethod: 'Pay on Delivery' }))}
                        style={{ 
                          padding: '16px', 
                          borderRadius: 12, 
                          border: '1px solid',
                          borderColor: form.paymentMethod === 'Pay on Delivery' ? 'var(--accent-gold)' : '#eee',
                          background: form.paymentMethod === 'Pay on Delivery' ? '#fff' : 'transparent',
                          color: form.paymentMethod === 'Pay on Delivery' ? '#000' : '#999',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: '0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10
                        }}
                      >
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: form.paymentMethod === 'Pay on Delivery' ? 'var(--accent-gold)' : '#ccc' }} />
                        Pay on Delivery
                      </button>
                      <button 
                        type="button"
                        onClick={() => setForm(f => ({ ...f, paymentMethod: 'Mobile Money' }))}
                        style={{ 
                          padding: '16px', 
                          borderRadius: 12, 
                          border: '1px solid',
                          borderColor: form.paymentMethod === 'Mobile Money' ? 'var(--accent-gold)' : '#eee',
                          background: form.paymentMethod === 'Mobile Money' ? '#fff' : 'transparent',
                          color: form.paymentMethod === 'Mobile Money' ? '#000' : '#999',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: '0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10
                        }}
                      >
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: form.paymentMethod === 'Mobile Money' ? 'var(--accent-gold)' : '#ccc' }} />
                        Mobile Money
                      </button>
                    </div>
                  </div>

                  {cost.days > 0 && (
                    <div style={{ borderTop: '1px solid #eee', paddingTop: 20, marginTop: 10, display: 'grid', gap: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span style={{ color: '#666' }}>{cost.dailyPrice.toLocaleString()} GHS × {cost.days} days</span>
                        <span style={{ fontWeight: 600 }}>{cost.baseTotal.toLocaleString()} GHS</span>
                      </div>
                      {form.addChauffeur && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                          <span style={{ color: '#666' }}>Chauffeur Service</span>
                          <span style={{ fontWeight: 600 }}>{cost.chauffeurTotal.toLocaleString()} GHS</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 900, marginTop: 8, borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--accent-gold)' }}>{cost.total.toLocaleString()} GHS</span>
                      </div>
                    </div>
                  )}

                  {error && <div style={{ fontSize: 13, color: '#ef4444', fontWeight: 700 }}>{error}</div>}

                  <button disabled={loading} type="submit" className="primary" style={{ width: '100%', padding: '24px', fontSize: 14, fontWeight: 900, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 12 }}>
                    {loading ? 'Initiating Charter...' : 'Secure Charter'} <ArrowRight size={20} />
                  </button>

                  <a 
                    href={`https://wa.me/233202225878?text=${encodeURIComponent(`Hello, I'd like to get more details about the ${model.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      width: '100%', 
                      padding: '22px', 
                      fontSize: 13, 
                      fontWeight: 800, 
                      borderRadius: 16, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: 12, 
                      marginTop: 8,
                      background: '#25D366',
                      color: '#fff',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      boxShadow: '0 10px 20px rgba(37, 211, 102, 0.15)',
                    }}
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 15px 30px rgba(37, 211, 102, 0.25)';
                      e.currentTarget.style.background = '#22c35e';
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(37, 211, 102, 0.15)';
                      e.currentTarget.style.background = '#25D366';
                    }}
                  >
                    <svg 
                      viewBox="0 0 448 512" 
                      width="18" 
                      height="18" 
                      fill="currentColor"
                      style={{ flexShrink: 0 }}
                    >
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.6-2.8-23.6-8.7-45-27.7-16.6-14.9-27.9-33.2-31.1-38.8-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.6-9.2 1.9-3.7 1-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg> Chat for Details
                  </a>

                  <div style={{ display: 'flex', gap: 16, background: '#fcfcf9', padding: '16px', borderRadius: 16, border: '1px solid #f0f0f0', marginTop: 10 }}>
                    <Shield size={18} color="var(--accent-gold)" />
                    <p style={{ margin: 0, fontSize: 10, color: '#999', lineHeight: 1.6, fontWeight: 600 }}>Billing is non-digital. Final itinerary and mobilization fees handled during vessel delivery.</p>
                  </div>
                </form>

              </div>
            </motion.div>
          </motion.div>
        </section>

      </div>
      <style jsx global>{`
        .luxury-input {
          width: 100%;
          background: #f8f8fa;
          border: 1px solid #f0f0f2;
          padding: 16px 20px 16px 52px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          outline: none;
          transition: 0.3s;
        }
        .luxury-input.small {
          padding: 16px 20px;
        }
        .luxury-input:focus {
          background: #fff;
          border-color: var(--accent-gold);
          box-shadow: 0 0 0 4px rgba(212, 178, 106, 0.05);
        }
        .luxury-input::placeholder {
          color: #ccc;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </Layout>
  )
}
