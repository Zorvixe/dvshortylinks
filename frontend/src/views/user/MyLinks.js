"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import "../../assets/MyLinks.css"

const MyLinks = () => {
  const { token, API_BASE_URL } = useAuth()
  const [links, setLinks] = useState([])
  const [hiddenLinks, setHiddenLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)
  const [activeTab, setActiveTab] = useState("active")
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  useEffect(() => {
    fetchLinks()
    fetchHiddenLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/links?hidden=false`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setLinks(data)
      }
    } catch (error) {
      console.error("Failed to fetch links:", error)
    }
  }

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
      console.error("Failed to fetch hidden links:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleHidden = async (linkId, isCurrentlyHidden = false) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/links/${linkId}/toggle-hidden`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        fetchLinks()
        fetchHiddenLinks()
        showNotification(`Link ${isCurrentlyHidden ? "shown" : "hidden"} successfully!`, "success")
      }
    } catch (error) {
      showNotification("Failed to update link visibility", "error")
    }
  }

  const copyToClipboard = async (url, linkId) => {
    try {
      await navigator.clipboard.writeText(`https://dvshortylinks.com/${url}`)
      setCopiedId(linkId)
      showNotification("URL copied to clipboard!", "success")
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      showNotification("Failed to copy URL", "error")
    }
  }

  const LinkCard = ({ link, isHidden = false }) => (
    <div className="link-card">
      <div className="link-header">
        <div className="link-info">
          <div className="link-title">
            <i className="fas fa-link"></i>
            <span>{link.title || "Untitled Link"}</span>
          </div>
          <div className="link-date">
            <i className="fas fa-calendar"></i>
            <span>{new Date(link.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="link-actions">
          <button
            onClick={() => toggleHidden(link.id, isHidden)}
            className="action-btn"
            title={isHidden ? "Show" : "Hide"}
          >
            <i className={`fas ${isHidden ? "fa-eye" : "fa-eye-slash"}`}></i>
          </button>
        </div>
      </div>

      <div className="link-content">
        <div className="url-section">
          <div className="short-url">
            <span className="url-text">dvshortylinks.com/{link.short_code}</span>
            <button onClick={() => copyToClipboard(link.short_code, link.id)} className="copy-btn" title="Copy">
              {copiedId === link.id ? <i className="fas fa-check"></i> : <i className="fas fa-copy"></i>}
            </button>
          </div>
          <div className="original-url">
            <i className="fas fa-external-link-alt"></i>
            <span>{link.original_url}</span>
          </div>
        </div>

        {link.description && <p className="link-description">{link.description}</p>}

        <div className="link-stats">
          <div className="stat-item">
            <i className="fas fa-eye"></i>
            <span className="stat-value">{link.clicks || 0}</span>
            <span className="stat-label">views</span>
          </div>
          <div className="stat-item">
            <i className="fas fa-dollar-sign"></i>
            <span className="stat-value">${link.earnings || "0.00"}</span>
            <span className="stat-label">earned</span>
          </div>
          {link.alias && (
            <div className="custom-badge">
              <span>Custom: {link.alias}</span>
            </div>
          )}
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min(((link.clicks || 0) / 100) * 100, 100)}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="my-links-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your links...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="my-links-container">
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
          My Links
        </h1>
        <p className="page-subtitle">Manage and track your shortened URLs</p>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active Links ({links.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "hidden" ? "active" : ""}`}
            onClick={() => setActiveTab("hidden")}
          >
            Hidden Links ({hiddenLinks.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "active" && (
            <div className="links-grid">
              {links.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <i className="fas fa-link"></i>
                  </div>
                  <h3 className="empty-title">No active links</h3>
                  <p className="empty-description">Create your first shortened URL to get started.</p>
                  <a href="/admin/shorten" className="create-link-btn">
                    <i className="fas fa-plus"></i>
                    Create Short URL
                  </a>
                </div>
              ) : (
                links.map((link) => <LinkCard key={link.id} link={link} />)
              )}
            </div>
          )}

          {activeTab === "hidden" && (
            <div className="links-grid">
              {hiddenLinks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <i className="fas fa-eye-slash"></i>
                  </div>
                  <h3 className="empty-title">No hidden links</h3>
                  <p className="empty-description">Links you hide will appear here.</p>
                </div>
              ) : (
                hiddenLinks.map((link) => <LinkCard key={link.id} link={link} isHidden={true} />)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyLinks
