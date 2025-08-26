"use client"
import { useEffect, useState } from "react"
import "./AdminRevenueDashboard.css"

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"

// ✅ Compact StatCard component
const StatCardAdmd = ({ title, value, icon }) => (
  <div className="stat-card-admd">
    <div className="stat-icon-admd">{icon}</div>
    <div className="stat-info-admd">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  </div>
)

const AdminRevenueDashboard = () => {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    todayEarnings: 0,
    userEarnings: 0,
    topLinks: [],
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/admin/revenue`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        })

        const data = await res.json()

        setStats({
          totalEarnings: Number(data.totalEarnings) || 0,
          todayEarnings: Number(data.todayEarnings) || 0,
          userEarnings: Number(data.userEarnings) || 0,
          topLinks: Array.isArray(data.topLinks) ? data.topLinks : [],
        })
      } catch (err) {
        console.error("Failed to fetch revenue stats:", err)
        setStats({
          totalEarnings: 0,
          todayEarnings: 0,
          userEarnings: 0,
          topLinks: [],
        })
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="admin-revenue-admd">
      <div className="header-admd">
        <h1 className="title-admd">Revenue Dashboard</h1>
      </div>

      <div className="stats-grid-admd">
        <StatCardAdmd title="Total Revenue" value={`$${Number(stats.totalEarnings).toFixed(2)}`} icon="💰" />
        <StatCardAdmd title="Today's Revenue" value={`$${Number(stats.todayEarnings).toFixed(2)}`} icon="📈" />
        <StatCardAdmd title="User Payouts" value={`$${Number(stats.userEarnings).toFixed(2)}`} icon="👥" />
      </div>

      <div className="top-links-admd">
        <div className="section-header-admd">
          <h3>Top Earning Links</h3>
        </div>
        
        {stats.topLinks.length > 0 ? (
          <div className="table-container-admd">
            <table className="table-admd">
              <thead>
                <tr>
                  <th>Link</th>
                  <th>Clicks</th>
                  <th>Earnings</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {stats.topLinks.map((link) => (
                  <tr key={link.id}>
                    <td className="link-cell-admd">{link.short_code}</td>
                    <td>{link.clicks}</td>
                    <td className="earnings-cell-admd">${Number(link.earnings || 0).toFixed(2)}</td>
                    <td className="user-cell-admd">{link.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-admd">
            <p>No data available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminRevenueDashboard