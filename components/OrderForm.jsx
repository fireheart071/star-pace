import React from 'react'

export default function OrderForm({ item, onCancel, onSuccess }){
  return (
    <form>
      <div>
        <label>Name</label>
        <input name="name" />
      </div>
      <div>
        <label>Email</label>
        <input name="email" />
      </div>
      <div style={{display:'flex',gap:8,marginTop:12}}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Order</button>
      </div>
    </form>
  )
}
