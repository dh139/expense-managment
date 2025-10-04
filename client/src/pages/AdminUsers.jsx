"use client"

import { useEffect, useState } from "react"
import api from "../lib/api.js"

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EMPLOYEE", managerId: "" })
  const [settings, setSettings] = useState({ managerApproverEnabled: true })

  async function load() {
    const { data } = await api.get("/api/users")
    setUsers(data)
  }
  useEffect(() => {
    load()
  }, [])

  async function createUser(e) {
    e.preventDefault()
    await api.post("/api/users", {
      ...form,
      managerId: form.managerId || null,
    })
    setForm({ name: "", email: "", password: "", role: "EMPLOYEE", managerId: "" })
    await load()
  }

  async function saveSettings() {
    await api.patch("/api/users/company/settings", settings)
    alert("Saved")
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card">
        <h3>Company Settings</h3>
        <label className="row" style={{ alignItems: "center" }}>
          <input
            type="checkbox"
            checked={settings.managerApproverEnabled}
            onChange={(e) => setSettings({ ...settings, managerApproverEnabled: e.target.checked })}
          />
          <span style={{ marginLeft: 8 }}>Require Manager as first approver</span>
        </label>
        <button onClick={saveSettings} style={{ marginTop: 8 }}>
          Save
        </button>
      </div>

      <div className="card">
        <h3>Create User</h3>
        <form onSubmit={createUser} className="grid grid-2">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {["EMPLOYEE", "MANAGER", "ADMIN"].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select value={form.managerId} onChange={(e) => setForm({ ...form, managerId: e.target.value })}>
            <option value="">No Manager</option>
            {users
              .filter((u) => u.role !== "EMPLOYEE")
              .map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
          </select>
          <button>Create</button>
        </form>
      </div>

      <div className="card">
        <h3>Users</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Manager</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.managerId || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
