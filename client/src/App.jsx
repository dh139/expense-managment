import { Routes, Route, Navigate, Link } from "react-router-dom"
import { AuthProvider, useAuth } from "./auth/auth-context.jsx"
import LoginSignup from "./pages/LoginSignup.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import SubmitExpense from "./pages/SubmitExpense.jsx"
import MyExpenses from "./pages/MyExpenses.jsx"
import PendingApprovals from "./pages/PendingApprovals.jsx"
import AdminUsers from "./pages/AdminUsers.jsx"
import AdminRules from "./pages/AdminRules.jsx"
import React from "react"
import { ToastProvider } from "./components/Toast.jsx"
import Footer from "./components/Footer.jsx"

function PrivateRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/auth" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function Shell({ children }) {
  const { user, logout } = useAuth()
  const current = typeof window !== "undefined" ? localStorage.getItem("theme") || "dark" : "dark"
  const [theme, setTheme] = React.useState(current)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div>
      <header className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/">
            <h3 className="text-xl font-bold">Expense Approval</h3>
          </Link>
          
          {/* Hamburger button for mobile */}
          <button
            className="md:hidden p-2 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <button
              aria-label="Toggle theme"
              className="ghost-btn px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title={theme === "dark" ? "Switch to light" : "Switch to dark"}
            >
              {theme === "dark" ? "Light" : "Dark"} Mode
            </button>
            {user ? (
              <>
                <Link to="/submit" className="hover:underline">
                  Submit
                </Link>
                <Link to="/my" className="hover:underline">
                  My Expenses
                </Link>
                {(user.role === "MANAGER" || user.role === "ADMIN") && (
                  <Link to="/approvals" className="hover:underline">
                    Approvals
                  </Link>
                )}
                {user.role === "ADMIN" && (
                  <>
                    <Link to="/admin/users" className="hover:underline">
                      Users
                    </Link>
                    <Link to="/admin/rules" className="hover:underline">
                      Rules
                    </Link>
                  </>
                )}
                <button
                  className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="hover:underline">
                Login
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col space-y-2 pb-4">
            <button
              aria-label="Toggle theme"
              className="ghost-btn px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-left"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title={theme === "dark" ? "Switch to light" : "Switch to dark"}
            >
              {theme === "dark" ? "Light" : "Dark"} Mode
            </button>
            {user ? (
              <>
                <Link to="/submit" className="hover:underline" onClick={toggleMenu}>
                  Submit
                </Link>
                <Link to="/my" className="hover:underline" onClick={toggleMenu}>
                  My Expenses
                </Link>
                {(user.role === "MANAGER" || user.role === "ADMIN") && (
                  <Link to="/approvals" className="hover:underline" onClick={toggleMenu}>
                    Approvals
                  </Link>
                )}
                {user.role === "ADMIN" && (
                  <>
                    <Link to="/admin/users" className="hover:underline" onClick={toggleMenu}>
                      Users
                    </Link>
                    <Link to="/admin/rules" className="hover:underline" onClick={toggleMenu}>
                      Rules
                    </Link>
                  </>
                )}
                <button
                  className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-left"
                  onClick={() => {
                    logout()
                    toggleMenu()
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="hover:underline" onClick={toggleMenu}>
                Login
              </Link>
            )}
          </nav>
        )}
      </header>
      <main className="container mx-auto px-4">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
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
        <Footer />
      </ToastProvider>
    </AuthProvider>
  )
}