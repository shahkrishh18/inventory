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
    return import.meta.env.VITE_API_BASE_URL
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
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <span className="text-lg leading-none">←</span>
          <span>Back to Dashboard</span>
        </button>

        {summaryLoading ? (
          <div className="mt-6 text-sm text-slate-500">Loading…</div>
        ) : product ? (
          <>
            <div className="mt-4">
              <h1 className="text-2xl sm:text-3xl font-semibold">{product.name}</h1>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-slate-700">
                <div>
                  <span className="text-slate-500">SKU:</span> <span className="font-medium">{product.sku}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Current Stock:</span>
                  <span className="rounded-md bg-slate-100 px-3 py-1 font-medium text-slate-900">
                    {currentStock}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 sm:mt-10">
              <div className="text-sm font-semibold text-slate-900">Stock Adjustment</div>

              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <span>Increase Stock</span>
                  </div>
                  <form onSubmit={submitIncrease} className="mt-4">
                    <label className="block text-sm text-slate-700">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={incQty}
                      onChange={(e) => setIncQty(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                      placeholder="Enter quantity"
                      required
                    />
                    <button
                      type="submit"
                      disabled={incSubmitting || !incQty}
                      className="mt-4 w-full rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-60 enabled:hover:bg-green-500 enabled:hover:text-white transition-colors"
                    >
                      {incSubmitting ? 'Increasing…' : 'Increase Stock'}
                    </button>
                  </form>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <span>Decrease Stock</span>
                  </div>
                  <form onSubmit={submitDecrease} className="mt-4">
                    <label className="block text-sm text-slate-700">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={decQty}
                      onChange={(e) => setDecQty(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                      placeholder="Enter quantity"
                      required
                    />
                    <button
                      type="submit"
                      disabled={decSubmitting || !decQty}
                      className="mt-4 w-full rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-60 enabled:hover:bg-red-500 enabled:hover:text-white transition-colors"
                    >
                      {decSubmitting ? 'Decreasing…' : 'Decrease Stock'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="mt-8 sm:mt-10">
              <div className="text-lg sm:text-xl font-semibold">Stock Summary</div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                  <div className="text-sm text-slate-600">Current Stock</div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">{currentStock}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                  <div className="text-sm text-slate-600">Total Increased</div>
                  <div className="mt-2 text-lg font-semibold text-green-700">{totalIncreased}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                  <div className="text-sm text-slate-600">Total Decreased</div>
                  <div className="mt-2 text-lg font-semibold text-red-700">{totalDecreased}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 sm:mt-10">
              <div className="text-sm font-semibold text-slate-900">Transaction History</div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-slate-50 text-slate-700">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Transaction Type</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Quantity</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txLoading ? (
                        <tr>
                          <td className="px-4 sm:px-6 py-6 text-slate-500" colSpan={3}>
                            Loading…
                          </td>
                        </tr>
                      ) : transactions.length === 0 ? (
                        <tr>
                          <td className="px-4 sm:px-6 py-6 text-slate-500" colSpan={3}>
                            No transactions.
                          </td>
                        </tr>
                      ) : (
                        transactions.map((t) => (
                          <tr key={t._id} className="border-t border-slate-200">
                            <td className="px-4 sm:px-6 py-5">
                              <span
                                className={
                                  t.type === 'INCREASE'
                                    ? 'inline-flex items-center rounded-md bg-green-50 px-3 py-1 text-xs font-semibold text-green-700'
                                    : 'inline-flex items-center rounded-md bg-red-50 px-3 py-1 text-xs font-semibold text-red-700'
                                }
                              >
                                {t.type}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-5 font-medium text-slate-900">
                              {t.type === 'INCREASE' ? `+${t.quantity}` : `-${t.quantity}`}
                            </td>
                            <td className="px-4 sm:px-6 py-5 text-slate-700 text-xs sm:text-sm">{formatTimestamp(t.timestamp)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {txError ? <div className="mt-3 text-sm text-red-600">{txError}</div> : null}
            </div>
          </>
        ) : (
          <div className="mt-6 text-sm text-slate-500">No details available.</div>
        )}

        {summaryError ? <div className="mt-4 text-sm text-red-600">{summaryError}</div> : null}
      </div>
    </div>
  )
}
