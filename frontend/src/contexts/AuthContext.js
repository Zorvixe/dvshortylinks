"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${apiUrl}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          localStorage.removeItem("token")
        }
      } catch (err) {
        console.error("Auth initialization failed:", err)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [apiUrl])

  const login = async (identifier, password) => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: identifier, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      localStorage.setItem("token", data.token)
      setUser(data.user)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (username, email, password, referralCode) => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(`${apiUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, referralCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      localStorage.setItem("token", data.token)
      setUser(data.user)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const socialLogin = async (token) => {
    try {
      localStorage.setItem("token", token)
      setLoading(true)

      const response = await fetch(`${apiUrl}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error("Social login failed")
      }

      const data = await response.json()
      setUser(data.user)
      return { success: true }
    } catch (err) {
      setError(err.message)
      localStorage.removeItem("token")
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    socialLogin,
    logout,
    isAuthenticated: !!user,
    token: localStorage.getItem("token"),
    API_BASE_URL: apiUrl,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}