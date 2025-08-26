"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import "./AdminDashboard.css"

const AdminDashboard = () => {
  const [stats, setStats] = useState({})
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [activityLoading, setActivityLoading] = useState(true)
  const [activityError, setActivityError] = useState("")
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"

  // --- time helpers ---
  const toMs = (ts) => {
    if (ts === null || ts === undefined) return null
    if (typeof ts === "number") return ts
    const num = Number(ts)
    if (!Number.isNaN(num) && `${ts}`.length >= 13) return num
    const d = new Date(ts)
    return isNaN(d.getTime()) ? null : d.getTime()
  }

  const formatTimeAgo = (ts) => {
    const ms = toMs(ts)
    if (!ms) return "Just now"
    const diffSec = Math.max(0, Math.floor((Date.now() - ms) / 1000))
    if (diffSec < 60) return `${diffSec}s ago`
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
    return `${Math.floor(diffSec / 86400)}d ago`
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/admin/dashboard/overview`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        })
        setStats(res.data)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("adminToken")
          window.location.href = "/adminlogin"
        }
      } finally {
        setLoading(false)
      }
    }

    const fetchRecentActivity = async () => {
      setActivityError("")
      try {
        const res = await axios.get(`${apiUrl}/api/admin/recent-activity`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        })
        const sorted = [...(res.data || [])].sort(
          (a, b) => (toMs(b.timestamp) || 0) - (toMs(a.timestamp) || 0),
        )
        setRecentActivity(sorted)
      } catch (error) {
        console.error("Failed to fetch recent activity:", error)
        if (error.response?.status === 404) {
          setActivityError("Recent Activity API not found on server.")
        } else {
          setActivityError("Could not load recent activity.")
        }
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("adminToken")
          window.location.href = "/adminlogin"
        }
      } finally {
        setActivityLoading(false)
      }
    }

    fetchStats()
    fetchRecentActivity()
  }, [apiUrl])

  const statCards = [
    { title: "Total Users", value: stats.users || 0, icon: "👥", color: "blue" },
    { title: "Total Links", value: stats.links || 0, icon: "🔗", color: "green" },
    { title: "Total Clicks", value: stats.clicks || 0, icon: "📊", color: "purple" },
    { title: "Pending Withdrawals", value: stats.pendingWithdrawals || 0, icon: "💰", color: "orange" },
  ]

  const handleNavigation = (path) => { window.location.href = path }

  const getActivityIcon = (type) => {
    switch (type) {
      case "user_registered": return "👤"
      case "withdrawal_request": return "💰"
      case "link_created": return "🔗"
      case "click": return "📊"
      case "withdrawal_processed": return "✅"
      default: return "📝"
    }
  }

  if (loading) {
    return (
      <div className="admd-container" role="status" aria-live="polite">
        <div className="admd-loading">
          <div className="admd-spinner" aria-hidden="true"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admd-container">
      <div className="admd-header">
        <div>
          <h1 className="admd-title">Dashboard</h1>
          <p className="admd-subtitle">Platform overview</p>
        </div>
        <button className="admd-refresh-btn" onClick={() => window.location.reload()} aria-label="Refresh page">
          Refresh
        </button>
      </div>

      <div className="admd-stats-grid">
        {statCards.map((card, i) => (
          <div key={i} className={`admd-stat-card admd-${card.color}`} role="status">
            <div className="admd-stat-icon" aria-hidden="true">{card.icon}</div>
            <div className="admd-stat-content">
              <h3 className="admd-stat-value">{Number(card.value).toLocaleString()}</h3>
              <p className="admd-stat-title">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admd-grid">
        <div className="admd-card">
          <div className="admd-card-header">
            <h3 className="admd-card-title">Quick Actions</h3>
          </div>
          <div className="admd-card-content">
            <div className="admd-quick-actions">
              <button className="admd-action-btn" onClick={() => handleNavigation("/adminusers")}><span className="admd-action-icon" aria-hidden="true">👥</span> Users</button>
              <button className="admd-action-btn" onClick={() => handleNavigation("/adminwithdrawals")}><span className="admd-action-icon" aria-hidden="true">💰</span> Withdrawals</button>
              <button className="admd-action-btn" onClick={() => handleNavigation("/adminannouncements")}><span className="admd-action-icon" aria-hidden="true">📢</span> Announcements</button>
              <button className="admd-action-btn" onClick={() => handleNavigation("/adminrevenue")}><span className="admd-action-icon" aria-hidden="true">📊</span> Revenue</button>
            </div>
          </div>
        </div>

        <div className="admd-card">
          <div className="admd-card-header">
            <h3 className="admd-card-title">Recent Activity</h3>
            <button
              className="admd-refresh-btn admd-small"
              onClick={async () => {
                setActivityLoading(true)
                setActivityError("")
                try {
                  const res = await axios.get(`${apiUrl}/api/admin/recent-activity?limit=20`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                  })
                  const sorted = [...(res.data || [])].sort(
                    (a, b) => (toMs(b.timestamp) || 0) - (toMs(a.timestamp) || 0),
                  )
                  setRecentActivity(sorted)
                } catch (error) {
                  console.error("Failed to refresh activity:", error)
                  setActivityError("Could not refresh activity.")
                } finally {
                  setActivityLoading(false)
                }
              }}
              aria-busy={activityLoading}
              aria-label="Refresh recent activity"
            >
              {activityLoading ? "↻" : "🔄"}
            </button>
          </div>

          <div className="admd-card-content">
            {activityLoading ? (
              <div className="admd-loading-small">
                <div className="admd-spinner-small" aria-hidden="true"></div>
                <p>Loading activity...</p>
              </div>
            ) : activityError ? (
              <div className="admd-empty-activity"><p>{activityError}</p></div>
            ) : recentActivity.length === 0 ? (
              <div className="admd-empty-activity"><p>No recent activity</p></div>
            ) : (
              <div className="admd-activity-list">
                {recentActivity.map((activity, index) => {
                  const ms = toMs(activity.timestamp)
                  return (
                    <div key={`${activity.type}-${ms || index}`} className="admd-activity-item" title={activity.description}>
                      <div className="admd-activity-icon" aria-hidden="true">{getActivityIcon(activity.type)}</div>
                      <div className="admd-activity-content">
                        <p className="admd-activity-text">{activity.description}</p>
                        <span className="admd-activity-time">{formatTimeAgo(ms)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
