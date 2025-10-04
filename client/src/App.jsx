"use client"
import { Routes, Route, Navigate, Link } from "react-router-dom"
import { AuthProvider, useAuth } from "./auth/auth-context.jsx"
import LoginSignup from "./pages/LoginSignup.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import SubmitExpense from "./pages/SubmitExpense.jsx"
import MyExpenses from "./pages/MyExpenses.jsx"
import PendingApprovals from "./pages/PendingApprovals.jsx"
import AdminUsers from "./pages/AdminUsers.jsx"
import AdminRules from "./pages/AdminRules.jsx"

function PrivateRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/auth" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function Shell({ children }) {
  const { user, logout } = useAuth()
  return (
    <div>
      <header className="container">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/">
            <h3>Expense Approval</h3>
          </Link>
          <nav className="row" style={{ alignItems: "center" }}>
            {user ? (
              <>
                <Link to="/submit" style={{ marginRight: 12 }}>
                  Submit
                </Link>
                <Link to="/my">My Expenses</Link>
                {(user.role === "MANAGER" || user.role === "ADMIN") && (
                  <Link to="/approvals" style={{ marginLeft: 12 }}>
                    Approvals
                  </Link>
                )}
                {user.role === "ADMIN" && (
                  <>
                    <Link to="/admin/users" style={{ marginLeft: 12 }}>
                      Users
                    </Link>
                    <Link to="/admin/rules" style={{ marginLeft: 12 }}>
                      Rules
                    </Link>
                  </>
                )}
                <button style={{ marginLeft: 16 }} onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Shell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<LoginSignup />} />
          <Route
            path="/submit"
            element={
              <PrivateRoute roles={["EMPLOYEE", "MANAGER", "ADMIN"]}>
                <SubmitExpense />
              </PrivateRoute>
            }
          />
          <Route
            path="/my"
            element={
              <PrivateRoute roles={["EMPLOYEE", "MANAGER", "ADMIN"]}>
                <MyExpenses />
              </PrivateRoute>
            }
          />
          <Route
            path="/approvals"
            element={
              <PrivateRoute roles={["MANAGER", "ADMIN"]}>
                <PendingApprovals />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute roles={["ADMIN"]}>
                <AdminUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/rules"
            element={
              <PrivateRoute roles={["ADMIN"]}>
                <AdminRules />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
    </AuthProvider>
  )
}
