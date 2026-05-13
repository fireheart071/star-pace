const storage = require('../../../lib/api-storage')
const { verifyAdmin } = require('../../../lib/api-middleware/auth')

export default async function handler(req, res) {
    return verifyAdmin(req, res, async () => {
        if (req.method === 'GET') {
            try {
                const settings = await storage.getSettings()
                const data = { 
                    ...settings, 
                    isGmailApiActive: !!process.env.GMAIL_CLIENT_SECRET 
                }
                return res.json(data)
            } catch (e) {
                return res.status(500).json({ error: 'Failed to load settings' })
            }
        }

        if (req.method === 'POST') {
            try {
                const current = await storage.getSettings()
                const updated = Object.assign({}, current, req.body)
                await storage.saveSettings(updated)
                return res.json(updated)
            } catch (e) {
                console.error(e)
                return res.status(500).json({ error: 'Failed to save settings' })
            }
        }

        res.setHeader('Allow', 'GET,POST')
        res.status(405).end('Method Not Allowed')
    })
}
