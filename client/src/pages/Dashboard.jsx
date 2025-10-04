import { useAuth } from "../auth/auth-context.jsx"
import { Link } from "react-router-dom"

export default function Dashboard() {
  const { user } = useAuth()
  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card">
        <h2 style={{ margin: 0 }}>{user ? `Welcome, ${user.name}` : "Welcome"}</h2>
        <p className="text-pretty" style={{ marginTop: 6 }}>
          Submit expenses, track statuses, and approve requests with clear multi-level workflows and flexible rules.
        </p>
        <div className="row" style={{ marginTop: 12 }}>
          <Link to="/submit">
            <button>New Expense</button>
          </Link>
          <Link to="/my">
            <button className="ghost-btn">My Expenses</button>
          </Link>
          {user && (user.role === "MANAGER" || user.role === "ADMIN") && (
            <Link to="/approvals">
              <button className="ghost-btn">Pending Approvals</button>
            </Link>
          )}
          {user && user.role === "ADMIN" && (
            <>
              <Link to="/admin/users">
                <button className="ghost-btn">Manage Users</button>
              </Link>
              <Link to="/admin/rules">
                <button className="ghost-btn">Approval Rules</button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h4 style={{ marginTop: 0 }}>How approvals work</h4>
          <p className="text-pretty">
            Expenses move to the next approver after each decision. Rules can auto-approve when a percentage of
            approvers approve or when a specific approver approves. Hybrid OR/AND is supported.
          </p>
        </div>
        <div className="card">
          <h4 style={{ marginTop: 0 }}>Tips</h4>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
            <li>Enable Manager-as-first-approver in Company settings.</li>
            <li>Use OCR on clear, well-lit receipt photos to auto-fill forms.</li>
            <li>Set percent thresholds and specific approvers in Rules.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
