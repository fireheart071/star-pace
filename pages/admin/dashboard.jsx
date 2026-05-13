import React from 'react'
import { useRouter } from 'next/router'
import {
  ShoppingBag,
  Box,
  Newspaper,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  TrendingDown,
  ArrowDownRight,
  ArrowRight,
  Activity,
  Calendar,
  Zap,
  ChevronRight
} from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [data, setData] = React.useState({ orders: [], vehicles: [], news: [], testimonials: [] })
  const [counts, setCounts] = React.useState({ orders: 0, vehicles: 0, news: 0, testimonials: 0 })

  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    if (!token) { router.replace('/admin/login'); return }

    let mounted = true
      ; (async () => {
        try {
          const [oRes, mRes, nRes, tRes] = await Promise.all([
            fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } }),
            fetch('/api/vehicles', { headers: { Authorization: `Bearer ${token}` } }),
            fetch('/api/news', { headers: { Authorization: `Bearer ${token}` } }),
            fetch('/api/testimonials', { headers: { Authorization: `Bearer ${token}` } })
          ])

          if (oRes.status === 401 || mRes.status === 401 || nRes.status === 401 || tRes.status === 401) {
            localStorage.removeItem('admin_token')
            router.replace('/admin/login')
            return
          }

          const [o, m, n, t] = await Promise.all([
            oRes.ok ? oRes.json() : [],
            mRes.ok ? mRes.json() : [],
            nRes.ok ? nRes.json() : [],
            tRes.ok ? tRes.json() : []
          ])
          
          if (mounted) {
            setData({ orders: o, vehicles: m, news: n, testimonials: t })
            setCounts({
              orders: Array.isArray(o) ? o.length : 0,
              vehicles: Array.isArray(m) ? m.length : 0,
              news: Array.isArray(n) ? n.length : 0,
              testimonials: Array.isArray(t) ? t.length : 0
            })
          }
        } catch (e) { if (mounted) setError(e.message || String(e)) }
        if (mounted) setLoading(false)
      })()

    return () => { mounted = false }
  }, [router])

  const stats = [
    { 
      label: 'Estimated Revenue', 
      value: `₵${data.orders.reduce((sum, o) => sum + (parseFloat(o.price || o.rate) || 0), 0).toLocaleString()}`, 
      icon: <Zap size={24} />, 
      color: 'var(--primary-gold)', 
      bg: 'rgba(223,151,56,0.1)', 
      href: '/admin/orders', 
      trend: 'Gross Volume' 
    },
    { label: 'Total Orders', value: counts.orders, icon: <ShoppingBag size={24} />, color: '#fff', bg: 'var(--primary)', href: '/admin/orders', trend: 'Live Feed' },
    { label: 'Fleet Assets', value: counts.vehicles, icon: <Box size={24} />, color: '#fff', bg: 'var(--primary)', href: '/admin/vehicles', trend: 'In Stock' },
    { label: 'Editorial Dispatches', value: counts.news, icon: <Newspaper size={24} />, color: '#fff', bg: 'var(--primary)', href: '/admin/blog', trend: 'Latest' }
  ]

  const sortedOrders = [...data.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const formatDistanceToNow = (dateString) => {
    if (!dateString) return 'recently'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'recently'
    const now = new Date()
    const diff = now - date
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (mins > 0) return `${mins}m ago`
    return 'just now'
  }

  return (
    <AdminLayout title="System Overview">
      {loading && <div style={{ padding: 120, textAlign: 'center', color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Synchronizing Data...</div>}
      {error && <div className="login-error" style={{ marginBottom: 32 }}>{error}</div>}

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
          
          {/* Metrics Ledger */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40 }}>
            {stats.map((stat, i) => (
              <div
                key={i}
                onClick={() => router.push(stat.href)}
                style={{
                  cursor: 'pointer',
                  borderTop: '2px solid #F1F5F9',
                  paddingTop: 24,
                  transition: '0.3s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                   <div style={{ fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>{stat.label}</div>
                   <div style={{ color: '#059669', fontSize: 12, fontWeight: 800 }}>{stat.trend}</div>
                </div>
                <div style={{ fontSize: 42, fontWeight: 700, color: '#24276F', letterSpacing: '-0.02em' }}>{stat.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 80 }}>
            
            {/* Activity Ledger */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>Recent Activity</h3>
                <button 
                  onClick={() => router.push('/admin/orders')}
                  style={{ fontSize: 11, fontWeight: 800, color: '#24276F', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textTransform: 'uppercase', letterSpacing: 1 }}>
                   General Ledger
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {sortedOrders.length > 0 ? sortedOrders.slice(0, 5).map((order, i) => (
                  <div key={i} style={{ display: 'flex', gap: 24, alignItems: 'center', padding: '24px 0', borderBottom: '1px solid #F8FAFC' }}>
                    <div style={{ 
                      width: 44, height: 44, borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#24276F' 
                    }}>
                      <ShoppingBag size={18} strokeWidth={2} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>
                        New reservation for {order.name || 'Anonymous Client'}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: 500 }}>
                        {order.productName} • {formatDistanceToNow(order.createdAt)}
                      </div>
                    </div>
                    <button 
                      onClick={() => router.push(`/admin/orders`)}
                      style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer' }}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )) : (
                  <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748B', fontSize: 13 }}>No recent activity recorded.</div>
                )}
              </div>
            </div>

            {/* Core Status */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>Core Configuration</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                {[
                  { label: 'Data Synchronization', value: 'Active' },
                  { label: 'Cloud Persistence', value: 'Healthy' },
                  { label: 'Security Layer', value: 'Encrypted' }
                ].map((core, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>{core.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                       <span style={{ fontSize: 16, fontWeight: 700, color: '#24276F' }}>{core.value}</span>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={() => router.push('/admin/settings')}
                  style={{ 
                     width: 'fit-content', padding: '14px 28px', background: '#24276F', 
                     color: '#fff', border: 'none', borderRadius: 12, 
                     fontWeight: 700, fontSize: 12, cursor: 'pointer', marginTop: 16, transition: '0.3s'
                  }}
                >
                   System Settings
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </AdminLayout>
  )
}

AdminDashboard.noLayout = true
