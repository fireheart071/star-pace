const storage = require('../../lib/api-storage')

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET')
        return res.status(405).end('Method Not Allowed')
    }

    try {
        const settings = await storage.getSettings()
        // We only return public-safe settings here
        return res.json({
            adminEmail: settings?.adminEmail || '',
            adminSmsNumber: settings?.adminSmsNumber || '',
            supportPhone: settings?.supportPhone || '',
            headquarters: settings?.headquarters || '',
            featuredBrands: settings?.featuredBrands || ''
        })
    } catch (e) {
        return res.status(500).json({ error: 'Failed to load settings' })
    }
}
