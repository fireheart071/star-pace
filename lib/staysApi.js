import { apiUrl } from './api'

export async function fetchStaysFromServer() {
  try {
    const resp = await fetch(apiUrl('/api/stays'))
    if (!resp.ok) throw new Error('Failed to fetch stays')
    const data = await resp.json()
    return Array.isArray(data) ? data : []
  } catch (e) {
    return []
  }
}

export async function getStays() {
  return await fetchStaysFromServer()
}
