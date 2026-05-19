import React from 'react'
import Products from '../components/Products'
import Layout from '../components/Layout'
import Head from 'next/head'

export default function StaysPage() {
  return (
    <Layout>
      <Head>
        <title>Elite Residences | Star Pace</title>
        <meta name="description" content="Discover elite residences and premium suites curated for the discerning traveler." />
      </Head>
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        
        {/* Editorial Residences Header */}
        <section className="editorial-header">
          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ width: '4px', height: '60px', background: 'var(--brand-fleet)' }} />
            <div>
              <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.3em', display: 'block', marginBottom: '8px' }}>
                THE SOVEREIGN RESIDENCES
              </span>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                Elite <span style={{ color: 'var(--brand-fleet)' }}>Residences</span>.
              </h1>
            </div>
          </div>
          <div style={{ maxWidth: 1400, margin: '0 auto', paddingTop: '24px' }}>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: 700, margin: 0, lineHeight: 1.8 }}>
              From panoramic high-rise penthouses to serene coastal villas, experience the pinnacle of bespoke hospitality in West Africa.
            </p>
          </div>
        </section>

        {/* Catalog Grid */}
        <Products endpoint="/api/residence" />
      </div>
    </Layout>
  )
}
