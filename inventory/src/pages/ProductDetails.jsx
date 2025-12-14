import '../App.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiFetchJson } from '../lib/api'

const formatTimestamp = (value) => {
  try {
    return new Date(value).toLocaleString()
  } catch {
    return String(value)
  }
}

export default function ProductDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const API_BASE_URL = useMemo(() => {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
  }, [])

  const [summaryLoading, setSummaryLoading] = useState(true)
  const [summaryError, setSummaryError] = useState('')
  const [summary, setSummary] = useState(null)

  const [txLoading, setTxLoading] = useState(true)
  const [txError, setTxError] = useState('')
  const [transactions, setTransactions] = useState([])

  const [incQty, setIncQty] = useState('')
  const [decQty, setDecQty] = useState('')
  const [incSubmitting, setIncSubmitting] = useState(false)
  const [decSubmitting, setDecSubmitting] = useState(false)

  const loadSummary = async () => {
    try {
      setSummaryError('')
      setSummaryLoading(true)
      const data = await apiFetchJson(`/products/${id}`)
      setSummary(data)
    } catch (e) {
      setSummaryError(e?.message || 'Failed to load product')
    } finally {
      setSummaryLoading(false)
    }
  }

  const loadTransactions = async () => {
    try {
      setTxError('')
      setTxLoading(true)
      const data = await apiFetchJson(`/products/${id}/transactions`)
      setTransactions(Array.isArray(data) ? data : [])
    } catch (e) {
      setTxError(e?.message || 'Failed to load transactions')
    } finally {
      setTxLoading(false)
    }
  }

  const reloadAll = async () => {
    await Promise.all([loadSummary(), loadTransactions()])
  }

  useEffect(() => {
    reloadAll()
  }, [API_BASE_URL, id])

  const submitIncrease = async (e) => {
    e.preventDefault()
    try {
      setIncSubmitting(true)
      setSummaryError('')
      await apiFetchJson(`/products/${id}/increase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: Number(incQty) }),
      })
      setIncQty('')
      await reloadAll()
    } catch (e2) {
      setSummaryError(e2?.message || 'Failed to increase stock')
    } finally {
      setIncSubmitting(false)
    }
  }

  const submitDecrease = async (e) => {
    e.preventDefault()
    try {
      setDecSubmitting(true)
      setSummaryError('')
      await apiFetchJson(`/products/${id}/decrease`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: Number(decQty) }),
      })
      setDecQty('')
      await reloadAll()
    } catch (e2) {
      setSummaryError(e2?.message || 'Failed to decrease stock')
    } finally {
      setDecSubmitting(false)
    }
  }

  const product = summary?.product
  const currentStock = summary?.currentStock
  const totalIncreased = summary?.totalIncreased
  const totalDecreased = summary?.totalDecreased

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <span className="text-lg leading-none">←</span>
          <span>Back to Dashboard</span>
        </button>

        {summaryLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="h-3 w-3 rounded-full bg-slate-400 animate-bounce"></div>
            <span className="text-sm text-slate-500">Loading product details…</span>
          </div>
        ) : product ? (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{product.name}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 sm:gap-8 text-sm sm:text-base">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-slate-500 font-medium">SKU:</span>
                  <span className="font-mono font-semibold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">{product.sku}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-slate-500 font-medium">Current Stock:</span>
                  <span className={`px-4 py-2 rounded-lg font-bold ${currentStock === 0 ? 'bg-red-100 text-red-700' : currentStock < 10 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {currentStock} units
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Stock Adjustment</h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-xl border-2 border-green-200 bg-white p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">📈</span>
                    <span className="text-lg font-bold text-green-700">Increase Stock</span>
                  </div>
                  <form onSubmit={submitIncrease} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity to Add</label>
                      <input
                        type="number"
                        min="1"
                        value={incQty}
                        onChange={(e) => setIncQty(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 transition-all"
                        placeholder="Enter quantity"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={incSubmitting || !incQty}
                      className="w-full rounded-lg bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-green-500 enabled:hover:text-white transition-all duration-200"
                    >
                      {incSubmitting ? '⏳ Increasing…' : '✓ Increase Stock'}
                    </button>
                  </form>
                </div>

                <div className="rounded-xl border-2 border-red-200 bg-white p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">📉</span>
                    <span className="text-lg font-bold text-red-700">Decrease Stock</span>
                  </div>
                  <form onSubmit={submitDecrease} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity to Remove</label>
                      <input
                        type="number"
                        min="1"
                        value={decQty}
                        onChange={(e) => setDecQty(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 transition-all"
                        placeholder="Enter quantity"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={decSubmitting || !decQty}
                      className="w-full rounded-lg bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-red-500 enabled:hover:text-white transition-all duration-200"
                    >
                      {decSubmitting ? '⏳ Decreasing…' : '✗ Decrease Stock'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Stock Summary</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Current Stock</div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <div className="text-3xl font-bold text-slate-900">{currentStock}</div>
                    <div className="text-sm text-slate-500">units</div>
                  </div>
                </div>
                <div className="rounded-xl border border-green-200 bg-green-50 p-6 shadow-lg">
                  <div className="text-xs font-semibold text-green-600 uppercase tracking-wider">Total Increased</div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <div className="text-3xl font-bold text-green-700">+{totalIncreased}</div>
                    <div className="text-sm text-green-600">units</div>
                  </div>
                </div>
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-lg">
                  <div className="text-xs font-semibold text-red-600 uppercase tracking-wider">Total Decreased</div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <div className="text-3xl font-bold text-red-700">-{totalDecreased}</div>
                    <div className="text-sm text-red-600">units</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Transaction History</h2>

              <div className="rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-gradient-to-r from-slate-900 to-slate-800 text-white sticky top-0">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-left">Type</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-left">Quantity</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-left">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txLoading ? (
                        <tr>
                          <td className="px-4 sm:px-6 py-6 text-slate-500 text-center" colSpan={3}>
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"></div>
                              <span>Loading transactions…</span>
                            </div>
                          </td>
                        </tr>
                      ) : transactions.length === 0 ? (
                        <tr>
                          <td className="px-4 sm:px-6 py-8 text-slate-500 text-center" colSpan={3}>
                            <span>No transactions yet</span>
                          </td>
                        </tr>
                      ) : (
                        transactions.map((t) => (
                          <tr key={t._id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="px-4 sm:px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold ${
                                  t.type === 'INCREASE'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                <span>{t.type === 'INCREASE' ? '📈' : '📉'}</span>
                                {t.type}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 font-bold text-slate-900">
                              <span className={t.type === 'INCREASE' ? 'text-green-600' : 'text-red-600'}>
                                {t.type === 'INCREASE' ? `+${t.quantity}` : `-${t.quantity}`}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-slate-700 text-xs sm:text-sm">{formatTimestamp(t.timestamp)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {txError ? (
                <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
                  <div className="flex gap-3">
                    <span className="text-red-600">⚠️</span>
                    <div className="text-sm text-red-700">{txError}</div>
                  </div>
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="text-2xl">❌</span>
            <span className="text-sm text-slate-500">Product not found</span>
          </div>
        )}

        {summaryError ? (
          <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <div className="flex gap-3">
              <span className="text-red-600 text-lg">⚠️</span>
              <div className="text-sm text-red-700">{summaryError}</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
