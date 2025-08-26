"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import "./AdminWithdrawals.css"

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"

  const fetchWithdrawals = async () => {
    try {
      // Use Axios params object instead of URLSearchParams
      const params = {
        status: filterStatus !== "all" ? filterStatus : undefined,
      }

      const res = await axios.get(`${apiUrl}/api/admin/withdrawals`, {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      })
      setWithdrawals(res.data.withdrawals)
    } catch (error) {
      console.error("Failed to fetch withdrawals:", error)
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("adminToken")
        window.location.href = "/adminlogin"
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWithdrawals()
  }, [filterStatus]) // Refetch when filter changes

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${apiUrl}/api/admin/withdrawals/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        },
      )
      fetchWithdrawals()
      alert(`Withdrawal ${status} successfully!`)
    } catch (error) {
      console.error("Failed to update withdrawal status:", error)
      alert("Failed to update withdrawal status. Please try again.")
    }
  }

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    return filterStatus === "all" || withdrawal.status === filterStatus
  })

  const totalAmount = filteredWithdrawals.reduce((sum, w) => sum + Number.parseFloat(w.amount), 0)
  const pendingCount = withdrawals.filter((w) => w.status === "pending").length
  const completedCount = withdrawals.filter((w) => w.status === "completed").length

  if (loading) {
    return (
      <div className="admin-withdrawals">
        <div className="withdrawals-loading">
          <div className="loading-spinner"></div>
          <p>Loading withdrawals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-withdrawals">
      <div className="withdrawals-header">
        <div className="header-content">
          <h1 className="withdrawals-title">Withdrawal Management</h1>
          <p className="withdrawals-subtitle">Process and monitor withdrawal requests</p>
        </div>
        <div className="withdrawals-stats">
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">{pendingCount}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card completed">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{completedCount}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          <div className="stat-card total">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">${totalAmount.toFixed(2)}</div>
              <div className="stat-label">Total Amount</div>
            </div>
          </div>
        </div>
      </div>

      <div className="withdrawals-controls">
        <div className="filter-container">
          <label htmlFor="status-filter" className="filter-label">
            Filter by Status:
          </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Withdrawals</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button onClick={fetchWithdrawals} className="refresh-btn">
          <span className="refresh-icon">🔄</span>
          Refresh
        </button>
      </div>

      <div className="withdrawals-table-container">
        <div className="table-wrapper">
          <table className="withdrawals-table">
            <thead>
              <tr>
                <th>Request Details</th>
                <th>User Info</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="withdrawal-row">
                  <td className="request-details">
                    <div className="request-id">#{withdrawal.id}</div>
                    <div className="request-type">Withdrawal Request</div>
                  </td>
                  <td className="user-info">
                    <div className="user-avatar">U{withdrawal.user_id}</div>
                    <div className="user-details">
                      <div className="user-id">User ID: {withdrawal.user_id}</div>
                    </div>
                  </td>
                  <td className="amount-info">
                    <div className="amount-main">${Number.parseFloat(withdrawal.amount).toFixed(2)}</div>
                    <div className="amount-breakdown">
                      <div className="amount-detail">
                        Publisher: ${Number.parseFloat(withdrawal.publisher_earnings).toFixed(2)}
                      </div>
                      {withdrawal.referral_earnings > 0 && (
                        <div className="amount-detail">
                          Referral: ${Number.parseFloat(withdrawal.referral_earnings).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="method-info">
                    <div className="method-name">{withdrawal.method}</div>
                    <div className="method-details">{withdrawal.account_details}</div>
                  </td>
                  <td className="status-info">
                    <span className={`status-badge ${withdrawal.status}`}>
                      <span className="status-dot"></span>
                      {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                    </span>
                  </td>
                  <td className="date-info">
                    <div className="date-created">
                      {new Date(withdrawal.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="time-created">
                      {new Date(withdrawal.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="actions-info">
                    {withdrawal.status === "pending" && (
                      <div className="action-buttons">
                        <button onClick={() => updateStatus(withdrawal.id, "completed")} className="action-btn approve">
                          ✓ Approve
                        </button>
                        <button onClick={() => updateStatus(withdrawal.id, "rejected")} className="action-btn reject">
                          ✗ Reject
                        </button>
                      </div>
                    )}
                    {withdrawal.status !== "pending" && (
                      <div className="status-final">
                        {withdrawal.status === "completed" ? "✓ Processed" : "✗ Rejected"}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredWithdrawals.length === 0 && (
        <div className="no-withdrawals">
          <div className="no-withdrawals-icon">💰</div>
          <h3>No withdrawal requests found</h3>
          <p>There are no withdrawal requests matching your current filter</p>
        </div>
      )}
    </div>
  )
}

export default AdminWithdrawals
