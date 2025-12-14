import '../App.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetchJson } from '../lib/api'

export default function InventoryDashboard() {
  const navigate = useNavigate()

  const API_BASE_URL = useMemo(() => {
    return import.meta.env.VITE_API_BASE_URL
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
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold">Inventory Management</h1>
          <button
            type="button"
            onClick={openCreate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 sm:px-6 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <span className="text-base leading-none">+</span>
            <span>Create Product</span>
          </button>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Product Name</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">SKU</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Current Stock</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 sm:px-6 py-6 text-slate-500" colSpan={4}>
                      Loading…
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td className="px-4 sm:px-6 py-6 text-slate-500" colSpan={4}>
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id} className="border-t border-slate-200">
                      <td className="px-4 sm:px-6 py-5 font-medium text-slate-900">{p.name}</td>
                      <td className="px-4 sm:px-6 py-5 text-slate-700">{p.sku}</td>
                      <td className="px-4 sm:px-6 py-5">
                        <span className={Number(p.stock) === 0 ? 'text-red-600' : 'text-slate-900'}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-5 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/products/${p._id}`)}
                          className="font-semibold text-slate-900 underline underline-offset-2 hover:text-slate-700"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {error ? <div className="mt-4 text-sm text-red-600">{error}</div> : null}
      </div>

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 sm:px-6 py-4">
              <div className="text-sm font-semibold">Create Product</div>
              <button
                type="button"
                onClick={closeCreate}
                className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <form onSubmit={submitCreate} className="px-5 sm:px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600">Product Name</label>
                  <input
                    value={createForm.name}
                    onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">SKU</label>
                  <input
                    value={createForm.sku}
                    onChange={(e) => setCreateForm((f) => ({ ...f, sku: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={createForm.initialStock}
                    onChange={(e) => setCreateForm((f) => ({ ...f, initialStock: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeCreate}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {createSubmitting ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
