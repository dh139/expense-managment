"use client"

import { useEffect, useState } from "react"
import api from "../lib/api.js"

export default function AdminRules() {
  const [rule, setRule] = useState({ sequence: [], percentThreshold: null, specificApprovers: [], hybridOr: true })
  const [users, setUsers] = useState([])
  const [newSeq, setNewSeq] = useState({ type: "ROLE", value: "MANAGER" })

  async function load() {
    const [r, u] = await Promise.all([api.get("/api/rules"), api.get("/api/users")])
    setRule(r.data || { sequence: [], percentThreshold: null, specificApprovers: [], hybridOr: true })
    setUsers(u.data)
  }
  useEffect(() => {
    load()
  }, [])

  function addSeq() {
    setRule((prev) => ({ ...prev, sequence: [...prev.sequence, newSeq] }))
  }

  function removeSeq(idx) {
    setRule((prev) => ({ ...prev, sequence: prev.sequence.filter((_, i) => i !== idx) }))
  }

  async function save() {
    await api.post("/api/rules", rule)
    alert("Saved")
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card">
        <h3>Approval Sequence</h3>
        <div className="row" style={{ alignItems: "center" }}>
          <select value={newSeq.type} onChange={(e) => setNewSeq({ ...newSeq, type: e.target.value })}>
            <option value="ROLE">ROLE</option>
            <option value="USER">USER</option>
          </select>
          {newSeq.type === "ROLE" ? (
            <select value={newSeq.value} onChange={(e) => setNewSeq({ ...newSeq, value: e.target.value })}>
              {["MANAGER", "ADMIN", "EMPLOYEE"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          ) : (
            <select value={newSeq.value} onChange={(e) => setNewSeq({ ...newSeq, value: e.target.value })}>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          )}
          <button onClick={addSeq}>Add Step</button>
        </div>
        <ol style={{ marginTop: 12 }}>
          {rule.sequence.map((s, idx) => (
            <li key={idx}>
              Step {idx + 1}: {s.type} - {s.value}{" "}
              <button onClick={() => removeSeq(idx)} style={{ marginLeft: 8 }}>
                Remove
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="card">
        <h3>Conditional Rules</h3>
        <div className="row">
          <input
            type="number"
            min="0"
            max="100"
            placeholder="Percent threshold (e.g. 60)"
            value={rule.percentThreshold ?? ""}
            onChange={(e) =>
              setRule({ ...rule, percentThreshold: e.target.value ? Number.parseFloat(e.target.value) : null })
            }
          />
          <select
            multiple
            value={rule.specificApprovers}
            onChange={(e) =>
              setRule({ ...rule, specificApprovers: Array.from(e.target.selectedOptions).map((o) => o.value) })
            }
            style={{ minWidth: 260, height: 120 }}
          >
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
          <label className="row" style={{ alignItems: "center" }}>
            <input
              type="checkbox"
              checked={rule.hybridOr}
              onChange={(e) => setRule({ ...rule, hybridOr: e.target.checked })}
            />
            <span style={{ marginLeft: 8 }}>Hybrid OR mode (otherwise AND)</span>
          </label>
        </div>
        <button onClick={save} style={{ marginTop: 8 }}>
          Save Rules
        </button>
      </div>
    </div>
  )
}
