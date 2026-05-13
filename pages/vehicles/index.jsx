import React from 'react'
import Products from '../../components/Products'
import Layout from '../../components/Layout'

export default function VehiclesPage() {
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Layout>
      <div style={{ paddingTop: 100, paddingBottom: 60 }}>
        <section style={{ padding: '40px 24px', textAlign: 'center' }}>
           <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: 16 }}>Premium Mobility</div>
           <h1 style={{ fontSize: 48, fontWeight: 900, color: 'var(--accent)', marginBottom: 24, letterSpacing: '-0.02em' }}>
             The Pace <span style={{ color: 'var(--accent-gold)' }}>Fleet</span>
           </h1>
        </section>
        <Products />
      </div>
    </Layout>
  )
}
