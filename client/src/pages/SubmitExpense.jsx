"use client"

import { useEffect, useState } from "react"
import api from "../lib/api.js"

export default function SubmitExpense() {
  const [form, setForm] = useState({
    amount: "",
    currency: "USD",
    category: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  })
  const [rates, setRates] = useState({})
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    // rates optional preview for UI
    async function load() {
      try {
        const { data } = await api.get(`/api/utils/rates/USD`)
        setRates(data)
      } catch {}
    }
    load()
  }, [])

  async function handleOCR() {
    if (!file) return
    const fd = new FormData()
    fd.append("receipt", file)
    try {
      const { data } = await api.post("/api/expenses/ocr", fd)
      setForm((prev) => ({
        ...prev,
        amount: data.amount != null ? String(data.amount) : prev.amount,
        description: data.description || prev.description,
        date: data.date ? data.date.split("T")[0] : prev.date,
      }))
    } catch (e) {
      setMsg("OCR failed")
    }
  }

  async function submit(e) {
    e.preventDefault()
    setMsg("")
    try {
      await api.post("/api/expenses", {
        amount: Number.parseFloat(form.amount),
        currency: form.currency,
        category: form.category,
        description: form.description,
        date: form.date,
      })
      setMsg("Expense submitted!")
      setForm({
        amount: "",
        currency: form.currency,
        category: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
      })
      setFile(null)
    } catch (e) {
      setMsg(e?.response?.data?.error || "Failed to submit")
    }
  }

  return (
    <div className="card">
      <h3>Submit Expense</h3>
      {msg && <p>{msg}</p>}
      <form onSubmit={submit} className="grid">
        <div className="row">
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
            {["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <input
          placeholder="Category (e.g. Meals, Travel)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <textarea
          rows="3"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <div className="row" style={{ alignItems: "center" }}>
          <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button type="button" onClick={handleOCR} style={{ marginLeft: 8 }}>
            OCR Autofill
          </button>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
