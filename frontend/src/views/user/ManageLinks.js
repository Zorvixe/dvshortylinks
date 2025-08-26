"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import "../../assets/ManageLinks.css"

const ManageLinks = () => {
  const { token, API_BASE_URL } = useAuth()
  const [formData, setFormData] = useState({
    url: "",
    alias: "",
    title: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
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
    setResult(null)

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
        setResult(data)
        setFormData({ url: "", alias: "", title: "", description: "" })
        showNotification("Link shortened successfully!", "success")
      } else {
        showNotification(data.error || "Failed to shorten link", "error")
      }
    } catch (error) {
      showNotification("Network error. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    showNotification("Short link copied to clipboard!", "success")
  }

  return (
    <div className="manage-links-container">
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
          <i className="fas fa-link"></i>
          Manage Links
        </h1>
        <p className="page-subtitle">Create and customize your shortened links to maximize earnings</p>
      </div>

      <div className="content-grid">
        {/* Link Creation Form */}
        <div className="form-section">
          <div className="form-card">
            <div className="card-header">
              <div className="header-icon">
                <i className="fas fa-plus-circle"></i>
              </div>
              <div className="header-text">
                <h2 className="card-title">Create New Short Link</h2>
                <p className="card-description">Enter your long URL and customize your short link details</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="link-form">
              <div className="form-group">
                <label htmlFor="url" className="form-label">
                  <i className="fas fa-globe"></i>
                  Long URL *
                </label>
                <input
                  id="url"
                  name="url"
                  type="url"
                  required
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://example.com/your-long-link"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="alias" className="form-label">
                  <i className="fas fa-tag"></i>
                  Custom Alias (Optional)
                </label>
                <div className="alias-input-group">
                  <span className="url-prefix">dvshortylinks.com/</span>
                  <input
                    id="alias"
                    name="alias"
                    value={formData.alias}
                    onChange={handleChange}
                    placeholder="your-custom-name"
                    className="form-input alias-input"
                  />
                </div>
                <p className="form-hint">Choose a memorable and unique alias for your link</p>
              </div>

              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  <i className="fas fa-heading"></i>
                  Title (Optional)
                </label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="A descriptive title for your link"
                  className="form-input"
                />
                <p className="form-hint">Helps you organize and identify your links easily</p>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  <i className="fas fa-align-left"></i>
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add a brief description of the link's content"
                  rows={3}
                  className="form-textarea"
                />
                <p className="form-hint">Provide more context for your link</p>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Creating Link...</span>
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
        </div>

        {/* Right Section */}
        <div className="info-section">
          {/* Result Display */}
          {result && (
            <div className="result-card">
              <div className="result-header">
                <div className="success-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3 className="result-title">Link Created Successfully!</h3>
              </div>

              <div className="result-content">
                <label className="result-label">Your Short URL:</label>
                <div className="url-display">
                  <input value={result.shortenedUrl} readOnly className="result-input" />
                  <button onClick={() => copyToClipboard(result.shortenedUrl)} className="copy-btn">
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
                <div className="result-message">
                  <i className="fas fa-info-circle"></i>
                  <span>Your link is ready! Share it widely and start earning money from every click.</span>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="instructions-card">
            <div className="instructions-header">
              <h3 className="instructions-title">How It Works</h3>
            </div>
            <div className="instructions-content">
              <div className="instruction-step">
                <div className="step-number">1</div>
                <p>Enter your long URL into the "Long URL" field</p>
              </div>
              <div className="instruction-step">
                <div className="step-number">2</div>
                <p>Add a custom alias, title, and description for better management</p>
              </div>
              <div className="instruction-step">
                <div className="step-number">3</div>
                <p>Click "Shorten URL" to generate your unique short link</p>
              </div>
              <div className="instruction-step">
                <div className="step-number">4</div>
                <p>Share your new short link and watch your earnings grow!</p>
              </div>
            </div>
          </div>

          {/* Earnings Info */}
          <div className="earnings-card">
            <div className="earnings-header">
              <div className="earnings-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <h3 className="earnings-title">Maximize Your Earning Potential</h3>
            </div>
            <div className="earnings-content">
              <div className="earning-stat">
                <div className="stat-info">
                  <i className="fas fa-chart-line"></i>
                  <span>CPM Rate:</span>
                </div>
                <span className="stat-value">$5 - $15</span>
              </div>
              <div className="earning-stat">
                <div className="stat-info">
                  <i className="fas fa-eye"></i>
                  <span>Per 1000 views:</span>
                </div>
                <span className="stat-value">$10 (avg)</span>
              </div>
              <div className="earning-stat">
                <div className="stat-info">
                  <i className="fas fa-users"></i>
                  <span>Referral bonus:</span>
                </div>
                <span className="stat-value">10% for life</span>
              </div>
              <div className="earnings-note">
                <i className="fas fa-lightbulb"></i>
                <span>Higher quality traffic and specific niches can lead to better CPM rates.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageLinks
