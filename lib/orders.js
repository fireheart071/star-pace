import { apiUrl } from './api'

const KEY = 'atlas_orders_v1'
const CONTACTS_KEY = 'atlas_linked_contacts_v1'

export function getLinkedContacts() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CONTACTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) { return [] }
}

export function saveContact(value) {
  if (!value || typeof window === 'undefined') return
  const current = getLinkedContacts()
  if (!current.includes(value)) {
    current.push(value)
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(current))
  }
}

export function saveOrder(order) {
  const all = getOrders()
  const id = Date.now().toString(36)
  const item = { id, ...order }
  all.unshift(item)
  try {
    localStorage.setItem(KEY, JSON.stringify(all))
    if (order.email) saveContact(order.email)
    if (order.phone) saveContact(order.phone)
  } catch (e) { }

  // Attempt to persist server-side (non-blocking). If server is unavailable, ignore.
  ; (async () => {
    try {
      const resp = await fetch(apiUrl('/api/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })
      if (resp.ok) {
        const serverOrder = await resp.json()
        // update local copy with server id if changed
        const local = getOrders()
        const idx = local.findIndex(o => o.id === item.id)
        if (idx !== -1) { local[idx] = serverOrder; localStorage.setItem(KEY, JSON.stringify(local)) }
      }
    } catch (e) { /* server not available; skip */ }
  })()

  return item
}

export function getOrders() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch (e) { return [] }
}

export function replaceLocalOrders(orders) {
  try { localStorage.setItem(KEY, JSON.stringify(Array.isArray(orders) ? orders : [])) } catch (e) { }
}

export async function fetchServerOrders() {
  try {
    const resp = await fetch(apiUrl('/api/orders'))
    if (!resp.ok) throw new Error('Failed')
    const data = await resp.json()
    return Array.isArray(data) ? data : []
  } catch (e) {
    return null
  }
}

export function clearOrders() {
  localStorage.removeItem(KEY)
}
