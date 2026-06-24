import React from 'react'
import { useRouter } from 'next/router'
import {
  Search,
  MessageSquare,
  Star,
  Trash2,
  Eye,
  Calendar,
  X
} from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'

export default function AdminReviews() {
  const router = useRouter()
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [search, setSearch] = React.useState('')
  const [filterRating, setFilterRating] = React.useState('all')
  const [viewItem, setViewItem] = React.useState(null)

  const sameId = React.useCallback((a, b) => String(a) === String(b), [])

  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    if (!token) { router.replace('/admin/login'); return }
    let mounted = true
      ; (async () => {
        try {
          const res = await fetch('/api/reviews', { headers: { Authorization: `Bearer ${token}` } })
          if (res.status === 401) {
            localStorage.removeItem('admin_token')
            router.replace('/admin/login')
            return
          }
          if (!res.ok) throw new Error('Failed to load reviews')
          const data = await res.json()
          if (mounted) setItems(Array.isArray(data) ? data : [])
        } catch (e) { if (mounted) setError(e.message || String(e)) }
        if (mounted) setLoading(false)
      })()
    return () => { mounted = false }
  }, [router])

  async function remove(id) {
    if (!confirm('Delete this client review permanently?')) return
    setError('')
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 401) {
        localStorage.removeItem('admin_token')
        router.replace('/admin/login')
        return
      }
      if (!res.ok) throw new Error('Failed to delete')
      setItems(s => s.filter(i => !sameId(i.id, id)))
    } catch (e) { setError(e.message || String(e)) }
  }

  const filtered = items.filter(i => {
    const q = search.trim().toLowerCase()
    if (q && !(`${i.name} ${i.comment} ${i.bookingId || ''}`.toLowerCase()).includes(q)) return false
    if (filterRating !== 'all' && Number(i.rating) !== Number(filterRating)) return false
    return true
  })

  function formatDate(isoStr) {
    if (!isoStr) return '-'
    const d = new Date(isoStr)
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <AdminLayout title="Client Reviews">
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: 48
      }}>
        <div style={{ display: 'flex', gap: 32, flex: 1, alignItems: 'center' }}>
           <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
              <Search size={16} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input 
                placeholder="Search reviews..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                style={{ 
                  width: '100%', height: 40, padding: '0 0 0 28px', borderRadius: 0, 
                  border: 'none', borderBottom: '1px solid #E2E8F0', background: 'transparent', outline: 'none', fontSize: 14, color: '#0F172A'
                }}
              />
           </div>
           <select
             value={filterRating}
             onChange={e => setFilterRating(e.target.value)}
             style={{ height: 40, padding: '0 12px', border: 'none', borderBottom: '1px solid #E2E8F0', background: 'transparent', color: '#475569', fontWeight: 700, outline: 'none', fontSize: 13 }}
           >
             <option value="all">All Ratings</option>
             <option value="5">5 Stars</option>
             <option value="4">4 Stars</option>
             <option value="3">3 Stars</option>
             <option value="2">2 Stars</option>
             <option value="1">1 Star</option>
           </select>
        </div>
      </div>

      {loading && <div style={{ padding: 120, textAlign: 'center', color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Synchronizing reviews...</div>}
      {error && <div className="login-error" style={{ marginBottom: 32 }}>{error}</div>}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 80, border: '1px dashed #E2E8F0', borderRadius: 24 }}>
          <MessageSquare size={48} style={{ color: '#E2E8F0', marginBottom: 16 }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>No Reviews Found</h3>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="admin-list-container">
          {/* List Header */}
          <div className="admin-list-header" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.5fr 1fr 2fr 1fr 120px', 
            gap: 24, 
            padding: '16px 0', 
            borderBottom: '1px solid #E2E8F0',
            color: '#64748B',
            fontSize: 10,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 1.5
          }}>
            <span>Client</span>
            <span>Rating</span>
            <span>Comment</span>
            <span>Booking ID</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {filtered.map(item => (
            <div key={item.id} className="admin-list-row" style={{ 
               padding: '24px 0',
               display: 'grid',
               gridTemplateColumns: '1.5fr 1fr 2fr 1fr 120px',
               gap: 24,
               alignItems: 'center',
               borderBottom: '1px solid #F8FAFC'
            }}>
               {/* Client Info */}
               <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{item.name}</h3>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={12} /> {formatDate(item.createdAt)}
                  </div>
               </div>

               {/* Rating */}
               <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star 
                      key={idx} 
                      size={14} 
                      fill={idx < item.rating ? 'var(--accent-gold)' : 'none'} 
                      stroke={idx < item.rating ? 'var(--accent-gold)' : '#CBD5E1'} 
                      style={{ color: 'var(--accent-gold)' }}
                    />
                  ))}
               </div>

               {/* Comment Preview */}
               <div style={{ fontSize: 13, fontWeight: 500, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.comment}
               </div>

               {/* Booking ID */}
               <div style={{ fontSize: 13, fontWeight: 700, color: '#24276F' }}>
                  {item.bookingId ? `#${item.bookingId}` : '-'}
               </div>

               {/* Actions */}
               <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                  <button onClick={() => setViewItem(item)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 0 }} title="View Detailed"><Eye size={16} strokeWidth={2} /></button>
                  <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', padding: 0 }} title="Delete Review"><Trash2 size={16} strokeWidth={2} /></button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal to view full details */}
      <Modal open={!!viewItem} title="Review Details" onClose={() => setViewItem(null)}>
        {viewItem && (
          <div style={{ padding: '20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 16, marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0F172A' }}>{viewItem.name}</h3>
                <span style={{ fontSize: 12, color: '#64748B' }}>Submitted: {formatDate(viewItem.createdAt)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star 
                    key={idx} 
                    size={16} 
                    fill={idx < viewItem.rating ? 'var(--accent-gold)' : 'none'} 
                    stroke={idx < viewItem.rating ? 'var(--accent-gold)' : '#CBD5E1'} 
                  />
                ))}
              </div>
            </div>

            {viewItem.bookingId && (
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>Booking Reference</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#24276F' }}>#{viewItem.bookingId}</span>
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Client Comment</span>
              <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.8, background: '#F8FAFC', padding: 16, borderRadius: 8, margin: 0 }}>
                {viewItem.comment}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
              <button 
                onClick={() => setViewItem(null)}
                style={{ 
                  height: 40, padding: '0 24px', background: '#F1F5F9', color: '#475569', 
                  borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer', 
                  transition: '0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#E2E8F0'}
                onMouseLeave={e => e.currentTarget.style.background = '#F1F5F9'}
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}
