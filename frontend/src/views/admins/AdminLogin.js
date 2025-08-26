"use client"
import { useState } from "react"
import axios from "axios"
import "./AdminLogin.css"

const AdminLogin = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [email, setEmail] = useState("")
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axios.post(`${apiUrl}/api/admin/login`, { username, password })
      localStorage.setItem("adminToken", res.data.token)
      localStorage.setItem("adminData", JSON.stringify(res.data.admin))
      window.location.href = "/admindashboard"
    } catch (err) {
      setError(err.response?.data?.error || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axios.post(`${apiUrl}/api/admin/register`, { username, email, password })
      localStorage.setItem("adminToken", res.data.token)
      localStorage.setItem("adminData", JSON.stringify(res.data.admin))
      window.location.href = "/admindashboard"
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-container-vad">
      <div className="admin-login-card-vad">
        <div className="admin-login-header-vad">
          <div className="admin-logo-vad">
            <div className="logo-icon-vad">⚡</div>
            <h1>Admin Portal</h1>
          </div>
          <p className="admin-subtitle-vad">
            {isRegisterMode ? "Create your admin account" : "Sign in to your admin account"}
          </p>
        </div>

        {error && (
          <div className="error-alert-vad">
            <span className="error-icon-vad">⚠</span>
            {error}
          </div>
        )}

        <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="admin-login-form-vad">
          <div className="form-group-vad">
            <label htmlFor="username" className="form-label-vad">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-input-vad"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          {isRegisterMode && (
            <div className="form-group-vad">
              <label htmlFor="email" className="form-label-vad">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-input-vad"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          )}

          <div className="form-group-vad">
            <label htmlFor="password" className="form-label-vad">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input-vad"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className={`login-button-vad ${loading ? "loading-vad" : ""}`} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-vad"></span>
                {isRegisterMode ? "Creating Account..." : "Signing in..."}
              </>
            ) : isRegisterMode ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="admin-toggle-mode">
          <button
            type="button"
            className="toggle-mode-btn"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode)
              setError("")
              setUsername("")
              setEmail("")
              setPassword("")
            }}
          >
            {isRegisterMode ? "Already have an account? Sign In" : "Don't have an account? Register"}
          </button>
        </div>

        <div className="admin-login-footer-vad">
          <p>© {new Date().getFullYear()} Admin Dashboard. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
