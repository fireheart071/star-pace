// Use Next.js public env var for API base. Avoid `import.meta` to prevent bundler warnings.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export function apiUrl(path){
  if (!path) return API_BASE_URL || ''
  if (!API_BASE_URL) return path
  return `${API_BASE_URL}${path}`
}
