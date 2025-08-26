"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import "./Login.css"

const Login_SignUp = () => {
  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  })

  const [isLoginMode, setIsLoginMode] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const auth = useAuth()
  const navigate = useNavigate()

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const result = await auth.login(loginData.identifier, loginData.password)
      if (result.success) {
        navigate("/admin/dashboard")
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      if (registerData.password !== registerData.confirmPassword) {
        throw new Error("Passwords do not match")
      }
      const result = await auth.register(
        registerData.username,
        registerData.email,
        registerData.password,
        registerData.referralCode,
      )
      if (result.success) {
        navigate("/admin/dashboard")
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"
    window.location.href = `${apiUrl}/auth/${provider}`
  }

  return (
    <div className="auth-page-wrapper">
      <div className={`auth-container ${!isLoginMode ? "right-panel-active" : ""}`}>
        {/* Mobile Toggle Buttons */}
        <div className="mobile-toggle">
          <button className={`mobile-toggle-btn ${isLoginMode ? "active" : ""}`} onClick={() => setIsLoginMode(true)}>
            Sign In
          </button>
          <button className={`mobile-toggle-btn ${!isLoginMode ? "active" : ""}`} onClick={() => setIsLoginMode(false)}>
            Sign Up
          </button>
        </div>

        {/* Sign Up Form */}
        <div className="form-panel sign-up-container">
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <h3 className="form-title">Create Account</h3>
            <div className="social-container">
              <button type="button" className="social-icon" onClick={() => handleSocialLogin("google")}>
                <i className="fab fa-google"></i>
              </button>
              <button type="button" className="social-icon" onClick={() => handleSocialLogin("facebook")}>
                <i className="fab fa-facebook-f"></i>
              </button>
              <button type="button" className="social-icon" onClick={() => handleSocialLogin("linkedin")}>
                <i className="fab fa-linkedin-in"></i>
              </button>
            </div>
            <span className="form-subtitle">or use your email for registration</span>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={registerData.username}
              onChange={handleRegisterChange}
              className="auth-input"
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              className="auth-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              className="auth-input"
              required
              minLength="6"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              className="auth-input"
              required
            />
            <input
              type="text"
              placeholder="Referral Code (Optional)"
              name="referralCode"
              value={registerData.referralCode}
              onChange={handleRegisterChange}
              className="auth-input"
            />
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-panel sign-in-container">
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <h3 className="form-title">Sign in</h3>
            <div className="social-container">
              <button type="button" className="social-icon" onClick={() => handleSocialLogin("google")}>
                <i className="fab fa-google"></i>
              </button>
              <button type="button" className="social-icon" onClick={() => handleSocialLogin("facebook")}>
                <i className="fab fa-facebook-f"></i>
              </button>
              <button type="button" className="social-icon" onClick={() => handleSocialLogin("linkedin")}>
                <i className="fab fa-linkedin-in"></i>
              </button>
            </div>
            <span className="form-subtitle">or use your account</span>
            <input
              type="text"
              placeholder="Username or Email"
              name="identifier"
              value={loginData.identifier}
              onChange={handleLoginChange}
              className="auth-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="auth-input"
              required
            />
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot your password?
            </Link>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>

        {/* Overlay Panel */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="overlay-title">Welcome Back!</h1>
              <p className="overlay-text">To keep connected with us please login with your personal info</p>
              <button className="auth-button ghost" onClick={() => setIsLoginMode(true)}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="overlay-title">Hello, Friend!</h1>
              <p className="overlay-text">Enter your personal details and start journey with us</p>
              <button className="auth-button ghost" onClick={() => setIsLoginMode(false)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login_SignUp
