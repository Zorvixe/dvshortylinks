"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import "../../assets/Payments.css"

const Payments = () => {
  const { token, API_BASE_URL, user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [withdrawalData, setWithdrawalData] = useState({
    amount: "",
    method: "paypal",
    account: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Ensure payments is always an array
        setPayments(Array.isArray(data) ? data : [])
      } else {
        showNotification("Failed to fetch payment history", "error")
        setPayments([]) // Set to empty array on error
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error)
      showNotification("Network error while fetching payments", "error")
      setPayments([]) // Set to empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleWithdrawalChange = (e) => {
    setWithdrawalData({
      ...withdrawalData,
      [e.target.name]: e.target.value,
    })
  }

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault()

    const amount = Number.parseFloat(withdrawalData.amount)
    const minWithdrawal = 10
    const userBalance = Number.parseFloat(user?.balance || 0)

    if (amount < minWithdrawal) {
      showNotification(`Minimum withdrawal amount is $${minWithdrawal}`, "error")
      return
    }

    if (amount > userBalance) {
      showNotification("Insufficient balance for withdrawal", "error")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(withdrawalData),
      })

      const data = await response.json()

      if (response.ok) {
        showNotification("Withdrawal request submitted successfully!", "success")
        setWithdrawalData({ amount: "", method: "paypal", account: "" })
        fetchPayments()
      } else {
        showNotification(data.error || "Failed to submit withdrawal request", "error")
      }
    } catch (error) {
      showNotification("Network error. Please try again.", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    if (!status) return "pending"
    switch (status.toLowerCase()) {
      case "completed":
        return "completed"
      case "pending":
        return "pending"
      case "cancelled":
      case "rejected":
        return "rejected"
      default:
        return "pending"
    }
  }

  const getStatusIcon = (status) => {
    if (!status) return "fa-clock"
    switch (status.toLowerCase()) {
      case "completed":
        return "fa-check-circle"
      case "pending":
        return "fa-clock"
      case "cancelled":
      case "rejected":
        return "fa-times-circle"
      default:
        return "fa-clock"
    }
  }

  if (loading) {
    return (
      <div className="payments-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading payment information...</p>
        </div>
      </div>
    )
  }

  // Calculate totals with proper null checks
  const totalEarnings = Array.isArray(payments)
    ? payments
        .filter((payment) => payment?.status?.toLowerCase() === "completed")
        .reduce((sum, payment) => sum + Number.parseFloat(payment?.amount || 0), 0)
    : 0

  const pendingAmount = Array.isArray(payments)
    ? payments
        .filter((payment) => payment?.status?.toLowerCase() === "pending")
        .reduce((sum, payment) => sum + Number.parseFloat(payment?.amount || 0), 0)
    : 0

  return (
    <div className="payments-container">
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
          <i className="fas fa-credit-card"></i>
          Payments
        </h1>
        <p className="page-subtitle">Manage your earnings and withdrawal requests</p>
      </div>

      {/* Balance Overview */}
      <div className="balance-overview">
        <div className="balance-card main-balance">
          <div className="balance-icon">
            <i className="fas fa-wallet"></i>
          </div>
          <div className="balance-content">
            <p className="balance-label">Available Balance</p>
            <p className="balance-value">${Number.parseFloat(user?.balance || 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="balance-card">
          <div className="balance-icon earnings">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="balance-content">
            <p className="balance-label">Total Withdrawn</p>
            <p className="balance-value">${totalEarnings.toFixed(2)}</p>
          </div>
        </div>

        <div className="balance-card">
          <div className="balance-icon pending">
            <i className="fas fa-clock"></i>
          </div>
          <div className="balance-content">
            <p className="balance-label">Pending Withdrawals</p>
            <p className="balance-value">${pendingAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="withdrawal-card">
        <div className="card-header">
          <div className="header-icon">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="header-text">
            <h2 className="card-title">Request Withdrawal</h2>
            <p className="card-description">Minimum withdrawal amount is $10.00</p>
          </div>
        </div>

        <form onSubmit={handleWithdrawalSubmit} className="withdrawal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                <i className="fas fa-dollar-sign"></i>
                Amount (USD)
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="10"
                max={user?.balance || 0}
                value={withdrawalData.amount}
                onChange={handleWithdrawalChange}
                placeholder="10.00"
                className="form-input"
                required
              />
              <p className="form-hint">Available: ${Number.parseFloat(user?.balance || 0).toFixed(2)}</p>
            </div>

            <div className="form-group">
              <label htmlFor="method" className="form-label">
                <i className="fas fa-credit-card"></i>
                Payment Method
              </label>
              <select
                id="method"
                name="method"
                value={withdrawalData.method}
                onChange={handleWithdrawalChange}
                className="form-select"
                required
              >
                <option value="paypal">PhonePe</option>
                <option value="bank">Bank Transfer</option>
                <option value="crypto">GPay</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="account" className="form-label">
              <i className="fas fa-user"></i>
              {withdrawalData.method === "paypal" && "PayPal Email"}
              {withdrawalData.method === "bank" && "Bank Account Details"}
              {withdrawalData.method === "crypto" && "Wallet Address"}
            </label>
            <input
              id="account"
              name="account"
              type="text"
              value={withdrawalData.account}
              onChange={handleWithdrawalChange}
              placeholder={
                withdrawalData.method === "paypal"
                  ? "Upi Id"
                  : withdrawalData.method === "bank"
                    ? "Account Number, Routing Number, Bank Name"
                    : "Upi Id"
              }
              className="form-input"
              required
            />
          </div>

          <button type="submit" disabled={submitting} className="submit-btn">
            {submitting ? (
              <>
                <div className="loading-spinner"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                <span>Request Withdrawal</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Payment History */}
      <div className="payment-history-card">
        <div className="card-header">
          <div className="header-icon">
            <i className="fas fa-history"></i>
          </div>
          <div className="header-text">
            <h2 className="card-title">Payment History</h2>
            <p className="card-description">Your withdrawal requests and completed payments</p>
          </div>
        </div>

        <div className="card-content">
          {Array.isArray(payments) && payments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-receipt"></i>
              </div>
              <h3 className="empty-title">No payment history</h3>
              <p className="empty-description">Your withdrawal requests and completed payments will appear here.</p>
            </div>
          ) : (
            <div className="payments-list">
              {Array.isArray(payments) &&
                payments.map((payment, index) => (
                  <div key={index} className="payment-item">
                    <div className="payment-info">
                      <div className="payment-details">
                        <div className="payment-amount">
                          <span className="amount">${Number.parseFloat(payment?.amount || 0).toFixed(2)}</span>
                          <span className="method">{payment?.method || "Unknown"}</span>
                        </div>
                        <div className="payment-date">
                          <i className="fas fa-calendar"></i>
                          <span>
                            {payment?.created_at ? new Date(payment.created_at).toLocaleDateString() : "Unknown date"}
                          </span>
                        </div>
                        <div className="payment-account">
                          <i className="fas fa-user"></i>
                          <span>{payment?.account || "Unknown account"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="payment-status">
                      <div className={`status-badge ${getStatusColor(payment?.status)}`}>
                        <i className={`fas ${getStatusIcon(payment?.status)}`}></i>
                        <span>{payment?.status || "Pending"}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Info */}
      <div className="payment-info-card">
        <div className="info-header">
          <div className="info-icon">
            <i className="fas fa-info-circle"></i>
          </div>
          <h3 className="info-title">Payment Information</h3>
        </div>
        <div className="info-content">
          <div className="info-item">
            <i className="fas fa-clock"></i>
            <p>Withdrawal requests are processed within 24-48 hours</p>
          </div>
          <div className="info-item">
            <i className="fas fa-dollar-sign"></i>
            <p>Minimum withdrawal amount is $10.00</p>
          </div>
          <div className="info-item">
            <i className="fas fa-shield-alt"></i>
            <p>All transactions are secure and encrypted</p>
          </div>
          <div className="info-item">
            <i className="fas fa-percentage"></i>
            <p>No fees for PayPal withdrawals, small fees may apply for other methods</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payments
