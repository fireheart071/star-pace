const storage = require('../../../lib/api-storage')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }

  const { productId } = req.query
  if (!productId) {
    return res.status(400).json({ error: 'Missing productId parameter' })
  }

  try {
    const orders = await storage.getOrders()
    const list = (Array.isArray(orders) ? orders : [])
      .filter(o => String(o.productId) === String(productId) && o.status !== 'Cancelled')
      .map(o => ({
        start: o.start,
        end: o.end
      }))

    return res.json(list)
  } catch (e) {
    console.error('Failed to fetch unavailable dates', e)
    return res.status(500).json({ error: 'Failed to load unavailable dates' })
  }
}
