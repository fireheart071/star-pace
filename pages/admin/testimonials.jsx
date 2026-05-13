import React from 'react'
import { useRouter } from 'next/router'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MessageSquare,
  User,
  Eye,
  CheckCircle2
} from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import CldOptimizedImage from '../../components/CldOptimizedImage'

function empty() { return { name: '', role: '', quote: '', status: 'active', avatar: '' } }

export default function AdminTestimonials() {
  const router = useRouter()
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [form, setForm] = React.useState(empty())
  const [showCreate, setShowCreate] = React.useState(false)
  const [editingId, setEditingId] = React.useState(null)
  const [imagePreview, setImagePreview] = React.useState('')
  const [search, setSearch] = React.useState('')
  const [viewItem, setViewItem] = React.useState(null)

  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    if (!token) { router.replace('/admin/login'); return }
    let mounted = true
      ; (async () => {
        try {
          const res = await fetch('/api/testimonials', { headers: { Authorization: `Bearer ${token}` } })
          if (res.status === 401) {
            localStorage.removeItem('admin_token'); router.replace('/admin/login')
            return
          }
          if (!res.ok) throw new Error('Failed to load testimonials')
          const data = await res.json()
          if (mounted) setItems(Array.isArray(data) ? data : [])
        } catch (e) { if (mounted) setError(e.message || String(e)) }
        if (mounted) setLoading(false)
      })()
  }, [router])

  function onChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  async function onImageFile(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader(); reader.onload = () => setImagePreview(reader.result); reader.readAsDataURL(file)
    try {
      const formData = new FormData(); formData.append('image', file)
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData })
      if (res.status === 401) {
        localStorage.removeItem('admin_token')
        router.replace('/admin/login')
        return
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setForm(f => ({ ...f, avatar: data.url }))
    } catch (err) { setError('Image upload failed: ' + err.message) }
  }

  function edit(item) {
    setForm({ name: item.name || '', role: item.role || '', quote: item.quote || '', status: item.status || 'active', avatar: item.avatar || '' })
    setEditingId(item.id); setImagePreview(item.avatar || ''); setShowCreate(true)
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault()
    setError('')
    const token = localStorage.getItem('admin_token')
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials'
    try {
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      })
      if (res.status === 401) {
        localStorage.removeItem('admin_token')
        router.replace('/admin/login')
        return
      }
      if (!res.ok) throw new Error('Failed to save')
      const item = await res.json()
      if (editingId) setItems(s => s.map(i => i.id === editingId ? item : i))
      else setItems(s => [item, ...s])
      setForm(empty()); setEditingId(null); setImagePreview(''); setShowCreate(false)
    } catch (e) { setError(e.message || String(e)) }
  }

  async function remove(id) {
    if (!confirm('Delete this testimonial?')) return
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 401) {
        localStorage.removeItem('admin_token')
        router.replace('/admin/login')
        return
      }
      if (!res.ok) throw new Error('Failed to delete')
      setItems(s => s.filter(i => i.id !== id))
    } catch (e) { setError(e.message || String(e)) }
  }

  const filtered = items.filter(i => {
    const q = search.trim().toLowerCase()
    return q ? (`${i.name} ${i.role} ${i.quote}`.toLowerCase()).includes(q) : true
  })

  return (
    <AdminLayout title="Client Endorsements">
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 48
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search size={16} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input
            placeholder="Search endorsements..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', height: 40, padding: '0 0 0 28px', borderRadius: 0,
              border: 'none', borderBottom: '1px solid #E2E8F0', background: 'transparent', outline: 'none', fontSize: 14, color: '#0F172A'
            }}
          />
        </div>
        <button
          onClick={() => { setForm(empty()); setEditingId(null); setImagePreview(''); setShowCreate(true); }}
          style={{ height: 44, padding: '0 24px', background: '#24276F', color: '#fff', borderRadius: 12, border: 'none', fontWeight: 700, cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <Plus size={18} /> New Entry
        </button>
      </div>

      {loading && <div style={{ padding: 120, textAlign: 'center', color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Synchronizing Content...</div>}
      {error && <div className="login-error" style={{ marginBottom: 32 }}>{error}</div>}

      {!loading && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* List Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '64px 1.5fr 3fr 120px',
            gap: 32,
            padding: '16px 0',
            borderBottom: '1px solid #E2E8F0',
            color: '#64748B',
            fontSize: 10,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 1.5
          }}>
            <span>Patron</span>
            <span>Identity</span>
            <span>Testimonial</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {filtered.map(item => (
            <div key={item.id} style={{
              padding: '28px 0',
              display: 'grid',
              gridTemplateColumns: '64px 1.5fr 3fr 120px',
              gap: 32,
              alignItems: 'center',
              borderBottom: '1px solid #F8FAFC'
            }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                <CldOptimizedImage src={item.avatar || item.image || '/placeholder-avatar.png'} alt={item.name} width={44} height={44} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{item.name}</h3>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginTop: 2 }}>{item.role || 'Verified Patron'}</div>
              </div>

              <div style={{ color: '#334155', fontSize: 14, lineHeight: 1.6, fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                "{item.quote}"
              </div>

              <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                <button onClick={() => edit(item)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 0 }} title="Edit"><Edit2 size={16} strokeWidth={2} /></button>
                <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', padding: 0 }} title="Delete"><Trash2 size={16} strokeWidth={2} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showCreate} title={editingId ? "Edit Endorsement" : "New Endorsement"} onClose={() => setShowCreate(false)}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: '12px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div className="field-group">
              <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Patron Name</label>
              <input name="name" placeholder="Full Identity" value={form.name} onChange={onChange} required style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500 }} />
            </div>
            <div className="field-group">
              <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Designation</label>
              <input name="role" placeholder="e.g. Executive Partner" value={form.role} onChange={onChange} style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500 }} />
            </div>
          </div>
          <div className="field-group">
            <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Client Quote</label>
            <textarea name="quote" placeholder="Statement of excellence..." value={form.quote} onChange={onChange} required style={{ width: '100%', minHeight: 120, borderRadius: 8, border: '1px solid #E2E8F0', padding: '12px', outline: 'none', resize: 'vertical', fontSize: 14, fontWeight: 500 }} />
          </div>
          <div className="field-group">
            <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Media Asset</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <input name="avatar" placeholder="Source URL" value={form.avatar} onChange={onChange} style={{ flex: 1, height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500 }} />
              <label style={{ height: 44, padding: '0 20px', background: '#F8FAFC', color: '#24276F', borderRadius: 8, display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 12, cursor: 'pointer', border: '1px solid #E2E8F0' }}>
                BROWSE
                <input type="file" accept="image/*" onChange={onImageFile} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
          {imagePreview && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
              <img src={imagePreview} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #E2E8F0' }} />
            </div>
          )}
          <div style={{ marginTop: 12 }}>
            <button type="submit" style={{ width: '100%', height: 48, borderRadius: 12, border: 'none', background: '#24276F', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
              {editingId ? 'Update Endorsement' : 'Publish Entry'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  )
}

AdminTestimonials.noLayout = true
