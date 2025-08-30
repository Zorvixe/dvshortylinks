"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "../../assets/Payments.css";

const Payments = () => {
  const { token, API_BASE_URL, user } = useAuth();

  // --- constants / derived ---
  const MIN_WITHDRAWAL = 10; // change to user?.is_premium ? 5 : 10 if you want dynamic min
  const balance = Number.parseFloat(user?.balance || 0);
  const canWithdraw = balance >= MIN_WITHDRAWAL;

  // --- state ---
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawalData, setWithdrawalData] = useState({
    amount: "",
    method: "paypal", // labels show PhonePe/GPay but backend key stays 'paypal'/'crypto'/'bank'
    account: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        // Accept either an array or { withdrawals: [...] }
        const list = Array.isArray(data?.withdrawals) ? data.withdrawals : Array.isArray(data) ? data : [];
        setPayments(list);
      } else {
        showNotification("Failed to fetch payment history", "error");
        setPayments([]);
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      showNotification("Network error while fetching payments", "error");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalChange = (e) => {
    setWithdrawalData({ ...withdrawalData, [e.target.name]: e.target.value });
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();

    const amount = Number.parseFloat(withdrawalData.amount || 0);

    if (!canWithdraw) {
      showNotification(`You need at least $${MIN_WITHDRAWAL} to withdraw.`, "error");
      return;
    }
    if (amount < MIN_WITHDRAWAL) {
      showNotification(`Minimum withdrawal amount is $${MIN_WITHDRAWAL}`, "error");
      return;
    }
    if (amount > balance) {
      showNotification("Insufficient balance for withdrawal", "error");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          method: withdrawalData.method,
          // IMPORTANT: backend expects accountDetails
          accountDetails: withdrawalData.account,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification("Withdrawal request submitted successfully!", "success");
        setWithdrawalData({ amount: "", method: "paypal", account: "" });
        fetchPayments();
      } else {
        showNotification(data.error || "Failed to submit withdrawal request", "error");
      }
    } catch (error) {
      showNotification("Network error. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "pending";
    switch (status.toLowerCase()) {
      case "completed":
        return "completed";
      case "pending":
        return "pending";
      case "cancelled":
      case "rejected":
        return "rejected";
      default:
        return "pending";
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return "fa-clock";
    switch (status.toLowerCase()) {
      case "completed":
        return "fa-check-circle";
      case "pending":
        return "fa-clock";
      case "cancelled":
      case "rejected":
        return "fa-times-circle";
      default:
        return "fa-clock";
    }
  };

  if (loading) {
    return (
      <div className="payments-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading payment information...</p>
        </div>
      </div>
    );
  }

  // totals
  const totalEarnings = Array.isArray(payments)
    ? payments
        .filter((p) => p?.status?.toLowerCase() === "completed")
        .reduce((sum, p) => sum + Number.parseFloat(p?.amount || 0), 0)
    : 0;

  const pendingAmount = Array.isArray(payments)
    ? payments
        .filter((p) => p?.status?.toLowerCase() === "pending")
        .reduce((sum, p) => sum + Number.parseFloat(p?.amount || 0), 0)
    : 0;

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
            <p className="balance-value">${balance.toFixed(2)}</p>
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
            <p className="card-description">Minimum withdrawal amount is ${MIN_WITHDRAWAL.toFixed(2)}</p>
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
                min={MIN_WITHDRAWAL}
                {...(canWithdraw ? { max: balance } : {})} // only set max when valid
                value={withdrawalData.amount}
                onChange={handleWithdrawalChange}
                placeholder={MIN_WITHDRAWAL.toFixed(2)}
                className="form-input"
                required
                disabled={!canWithdraw}
              />
              <p className="form-hint">
                Available: ${balance.toFixed(2)}
                {!canWithdraw && (
                  <span className="ml-2 text-red-600">You need at least ${MIN_WITHDRAWAL} to withdraw.</span>
                )}
              </p>
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
                {/* Keep keys as your backend expects, labels localized */}
                <option value="paypal">PhonePe</option>
                <option value="bank">Bank Transfer</option>
                <option value="crypto">GPay</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="account" className="form-label">
              <i className="fas fa-user"></i>
              {withdrawalData.method === "bank" ? "Bank Account Details" : "UPI / Wallet"}
            </label>
            <input
              id="account"
              name="account"
              type="text"
              value={withdrawalData.account}
              onChange={handleWithdrawalChange}
              placeholder={
                withdrawalData.method === "bank"
                  ? "Account Number, IFSC / Routing, Bank Name"
                  : "UPI ID (e.g., name@bank) or Wallet"
              }
              className="form-input"
              required
              disabled={!canWithdraw}
            />
          </div>

          <button type="submit" disabled={submitting || !canWithdraw} className="submit-btn">
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
                payments.map((payment, index) => {
                  const created =
                    payment?.created_at || payment?.createdAt || payment?.createdOn || payment?.created || null;
                  const account = payment?.account ?? payment?.account_details ?? "Unknown account";
                  return (
                    <div key={index} className="payment-item">
                      <div className="payment-info">
                        <div className="payment-details">
                          <div className="payment-amount">
                            <span className="amount">
                              ${Number.parseFloat(payment?.amount || 0).toFixed(2)}
                            </span>
                            <span className="method">{payment?.method || "Unknown"}</span>
                          </div>
                          <div className="payment-date">
                            <i className="fas fa-calendar"></i>
                            <span>{created ? new Date(created).toLocaleDateString() : "Unknown date"}</span>
                          </div>
                          <div className="payment-account">
                            <i className="fas fa-user"></i>
                            <span>{account}</span>
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
                  );
                })}
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
        </div>
        <div className="info-content">
          <div className="info-item">
            <i className="fas fa-clock"></i>
            <p>Withdrawal requests are processed within 24–48 hours.</p>
          </div>
          <div className="info-item">
            <i className="fas fa-dollar-sign"></i>
            <p>Minimum withdrawal amount is ${MIN_WITHDRAWAL.toFixed(2)}.</p>
          </div>
          <div className="info-item">
            <i className="fas fa-shield-alt"></i>
            <p>All transactions are secure and encrypted.</p>
          </div>
          <div className="info-item">
            <i className="fas fa-percentage"></i>
            <p>No fees for UPI; bank transfers may incur small fees.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
