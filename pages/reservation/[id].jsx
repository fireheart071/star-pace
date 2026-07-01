import React from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { saveOrder as saveRental } from '../../lib/orders'
import { getVehicles } from '../../lib/vehiclesApi'
import CldOptimizedImage from '../../components/CldOptimizedImage'
import Layout from '../../components/Layout'
import { Calendar, MapPin, ChevronLeft, Shield, Clock, CreditCard, CheckCircle, Info, ArrowRight, User, Mail, Phone } from 'lucide-react'

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

  const [showConditions, setShowConditions] = React.useState(false)
  const [conditionsCheckbox, setConditionsCheckbox] = React.useState(false)
  const [bookingConditions, setBookingConditions] = React.useState('')
  const [bookedRanges, setBookedRanges] = React.useState([])
  const [vehicles, setVehicles] = React.useState([])
  const [vehiclesLoading, setVehiclesLoading] = React.useState(true)
  const [showWhatsAppModal, setShowWhatsAppModal] = React.useState(false)
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    start: '',
    end: '',
    location: '',
    addChauffeur: false,
    paymentMethod: 'Pay on Delivery',
    note: '',
    conditionsAccepted: false
  })
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [rentalSuccess, setRentalSuccess] = React.useState(null)
  const [selectedImage, setSelectedImage] = React.useState(0)
  const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' && window.innerWidth <= 768)

  const model = vehicles.find(m => String(m.id) === String(id))

  const getCapacityText = () => {
    if (!model) return '';
    if (model.isResidence) {
      const guests = model.specs?.guests || model.specs?.seats;
      return typeof guests === 'number' ? `${guests} Guests` : (guests || 'N/A');
    }
    return `${model.specs?.seats || '4'} Seater`;
  }

  const getPerformanceText = () => {
    if (!model) return '';
    if (model.isResidence) {
      const bedrooms = model.specs?.bedrooms || model.specs?.battery;
      const bathrooms = model.specs?.bathrooms || model.specs?.drive;
      const type = model.specs?.type || model.specs?.transmission;

      const parts = [];
      if (bedrooms) parts.push(typeof bedrooms === 'number' ? `${bedrooms} Beds` : bedrooms);
      if (bathrooms) parts.push(typeof bathrooms === 'number' ? `${bathrooms} Baths` : bathrooms);
      if (type) parts.push(type);
      return parts.join(' · ') || 'Premium Stays';
    }
    return model.specs?.drive || 'AWD';
  }

  const getCapacityLabel = () => {
    if (model?.isResidence) return 'OCCUPANCY';
    return 'CAPACITY';
  }

  const getPerformanceLabel = () => {
    if (model?.isResidence) return 'SPECIFICATIONS';
    return 'PERFORMANCE';
  }

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [vehiclesRes, residencesRes, settingsRes] = await Promise.all([
          getVehicles(),
          fetch('/api/residence').then(r => r.json()).catch(() => []),
          fetch('/api/settings').then(r => r.json()).catch(() => ({}))
        ])
        if (mounted) {
          const combined = [
            ...(Array.isArray(vehiclesRes) ? vehiclesRes : []).map(v => ({ ...v, isResidence: false })),
            ...(Array.isArray(residencesRes) ? residencesRes : []).map(r => ({ ...r, isResidence: true }))
          ]
          setVehicles(combined)
          if (settingsRes && settingsRes.bookingConditions) {
            setBookingConditions(settingsRes.bookingConditions)
          }
          setVehiclesLoading(false)
        }
      } catch (err) {
        console.error("Failed to load catalog details", err)
        if (mounted) setVehiclesLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  React.useEffect(() => {
    if (!id) return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`/api/orders/unavailable-dates?productId=${id}`)
        if (res.ok && mounted) {
          const list = await res.json()
          setBookedRanges(Array.isArray(list) ? list : [])
        }
      } catch (e) {
        console.error("Failed to load booked ranges", e)
      }
    })()
    return () => { mounted = false }
  }, [id])

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  React.useEffect(() => {
    if (rentalSuccess) {
      window.scrollTo(0, 0)
    }
  }, [rentalSuccess])

  const allImages = model ? [model.image, ...(model.gallery || [])] : []

  const update = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  // Cost calculation logic
  const calculateTotal = () => {
    if (!model || !form.start || !form.end) return { days: 0, baseTotal: 0, chauffeurTotal: 0, total: 0 }

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

  const completeBooking = async (updatedForm) => {
    setLoading(true)
    const rental = saveRental({
      productId: model.id,
      productName: model.name,
      price: model.price,
      rate: model.rate,
      ...updatedForm,
      paymentMethod: model.isResidence ? 'Check-in' : updatedForm.paymentMethod,
      total: cost.total,
      days: cost.days,
      basePrice: cost.dailyPrice,
      chauffeurFee: cost.chauffeurTotal,
      createdAt: new Date().toISOString()
    })
    setLoading(false)
    setRentalSuccess(rental)
    setShowWhatsAppModal(true)
  }

  const confirmConditions = () => {
    const updated = { ...form, conditionsAccepted: true }
    setForm(updated)
    setShowConditions(false)
    completeBooking(updated)
  }

  const submit = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.start || !form.end) {
      setError('Essential credentials (Name, Email, Dates) are required.')
      return
    }

    const s1 = new Date(form.start)
    const e1 = new Date(form.end)
    const hasOverlap = bookedRanges.some(range => {
      const s2 = new Date(range.start)
      const e2 = new Date(range.end)
      return (s1 <= e2 && e1 >= s2)
    })

    if (hasOverlap) {
      setError('The selected dates are already booked. Please choose another date range.')
      return
    }

    if (!form.conditionsAccepted) {
      setShowConditions(true)
      return
    }
    completeBooking(form)
  }

  if (vehiclesLoading) return (
    <Layout>
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
        <div style={{ fontSize: 13, fontWeight: 300, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8em' }} className="animate-pulse">Curating Atmosphere...</div>
      </div>
    </Layout>
  )

  if (!model) return (
    <Layout>
      <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'transparent', gap: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 300, color: 'var(--text-primary)', letterSpacing: '0.1em' }}>PRECISION LOST</div>
        <button className="primary" onClick={() => navigate('/vehicles')}>Return to Fleet</button>
      </div>
    </Layout>
  )

  if (rentalSuccess) return (
    <Layout>
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '100vh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '160px 24px 80px' }}>
        <div style={{ maxWidth: 640, width: '100%', textAlign: 'center', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: isMobile ? '40px 24px' : '64px 48px', borderRadius: '24px', boxShadow: 'var(--shadow-glow)' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 24 }}>
              {model.isResidence ? 'Reservation Confirmed' : 'Order Confirmed'}
            </div>
            <h2 style={{ fontSize: isMobile ? 32 : 48, fontFamily: "'Playfair Display', serif", fontWeight: 400, color: '#ffffff', marginBottom: 24, letterSpacing: '-0.02em', fontStyle: 'italic' }}>
              {model.isResidence ? 'Thank you for your reservation!' : 'Thank you for your order!'}
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 48 }}>
              {model.isResidence ? 'Booking' : 'Order'} ID: <span style={{ fontWeight: 800, color: 'var(--brand-fleet)' }}>#{rentalSuccess.id}</span>. We have received your request and will contact you shortly to confirm your booking.
            </p>
            <button
              className="primary"
              onClick={() => navigate(model.isResidence ? '/residence' : '/vehicles')}
              style={{
                padding: '18px 48px',
                width: '100%',
                borderRadius: 14,
                background: 'var(--brand-fleet)',
                color: '#070B18',
                fontWeight: 900,
                border: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                cursor: 'pointer'
              }}
            >
              {model.isResidence ? 'Back to Residences' : 'Back to Vehicles'}
            </button>
          </motion.div>
        </div>
      </motion.section>

      <AnimatePresence>
        {showWhatsAppModal && rentalSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(6, 10, 19, 0.85)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '24px'
            }}
            onClick={() => setShowWhatsAppModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                maxWidth: 480,
                width: '100%',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '24px',
                padding: '40px 32px',
                boxShadow: 'var(--shadow-glow), 0 30px 60px rgba(0,0,0,0.4)',
                textAlign: 'center',
                color: '#ffffff'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(37, 211, 102, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                border: '1px solid rgba(37, 211, 102, 0.2)'
              }}>
                <svg viewBox="0 0 448 512" width="32" height="32" fill="#25D366">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.6-2.8-23.6-8.7-45-27.7-16.6-14.9-27.9-33.2-31.1-38.8-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.6-9.2 1.9-3.7 1-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
              </div>

              {/* Title & Description */}
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 24,
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 12px 0',
                fontStyle: 'italic'
              }}>
                Instant Confirmation?
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 32px 0' }}>
                Would you like to send this booking to the owner via WhatsApp? This allows us to process and confirm your booking immediately.
              </p>

              {/* Actions */}
              <div style={{ display: 'grid', gap: 12 }}>
                <button
                  onClick={() => {
                    const msg = `Hello Star Pace, I have just made a ${model.isResidence ? 'residence reservation' : 'vehicle booking'}. Here are my details:\n\n`
                      + `• Booking ID: #${rentalSuccess.id}\n`
                      + `• Name: ${rentalSuccess.name}\n`
                      + `• Asset: ${rentalSuccess.productName}\n`
                      + `• Date: ${rentalSuccess.start} to ${rentalSuccess.end} (${rentalSuccess.days} ${model.isResidence ? 'nights' : 'days'})\n`
                      + `• Total Cost: ₵${rentalSuccess.total.toLocaleString()} GHS\n`
                      + `• Contact: ${rentalSuccess.phone || 'N/A'} / ${rentalSuccess.email}\n`
                      + (model.isResidence ? '' : `• Payment Method: ${rentalSuccess.paymentMethod}\n`)
                      + (rentalSuccess.location ? `• Details: ${rentalSuccess.location}\n` : '');

                    window.open(`https://wa.me/233247685405?text=${encodeURIComponent(msg)}`, '_blank');
                    setShowWhatsAppModal(false);
                  }}
                  style={{
                    padding: '16px',
                    fontSize: 12,
                    fontWeight: 900,
                    borderRadius: 14,
                    background: '#25D366',
                    color: '#fff',
                    border: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(37, 211, 102, 0.2)',
                    transition: '0.3s'
                  }}
                >
                  Yes, Send WhatsApp
                </button>

                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  style={{
                    padding: '16px',
                    fontSize: 11,
                    fontWeight: 800,
                    borderRadius: 14,
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--glass-border)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    transition: '0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  No, Thank You
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )

  return (
    <Layout>
      <div style={{ background: 'transparent', minHeight: '100vh', color: 'var(--text-primary)' }}>

        {/* Navigation & Trace */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '140px 20px 20px' : '140px 64px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 101 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 24, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 900 }}>
              <ChevronLeft size={14} style={{ color: 'var(--brand-fleet)' }} /> BACK
            </button>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: 9 }}>{model.category} COLLECTION</span>
          </div>
        </div>

        {/* The Boutique Layout */}
        <section style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '0 20px 60px' : '0 64px 100px' }}>
          <motion.div initial="initial" animate="animate" variants={stagger} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 40 : 80, alignItems: 'start' }}>

            {/* Image & Context Column */}
            <div style={{ flex: 1, width: '100%', display: 'grid', gap: isMobile ? 24 : 48 }}>
              <motion.div variants={fadeInUp} style={{ position: 'relative', borderRadius: isMobile ? 16 : 24, overflow: 'hidden', background: 'rgba(12, 18, 32, 0.4)', border: '1px solid var(--glass-border)', padding: '20px' }}>
                <CldOptimizedImage src={allImages[selectedImage]} alt={model.name} width={1000} height={250} style={{ width: '100%', height: 'auto', maxHeight: isMobile ? 'none' : 500, objectFit: 'contain', display: 'block' }} />
                <div style={{ position: 'absolute', bottom: isMobile ? 16 : 32, right: isMobile ? 16 : 32, background: 'rgba(6, 10, 19, 0.85)', border: '1px solid var(--glass-border)', padding: isMobile ? '8px 16px' : '12px 24px', borderRadius: 99, fontSize: 10, fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>
                  {selectedImage + 1}/{allImages.length}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} style={{ display: 'flex', alignItems: 'center', gap: 12, overflowX: 'auto', paddingBottom: 12 }} className="no-scrollbar">
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{ flexShrink: 0, width: isMobile ? 100 : 160, height: 'auto', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', border: selectedImage === idx ? '2px solid var(--brand-fleet)' : '2px solid transparent', opacity: selectedImage === idx ? 1 : 0.6, transition: '0.3s' }}
                  >
                    <CldOptimizedImage src={img} alt="Thumbnail" width={200} height={100} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} style={{ padding: isMobile ? '32px 0' : '48px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 style={{ fontSize: isMobile ? 28 : 40, fontFamily: "'Playfair Display', serif", fontWeight: 400, color: '#ffffff', fontStyle: 'italic', marginBottom: 24, lineHeight: 1.2 }}>
                  {model.isResidence ? "Bespoke Luxury Living." : "Bespoke Executive Mobility."}
                </h2>
                <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 800 }}>{model.desc}</p>
              </motion.div>

              {/* Tech Attributes - Single row grid */}
              <motion.div variants={fadeInUp} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: isMobile ? 16 : 32, paddingBottom: isMobile ? 20 : 60 }}>
                <div style={{ padding: isMobile ? 20 : 32, background: 'rgba(12, 18, 32, 0.4)', border: '1px solid var(--glass-border)', borderRadius: 16 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{getCapacityLabel()}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>{getCapacityText()}</div>
                </div>
                <div style={{ padding: isMobile ? 20 : 32, background: 'rgba(12, 18, 32, 0.4)', border: '1px solid var(--glass-border)', borderRadius: 16 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{getPerformanceLabel()}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>{getPerformanceText()}</div>
                </div>
              </motion.div>
            </div>

            {/* Concierge Desk - sticky form */}
            <motion.div variants={fadeInUp} style={{ width: '100%', maxWidth: isMobile ? '100%' : 450, position: isMobile ? 'relative' : 'sticky', top: 120 }}>
              <div style={{ background: 'var(--glass-bg)', padding: isMobile ? 24 : 40, borderRadius: isMobile ? 24 : 32, border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-glow), var(--shadow-lg)' }}>

                <div style={{ marginBottom: 32 }}>
                  <h1 style={{ fontSize: isMobile ? 28 : 36, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#ffffff', margin: '0 0 12px', fontStyle: 'italic', lineHeight: 1 }}>{model.name}</h1>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent-gold)' }}>
                      {model.rate ? model.rate : `₵${Number(model.price).toLocaleString()}`}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {model.isResidence ? 'Per Night' : 'Per Charter Day'}
                    </div>
                  </div>
                  {!showConditions ? (
                    <form onSubmit={submit} style={{ display: 'grid', gap: isMobile ? 16 : 20 }}>

                      <div className="input-group">
                        <label style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, display: 'block' }}>NAME</label>
                        <div style={{ position: 'relative' }}>
                          <User size={16} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-fleet)' }} />
                          <input name="name" required value={form.name} onChange={update} placeholder="Full Name" className="luxury-input" />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                        <div className="input-group">
                          <label style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, display: 'block' }}>Email</label>
                          <input name="email" required type="email" value={form.email} onChange={update} placeholder="Email" className="luxury-input small" />
                        </div>
                        <div className="input-group">
                          <label style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, display: 'block' }}>Phone</label>
                          <input name="phone" type="tel" value={form.phone} onChange={update} placeholder="Phone" className="luxury-input small" />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                        <div className="input-group">
                          <label style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, display: 'block' }}>
                            {model.isResidence ? 'CHECK-IN DATE' : 'PICK-UP DATE'}
                          </label>
                          <input name="start" required type="date" value={form.start} onChange={update} min={new Date().toISOString().split('T')[0]} className="luxury-input small" />
                        </div>
                        <div className="input-group">
                          <label style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, display: 'block' }}>
                            {model.isResidence ? 'CHECK-OUT DATE' : 'RETURN DATE'}
                          </label>
                          <input name="end" required type="date" value={form.end} onChange={update} min={form.start || new Date().toISOString().split('T')[0]} className="luxury-input small" />
                        </div>
                      </div>

                      {bookedRanges.length > 0 && (
                        <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 12, fontSize: 11, color: 'var(--text-secondary)' }}>
                          <span style={{ fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>Unavailable / Booked Dates:</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px' }}>
                            {bookedRanges.map((range, idx) => {
                              const formatDateStr = (dStr) => {
                                const d = new Date(dStr)
                                return isNaN(d.getTime()) ? dStr : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                              }
                              return (
                                <span key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 4, fontWeight: 700, color: '#ffffff' }}>
                                  {formatDateStr(range.start)} - {formatDateStr(range.end)}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      <div className="input-group">
                        <label style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, display: 'block' }}>
                          {model.isResidence ? 'NOTES / SPECIAL REQUESTS' : 'PICK-UP LOCATION'}
                        </label>
                        <div style={{ position: 'relative' }}>
                          {model.isResidence ? (
                            <Info size={16} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-fleet)' }} />
                          ) : (
                            <MapPin size={16} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-fleet)' }} />
                          )}
                          <input name="location" value={form.location} onChange={update} placeholder={model.isResidence ? "e.g. Flight details, arrival time, special requests" : "e.g. Kotoka Terminal 3"} className="luxury-input" />
                        </div>
                      </div>

                      {!model.isResidence && model.chauffeurEnabled !== false && (
                        <div style={{ padding: '20px', background: 'rgba(12, 18, 32, 0.4)', borderRadius: 16, border: '1px solid var(--glass-border)', display: 'grid', gap: 24 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>
                                Add Chauffeur
                              </div>
                              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: '2px' }}>
                                +GHS 250/day · Professional driver
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              name="addChauffeur"
                              checked={form.addChauffeur}
                              onChange={update}
                              style={{ width: 20, height: 20, accentColor: 'var(--brand-fleet)', cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                      )}

                      {!model.isResidence && (
                        <div className="input-group">
                          <label style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12, display: 'block' }}>Payment Method</label>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <button
                              type="button"
                              onClick={() => setForm(f => ({ ...f, paymentMethod: 'Pay on Delivery' }))}
                              style={{
                                padding: '14px',
                                borderRadius: 10,
                                border: '1px solid',
                                borderColor: form.paymentMethod === 'Pay on Delivery' ? 'var(--accent-gold)' : 'var(--glass-border)',
                                background: form.paymentMethod === 'Pay on Delivery' ? 'rgba(197, 168, 128, 0.15)' : 'transparent',
                                color: form.paymentMethod === 'Pay on Delivery' ? '#fff' : 'var(--text-secondary)',
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: '0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                              }}
                            >
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: form.paymentMethod === 'Pay on Delivery' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.2)' }} />
                              Pay on Delivery
                            </button>
                            <button
                              type="button"
                              onClick={() => setForm(f => ({ ...f, paymentMethod: 'Mobile Money' }))}
                              style={{
                                padding: '14px',
                                borderRadius: 10,
                                border: '1px solid',
                                borderColor: form.paymentMethod === 'Mobile Money' ? 'var(--accent-gold)' : 'var(--glass-border)',
                                background: form.paymentMethod === 'Mobile Money' ? 'rgba(197, 168, 128, 0.15)' : 'transparent',
                                color: form.paymentMethod === 'Mobile Money' ? '#fff' : 'var(--text-secondary)',
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: '0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                              }}
                            >
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: form.paymentMethod === 'Mobile Money' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.2)' }} />
                              Mobile Money
                            </button>
                          </div>
                        </div>
                      )}

                      {cost.days > 0 && (
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, marginTop: 8, display: 'grid', gap: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span style={{ color: 'var(--text-secondary)' }}>
                              ₵{cost.dailyPrice.toLocaleString()} × {cost.days} {model.isResidence ? 'nights' : 'days'}
                            </span>
                            <span style={{ fontWeight: 700, color: '#ffffff' }}>{cost.baseTotal.toLocaleString()} GHS</span>
                          </div>
                          {form.addChauffeur && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                              <span style={{ color: 'var(--text-secondary)' }}>
                                Chauffeur Service
                              </span>
                              <span style={{ fontWeight: 700, color: '#ffffff' }}>{cost.chauffeurTotal.toLocaleString()} GHS</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--brand-fleet)' }}>{cost.total.toLocaleString()} GHS</span>
                          </div>
                        </div>
                      )}

                      {error && <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 700 }}>{error}</div>}

                      <button
                        disabled={loading}
                        type="submit"
                        className="primary"
                        style={{
                          width: '100%',
                          padding: '18px',
                          fontSize: 12,
                          fontWeight: 900,
                          borderRadius: 14,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 12,
                          marginTop: 8,
                          background: 'var(--brand-fleet)',
                          color: '#070B18',
                          border: 'none',
                          textTransform: 'uppercase',
                          letterSpacing: '0.15em',
                          cursor: 'pointer',
                          boxShadow: '0 10px 30px rgba(56, 189, 248, 0.2)'
                        }}
                      >
                        {loading
                          ? (model.isResidence ? 'Initiating Reservation...' : 'Initiating Charter...')
                          : (model.isResidence ? 'Secure Stay' : 'Secure Charter')
                        } <ArrowRight size={16} />
                      </button>

                      <a
                        href={`https://wa.me/233247685405?text=${encodeURIComponent(`Hello, I'd like to get more details about the ${model.name}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: '100%',
                          padding: '16px',
                          fontSize: 12,
                          fontWeight: 900,
                          borderRadius: 14,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 12,
                          marginTop: 4,
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
                          width="16"
                          height="16"
                          fill="currentColor"
                          style={{ flexShrink: 0 }}
                        >
                          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.6-2.8-23.6-8.7-45-27.7-16.6-14.9-27.9-33.2-31.1-38.8-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.6-9.2 1.9-3.7 1-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                        </svg> Chat for Details
                      </a>

                      <div style={{ display: 'flex', gap: 12, background: 'rgba(6, 10, 19, 0.4)', padding: '16px', borderRadius: 16, border: '1px solid var(--glass-border)', marginTop: 8 }}>
                        <Shield size={16} color="var(--accent-gold)" />
                        <p style={{ margin: 0, fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 600 }}>
                          {model.isResidence
                            ? "Billing is non-digital. Final itinerary and check-in details handled during check-in."
                            : "Billing is non-digital. Final itinerary and mobilization fees handled during vessel delivery."
                          }
                        </p>
                      </div>
                    </form>
                  ) : (
                    <div style={{ display: 'grid', gap: 20 }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#ffffff', margin: '0 0 8px 0', fontStyle: 'italic' }}>
                        Confirm Booking Conditions
                      </h3>

                      <div style={{
                        fontSize: 13,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.8,
                        margin: '0 0 8px 0',
                        background: 'rgba(255,255,255,0.03)',
                        padding: 16,
                        borderRadius: 12,
                        border: '1px solid rgba(255,255,255,0.05)',
                        maxHeight: '260px',
                        overflowY: 'auto'
                      }}>
                        <p style={{ margin: '0 0 12px 0' }}>Please review and accept our special conditions to complete your booking:</p>
                        {bookingConditions && bookingConditions.trim() && (
                          <ul style={{ margin: 0, paddingLeft: 16 }}>
                            {bookingConditions.split('\n').filter(Boolean).map((cond, idx) => (
                              <li key={idx} style={{ marginBottom: 8 }}>{cond.trim()}</li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0' }}>
                        <input
                          type="checkbox"
                          id="conditions-check"
                          checked={conditionsCheckbox}
                          onChange={(e) => setConditionsCheckbox(e.target.checked)}
                          style={{ width: 18, height: 18, accentColor: 'var(--brand-fleet)', cursor: 'pointer' }}
                        />
                        <label htmlFor="conditions-check" style={{ fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
                          I agree to the Special Booking Conditions
                        </label>
                      </div>

                      <div style={{ display: 'grid', gap: 12 }}>
                        <button
                          disabled={!conditionsCheckbox}
                          onClick={confirmConditions}
                          style={{
                            padding: '16px',
                            fontSize: 12,
                            fontWeight: 900,
                            borderRadius: 14,
                            background: conditionsCheckbox ? 'var(--brand-fleet)' : 'rgba(255,255,255,0.05)',
                            color: conditionsCheckbox ? '#070B18' : 'var(--text-muted)',
                            border: 'none',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            cursor: conditionsCheckbox ? 'pointer' : 'not-allowed',
                            transition: '0.3s'
                          }}
                        >
                          Accept & Secure Booking
                        </button>
                        <button
                          onClick={() => setShowConditions(false)}
                          style={{
                            padding: '16px',
                            fontSize: 11,
                            fontWeight: 800,
                            borderRadius: 14,
                            background: 'transparent',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--glass-border)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            cursor: 'pointer',
                            transition: '0.3s'
                          }}
                        >
                          Back to Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <AnimatePresence>
          {showWhatsAppModal && rentalSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(6, 10, 19, 0.85)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 99999,
                padding: '24px'
              }}
              onClick={() => setShowWhatsAppModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{
                  maxWidth: 480,
                  width: '100%',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '24px',
                  padding: '40px 32px',
                  boxShadow: 'var(--shadow-glow), 0 30px 60px rgba(0,0,0,0.4)',
                  textAlign: 'center',
                  color: '#ffffff'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Icon */}
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(37, 211, 102, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  border: '1px solid rgba(37, 211, 102, 0.2)'
                }}>
                  <svg viewBox="0 0 448 512" width="32" height="32" fill="#25D366">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.6-2.8-23.6-8.7-45-27.7-16.6-14.9-27.9-33.2-31.1-38.8-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.6-9.2 1.9-3.7 1-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                  </svg>
                </div>

                {/* Title & Description */}
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: '0 0 12px 0',
                  fontStyle: 'italic'
                }}>
                  Instant Confirmation?
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 32px 0' }}>
                  Would you like to send this booking to the owner via WhatsApp? This allows us to process and confirm your booking immediately.
                </p>

                {/* Actions */}
                <div style={{ display: 'grid', gap: 12 }}>
                  <button
                    onClick={() => {
                      const msg = `Hello Star Pace, I have just made a ${model.isResidence ? 'residence reservation' : 'vehicle booking'}. Here are my details:\n\n`
                        + `• Booking ID: #${rentalSuccess.id}\n`
                        + `• Name: ${rentalSuccess.name}\n`
                        + `• Asset: ${rentalSuccess.productName}\n`
                        + `• Date: ${rentalSuccess.start} to ${rentalSuccess.end} (${rentalSuccess.days} ${model.isResidence ? 'nights' : 'days'})\n`
                        + `• Total Cost: ₵${rentalSuccess.total.toLocaleString()} GHS\n`
                        + `• Contact: ${rentalSuccess.phone || 'N/A'} / ${rentalSuccess.email}\n`
                        + (model.isResidence ? '' : `• Payment Method: ${rentalSuccess.paymentMethod}\n`)
                        + (rentalSuccess.location ? `• Details: ${rentalSuccess.location}\n` : '');

                      window.open(`https://wa.me/233247685405?text=${encodeURIComponent(msg)}`, '_blank');
                      setShowWhatsAppModal(false);
                    }}
                    style={{
                      padding: '16px',
                      fontSize: 12,
                      fontWeight: 900,
                      borderRadius: 14,
                      background: '#25D366',
                      color: '#fff',
                      border: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      cursor: 'pointer',
                      boxShadow: '0 10px 20px rgba(37, 211, 102, 0.2)',
                      transition: '0.3s'
                    }}
                  >
                    Yes, Send WhatsApp
                  </button>

                  <button
                    onClick={() => setShowWhatsAppModal(false)}
                    style={{
                      padding: '16px',
                      fontSize: 11,
                      fontWeight: 800,
                      borderRadius: 14,
                      background: 'transparent',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--glass-border)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      transition: '0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    No, Thank You
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx global>{`
        .luxury-input {
          width: 100%;
          background: rgba(6, 10, 19, 0.4);
          border: 1px solid var(--glass-border);
          padding: 16px 20px 16px 52px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          outline: none;
          transition: 0.3s;
        }
        .luxury-input.small {
          padding: 16px 20px;
        }
        .luxury-input:focus {
          background: rgba(6, 10, 19, 0.8);
          border-color: var(--accent-gold);
          box-shadow: 0 0 0 4px rgba(212, 178, 106, 0.05);
        }
        .luxury-input::placeholder {
          color: var(--text-muted);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        /* Style date inputs for dark mode compatibility */
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.7;
          cursor: pointer;
        }
      `}</style>
      </div>
    </Layout>
  )
}
