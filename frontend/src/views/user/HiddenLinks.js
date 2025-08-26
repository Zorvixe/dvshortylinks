"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link } from "react-router-dom"
import "../../assets/HiddenLinks.css"

const HiddenLinks = () => {
  const { token, API_BASE_URL } = useAuth()
  const [hiddenLinks, setHiddenLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  useEffect(() => {
    fetchHiddenLinks()
  }, [])

  const fetchHiddenLinks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/links?hidden=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setHiddenLinks(data)
      }
    } catch (error) {
      console.error("Error fetching hidden links:", error)
      showNotification("Failed to fetch hidden links. Please try again later.", "error")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    showNotification("Short link copied to clipboard!", "success")
  }

  const showLink = async (linkId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/links/${linkId}/toggle-hidden`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        fetchHiddenLinks()
        showNotification("Link is now visible.", "success")
      }
    } catch (error) {
      showNotification("Failed to show link. Please try again.", "error")
    }
  }

  const totalClicks = hiddenLinks.reduce((sum, link) => sum + (link.clicks || 0), 0)
  const totalEarnings = hiddenLinks.reduce((sum, link) => sum + Number.parseFloat(link.earnings || 0), 0)

  if (loading) {
    return (
      <div className="hidden-links-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading hidden links...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="hidden-links-container">
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
          <i className="fas fa-eye-slash"></i>
          Hidden Links
        </h1>
        <p className="page-subtitle">Manage your links that are currently hidden from public view</p>
      </div>

      {/* Stats */}
      <div className="stats-section">
        <div className="stat-item">
          <span className="stat-label">Hidden Links:</span>
          <span className="stat-value">{hiddenLinks.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Clicks (Hidden):</span>
          <span className="stat-value">{totalClicks.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Earnings (Hidden):</span>
          <span className="stat-value earnings">${totalEarnings.toFixed(2)}</span>
        </div>
      </div>

      {/* Hidden Links List */}
      {hiddenLinks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-eye-slash"></i>
          </div>
          <h3 className="empty-title">No hidden links</h3>
          <p className="empty-description">
            You don't have any links currently hidden. You can hide links from the "All Links" page to temporarily
            remove them from public access.
          </p>
          <Link to="/admin/all-links" className="view-links-btn">
            <i className="fas fa-link"></i>
            View All Links
          </Link>
        </div>
      ) : (
        <div className="links-grid">
          {hiddenLinks.map((link) => (
            <div key={link.id} className="link-card hidden-card">
              <div className="link-header">
                <div className="link-title-section">
                  <h3 className="link-title">{link.title || "Untitled Link"}</h3>
                  <div className="hidden-badge">
                    <i className="fas fa-eye-slash"></i>
                    <span>Hidden</span>
                  </div>
                </div>
              </div>

              <div className="link-content">
                <div className="url-section">
                  <div className="short-url-row">
                    <span className="url-label">Short:</span>
                    <div className="url-display">
                      <code className="short-url">dvshortylinks.com/{link.short_code}</code>
                      <button
                        onClick={() => copyToClipboard(`https://dvshortylinks.com/${link.short_code}`)}
                        className="copy-btn"
                        title="Copy"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                  </div>

                  <div className="original-url-row">
                    <span className="url-label">Original:</span>
                    <div className="original-url-display">
                      <a
                        href={link.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="original-url"
                        title={link.original_url}
                      >
                        {link.original_url}
                      </a>
                      <i className="fas fa-external-link-alt external-icon"></i>
                    </div>
                  </div>
                </div>

                {link.description && <p className="link-description">{link.description}</p>}

                <div className="link-stats">
                  <div className="stat-group">
                    <div className="stat-item">
                      <i className="fas fa-eye stat-icon"></i>
                      <span className="stat-value">{link.clicks || 0}</span>
                      <span className="stat-label">Views</span>
                    </div>
                    <div className="stat-item">
                      <i className="fas fa-dollar-sign stat-icon earnings"></i>
                      <span className="stat-value">${Number.parseFloat(link.earnings || 0).toFixed(2)}</span>
                      <span className="stat-label">Earned</span>
                    </div>
                    <div className="stat-item">
                      <i className="fas fa-calendar stat-icon"></i>
                      <span className="stat-value">{new Date(link.created_at).toLocaleDateString()}</span>
                      <span className="stat-label">Created</span>
                    </div>
                  </div>

                  <div className="link-actions">
                    <button onClick={() => showLink(link.id)} className="action-btn show-btn" title="Show Link">
                      <i className="fas fa-eye"></i>
                      <span>Show Link</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HiddenLinks
