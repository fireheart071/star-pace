import React from 'react'
import { useRouter } from 'next/router'
import {
  Search,
  ShoppingBag,
  FileText,
  User,
  Calendar,
  Mail,
  MapPin,
  MessageSquare,
  Clock,
  Eye,
  Trash2,
  CheckCircle2,
  ChevronRight
} from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'

export default function AdminOrders() {
  const router = useRouter()
  const [orders, setOrders] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [updating, setUpdating] = React.useState(false)
  const [error, setError] = React.useState('')
  const [search, setSearch] = React.useState('')
  const [sortBy, setSortBy] = React.useState('newest')
  const [viewItem, setViewItem] = React.useState(null)

  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    if (!token) { router.replace('/admin/login'); return }
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 401) {
          localStorage.removeItem('admin_token'); router.replace('/admin/login')
          return
        }
        if (!res.ok) throw new Error('Failed to load orders')
        const data = await res.json()
        if (mounted) setOrders(Array.isArray(data) ? data : [])
      } catch (e) { if (mounted) setError(e.message || String(e)) }
      if (mounted) setLoading(false)
    })()
  }, [router])

  const filtered = orders.filter(o => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      (o.productName || '').toLowerCase().includes(q) ||
      (o.name || '').toLowerCase().includes(q) ||
      (o.email || '').toLowerCase().includes(q) ||
      (o.id || '').toLowerCase().includes(q)
    )
  }).sort((a, b) => {
    if (sortBy === 'newest') return (b.id || '').localeCompare(a.id || '')
    if (sortBy === 'oldest') return (a.id || '').localeCompare(b.id || '')
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
    return 0
  })

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch (e) { return dateStr }
  }

  const updateStatus = async (id, status) => {
    setUpdating(true)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      })
      if (res.status === 401) {
        localStorage.removeItem('admin_token')
        router.replace('/admin/login')
        return
      }
      if (!res.ok) throw new Error('Failed to update status')
      const updated = await res.json()
      setOrders(prev => prev.map(o => o.id === id ? updated : o))
      setViewItem(updated)
    } catch (e) { alert(e.message) } finally { setUpdating(false) }
  }
  
  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order record permanently?')) return
    setUpdating(true)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 401) {
        localStorage.removeItem('admin_token')
        router.replace('/admin/login')
        return
      }
      if (!res.ok) throw new Error('Failed to delete order')
      setOrders(prev => prev.filter(o => o.id !== id))
      if (viewItem?.id === id) setViewItem(null)
    } catch (e) { alert(e.message) } finally { setUpdating(false) }
  }

  return (
    <AdminLayout title="Reservation Registry">
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: 48
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search size={16} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input 
            placeholder="Search bookings..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            style={{ 
              width: '100%', height: 40, padding: '0 0 0 28px', borderRadius: 0, 
              border: 'none', borderBottom: '1px solid #E2E8F0', background: 'transparent', outline: 'none', fontSize: 14, color: '#0F172A'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
           <select 
             value={sortBy} 
             onChange={e => setSortBy(e.target.value)}
             style={{ height: 40, padding: '0 12px', background: 'transparent', border: 'none', borderBottom: '1px solid #E2E8F0', fontSize: 13, fontWeight: 700, color: '#24276F', outline: 'none' }}
           >
             <option value="newest">Newest First</option>
             <option value="oldest">Oldest First</option>
             <option value="name">Customer Name</option>
           </select>
        </div>
      </div>

      {loading && <div style={{ padding: 120, textAlign: 'center', color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Synchronizing Registry...</div>}
      {error && <div className="login-error" style={{ marginBottom: 32 }}>{error}</div>}

      {!loading && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* List Header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '56px 2fr 1fr 1fr 120px', 
            gap: 32, 
            padding: '16px 0', 
            borderBottom: '1px solid #E2E8F0',
            color: '#64748B',
            fontSize: 10,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 1.5
          }}>
            <span>Type</span>
            <span>Customer & Asset</span>
            <span>Schedule</span>
            <span>Investment</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {filtered.map(o => (
            <div key={o.id} style={{ 
               padding: '28px 0',
               display: 'grid',
               gridTemplateColumns: '56px 2fr 1fr 1fr 120px',
               gap: 32,
               alignItems: 'center',
               borderBottom: '1px solid #F8FAFC'
            }}>
               <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F8FAFC', border: '1px solid #F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBag size={18} strokeWidth={2} />
               </div>
               
               <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{o.productName}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginTop: 3 }}>
                     {o.name} <span style={{ color: '#CBD5E1', margin: '0 8px' }}>•</span> #{String(o.id).substring(0, 8).toUpperCase()}
                  </div>
               </div>

               <div style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>
                  {formatDate(o.createdAt)}
               </div>

               <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#24276F' }}>₵{o.price || o.rate}</div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: o.status === 'Approved' ? '#059669' : '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>
                     {o.status === 'Approved' ? 'Verified' : 'Pending'}
                  </div>
               </div>

               <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                  <button onClick={() => setViewItem(o)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 0 }} title="Dossier"><Eye size={18} strokeWidth={2} /></button>
                  <a href={`/api/invoice/${o.id}`} target="_blank" rel="noreferrer" style={{ color: '#64748B' }} title="Invoice">
                     <FileText size={18} strokeWidth={2} />
                  </a>
                  <button onClick={() => deleteOrder(o.id)} style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', padding: 0 }} title="Delete"><Trash2 size={18} strokeWidth={2} /></button>
               </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!viewItem} title="Reservation Dossier" onClose={() => setViewItem(null)}>
        {viewItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: '12px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
              {[
                { label: 'Reference', value: `#${viewItem.id}` },
                { label: 'Client', value: viewItem.name },
                { label: 'Asset', value: viewItem.productName },
                { label: 'Investment', value: `${viewItem.price || viewItem.rate} GHS` },
                { label: 'Check-In', value: viewItem.start },
                { label: 'Check-Out', value: viewItem.end }
              ].map((spec, i) => (
                <div key={i}>
                   <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>{spec.label}</div>
                   <div style={{ fontSize: 15, fontWeight: 700, color: '#24276F' }}>{spec.value}</div>
                </div>
              ))}
            </div>

            {viewItem.note && (
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 32 }}>
                 <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Special Requests</div>
                 <div style={{ color: '#475569', fontSize: 15, fontStyle: 'italic', lineHeight: 1.8 }}>"{viewItem.note}"</div>
              </div>
            )}

            <div style={{ marginTop: 12, display: 'flex', gap: 16, alignItems: 'center' }}>
              {viewItem.status !== 'Approved' && (
                <button
                  onClick={() => updateStatus(viewItem.id, 'Approved')}
                  disabled={updating}
                  style={{ height: 44, padding: '0 32px', background: '#24276F', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  {updating ? 'Processing...' : 'Verify Reservation'}
                </button>
              )}
              {viewItem.status === 'Approved' && (
                <div style={{ color: '#059669', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                   <CheckCircle2 size={18} strokeWidth={2.5} /> Asset Verified
                </div>
              )}
              <button onClick={() => setViewItem(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#475569', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Close Dossier</button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}

AdminOrders.noLayout = true
