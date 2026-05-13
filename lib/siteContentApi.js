import { apiUrl } from './api'

async function fetchList(path) {
  try {
    const resp = await fetch(apiUrl(path))
    if (!resp.ok) throw new Error('Failed')
    const data = await resp.json()
    return Array.isArray(data) ? data : []
  } catch (e) {
    return []
  }
}

export async function getTestimonials() {
  return await fetchList('/api/testimonials')
}

export async function getNews() {
  return await fetchList('/api/news')
}

export async function getModels() {
  return await fetchList('/api/vehicles')
}

export async function getTeam() {
  return await fetchList('/api/team')
}
