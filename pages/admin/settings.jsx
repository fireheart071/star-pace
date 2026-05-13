import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/AdminLayout'
import { Save, Mail, Phone, BellRing, Info, ShieldCheck, Globe } from 'lucide-react'

export default function AdminSettings() {
    const router = useRouter()
    const [settings, setSettings] = useState({
        adminEmail: '',
        fromEmail: '',
        adminSmsNumber: '',
        supportPhone: '',
        headquarters: '',
        featuredBrands: '',
        isGmailApiActive: false
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
        if (!token) { router.replace('/admin/login'); return }
        fetchSettings()
    }, [router])

    async function fetchSettings() {
        const token = localStorage.getItem('admin_token')
        try {
            const res = await fetch('/api/admin/settings', { headers: { 'Authorization': `Bearer ${token}` } })
            if (res.status === 401) { localStorage.removeItem('admin_token'); router.replace('/admin/login'); return }
            if (res.ok) {
                const data = await res.json()
                setSettings({
                    adminEmail: data.adminEmail || '',
                    fromEmail: data.fromEmail || '',
                    adminSmsNumber: data.adminSmsNumber || '',
                    supportPhone: data.supportPhone || '',
                    headquarters: data.headquarters || '',
                    featuredBrands: data.featuredBrands || '',
                    isGmailApiActive: data.isGmailApiActive || false
                })
            }
        } catch (e) { console.error('Failed to fetch settings', e) } finally { setLoading(false) }
    }

    async function handleSubmit(e) {
        if (e) e.preventDefault()
        setSaving(true); setMessage(null)
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
                body: JSON.stringify(settings)
            })
            if (res.status === 401) { localStorage.removeItem('admin_token'); router.replace('/admin/login'); return }
            if (res.ok) setMessage({ type: 'success', text: 'Configuration synchronized successfully.' })
            else setMessage({ type: 'error', text: 'Failed to update configuration.' })
        } catch (e) { setMessage({ type: 'error', text: 'An unexpected error occurred.' }) } finally { setSaving(false) }
    }

    return (
        <AdminLayout title="Core Configuration">

            {loading ? (
                <div style={{ padding: 120, textAlign: 'center', color: '#64748B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Synchronizing System State...</div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 64, maxWidth: 800 }}>

                    {/* Section: Communication */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                            <Mail size={18} strokeWidth={2} style={{ color: '#64748B' }} />
                            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#24276F', textTransform: 'uppercase', letterSpacing: 1.5 }}>Communication Channels</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                            <div className="field-group">
                                <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Administrative Inbox</label>
                                <input type="email" value={settings.adminEmail} onChange={e => setSettings({ ...settings, adminEmail: e.target.value })} style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', background: 'transparent', fontSize: 14, fontWeight: 500 }} />
                            </div>
                            <div className="field-group">
                                <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Dispatch Alias (From)</label>
                                <input type="email" value={settings.fromEmail} onChange={e => setSettings({ ...settings, fromEmail: e.target.value })} style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', background: 'transparent', fontSize: 14, fontWeight: 500 }} />
                            </div>
                        </div>

                        {settings.isGmailApiActive && (
                            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8, color: '#059669', fontSize: 12, fontWeight: 800 }}>
                                <ShieldCheck size={16} strokeWidth={2.5} /> Gmail API Integration Active
                            </div>
                        )}
                    </div>

                    {/* Section: Support */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                            <Phone size={18} strokeWidth={2} style={{ color: '#64748B' }} />
                            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#24276F', textTransform: 'uppercase', letterSpacing: 1.5 }}>Client Support & Presence</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
                            <div className="field-group">
                                <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>SMS Notification Line</label>
                                <input type="tel" value={settings.adminSmsNumber} onChange={e => setSettings({ ...settings, adminSmsNumber: e.target.value })} style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', background: 'transparent', fontSize: 14, fontWeight: 500 }} />
                            </div>
                            <div className="field-group">
                                <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>24/7 Support Line</label>
                                <input type="tel" value={settings.supportPhone} onChange={e => setSettings({ ...settings, supportPhone: e.target.value })} style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', background: 'transparent', fontSize: 14, fontWeight: 500 }} />
                            </div>
                        </div>

                        <div className="field-group">
                            <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Global Headquarters Address</label>
                            <input type="text" value={settings.headquarters} onChange={e => setSettings({ ...settings, headquarters: e.target.value })} style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', background: 'transparent', fontSize: 14, fontWeight: 500 }} />
                        </div>
                    </div>

                    {/* Section: Branding */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                            <Globe size={18} strokeWidth={2} style={{ color: '#64748B' }} />
                            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#24276F', textTransform: 'uppercase', letterSpacing: 1.5 }}>Brand Identity</h3>
                        </div>

                        <div className="field-group">
                            <label style={{ fontSize: 10, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>Featured Brand Partners</label>
                            <input type="text" value={settings.featuredBrands} onChange={e => setSettings({ ...settings, featuredBrands: e.target.value })} placeholder="Rolls Royce, Bentley, Mercedes-Benz" style={{ width: '100%', height: 44, borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px', outline: 'none', background: 'transparent', fontSize: 14, fontWeight: 500 }} />
                        </div>
                    </div>

                    {message && (
                        <div style={{
                            fontSize: 12, fontWeight: 800, textAlign: 'center',
                            color: message.type === 'success' ? '#059669' : '#DC2626'
                        }}>{message.text}</div>
                    )}

                    <div style={{ paddingTop: 24 }}>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{ height: 48, padding: '0 40px', background: '#24276F', color: '#fff', borderRadius: 12, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: '0.3s' }}
                        >
                            {saving ? 'Synchronizing...' : 'Save Configuration'}
                        </button>
                    </div>
                </form>
            )}
        </AdminLayout>
    )
}

AdminSettings.noLayout = true
