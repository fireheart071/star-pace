import React from 'react'
import { useRouter } from 'next/router'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Newspaper,
  ChevronRight,
  LogOut,
  Activity,
  Zap,
  Eye,
  Calendar
} from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import dynamic from 'next/dynamic'

const LexicalEditor = dynamic(() => import('../../components/LexicalEditor'), { ssr: false })

function empty() { return { title: '', date: '', author: '', category: '', excerpt: '', content: '', image: '', status: 'active' } }

export default function AdminBlog() {
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

  const truncate = (str, n = 160) => {
    if (!str) return ''
    return str.length > n ? str.substr(0, n - 1) + "..." : str
  }

  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    if (!token) { router.replace('/admin/login'); return }
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/news', { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 401) {
          localStorage.removeItem('admin_token')
          router.replace('/admin/login')
          return
        }
        if (!res.ok) throw new Error('Failed to load articles')
        const data = await res.json()
        if (mounted) setItems(Array.isArray(data) ? data : [])
      } catch (e) { if (mounted) setError(e.message || String(e)) }
      if (mounted) setLoading(false)
    })()
  }, [router])

  function onChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  function onEditorChange({ html, text }) {
    setForm(f => ({
      ...f,
      content: html,
      excerpt: truncate(text)
    }))
  }

  async function onFile(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('image', file)
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      if (res.status === 401) {
        localStorage.removeItem('admin_token')
        router.replace('/admin/login')
        return
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setForm(f => ({ ...f, image: data.url }))
    } catch (err) { setError('Upload failed: ' + err.message) }
  }

  function edit(item) {
    setForm({ 
      title: item.title || '', 
      date: item.date || '', 
      author: item.author || '',
      category: item.category || '',
      excerpt: item.excerpt || '', 
      content: item.content || '',
      image: item.image || '', 
      status: item.status || 'active' 
    })
    setEditingId(item.id)
    setImagePreview(item.image || '')
    setShowCreate(true)
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault()
    setError('')
    const token = localStorage.getItem('admin_token')
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/news/${editingId}` : '/api/news'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      })
      if (res.status === 401) {
        localStorage.removeItem('admin_token')
        router.replace('/admin/login')
        return
      }
      if (!res.ok) throw new Error(`Failed to ${editingId ? 'update' : 'publish'}`)
      const item = await res.json()
      if (editingId) setItems(s => s.map(i => i.id === editingId ? item : i))
      else setItems(s => [item, ...s])
      setForm(empty()); setEditingId(null); setImagePreview(''); setShowCreate(false)
    } catch (e) { setError(e.message || String(e)) }
  }

  async function remove(id) {
    if (!confirm('Delete this article?')) return
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 401) {
        localStorage.removeItem('admin_token')
        router.replace('/admin/login')
        return
      }
      if (!res.ok) throw new Error('Failed to remove')
      setItems(s => s.filter(i => i.id !== id))
    } catch (e) { setError(e.message || String(e)) }
  }

  const filtered = items.filter(i => {
    const q = search.trim().toLowerCase()
    return q ? (`${i.title} ${i.excerpt} ${i.date}`.toLowerCase()).includes(q) : true
  })

  return (
    <AdminLayout title="Editorial Bureau">
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: 48
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search size={16} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input 
            placeholder="Search archives..." 
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
          style={{ 
            height: 44, padding: '0 24px', background: '#24276F', color: '#fff', 
            borderRadius: 12, border: 'none', fontWeight: 700, cursor: 'pointer', 
            transition: '0.3s', display: 'flex', alignItems: 'center', gap: 10
          }}
        >
          <Plus size={18} />
          Publish Insight
        </button>
      </div>

      {loading && <div style={{ padding: 120, textAlign: 'center', color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Synchronizing Archives...</div>}
      {error && <div className="login-error" style={{ marginBottom: 32 }}>{error}</div>}

      {!loading && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* List Header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '120px 2.5fr 1fr 120px', 
            gap: 32, 
            padding: '16px 0', 
            borderBottom: '1px solid #E2E8F0',
            color: '#64748B',
            fontSize: 10,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 1.5
          }}>
            <span>Asset</span>
            <span>Title & Summary</span>
            <span>Date</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {filtered.map(item => (
            <div key={item.id} style={{ 
               padding: '28px 0',
               display: 'grid',
               gridTemplateColumns: '120px 2.5fr 1fr 120px',
               gap: 32,
               alignItems: 'center',
               borderBottom: '1px solid #F8FAFC'
            }}>
               {/* Image Thumbnail */}
               <div style={{ width: 120, height: 64, borderRadius: 8, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                  <img src={item.image || '/placeholder.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>

               {/* Content */}
               <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0F172A' }}>{item.title}</h3>
                  <div style={{ color: '#475569', fontSize: 13, marginTop: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', fontWeight: 500 }}>
                    {item.excerpt}
                  </div>
               </div>

               {/* Date */}
               <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>
                  {item.date || 'Unscheduled'}
               </div>

               {/* Actions */}
               <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                  <button onClick={() => edit(item)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 0 }} title="Edit"><Edit2 size={16} strokeWidth={2} /></button>
                  <button onClick={() => remove(id)} style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', padding: 0 }} title="Delete"><Trash2 size={16} strokeWidth={2} /></button>
               </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showCreate} title={editingId ? "Update Insight" : "Publish Insight"} onClose={() => setShowCreate(false)}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: '12px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
             <div className="field-group">
                <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Article Title</label>
                <input name="title" placeholder="Record title" value={form.title} onChange={onChange} required style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500 }} />
             </div>
             <div className="field-group">
                <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Release Date</label>
                <input name="date" placeholder="October 24, 2026" value={form.date} onChange={onChange} style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500 }} />
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
             <div className="field-group">
                <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Published By</label>
                <input name="author" placeholder="e.g. Atlas Executive Team" value={form.author} onChange={onChange} style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500 }} />
             </div>
             <div className="field-group">
                <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Category</label>
                <select 
                  name="category" 
                  value={form.category} 
                  onChange={onChange} 
                  style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500, background: '#fff' }}
                >
                  <option value="">Select Category</option>
                  <option value="Fleet Insights">Fleet Insights</option>
                  <option value="Luxury Travel">Luxury Travel</option>
                  <option value="Corporate Mobility">Corporate Mobility</option>
                  <option value="Protocol Services">Protocol Services</option>
                  <option value="Destination Ghana">Destination Ghana</option>
                  <option value="Company News">Company News</option>
                </select>
             </div>
          </div>
          
          <div className="field-group">
             <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Editorial Body (Rich Text)</label>
             <LexicalEditor initialValue={form.content} onChange={onEditorChange} />
             <p style={{ marginTop: 12, fontSize: 11, color: '#94A3B8', fontWeight: 600, fontStyle: 'italic' }}>
               A preview summary is being generated automatically from your narrative.
             </p>
          </div>

          <div className="field-group">
             <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Visual Asset</label>
             <div style={{ display: 'flex', gap: 12 }}>
                <input name="image" placeholder="Image URL" value={form.image} onChange={onChange} style={{ flex: 1, height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500 }} />
                <label style={{ height: 44, padding: '0 20px', background: '#F8FAFC', color: '#24276F', borderRadius: 8, display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 12, cursor: 'pointer', border: '1px solid #E2E8F0' }}>
                   BROWSE
                   <input type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
                </label>
             </div>
          </div>
          {imagePreview && (
            <div style={{ width: '100%', height: 180, borderRadius: 8, overflow: 'hidden', border: '2px solid #E2E8F0' }}>
               <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ marginTop: 12 }}>
             <button type="submit" style={{ width: '100%', height: 48, borderRadius: 12, border: 'none', background: '#24276F', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                {editingId ? 'Update Record' : 'Confirm Publication'}
             </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  )
}

AdminBlog.noLayout = true
