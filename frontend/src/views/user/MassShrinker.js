"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import "../../assets/MassShrinker.css"

const MassShrinker = () => {
  const { token, API_BASE_URL } = useAuth()
  const [urls, setUrls] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const urlList = urls.split("\n").filter((url) => url.trim())

    if (urlList.length === 0) {
      showNotification("Please enter at least one URL", "error")
      return
    }

    if (urlList.length > 20) {
      showNotification("Maximum 20 URLs allowed", "error")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/mass-shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ urls: urlList }),
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data.results)
        showNotification(`${data.results.length} URLs shortened successfully!`, "success")
      } else {
        showNotification(data.error || "Failed to shorten URLs", "error")
      }
    } catch (error) {
      showNotification("Network error. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
    showNotification("URL copied to clipboard!", "success")
  }

  const copyAllResults = () => {
    const allUrls = results.map((result) => result.shortenedUrl).join("\n")
    navigator.clipboard.writeText(allUrls)
    showNotification("All URLs copied to clipboard!", "success")
  }

  return (
    <div className="mass-shrinker-container">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <i className={`fas ${notification.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">
          <i className="fas fa-cut"></i>
          Mass URL Shrinker
        </h1>
        <p className="page-subtitle">Shorten multiple URLs at once (max 20)</p>
      </div>

      <div className="mass-shrinker-content">
        {/* Input Form */}
        <div className="form-card">
          <div className="card-header">
            <div className="header-icon">
              <i className="fas fa-cut"></i>
            </div>
            <div className="header-text">
              <h2 className="card-title">Bulk URL Shortening</h2>
              <p className="card-description">Enter URLs (one per line) to shorten them all at once</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mass-form">
            <div className="form-group">
              <label htmlFor="urls" className="form-label">
                <i className="fas fa-list"></i>
                URLs to Shorten (Max 20)
              </label>
              <textarea
                id="urls"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
                rows={10}
                className="form-textarea"
                required
              />
              <p className="form-hint">Enter one URL per line. Maximum 20 URLs allowed per batch.</p>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Processing URLs...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-compress-alt"></i>
                  <span>Shorten All URLs</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="results-card">
            <div className="results-header">
              <div className="results-title-section">
                <h3 className="results-title">
                  <i className="fas fa-check-circle"></i>
                  Results
                </h3>
                <p className="results-description">{results.length} URLs processed successfully</p>
              </div>
              <button onClick={copyAllResults} className="copy-all-btn">
                <i className="fas fa-copy"></i>
                Copy All
              </button>
            </div>

            <div className="results-list">
              {results.map((result, index) => (
                <div key={index} className="result-item">
                  <div className="result-info">
                    <span className="result-index">#{index + 1}</span>
                    <code className="result-url">{result.shortenedUrl}</code>
                  </div>
                  <button onClick={() => copyToClipboard(result.shortenedUrl)} className="copy-btn" title="Copy URL">
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="instructions-card">
          <div className="instructions-header">
            <div className="instructions-icon">
              <i className="fas fa-info-circle"></i>
            </div>
            <h3 className="instructions-title">How to Use Mass Shrinker</h3>
          </div>
          <div className="instructions-content">
            <div className="instruction-step">
              <div className="step-number">1</div>
              <p>Paste your URLs in the text area above, one URL per line</p>
            </div>
            <div className="instruction-step">
              <div className="step-number">2</div>
              <p>Make sure each URL is valid and starts with http:// or https://</p>
            </div>
            <div className="instruction-step">
              <div className="step-number">3</div>
              <p>Click "Shorten All URLs" to process your batch (max 20 URLs)</p>
            </div>
            <div className="instruction-step">
              <div className="step-number">4</div>
              <p>Copy individual URLs or use "Copy All" to get all shortened links</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MassShrinker
