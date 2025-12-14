export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
}

export const apiFetchJson = async (path, init) => {
  const base = getApiBaseUrl()
  const res = await fetch(`${base}${path}`, init)
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.message || 'Request failed')
  }
  return data
}
