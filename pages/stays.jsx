import React from 'react'
import Products from '../components/Products'
import Layout from '../components/Layout'
import Head from 'next/head'

export default function StaysPage() {
  return (
    <>
      <Head>
        <title>Luxury Stays | Star Pace</title>
        <meta name="description" content="Discover elite stays and premium rooms curated for the discerning traveler." />
      </Head>
      <div style={{ paddingTop: '80px' }}>
        <section style={{ padding: '80px 24px 40px', textAlign: 'center', background: '#fcfcfd' }}>
           <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 16 }}>Elite Accommodations</div>
           <h1 style={{ fontSize: 48, fontWeight: 900, color: 'var(--accent)', marginBottom: 24, letterSpacing: '-0.02em' }}>
             Curated <span style={{ color: 'var(--accent-gold)' }}>Stays</span>
           </h1>
           <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
             From panoramic penthouses to serene coastal villas, experience the pinnacle of hospitality with Star Pace.
           </p>
        </section>
        <Products />
      </div>
    </>
  )
}
