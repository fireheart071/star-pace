import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  LayoutDashboard,
  ShoppingCart,
  Box,
  Newspaper,
  MessageSquare,
  Users,
  ChevronRight,
  LogOut,
  Settings,
  Menu,
  X,
  Image as ImageIcon
} from 'lucide-react'

export default function AdminLayout({ title, children }) {
  const router = useRouter()
  const path = router?.pathname || ''
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
  }, [])

  useEffect(() => {
    // Close sidebar on route change
    setIsSidebarOpen(false)
  }, [path])

  function handleLogout(e) {
    if (e && e.preventDefault) e.preventDefault()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
      router.push('/admin/login')
    }
  }

  const nav = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { href: '/admin/orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { href: '/admin/vehicles', label: 'Vehicles', icon: <Box size={20} /> },
    { href: '/admin/blog', label: 'Editorial Blog', icon: <Newspaper size={20} /> },
    { href: '/admin/testimonials', label: 'Reviews', icon: <MessageSquare size={20} /> },
    { href: '/admin/gallery', label: 'Gallery', icon: <ImageIcon size={20} /> },
    { href: '/admin/team', label: 'Leadership', icon: <Users size={20} /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> }
  ]

  return (
    <div className={`admin-shell ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="admin-sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className="admin-sidebar">
        <div className="sidebar-logo-area">
          <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '0.1em', color: '#24276F' }}>ATLAS</div>
            <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.2em', color: '#DF9738', marginTop: 4 }}>ADMINISTRATION</div>
          </Link>
          <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-scrollable-section" style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
          <nav className="admin-nav">
            {nav.map(item => {
              const isActive = path === item.href
              return (
                <Link key={item.href} href={item.href} className={isActive ? 'active' : ''} style={{ 
                    borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none',
                    transition: '0.2s'
                }}>
                  <div className="nav-icon" style={{ color: isActive ? '#fff' : '#64748B', display: 'flex', alignItems: 'center' }}>
                    {React.cloneElement(item.icon, { size: 16, strokeWidth: isActive ? 2 : 1.5 })}
                  </div>
                  <span className="nav-label" style={{ fontWeight: isActive ? 700 : 600, fontSize: 13, color: isActive ? '#fff' : '#475569' }}>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            style={{ 
              width: '100%', padding: '0', background: 'none', border: 'none', 
              color: '#64748B', fontSize: 11, fontWeight: 800, 
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: 1
            }}
          >
            <LogOut size={12} strokeWidth={2} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="mobile-nav-toggle" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="header-title" style={{ fontSize: 12, fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: 2 }}>
               {title || 'Administrative Center'}
            </div>
          </div>

          <div className="header-right">
             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 28, height: 28, background: '#F8FAFC', borderRadius: '50%', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#24276F' }}>A</div>
                <span className="header-user-role" style={{ fontSize: 12, fontWeight: 700, color: '#24276F' }}>Executive</span>
             </div>
          </div>
        </header>

        <main className="admin-content-wrapper">
          {children}
        </main>
      </div>
    </div>
  )
}
