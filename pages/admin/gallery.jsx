import React from 'react'
import { useRouter } from 'next/router'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Tag,
  Eye,
  CheckCircle2
} from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import CldOptimizedImage from '../../components/CldOptimizedImage'

function empty() { return { image: '', caption: '', category: 'General' } }

export default function AdminGallery() {
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
          const res = await fetch('/api/gallery', { headers: { Authorization: `Bearer ${token}` } })
          if (res.status === 401) {
            localStorage.removeItem('admin_token'); router.replace('/admin/login')
            return
          }
          if (!res.ok) throw new Error('Failed to load gallery')
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
    setForm({ image: item.image || '', caption: item.caption || '', category: item.category || 'General' })
    setEditingId(item.id); setImagePreview(item.image || ''); setShowCreate(true)
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault()
    setError('')
    const token = localStorage.getItem('admin_token')
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/gallery/${editingId}` : '/api/gallery'
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
    if (!confirm('Delete this image?')) return
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 401) {
        localStorage.removeItem('admin_token')
        router.replace('/admin/login')
        return
      }
      if (!res.ok) throw new Error('Failed to delete')
      setItems(s => s.filter(i => i.id !== id))
    } catch (e) { setError(e.message || String(e)) }
  }

  async function onBulkUpload(e) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    
    setLoading(true)
    setError('')
    const token = localStorage.getItem('admin_token')
    let successCount = 0
    let failCount = 0

    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append('image', file)
        const uploadRes = await fetch('/api/upload', { 
          method: 'POST', 
          headers: { Authorization: `Bearer ${token}` }, 
          body: formData 
        })
        
        if (!uploadRes.ok) throw new Error('Upload failed')
        const uploadData = await uploadRes.json()
        
        const galleryRes = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({
            image: uploadData.url,
            caption: file.name.split('.')[0], // Use filename as default caption
            category: 'General'
          })
        })
        
        if (galleryRes.ok) {
          const newItem = await galleryRes.json()
          setItems(s => [newItem, ...s])
          successCount++
        } else {
          failCount++
        }
      } catch (err) {
        console.error(err)
        failCount++
      }
    }
    
    setLoading(false)
    if (failCount > 0) {
      setError(`Uploaded ${successCount} images. ${failCount} failed.`)
    }
  }

  const [selectedIds, setSelectedIds] = React.useState(new Set())
  const [isSelectionMode, setIsSelectionMode] = React.useState(false)

  function toggleSelect(id) {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  function selectAll() {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(filtered.map(i => i.id)))
  }

  async function removeSelected() {
    if (!confirm(`Delete ${selectedIds.size} selected images?`)) return
    setLoading(true)
    const token = localStorage.getItem('admin_token')
    const ids = Array.from(selectedIds)
    let success = 0
    for (const id of ids) {
      try {
        const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) success++
      } catch (e) { console.error(e) }
    }
    setItems(s => s.filter(i => !selectedIds.has(i.id)))
    setSelectedIds(new Set())
    setIsSelectionMode(false)
    setLoading(false)
    if (success < ids.length) setError(`Deleted ${success} items. Some failed.`)
  }

  const filtered = items.filter(i => {
    const q = search.trim().toLowerCase()
    return q ? (`${i.caption} ${i.category}`.toLowerCase()).includes(q) : true
  })

  return (
    <AdminLayout title="Visual Gallery">
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 48, gap: 16, flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input
            placeholder="Search gallery..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', height: 40, padding: '0 0 0 28px', borderRadius: 0,
              border: 'none', borderBottom: '1px solid #E2E8F0', background: 'transparent', outline: 'none', fontSize: 14, color: '#0F172A'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          {selectedIds.size > 0 && (
            <button
              onClick={removeSelected}
              style={{ height: 44, padding: '0 24px', background: '#EF4444', color: '#fff', borderRadius: 12, border: 'none', fontWeight: 700, cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}
            >
              <Trash2 size={18} /> Delete ({selectedIds.size})
            </button>
          )}

          <button
            onClick={() => {
              setIsSelectionMode(!isSelectionMode)
              if (isSelectionMode) setSelectedIds(new Set())
            }}
            style={{ height: 44, padding: '0 24px', background: isSelectionMode ? '#24276F' : '#F1F5F9', color: isSelectionMode ? '#fff' : '#475569', borderRadius: 12, border: 'none', fontWeight: 700, cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}
          >
            <CheckCircle2 size={18} /> {isSelectionMode ? 'Cancel Selection' : 'Select Multiple'}
          </button>

          {!isSelectionMode && (
            <>
              <label style={{ height: 44, padding: '0 24px', background: '#F1F5F9', color: '#475569', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, cursor: 'pointer', transition: '0.3s', fontSize: 14 }}>
                <Plus size={18} /> Bulk Upload
                <input type="file" multiple accept="image/*" onChange={onBulkUpload} style={{ display: 'none' }} />
              </label>
              <button
                onClick={() => { setForm(empty()); setEditingId(null); setImagePreview(''); setShowCreate(true); }}
                style={{ height: 44, padding: '0 24px', background: '#24276F', color: '#fff', borderRadius: 12, border: 'none', fontWeight: 700, cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}
              >
                <Plus size={18} /> Add Image
              </button>
            </>
          )}
        </div>
      </div>

      {isSelectionMode && (
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={selectAll} style={{ background: 'none', border: 'none', color: '#24276F', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            {selectedIds.size === filtered.length ? 'Deselect All' : 'Select All Visible'}
          </button>
          <span style={{ fontSize: 13, color: '#64748B' }}>{selectedIds.size} items selected</span>
        </div>
      )}

      {loading && <div style={{ padding: 120, textAlign: 'center', color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Synchronizing Visuals...</div>}
      {error && <div className="login-error" style={{ marginBottom: 32 }}>{error}</div>}

      {!loading && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 32 }}>
          {filtered.map(item => (
            <div 
              key={item.id} 
              onClick={() => isSelectionMode && toggleSelect(item.id)}
              style={{
                background: '#fff',
                borderRadius: 16,
                overflow: 'hidden',
                border: '2px solid',
                borderColor: selectedIds.has(item.id) ? '#24276F' : '#F1F5F9',
                transition: '0.3s',
                boxShadow: selectedIds.has(item.id) ? '0 10px 20px rgba(36, 39, 111, 0.1)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
                position: 'relative',
                cursor: isSelectionMode ? 'pointer' : 'default'
              }}
            >
              <div style={{ height: 200, width: '100%', position: 'relative', overflow: 'hidden' }}>
                <CldOptimizedImage src={item.image || '/placeholder-car.png'} alt={item.caption} width={400} height={300} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: selectedIds.has(item.id) ? 0.7 : 1 }} />
                
                {isSelectionMode ? (
                  <div style={{ position: 'absolute', top: 12, left: 12, width: 24, height: 24, borderRadius: 6, background: selectedIds.has(item.id) ? '#24276F' : 'rgba(255,255,255,0.8)', border: '2px solid #24276F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    {selectedIds.has(item.id) && <CheckCircle2 size={14} />}
                  </div>
                ) : (
                  <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
                    <button onClick={(e) => { e.stopPropagation(); edit(item); }} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}><Edit2 size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); remove(item.id); }} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Tag size={12} color="#DF9738" />
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#DF9738', textTransform: 'uppercase', letterSpacing: 1 }}>{item.category}</span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: '#1E293B', fontWeight: 600, lineHeight: 1.5 }}>{item.caption || 'No caption provided'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
         <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, background: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
               <ImageIcon size={32} color="#CBD5E1" />
            </div>
            <h3 style={{ margin: 0, color: '#475569', fontSize: 18, fontWeight: 700 }}>No images found</h3>
            <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 8 }}>Your gallery is currently empty or matches no search results.</p>
         </div>
      )}

      <Modal open={showCreate} title={editingId ? "Edit Image" : "Add Image"} onClose={() => setShowCreate(false)}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: '12px 0' }}>
          <div className="field-group">
            <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Media Asset</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <input name="image" placeholder="Image URL" value={form.image} onChange={onChange} required style={{ flex: 1, height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500 }} />
              <label style={{ height: 44, padding: '0 20px', background: '#F8FAFC', color: '#24276F', borderRadius: 8, display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 12, cursor: 'pointer', border: '1px solid #E2E8F0' }}>
                BROWSE
                <input type="file" accept="image/*" onChange={onImageFile} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
          
          {imagePreview && (
            <div style={{ width: '100%', height: 240, borderRadius: 12, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <div className="field-group">
            <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Category</label>
            <select name="category" value={form.category} onChange={onChange} style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500, background: '#fff' }}>
              <option value="General">General</option>
              <option value="Fleet">Fleet</option>
              <option value="Events">Events</option>
              <option value="Office">Office</option>
              <option value="Tours">Tours</option>
            </select>
          </div>

          <div className="field-group">
            <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Caption</label>
            <textarea name="caption" placeholder="Describe this image..." value={form.caption} onChange={onChange} style={{ width: '100%', minHeight: 80, borderRadius: 8, border: '1px solid #E2E8F0', padding: '12px', outline: 'none', resize: 'vertical', fontSize: 14, fontWeight: 500 }} />
          </div>

          <div style={{ marginTop: 12 }}>
            <button type="submit" style={{ width: '100%', height: 48, borderRadius: 12, border: 'none', background: '#24276F', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
              {editingId ? 'Update Visual' : 'Add to Gallery'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  )
}

AdminGallery.noLayout = true
