"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const FinalRedirect = () => {
  const { slug } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/redirect/${slug}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
          }),
        })

        const data = await response.json()

        if (response.ok && data.originalUrl) {
          // Record the click and redirect
          window.location.href = data.originalUrl
        } else {
          setError(data.error || "Link not found")
        }
      } catch (err) {
        setError("Failed to process redirect")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      handleRedirect()
    }
  }, [slug, apiUrl])

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Redirecting...</h2>
        <p>Please wait while we redirect you to your destination.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => (window.location.href = "/")}>Go to Homepage</button>
      </div>
    )
  }

  return null
}

export default FinalRedirect
