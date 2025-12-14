import '../App.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetchJson } from '../lib/api'

export default function InventoryDashboard() {
  const navigate = useNavigate()

  const API_BASE_URL = useMemo(() => {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
  }, [])

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', sku: '', initialStock: '' })
  const [createSubmitting, setCreateSubmitting] = useState(false)

  const fetchProducts = async () => {
    try {
      setError('')
      setLoading(true)
      const data = await apiFetchJson('/products')
      setProducts(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [API_BASE_URL])

  const openCreate = () => {
    setCreateForm({ name: '', sku: '', initialStock: '' })
    setCreateOpen(true)
  }

  const closeCreate = () => {
    if (!createSubmitting) setCreateOpen(false)
  }

  const submitCreate = async (e) => {
    e.preventDefault()
    try {
      setCreateSubmitting(true)
      setError('')

      const payload = {
        name: createForm.name.trim(),
        sku: createForm.sku.trim(),
        initialStock: Number(createForm.initialStock || 0),
      }

      await apiFetchJson('/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      setCreateOpen(false)
      await fetchProducts()
    } catch (e2) {
      setError(e2?.message || 'Failed to create product')
    } finally {
      setCreateSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-sm text-slate-600 mt-1">Track and manage your product stock</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:from-slate-800 hover:to-slate-700 transition-all duration-200"
          >
            <span className="text-base leading-none">+</span>
            <span>Create Product</span>
          </button>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gradient-to-r from-slate-900 to-slate-800 text-white sticky top-0">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-left">Product Name</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-left">SKU</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-left">Stock</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 sm:px-6 py-6 text-slate-500 text-center" colSpan={4}>
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"></div>
                        <span>Loading products…</span>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td className="px-4 sm:px-6 py-8 text-slate-500 text-center" colSpan={4}>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">📦</span>
                        <span>No products found. Create one to get started!</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 font-medium text-slate-900">{p.name}</td>
                      <td className="px-4 sm:px-6 py-4 text-slate-700 font-mono text-xs sm:text-sm">{p.sku}</td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-semibold text-sm ${Number(p.stock) === 0 ? 'bg-red-100 text-red-700' : Number(p.stock) < 10 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/products/${p._id}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-900 text-xs sm:text-sm font-semibold hover:bg-slate-200 transition-colors"
                        >
                          <span>→</span>
                          <span className="hidden sm:inline">View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <div className="flex gap-3">
              <span className="text-red-600 text-lg">⚠️</span>
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        ) : null}
      </div>

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 sm:px-6 py-4">
              <div className="text-lg font-semibold">Create New Product</div>
              <button
                type="button"
                onClick={closeCreate}
                className="rounded-md p-1 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={submitCreate} className="px-5 sm:px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Product Name</label>
                  <input
                    value={createForm.name}
                    onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 transition-all"
                    placeholder="e.g., Laptop Computer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">SKU (Stock Keeping Unit)</label>
                  <input
                    value={createForm.sku}
                    onChange={(e) => setCreateForm((f) => ({ ...f, sku: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 transition-all"
                    placeholder="e.g., LP-001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={createForm.initialStock}
                    onChange={(e) => setCreateForm((f) => ({ ...f, initialStock: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 transition-all"
                    placeholder="e.g., 50"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeCreate}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-2 text-sm font-semibold text-white hover:shadow-lg disabled:opacity-60 transition-all"
                >
                  {createSubmitting ? 'Creating…' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
