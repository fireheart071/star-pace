import React from 'react'
import Products from '../../components/Products'
import Layout from '../../components/Layout'
import Head from 'next/head'

export default function VehiclesPage() {
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Layout>
      <Head>
        <title>The Premium Fleet | Star Pace</title>
        <meta name="description" content="Explore the Star Pace fleet of elite luxury sedans, corporate SUVs, and professional chauffeur drives." />
      </Head>
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        
        {/* Editorial Fleet Header */}
        <section className="editorial-header">
          <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ width: '4px', height: '60px', background: 'var(--brand-fleet)' }} />
            <div>
              <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.3em', display: 'block', marginBottom: '8px' }}>
                PREMIUM MOBILITY
              </span>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                The Pace <span style={{ color: 'var(--brand-fleet)' }}>Fleet</span>.
              </h1>
            </div>
          </div>
          <div style={{ maxWidth: 1400, margin: '0 auto', paddingTop: '24px' }}>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: 700, margin: 0, lineHeight: 1.8 }}>
              From high-end executive SUVs to pristine armored sedans, cruise with absolute privacy, discretion, and comfort across West Africa.
            </p>
          </div>
        </section>

        {/* Fleet Catalog Grid */}
        <Products endpoint="/api/vehicles" />
      </div>
    </Layout>
  )
}
