import React from 'react'
import { useRouter } from 'next/router'
import CldOptimizedImage from './CldOptimizedImage'

export default function ProductCard({ item }) {
  const router = useRouter()

  return (
    <article className="product-card" onClick={() => router.push(`/reservation/${item.id}`)} style={{ cursor: 'pointer' }}>
      <div className="product-card-img-wrap">
        <CldOptimizedImage
          width={600}
          height={400}
          src={item.image}
          alt={item.name}
        />
      </div>
      
      <div className="product-card-content">
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>
          {item.category ? item.category.replace(/ cars?/i, '') : 'Luxury'}
        </div>
        <h3>{item.name}</h3>
        <div className="product-price">
          {item.price || item.rate} GHS <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/ day</span>
        </div>
        
        <div className="product-specs">
          <div className="spec-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
            {item.specs?.seats || '4'} Seats
          </div>
          <div className="spec-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 12h20"/><path d="m5 7-3 5 3 5"/><path d="m19 7 3 5-3 5"/></svg>
            {item.specs?.transmission || 'Automatic'}
          </div>
          <div className="spec-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22v-8"/><path d="M7 22v-6"/><path d="M11 22v-4"/><path d="M15 22v-2"/><path d="M19 22V4"/><path d="M2 22h20"/></svg>
            {item.specs?.fuelType || 'Petrol / EV'}
          </div>
          <div className="spec-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m12 6 4 6-4 6-4-6 4-6z"/></svg>
            {item.range ? `${item.range} ${item.rangeUnit || ''}` : 'Unlimited km'}
          </div>
        </div>

        <button className="btn-outline">
          Reserve Vehicle
        </button>
      </div>
    </article>
  )
}
