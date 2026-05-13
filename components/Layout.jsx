import React from 'react'

export default function Layout({ children }){
  return (
    <div className="page-wrapper">
      <div className="page-container">
        {children}
      </div>
    </div>
  )
}
