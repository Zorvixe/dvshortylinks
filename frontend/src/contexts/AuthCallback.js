"use client"

import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

const AuthCallback = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { socialLogin } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get("token")

    if (token) {
      socialLogin(token)
        .then((result) => {
          if (result.success) {
            navigate("/admin/dashboard")
          } else {
            navigate("/auth/login")
          }
        })
        .catch(() => {
          navigate("/auth/login")
        })
    } else {
      navigate("/auth/login")
    }
  }, [location, socialLogin, navigate])

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Authenticating...</p>
      </div>
    </div>
  )
}

export default AuthCallback
