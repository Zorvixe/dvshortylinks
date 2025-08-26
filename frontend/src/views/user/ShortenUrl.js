"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"

import "../../assets/ShortenUrl.css"

const ShortenUrl = () => {
  const { token, API_BASE_URL } = useAuth()
  const [formData, setFormData] = useState({
    url: "",
    alias: "",
    title: "",
    description: "",
  })
  const [shortenedUrl, setShortenedUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setShortenedUrl(data.shortenedUrl)
        setFormData({
          url: "",
          alias: "",
          title: "",
          description: "",
        })
        showNotification("URL shortened successfully!", "success")
      } else {
        showNotification(data.error || "Failed to shorten URL", "error")
      }
    } catch (error) {
      showNotification("Network error. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl)
      setCopied(true)
      showNotification("URL copied to clipboard!", "success")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      showNotification("Failed to copy URL", "error")
    }
  }

  return (
    <div className="shorten-url-container">
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
        <div className="header-content">
          <h1 className="page-title">
            <i className="fas fa-link"></i>
            Shorten Your URLs
          </h1>
          <p className="page-subtitle">Convert your long URLs into short, shareable links and start earning money!</p>
        </div>
        <div className="header-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>

      <div className="main-content w-full xl:w-8/12 sm:w-12">
        {/* URL Shortening Form */}
        <div className="form-card">
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-magic"></i>
            </div>
            <div className="card-title-section">
              <h2 className="card-title">Create Short URL</h2>
              <p className="card-description">Enter your long URL and optional details to create a shortened link</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="url-form">
            <div className="form-group">
              <label htmlFor="url" className="form-label">
                <i className="fas fa-globe"></i>
                Long URL *
              </label>
              <div className="input-wrapper">
                <input
                  id="url"
                  name="url"
                  type="url"
                  placeholder="https://example.com/very/long/url"
                  value={formData.url}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <div className="input-border"></div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="alias" className="form-label">
                <i className="fas fa-tag"></i>
                Custom Alias (Optional)
              </label>
              <div className="input-wrapper">
                <input
                  id="alias"
                  name="alias"
                  placeholder="my-custom-alias"
                  value={formData.alias}
                  onChange={handleChange}
                  className="form-input"
                />
                <div className="input-border"></div>
              </div>
              <p className="form-hint">Leave empty for auto-generated short code</p>
            </div>

            <div className="form-group">
              <label htmlFor="title" className="form-label">
                <i className="fas fa-heading"></i>
                Title (Optional)
              </label>
              <div className="input-wrapper">
                <input
                  id="title"
                  name="title"
                  placeholder="Page title for reference"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                />
                <div className="input-border"></div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                <i className="fas fa-align-left"></i>
                Description (Optional)
              </label>
              <div className="input-wrapper">
                <textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the link"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  rows={3}
                />
                <div className="input-border"></div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Shortening...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-compress-alt"></i>
                  <span>Shorten URL</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Success Result */}
        {shortenedUrl && (
          <div className="result-card success-card">
            <div className="result-header">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3 className="result-title">URL Shortened Successfully!</h3>
            </div>

            <div className="result-content">
              <div className="url-display">
                <div className="url-input-wrapper">
                  <input value={shortenedUrl} readOnly className="url-result-input" />
                  <button onClick={copyToClipboard} className="copy-btn" title="Copy to clipboard">
                    {copied ? <i className="fas fa-check"></i> : <i className="fas fa-copy"></i>}
                  </button>
                </div>
              </div>
              <p className="result-message">
                <i className="fas fa-money-bill-wave"></i>
                Share this link and start earning money from every click!
              </p>
            </div>
          </div>
        )}

        {/* Earning Information */}
        <div className="info-card">
          <div className="info-header">
            <div className="info-icon">
              <i className="fas fa-coins"></i>
            </div>
            <h3 className="info-title">💰 Earning Information</h3>
          </div>

          <div className="info-content">
            <div className="earning-stats">
              <div className="stat-item">
                <div className="stat-value">$8</div>
                <div className="stat-label">Per 1000 Views</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-value">10%</div>
                <div className="stat-label">Referral Bonus</div>
              </div>
            </div>
            <p className="info-description">You earn money for every unique click on your shortened links!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShortenUrl
