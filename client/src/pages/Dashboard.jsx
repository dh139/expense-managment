"use client"
import { useAuth } from "../auth/auth-context.jsx"

export default function Dashboard() {
  const { user } = useAuth()
  return (
    <div className="grid" style={{ gap: 8 }}>
      <h2>Welcome {user ? user.name : "Guest"}</h2>
      <p>Submit expenses, approve requests, and configure rules.</p>
      {!user && <p>Please log in to continue.</p>}
    </div>
  )
}
