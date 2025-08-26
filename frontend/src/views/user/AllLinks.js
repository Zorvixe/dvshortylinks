"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link } from "react-router-dom"
import "../../assets/AllLinks.css"

const AllLinks = () => {
  const { token, API_BASE_URL } = useAuth()
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/links`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      showNotification("Failed to fetch links. Please try again later.", "error");
      return;
    }

    const data = await response.json().catch(() => null);
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.links)
        ? data.links
        : [];

    setLinks(list);
  } catch (error) {
    console.error("Error fetching links:", error);
    showNotification("Failed to fetch links. Please try again later.", "error");
  } finally {
    setLoading(false);
  }
};


  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    showNotification("Short link copied to clipboard!", "success")
  }

  const toggleHidden = async (linkId, isCurrentlyHidden) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/links/${linkId}/toggle-hidden`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        fetchLinks()
        showNotification(`Link is now ${isCurrentlyHidden ? "visible" : "hidden"}.`, "success")
      }
    } catch (error) {
      showNotification("Failed to update link visibility. Please try again.", "error")
    }
  }

  const filteredLinks = links.filter(
    (link) =>
      link.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (link.title && link.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      link.short_code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0)
  const totalEarnings = links.reduce((sum, link) => sum + Number.parseFloat(link.earnings || 0), 0)

  if (loading) {
    return (
      <div className="all-links-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your links...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="all-links-container">
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
          All Links
        </h1>
        <p className="page-subtitle">Manage and track all your shortened links in one place</p>
      </div>

      {/* Search and Stats */}
      <div className="search-stats-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search by URL, title, or short code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-label">Total Links:</span>
            <span className="stat-value">{links.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Clicks:</span>
            <span className="stat-value">{totalClicks.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Earnings:</span>
            <span className="stat-value earnings">${totalEarnings.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Links Grid */}
      {filteredLinks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-external-link-alt"></i>
          </div>
          <h3 className="empty-title">No links found</h3>
          <p className="empty-description">
            {searchTerm
              ? "No links match your search criteria. Try a different keyword or clear your search."
              : "You haven't created any links yet. Start by shortening your first URL!"}
          </p>
          <Link to="/admin/manage-links" className="create-link-btn">
            <i className="fas fa-plus-circle"></i>
            Create Your First Link
          </Link>
        </div>
      ) : (
        <div className="links-grid">
          {filteredLinks.map((link) => (
            <div key={link.id} className="link-card">
              <div className="link-header">
                <div className="link-title-section">
                  <h3 className="link-title">{link.title || "Untitled Link"}</h3>
                  {link.is_hidden && (
                    <div className="hidden-badge">
                      <i className="fas fa-eye-slash"></i>
                      <span>Hidden</span>
                    </div>
                  )}
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
                    <button
                      onClick={() => toggleHidden(link.id, link.is_hidden)}
                      className={`action-btn ${link.is_hidden ? "show-btn" : "hide-btn"}`}
                      title={link.is_hidden ? "Show" : "Hide"}
                    >
                      <i className={`fas ${link.is_hidden ? "fa-eye" : "fa-eye-slash"}`}></i>
                      <span>{link.is_hidden ? "Show" : "Hide"}</span>
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

export default AllLinks
