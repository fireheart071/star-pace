import { useRouter } from 'next/router'
import React from 'react'

export default function OrdersPage(){
  const router = useRouter()

  React.useEffect(()=>{
    router.replace('/admin/login')
  }, [router])

  return null
}

// Hide global Navbar/Footer while redirecting
OrdersPage.noLayout = true
