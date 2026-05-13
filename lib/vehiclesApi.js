import { apiUrl } from './api'

export async function fetchVehiclesFromServer() {
  try {
    const resp = await fetch(apiUrl('/api/vehicles'))
    if (!resp.ok) throw new Error('Failed to fetch vehicles')
    const data = await resp.json()
    return Array.isArray(data) ? data : []
  } catch (e) {
    return []
  }
}

export async function getVehicles() {
  return await fetchVehiclesFromServer()
}
