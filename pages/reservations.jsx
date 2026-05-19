import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { Search, ShoppingBag, Calendar, Mail, Phone, Link as LinkIcon, Trash2, Box, CheckCircle2 } from 'lucide-react'
import { getLinkedContacts, saveContact } from '../lib/orders'
import Layout from '../components/Layout'
import { motion } from 'framer-motion'

export default function MyReservations() {
    const [seeds, setSeeds] = useState([])
    const [reservations, setReservations] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [inputValue, setInputValue] = useState('')
    const [isMobile, setIsMobile] = useState(false)
    
    useEffect(() => {
        window.scrollTo(0, 0)
        setIsMobile(window.innerWidth <= 768)
        const handleResize = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        setSeeds(getLinkedContacts())
    }, [])

    const refreshReservations = useCallback(async (currentSeeds) => {
        if (!currentSeeds || currentSeeds.length === 0) {
            setReservations([])
            return
        }

        setLoading(true)
        setError('')

        let processedSeeds = [...currentSeeds]
        let allReservations = []
        let seenRentalIds = new Set()
        let iteration = 0
        let hasNewSeeds = true

        try {
            while (hasNewSeeds && iteration < 5) {
                iteration++
                hasNewSeeds = false

                const results = await Promise.all(
                    processedSeeds.map(s =>
                        fetch(`/api/my-orders?contact=${encodeURIComponent(s)}`).then(r => r.ok ? r.json() : [])
                    )
                )

                const flat = results.flat()
                flat.forEach(r => {
                    if (!seenRentalIds.has(r.id)) {
                        allReservations.push(r)
                        seenRentalIds.add(r.id)

                        if (r.email && !processedSeeds.includes(r.email)) {
                            processedSeeds.push(r.email)
                            saveContact(r.email)
                            hasNewSeeds = true
                        }
                        if (r.phone && !processedSeeds.includes(r.phone)) {
                            const cleanPhone = r.phone.replace(/\s+/g, '')
                            if (!processedSeeds.includes(cleanPhone)) {
                                processedSeeds.push(cleanPhone)
                                saveContact(cleanPhone)
                                hasNewSeeds = true
                            }
                        }
                    }
                })
            }

            setSeeds(processedSeeds)
            setReservations(allReservations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        } catch (err) {
            setError('System unavailable. Please try again later.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (seeds.length > 0 && reservations === null) {
            refreshReservations(seeds)
        }
    }, [seeds, reservations, refreshReservations])

    const handleManualAdd = (e) => {
        if (e) e.preventDefault()
        const val = inputValue.trim()
        if (!val) return

        if (!seeds.includes(val)) {
            const newSeeds = [...seeds, val]
            saveContact(val)
            setSeeds(newSeeds)
            refreshReservations(newSeeds)
        }
        setInputValue('')
    }

    const removeContact = (c) => {
        const newSeeds = seeds.filter(s => s !== c)
        if (typeof window !== 'undefined') {
            localStorage.setItem('atlas_linked_contacts_v1', JSON.stringify(newSeeds))
        }
        setSeeds(newSeeds)
        setReservations(null)
    }

    return (
        <Layout>
            <Head>
                <title>Reservations | Star Pace</title>
                <meta name="description" content="Securely retrieve and inspect your active vehicle and residence reservations at Star Pace." />
            </Head>

            <div className="my-orders-page" style={{
                paddingTop: '140px',
                paddingBottom: '120px',
                minHeight: '100vh',
                background: 'var(--bg-primary)'
            }}>
                <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
                    
                    {/* Editorial Dashboard Header */}
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ 
                            marginBottom: '60px', 
                            borderBottom: '1px solid var(--border-color)',
                            paddingBottom: '32px'
                        }}
                    >
                        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                            <div style={{ width: '4px', height: '60px', background: 'var(--brand-fleet)' }} />
                            <div>
                                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', letterSpacing: '0.4em', display: 'block', marginBottom: '8px' }}>
                                    Executive Booking Desk
                                </span>
                                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                                    My <span style={{ color: 'var(--brand-fleet)' }}>Reservations</span>
                                </h1>
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '16px', margin: 0, lineHeight: 1.6 }}>
                            Securely manage your elite vehicle hires and residence reservations across Ghana.
                        </p>
                    </motion.header>

                    {/* Discovery Dashboard */}
                    <div style={{ display: 'grid', gridTemplateColumns: seeds.length > 0 ? '320px 1fr' : '1fr', gap: '48px' }}>

                        {/* Linked Identifiers Panel (Sidebar) */}
                        {seeds.length > 0 && (
                            <motion.aside
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{
                                    background: '#ffffff',
                                    padding: '32px 24px',
                                    borderRadius: '24px',
                                    border: '1.5px solid var(--border-color)',
                                    height: 'fit-content',
                                    position: 'sticky',
                                    top: '120px',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '24px' }}>
                                    <LinkIcon size={16} color="var(--brand-fleet)" />
                                    <h3 style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                        Linked Profiles
                                    </h3>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {seeds.map(s => (
                                        <div key={s} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '12px 16px',
                                            background: 'var(--bg-secondary)',
                                            borderRadius: '12px',
                                            fontSize: '13px',
                                            color: 'var(--text-primary)',
                                            border: '1px solid var(--border-color)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                                                {s.includes('@') ? <Mail size={14} color="var(--brand-fleet)" style={{ opacity: 0.8 }} /> : <Phone size={14} color="var(--brand-fleet)" style={{ opacity: 0.8 }} />}
                                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px', fontWeight: 700 }}>{s}</span>
                                            </div>
                                            <button
                                                onClick={() => removeContact(s)}
                                                style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    <form onSubmit={handleManualAdd} style={{ marginTop: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder="+ Link Email or Phone"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            style={{
                                                width: '100%',
                                                border: '1.5px dashed var(--border-color)',
                                                background: 'transparent',
                                                borderRadius: '12px',
                                                padding: '12px 16px',
                                                fontSize: '13px',
                                                color: 'var(--text-primary)',
                                                fontWeight: 700,
                                                outline: 'none',
                                                textAlign: 'center',
                                                transition: 'all 0.3s'
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand-fleet)'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                        />
                                    </form>
                                </div>
                            </motion.aside>
                        )}

                        <div style={{ flex: 1 }}>
                            
                            {/* Empty State / Search Panel */}
                            {seeds.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{
                                        padding: '80px 40px',
                                        background: '#ffffff',
                                        borderRadius: '32px',
                                        textAlign: 'center',
                                        border: '1.5px solid var(--border-color)',
                                        boxShadow: 'var(--shadow-sm)',
                                        maxWidth: '720px',
                                        margin: '0 auto'
                                    }}
                                >
                                    <div style={{
                                        width: 80, height: 80,
                                        background: 'rgba(127, 29, 29, 0.05)',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 32px',
                                        border: '1.5px solid rgba(127, 29, 29, 0.1)'
                                    }}>
                                        <ShoppingBag size={32} color="var(--brand-fleet)" />
                                    </div>
                                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px' }}>
                                        Retrieve Your Legacy
                                    </h2>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.6, fontSize: '15px' }}>
                                        Enter the email or phone number used during your Star Pace reservations to automatically sync your logistics.
                                    </p>
                                    
                                    <form onSubmit={handleManualAdd} style={{ maxWidth: 500, margin: '0 auto', display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row' }}>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <Search style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-fleet)', opacity: 0.6 }} size={18} />
                                            <input
                                                type="text"
                                                placeholder="Email or mobile number..."
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '16px 20px 16px 48px',
                                                    borderRadius: '99px',
                                                    background: 'var(--bg-secondary)',
                                                    border: '1.5px solid var(--border-color)',
                                                    fontSize: '15px',
                                                    color: 'var(--text-primary)',
                                                    fontWeight: 700,
                                                    outline: 'none',
                                                    transition: 'all 0.3s'
                                                }}
                                                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--brand-fleet)'}
                                                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            style={{
                                                padding: '0 32px',
                                                height: '54px',
                                                borderRadius: '99px',
                                                background: 'var(--brand-fleet)',
                                                color: '#ffffff',
                                                fontWeight: 800,
                                                fontSize: '12px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em',
                                                border: 'none',
                                                cursor: 'pointer',
                                                boxShadow: '0 8px 20px rgba(127,29,29,0.15)'
                                            }}
                                        >
                                            Link Account
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Loading State Spinner */}
                            {loading && (
                                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                                    <div style={{ 
                                        width: 44, 
                                        height: 44, 
                                        border: '3.5px solid var(--border-color)', 
                                        borderTop: '3.5px solid var(--brand-fleet)', 
                                        borderRadius: '50%', 
                                        margin: '0 auto 24px', 
                                        animation: 'spin 1s linear infinite' 
                                    }} />
                                    <p style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '11px', color: 'var(--brand-fleet)' }}>
                                        Syncing Reservation History...
                                    </p>
                                </div>
                            )}

                            {/* Error Alert */}
                            {error && <div style={{ color: '#ef4444', textAlign: 'center', padding: '20px', fontWeight: 700 }}>{error}</div>}

                            {/* Confirmations List */}
                            {reservations && reservations.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ display: 'grid', gap: '32px' }}
                                >
                                    {reservations.map((res, idx) => (
                                        <motion.div
                                            key={res.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.08 }}
                                            style={{
                                                background: '#ffffff',
                                                borderRadius: '24px',
                                                padding: '32px',
                                                border: '1.5px solid var(--border-color)',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                boxShadow: 'var(--shadow-sm)'
                                            }}
                                        >
                                            {/* Luxury Green Confirmed badge */}
                                            <div style={{
                                                position: 'absolute', 
                                                top: 0, 
                                                right: 0,
                                                padding: '8px 20px',
                                                background: 'rgba(16, 185, 129, 0.08)',
                                                color: '#10b981',
                                                fontSize: '10px',
                                                fontWeight: 800,
                                                borderBottomLeftRadius: '16px',
                                                letterSpacing: '0.15em',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 6,
                                                borderLeft: '1px solid rgba(16, 185, 129, 0.2)',
                                                borderBottom: '1px solid rgba(16, 185, 129, 0.2)'
                                            }}>
                                                <CheckCircle2 size={12} /> CONFIRMED
                                            </div>

                                            <div style={{ marginBottom: '24px' }}>
                                                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                                                    Reference ID <span style={{ color: 'var(--text-primary)', fontWeight: 900 }}>#{res.id}</span>
                                                </div>
                                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                                                    {res.productName || 'Executive Transport'}
                                                </h3>
                                            </div>

                                            {/* Details Matrix */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                                                <div>
                                                    <h4 style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                                                        Contact details
                                                    </h4>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                                            <Mail size={14} color="var(--brand-fleet)" /> <span>{res.email}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                                            <Phone size={14} color="var(--brand-fleet)" /> <span>{res.phone}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 style={{ fontSize: '10px', fontWeight: 800, color: 'var(--brand-fleet)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                                                        Itinerary
                                                    </h4>
                                                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5, fontWeight: 600 }}>
                                                        <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                            <Calendar size={14} color="var(--brand-fleet)" />
                                                            {res.start} to {res.end}
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                            📍 {res.location || 'Accra, Ghana'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: isMobile ? 'left' : 'right', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginTop: isMobile ? '16px' : 0 }}>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                        Total Value
                                                    </div>
                                                    <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-primary)' }}>
                                                        ${res.price}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {/* Empty Query result details */}
                            {reservations && reservations.length === 0 && seeds.length > 0 && !loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ 
                                        textAlign: 'center', 
                                        padding: '80px 40px', 
                                        background: '#ffffff', 
                                        borderRadius: '24px', 
                                        border: '1.5px dashed var(--border-color)' 
                                    }}
                                >
                                    <Box size={40} color="var(--brand-fleet)" style={{ marginBottom: '20px', opacity: 0.6 }} />
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 600 }}>
                                        No active bookings could be located for these profiles.
                                    </p>
                                    <button
                                        onClick={() => { setSeeds([]); localStorage.removeItem('atlas_linked_contacts_v1'); }}
                                        style={{ 
                                            marginTop: '24px', 
                                            color: 'var(--brand-fleet)', 
                                            background: 'transparent', 
                                            border: '1.5px solid var(--brand-fleet)', 
                                            padding: '10px 24px', 
                                            borderRadius: '99px', 
                                            cursor: 'pointer', 
                                            fontWeight: 800, 
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-fleet)'; e.currentTarget.style.color = '#ffffff'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--brand-fleet)'; }}
                                    >
                                        Clear History & Start Fresh
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
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
