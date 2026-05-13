import React from 'react'
import { useRouter } from 'next/router'

export default function AdminPage() {
  const router = useRouter()

  React.useEffect(() => {
    router.replace('/admin/login')
  }, [router])

  return null
}

// Prevent global Navbar/Footer for this route (we redirect to login)
AdminPage.noLayout = true
