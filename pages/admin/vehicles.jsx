import React from 'react'
import { useRouter } from 'next/router'
import {
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Box,
  Eye,
  PlusCircle
} from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import CldOptimizedImage from '../../components/CldOptimizedImage'

function empty() {
  return {
    name: '',
    category: '',
    price: '',
    image: '',
    desc: '',
    status: 'active',
    range: '',
    rangeUnit: 'km',
    topSpeed: '',
    topSpeedUnit: 'km/h',
    zeroToSixty: '',
    zeroToSixtyUnit: 's',
    rate: '',
    features: '',
    gallery: [],
    specs: {
      battery: '',
      drive: '',
      seats: '',
      charging: '',
      transmission: '',
      fuelType: ''
    }
  }
}

export default function AdminVehicles() {
  const router = useRouter()
  const [editingId, setEditingId] = React.useState(null)
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [form, setForm] = React.useState(empty())
  const [showCreate, setShowCreate] = React.useState(false)
  const [imagePreview, setImagePreview] = React.useState('')
  const [search, setSearch] = React.useState('')
  const [filterStatus, setFilterStatus] = React.useState('all')
  const [sortBy, setSortBy] = React.useState('newest')
  const [viewItem, setViewItem] = React.useState(null)

  const sameId = React.useCallback((a, b) => String(a) === String(b), [])

  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    if (!token) { router.replace('/admin/login'); return }
    let mounted = true
      ; (async () => {
        try {
          const res = await fetch('/api/vehicles', { headers: { Authorization: `Bearer ${token}` } })
          if (res.status === 401) {
            localStorage.removeItem('admin_token')
            router.replace('/admin/login')
            return
          }
          if (!res.ok) throw new Error('Failed to load models')
          const data = await res.json()
          if (mounted) setItems(Array.isArray(data) ? data : [])
        } catch (e) { if (mounted) setError(e.message || String(e)) }
        if (mounted) setLoading(false)
      })()
    return () => { mounted = false }
  }, [router])

  function onChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function onSpecChange(e) {
    const { name, value } = e.target
    setForm(f => ({
      ...f,
      specs: {
        ...(f.specs || {}),
        [name]: value
      }
    }))
  }

  async function onImageFile(e) {
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
    } catch (err) {
      setError('Image upload failed: ' + (err.message || String(err)))
    }
  }

  async function onGalleryFile(e) {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length === 0) return
    const token = localStorage.getItem('admin_token')
    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append('image', file)
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
        setForm(f => ({
          ...f,
          gallery: [...(f.gallery || []), data.url]
        }))
      } catch (err) {
        setError('Gallery upload failed: ' + (err.message || String(err)))
      }
    }
  }

  function removeFromGallery(index) {
    setForm(f => ({
      ...f,
      gallery: (f.gallery || []).filter((_, i) => i !== index)
    }))
  }

  function edit(item) {
    setForm({
      name: item.name || '',
      category: item.category || '',
      price: item.price || '',
      image: item.image || '',
      desc: item.desc || '',
      status: item.status || 'active',
      range: item.range || '',
      rangeUnit: item.rangeUnit || 'km',
      topSpeed: item.topSpeed || '',
      topSpeedUnit: item.topSpeedUnit || 'km/h',
      zeroToSixty: item.zeroToSixty || '',
      zeroToSixtyUnit: item.zeroToSixtyUnit || 's',
      rate: item.rate || '',
      specs: {
        battery: item.specs?.battery || '',
        drive: item.specs?.drive || '',
        seats: item.specs?.seats || '',
        charging: item.specs?.charging || '',
        transmission: item.specs?.transmission || '',
        fuelType: item.specs?.fuelType || ''
      },
      features: Array.isArray(item.features) ? item.features.join(', ') : (item.features || ''),
      gallery: Array.isArray(item.gallery) ? item.gallery : []
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
    const url = editingId ? `/api/vehicles/${editingId}` : '/api/vehicles'
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
      if (!res.ok) throw new Error(`Failed to ${editingId ? 'update' : 'create'}`)
      const item = await res.json()
      if (editingId) {
        setItems(s => s.map(i => sameId(i.id, editingId) ? item : i))
      } else {
        setItems(s => [item, ...s])
      }
      setForm(empty())
      setEditingId(null)
      setImagePreview('')
      setShowCreate(false)
    } catch (e) { setError(e.message || String(e)) }
  }

  async function remove(id) {
    if (!confirm('Delete this vehicle record?')) return
    setError('')
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
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
    if (q && !(`${i.name} ${i.category} ${i.desc}`.toLowerCase()).includes(q)) return false
    if (filterStatus !== 'all' && (i.status || 'active') !== filterStatus) return false
    return true
  }).sort((a, b) => {
    if (sortBy === 'newest') return (b.id || 0).toString().localeCompare((a.id || 0).toString())
    if (sortBy === 'oldest') return (a.id || 0).toString().localeCompare((b.id || 0).toString())
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
    return 0
  })

  return (
    <AdminLayout title="Fleet Management">
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: 48
      }}>
        <div style={{ display: 'flex', gap: 32, flex: 1, alignItems: 'center' }}>
           <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
              <Search size={16} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input 
                placeholder="Search inventory..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                style={{ 
                  width: '100%', height: 40, padding: '0 0 0 28px', borderRadius: 0, 
                  border: 'none', borderBottom: '1px solid #E2E8F0', background: 'transparent', outline: 'none', fontSize: 14, color: '#0F172A'
                }}
              />
           </div>
           <select
             value={filterStatus}
             onChange={e => setFilterStatus(e.target.value)}
             style={{ height: 40, padding: '0 12px', border: 'none', borderBottom: '1px solid #E2E8F0', background: 'transparent', color: '#475569', fontWeight: 700, outline: 'none', fontSize: 13 }}
           >
             <option value="all">All Status</option>
             <option value="active">Active</option>
             <option value="inactive">Inactive</option>
           </select>
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
          Register Vehicle
        </button>
      </div>

      {loading && <div style={{ padding: 120, textAlign: 'center', color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Synchronizing Inventory...</div>}
      {error && <div className="login-error" style={{ marginBottom: 32 }}>{error}</div>}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 80, border: '1px dashed #E2E8F0', borderRadius: 24 }}>
          <Box size={48} style={{ color: '#E2E8F0', marginBottom: 16 }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>Empty Inventory</h3>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="admin-list-container">
          {/* List Header */}
          <div className="admin-list-header" style={{ 
            display: 'grid', 
            gridTemplateColumns: '80px 2fr 1fr 1fr 1fr 120px', 
            gap: 24, 
            padding: '16px 0', 
            borderBottom: '1px solid #E2E8F0',
            color: '#64748B',
            fontSize: 10,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 1.5
          }}>
            <span>Asset</span>
            <span>Identity</span>
            <span>Category</span>
            <span>Status</span>
            <span>Daily Rate</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>

          {filtered.map(item => (
            <div key={item.id} className="admin-list-row" style={{ 
               padding: '24px 0',
               display: 'grid',
               gridTemplateColumns: '80px 2fr 1fr 1fr 1fr 120px',
               gap: 24,
               alignItems: 'center',
               borderBottom: '1px solid #F8FAFC'
            }}>
               {/* Asset Thumbnail */}
               <div style={{ width: 80, height: 56, background: '#F8FAFC', borderRadius: 8, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #F1F5F9' }}>
                  <CldOptimizedImage
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    width={60}
                    height={40}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
               </div>

               {/* Identity */}
               <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{item.name}</h3>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginTop: 2 }}>{String(item.id).substring(0, 8).toUpperCase()}</div>
               </div>

               {/* Category */}
               <div style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>
                  {item.category || 'Luxury Elite'}
               </div>

               {/* Status */}
               <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.status === 'active' ? '#10B981' : '#CBD5E1' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: item.status === 'active' ? '#0F172A' : '#64748B', textTransform: 'capitalize' }}>{item.status}</span>
                  </div>
               </div>

               {/* Rate */}
               <div style={{ fontSize: 15, fontWeight: 700, color: '#24276F' }}>
                  ₵{item.price || item.rate}
               </div>

               {/* Actions */}
               <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                  <button onClick={() => edit(item)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 0 }} title="Edit"><Edit2 size={16} strokeWidth={2} /></button>
                  <button onClick={() => setViewItem(item)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 0 }} title="View"><Eye size={16} strokeWidth={2} /></button>
                  <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', padding: 0 }} title="Delete"><Trash2 size={16} strokeWidth={2} /></button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      <Modal open={showCreate} title={editingId ? "Update Specification" : "Register Asset"} onClose={() => setShowCreate(false)}>
        <form onSubmit={handleSubmit} style={{ padding: '20px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div className="field-group">
              <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Model Identity</label>
              <input name="name" value={form.name} onChange={onChange} required style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500 }} />
            </div>
            <div className="field-group">
              <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Daily Rate (GHS)</label>
              <input name="price" value={form.price} onChange={onChange} style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500 }} />
            </div>
            <div className="field-group">
              <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Asset Category</label>
              <select name="category" value={form.category} onChange={onChange} style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', background: '#fff', fontSize: 14, fontWeight: 500 }}>
                <option value="">Select Category</option>
                <option value="Luxury Cars">Elite Luxury</option>
                <option value="Premium Cars">Premium Suite</option>
                <option value="Business Cars">Business Tier</option>
                <option value="Economic Cars">Economic Tier</option>
              </select>
            </div>
          </div>
          <div className="field-group" style={{ marginTop: 32 }}>
            <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Vehicle Description</label>
            <textarea name="desc" value={form.desc} onChange={onChange} style={{ width: '100%', height: 100, borderRadius: 8, border: '1px solid #E2E8F0', padding: '12px', outline: 'none', fontSize: 14, fontWeight: 500, fontFamily: 'inherit' }} />
          </div>

          <div className="field-group" style={{ marginTop: 32 }}>
            <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Fleet Features (Comma separated)</label>
            <input name="features" value={form.features} onChange={onChange} placeholder="e.g. WiFi, Chauffeur, Insurance, GPS" style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500 }} />
          </div>

          <div style={{ marginTop: 32, padding: 24, background: '#F8FAFC', borderRadius: 16 }}>
             <h4 style={{ margin: '0 0 20px', fontSize: 12, fontWeight: 800, color: '#24276F', textTransform: 'uppercase', letterSpacing: 1.5 }}>Technical Specifications</h4>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                <div className="field-group">
                  <label style={{ fontSize: 9, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 6 }}>SEATS</label>
                  <select name="seats" value={form.specs?.seats} onChange={onSpecChange} style={{ width: '100%', height: 38, borderRadius: 6, border: '1px solid #E2E8F0', padding: '0 10px', fontSize: 13, background: '#fff' }}>
                     <option value="">Select Seats</option>
                     <option value="2">2 Seater</option>
                     <option value="4">4 Seater</option>
                     <option value="5">5 Seater</option>
                     <option value="7">7 Seater (SUV)</option>
                     <option value="12">12 Seater (Mini Bus)</option>
                     <option value="14">14 Seater (High Roof)</option>
                     <option value="25">25+ Seater (Coach)</option>
                  </select>
                </div>
                <div className="field-group">
                  <label style={{ fontSize: 9, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 6 }}>TRANSMISSION</label>
                  <select name="transmission" value={form.specs?.transmission} onChange={onSpecChange} style={{ width: '100%', height: 38, borderRadius: 6, border: '1px solid #E2E8F0', padding: '0 10px', fontSize: 13, background: '#fff' }}>
                     <option value="">Select Transmission</option>
                     <option value="Automatic">Automatic</option>
                     <option value="Manual">Manual</option>
                     <option value="Tiptronic">Tiptronic</option>
                  </select>
                </div>
                <div className="field-group">
                  <label style={{ fontSize: 9, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 6 }}>FUEL TYPE</label>
                  <select name="fuelType" value={form.specs?.fuelType} onChange={onSpecChange} style={{ width: '100%', height: 38, borderRadius: 6, border: '1px solid #E2E8F0', padding: '0 10px', fontSize: 13, background: '#fff' }}>
                     <option value="">Select Fuel</option>
                     <option value="Petrol">Petrol</option>
                     <option value="Diesel">Diesel</option>
                     <option value="Hybrid">Hybrid</option>
                     <option value="Electric (EV)">Electric (EV)</option>
                  </select>
                </div>
                <div className="field-group">
                  <label style={{ fontSize: 9, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 6 }}>DRIVE (PERFORMANCE)</label>
                  <select name="drive" value={form.specs?.drive} onChange={onSpecChange} style={{ width: '100%', height: 38, borderRadius: 6, border: '1px solid #E2E8F0', padding: '0 10px', fontSize: 13, background: '#fff' }}>
                     <option value="">Select Drive</option>
                     <option value="Front-Wheel Drive (FWD)">Front-Wheel Drive (FWD)</option>
                     <option value="Rear-Wheel Drive (RWD)">Rear-Wheel Drive (RWD)</option>
                     <option value="All-Wheel Drive (AWD)">All-Wheel Drive (AWD)</option>
                     <option value="4x4 Executive">4x4 Executive</option>
                  </select>
                </div>
                <div className="field-group">
                  <label style={{ fontSize: 9, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 6 }}>RANGE ESTIMATE</label>
                  <input name="range" value={form.range} onChange={onChange} placeholder="e.g. 500" style={{ width: '100%', height: 38, borderRadius: 6, border: '1px solid #E2E8F0', padding: '0 10px', fontSize: 13 }} />
                </div>
             </div>
          </div>

          <div className="field-group" style={{ marginTop: 32 }}>
            <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Hero Asset</label>
            <div style={{ display: 'flex', gap: 12 }}>
               <input name="image" placeholder="Primary Image URL" value={form.image} onChange={onChange} style={{ flex: 1, height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', fontSize: 14, fontWeight: 500 }} />
               <label style={{ height: 44, padding: '0 20px', background: '#F8FAFC', color: '#24276F', borderRadius: 8, display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 12, cursor: 'pointer', border: '1px solid #E2E8F0' }}>
                 BROWSE
                 <input type="file" accept="image/*" onChange={onImageFile} style={{ display: 'none' }} />
               </label>
            </div>
          </div>
          {imagePreview && (
            <div style={{ width: '100%', height: 200, borderRadius: 12, overflow: 'hidden', border: '1px solid #E2E8F0', marginTop: 16 }}>
               <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          
          <div className="field-group" style={{ marginTop: 32 }}>
            <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Media Gallery (Optional)</label>
            <label style={{ width: '100%', height: 100, border: '2px dashed #E2E8F0', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 8 }}>
               <PlusCircle size={24} color="#64748B" />
               <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>APPEND ASSETS</span>
               <input type="file" accept="image/*" multiple onChange={onGalleryFile} style={{ display: 'none' }} />
            </label>
          </div>

          {form.gallery && form.gallery.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 12, marginTop: 16 }}>
               {form.gallery.map((img, idx) => (
                 <div key={idx} style={{ position: 'relative', height: 60, borderRadius: 8, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => removeFromGallery(idx)} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#F87171' }}>
                       <Trash2 size={10} />
                    </button>
                 </div>
               ))}
            </div>
          )}

          <div style={{ marginTop: 48 }}>
            <button type="submit" style={{ width: '100%', height: 48, borderRadius: 12, background: '#24276F', color: '#fff', border: 'none', fontWeight: 700, fontSize: 13 }}>{editingId ? 'Update Record' : 'Confirm Registration'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!viewItem} title="Asset Dossier" onClose={() => setViewItem(null)}>
        {viewItem && (
          <div style={{ padding: '12px 0' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#24276F', margin: '0 0 16px' }}>{viewItem.name}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32, padding: 20, background: '#F8FAFC', borderRadius: 16 }}>
               <div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>Capacity</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{viewItem.specs?.seats || '4'} Seats</div>
               </div>
               <div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>Transmission</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{viewItem.specs?.transmission || 'Automatic'}</div>
               </div>
               <div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>Performance</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{viewItem.specs?.drive || 'Rear Wheel'}</div>
               </div>
               <div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>Fuel Type</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{viewItem.specs?.fuelType || 'Petrol / EV'}</div>
               </div>
            </div>

            <div style={{ marginBottom: 32 }}>
               <div style={{ fontSize: 9, fontWeight: 800, color: '#24276F', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Executive Summary</div>
               <p style={{ color: '#475569', lineHeight: 1.8, fontSize: 14, margin: 0 }}>{viewItem.desc || 'No summary available for this asset.'}</p>
            </div>

            {viewItem.features && viewItem.features.length > 0 && (
               <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: '#24276F', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Fleet Features</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                     {(Array.isArray(viewItem.features) ? viewItem.features : viewItem.features.split(',')).map((f, i) => (
                        <div key={i} style={{ padding: '6px 12px', background: '#F1F5F9', borderRadius: 6, fontSize: 11, fontWeight: 700, color: '#475569' }}>{f.trim()}</div>
                     ))}
                  </div>
               </div>
            )}

            <button onClick={() => setViewItem(null)} style={{ width: '100%', height: 48, background: '#24276F', borderRadius: 12, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13, border: 'none' }}>Close Dossier</button>
          </div>
        )}
      </Modal>

    </AdminLayout>
  )
}
