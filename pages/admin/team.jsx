import React from 'react'
import { useRouter } from 'next/router'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  Briefcase
} from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import CldOptimizedImage from '../../components/CldOptimizedImage'

function empty() { return { name: '', role: '', bio: '', image: '', status: 'active', order: 0 } }

export default function AdminTeam() {
  const router = useRouter()
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [form, setForm] = React.useState(empty())
  const [showCreate, setShowCreate] = React.useState(false)
  const [editingId, setEditingId] = React.useState(null)
  const [imagePreview, setImagePreview] = React.useState('')
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    if (!token) { router.replace('/admin/login'); return }
    let mounted = true
      ; (async () => {
        try {
          const res = await fetch('/api/team', { headers: { Authorization: `Bearer ${token}` } })
          if (res.status === 401) {
            localStorage.removeItem('admin_token'); router.replace('/admin/login')
            return
          }
          if (!res.ok) throw new Error('Failed to load team data')
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
      setForm(f => ({ ...f, image: data.url }))
    } catch (err) { setError('Image upload failed: ' + err.message) }
  }

  function edit(item) {
    setForm({ 
      name: item.name || '', 
      role: item.role || '', 
      bio: item.bio || '', 
      image: item.image || '', 
      status: item.status || 'active', 
      order: item.order || 0 
    })
    setEditingId(item.id); setImagePreview(item.image || ''); setShowCreate(true)
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault()
    setError('')
    const token = localStorage.getItem('admin_token')
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/team/${editingId}` : '/api/team'
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
      else setItems(s => [...s, item])
      setForm(empty()); setEditingId(null); setImagePreview(''); setShowCreate(false)
    } catch (e) { setError(e.message || String(e)) }
  }

  async function remove(id) {
    if (!confirm('Delete this executive entry?')) return
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
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
    return q ? (`${i.name} ${i.role}`).toLowerCase().includes(q) : true
  })

  return (
    <AdminLayout title="Leadership Registry">
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 48
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search size={16} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input
            placeholder="Search our leadership..."
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
          <Plus size={18} /> Add Executive
        </button>
      </div>

      {loading && <div style={{ padding: 120, textAlign: 'center', color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Synchronizing Registry...</div>}
      {error && <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '12px 16px', borderRadius: 8, marginBottom: 32, fontSize: 14 }}>{error}</div>}

      {!loading && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 32 }}>
          {filtered.map(item => (
            <div key={item.id} style={{
              background: '#fff',
              border: '1px solid #F1F5F9',
              borderRadius: 24,
              padding: 24,
              transition: 'all 0.3s ease',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent-gold)' }}>
                  <img src={item.image || '/placeholder-avatar.png'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                   <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{item.name}</h3>
                   <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.role}</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 24 }}>{item.bio}</p>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => edit(item)} style={{ flex: 1, height: 40, background: '#F8FAFC', color: '#24276F', border: '1px solid #E2E8F0', borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>EDIT</button>
                <button onClick={() => remove(item.id)} style={{ padding: '0 12px', background: '#FEF2F2', color: '#B91C1C', border: 'none', borderRadius: 10, cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showCreate} title={editingId ? "Refine Profile" : "New Executive Detail"} onClose={() => setShowCreate(false)}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '12px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="field-group">
              <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Full Identity</label>
              <input name="name" placeholder="Executive Name" value={form.name} onChange={onChange} required style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500 }} />
            </div>
            <div className="field-group">
              <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Current Office</label>
              <input name="role" placeholder="e.g. Managing Director" value={form.role} onChange={onChange} required style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500 }} />
            </div>
          </div>
          <div className="field-group">
            <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Professional narrative</label>
            <textarea name="bio" placeholder="Statement of expertise..." value={form.bio} onChange={onChange} style={{ width: '100%', minHeight: 100, borderRadius: 8, border: '1px solid #E2E8F0', padding: '12px', outline: 'none', resize: 'vertical', fontSize: 14, fontWeight: 500 }} />
          </div>
          <div className="field-group">
            <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Executive Portrait</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <input name="image" placeholder="Image URL" value={form.image} onChange={onChange} style={{ flex: 1, height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500 }} />
                <label style={{ height: 44, padding: '0 20px', background: '#F8FAFC', color: '#24276F', borderRadius: 8, display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 12, cursor: 'pointer', border: '1px solid #E2E8F0' }}>
                  BROWSE
                  <input type="file" accept="image/*" onChange={onImageFile} style={{ display: 'none' }} />
                </label>
             </div>
          </div>
          {imagePreview && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
               <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '2px solid #E2E8F0' }}>
                  <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
            </div>
          )}
          <div style={{ marginTop: 12 }}>
            <button type="submit" style={{ width: '100%', height: 52, borderRadius: 14, border: 'none', background: '#24276F', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {editingId ? 'Confirm Updates' : 'Publish to Roster'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  )
}

AdminTeam.noLayout = true
