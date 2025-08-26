"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import "./AdminAnnouncements.css"

const AdminAnnouncements = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("view")
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/announcements`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      })
      setAnnouncements(res.data)
    } catch (error) {
      console.error("Failed to fetch announcements:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setSubmitting(true)
    try {
      await axios.post(
        `${apiUrl}/api/admin/announcements`,
        { title, content },
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } },
      )
      setTitle("")
      setContent("")
      await fetchAnnouncements()
      setActiveTab("view")
      // Scroll to top of list after publish on mobile
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("Failed to post announcement:", error)
      alert("Failed to post announcement. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return
    try {
      await axios.delete(`${apiUrl}/api/admin/announcements/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      })
      await fetchAnnouncements()
    } catch (error) {
      console.error("Failed to delete announcement:", error)
      alert("Failed to delete announcement. Please try again.")
    }
  }

  useEffect(() => {
    fetchAnnouncements()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="admd-container" role="status" aria-live="polite">
        <div className="admd-loading">
          <div className="admd-spinner" aria-hidden="true"></div>
          <p>Loading announcements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admd-container">
      <div className="admd-header">
        <h1 className="admd-title">Announcements</h1>
        <div className="admd-stats">
          <span className="admd-stat">{announcements.length} total</span>
          <button onClick={fetchAnnouncements} className="admd-refresh" aria-label="Refresh announcements">Refresh</button>
        </div>
      </div>

      <div className="admd-tabs" role="tablist" aria-label="Announcement tabs">
        <button
          role="tab"
          aria-selected={activeTab === "create"}
          className={`admd-tab ${activeTab === "create" ? "admd-active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          Create New
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "view"}
          className={`admd-tab ${activeTab === "view" ? "admd-active" : ""}`}
          onClick={() => setActiveTab("view")}
        >
          View All
        </button>
      </div>

      {activeTab === "create" && (
        <div className="admd-form-container">
          <form onSubmit={handleSubmit} className="admd-form">
            <div className="admd-form-group">
              <label htmlFor="title" className="admd-label">
                Title <span className="admd-required">*</span>
              </label>
              <input
                type="text"
                id="title"
                className="admd-input"
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
              />
              <div className="admd-char-count">{title.length}/100</div>
            </div>

            <div className="admd-form-group">
              <label htmlFor="content" className="admd-label">
                Content <span className="admd-required">*</span>
              </label>
              <textarea
                id="content"
                className="admd-textarea"
                placeholder="Write content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
              />
              <div className="admd-char-count">{content.length} characters</div>
            </div>

            <div className="admd-form-actions">
              <button
                type="button"
                className="admd-btn admd-btn-secondary"
                onClick={() => { setTitle(""); setContent(""); }}
                disabled={submitting}
              >
                Clear
              </button>
              <button
                type="submit"
                className="admd-btn admd-btn-primary"
                disabled={submitting || !title.trim() || !content.trim()}
              >
                {submitting ? "Publishing..." : "Publish"}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "view" && (
        <div className="admd-list-container">
          {announcements.length === 0 ? (
            <div className="admd-empty">
              <p>No announcements yet. Create your first one!</p>
              <button className="admd-btn admd-btn-primary" onClick={() => setActiveTab("create")}>
                Create Announcement
              </button>
            </div>
          ) : (
            <div className="admd-list">
              {announcements.map((a) => (
                <div key={a.id} className="admd-card">
                  <div className="admd-card-header">
                    <span className="admd-card-title">{a.title}</span>
                    <span className="admd-date">
                      {a.created_at
                        ? new Date(a.created_at).toLocaleDateString(undefined, {
                            month: "short", day: "numeric", year: "numeric"
                          })
                        : ""}
                    </span>
                  </div>
                  <div className="admd-card-content">
                    <p>{a.content}</p>
                  </div>
                  <div className="admd-card-actions">
                    <button className="admd-btn admd-btn-danger" onClick={() => handleDelete(a.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminAnnouncements
