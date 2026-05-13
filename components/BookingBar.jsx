import React from 'react'

export default function BookingBar(){
  return (
    <div style={{padding:12,background:'rgba(0,0,0,0.02)',display:'flex',gap:12,alignItems:'center',justifyContent:'center'}}>
      <div style={{fontWeight:700}}>Need assistance?</div>
      <a href="/contact" className="small cta" style={{textDecoration:'none'}}>Contact Sales</a>
    </div>
  )
}
