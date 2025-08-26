"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

const AdRedirect = () => {
  const { slug } = useParams()
  const [countdown, setCountdown] = useState(10)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer)
          navigate(`/final-redirect/${slug}`)
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [slug, navigate])

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Hold on! We're getting your link ready</h2>
      <div style={{ border: "1px solid #ccc", padding: 20, width: 300, margin: "20px auto" }}>
        {/* Your ad code can go here as iframe or Google AdSense */}
        <p>Advertisement will be shown here</p>
      </div>
      <p style={{ fontSize: "24px" }}>Redirecting in {countdown} seconds...</p>
    </div>
  )
}

export default AdRedirect
