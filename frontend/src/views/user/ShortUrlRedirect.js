// views/user/ShortUrlRedirect.js
"use client"
import { useEffect } from "react"
import { useParams } from "react-router-dom"

export default function ShortUrlRedirect() {
  const { shortCode } = useParams()
  const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin

  useEffect(() => {
    if (shortCode) {
      // Always go through the backend interstitial
      window.location.replace(`${API_BASE_URL}/${shortCode}`)
    }
  }, [shortCode, API_BASE_URL])

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>Loading your link…</h2>
      <p>
        If nothing happens,&nbsp;
        <a href={`${API_BASE_URL}/${shortCode}`}>click here</a>.
      </p>
    </div>
  )
}
