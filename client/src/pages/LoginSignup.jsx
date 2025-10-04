"use client"

import { useState } from "react"
import api from "../lib/api.js"
import { useAuth } from "../auth/auth-context.jsx"

export default function LoginSignup() {
  const { login } = useAuth()
  const [mode, setMode] = useState("login")
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    country: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function submit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (mode === "login") {
        const { data } = await api.post("/api/auth/login", { email: form.email, password: form.password })
        login(data)
      } else {
        const { data } = await api.post("/api/auth/signup", {
          name: form.name,
          email: form.email,
          password: form.password,
          companyName: form.companyName,
          country: form.country,
        })
        login(data)
      }
    } catch (e) {
      setError(e?.response?.data?.error || "Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: "40px auto" }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h3>{mode === "login" ? "Login" : "Sign up"}</h3>
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Need an account?" : "Have an account?"}
        </button>
      </div>
      {error && <p style={{ color: "salmon" }}>{error}</p>}
      <form onSubmit={submit} className="grid" style={{ marginTop: 16 }}>
        {mode === "signup" && (
          <>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Company Name"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              required
            />
            <input
              placeholder="Country (e.g. United States)"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              required
            />
          </>
        )}
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}</button>
      </form>
      <p style={{ marginTop: 12, fontSize: 12, color: "#94a3b8" }}>
        Signup auto-creates a Company (currency based on country) and Admin user.
      </p>
    </div>
  )
}
