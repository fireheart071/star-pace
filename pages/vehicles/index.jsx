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
        <Products />
      </div>
    </Layout>
  )
}
