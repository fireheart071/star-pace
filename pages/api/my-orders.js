const storage = require('../../lib/api-storage')

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET')
        return res.status(405).end('Method Not Allowed')
    }

    const { contact } = req.query
    if (!contact) {
        return res.status(400).json({ error: 'Email or Phone number is required' })
    }

    try {
        const orders = await storage.getOrders()
        const myOrders = orders.filter(o => {
            const searchContact = contact.toLowerCase().trim()
            const orderEmail = (o.email || '').toLowerCase().trim()
            const orderPhone = (o.phone || '').replace(/\s+/g, '').trim()
            const searchPhone = contact.replace(/\s+/g, '').trim()

            return orderEmail === searchContact || orderPhone === searchPhone
        })
        return res.json(myOrders)
    } catch (e) {
        console.error(e)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}
