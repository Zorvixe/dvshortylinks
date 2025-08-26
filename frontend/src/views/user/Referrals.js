"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import "../../assets/Referrals.css"

const Referrals = () => {
  const { token, API_BASE_URL, user } = useAuth()
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(null)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  const referralUrl = `${window.location.origin}/auth?ref=${user?.referral_code}`

  useEffect(() => {
    fetchReferrals()
  }, [])

  const fetchReferrals = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/referrals`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      showNotification("Failed to fetch referrals", "error");
      return;
    }

    // Be defensive about response shape
    const data = await response.json().catch(() => null);
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.referrals)
        ? data.referrals
        : [];

    setReferrals(list);
  } catch (error) {
    console.error("Failed to fetch referrals:", error);
    showNotification("Network error while fetching referrals", "error");
  } finally {
    setLoading(false);
  }
};


  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      showNotification(`${type} copied to clipboard!`, "success")
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      showNotification(`Failed to copy ${type.toLowerCase()}`, "error")
    }
  }

  const shareReferral = async (platform) => {
    const text = "Join dvshortylinks and start earning money by shortening URLs!"
    const encodedText = encodeURIComponent(text)
    const encodedUrl = encodeURIComponent(referralUrl)

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${referralUrl}`)}`,
    }

    if (urls[platform]) {
      window.open(urls[platform], "_blank")
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: "Join dvshortylinks",
          text: text,
          url: referralUrl,
        })
      } catch (error) {
        copyToClipboard(referralUrl, "Referral URL")
      }
    } else {
      copyToClipboard(referralUrl, "Referral URL")
    }
  }

  if (loading) {
    return (
      <div className="referrals-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading referrals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="referrals-container">
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
          <i className="fas fa-users"></i>
          Referrals
        </h1>
        <p className="page-subtitle">Invite friends and earn 10% lifetime commission on their earnings</p>
      </div>

      {/* Referral Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Referrals</p>
            <p className="stat-value">{referrals.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon earnings">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">Referral Earnings</p>
            <p className="stat-value">${user?.referral_earnings || "0.00"}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon commission">
            <i className="fas fa-percentage"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">Commission Rate</p>
            <p className="stat-value">10%</p>
          </div>
        </div>
      </div>

      {/* Referral Tools */}
      <div className="referral-tools-card">
        <div className="card-header">
          <div className="header-icon">
            <i className="fas fa-share-alt"></i>
          </div>
          <div className="header-text">
            <h2 className="card-title">Share Your Referral Link</h2>
            <p className="card-description">Get 10% commission for every dollar your referrals earn - for lifetime!</p>
          </div>
        </div>

        <div className="card-content">
          {/* Referral Code */}
          <div className="form-group">
            <label className="form-label">Your Referral Code</label>
            <div className="input-group">
              <input value={user?.referral_code || ""} readOnly className="form-input readonly" />
              <button
                onClick={() => copyToClipboard(user?.referral_code, "Referral Code")}
                className="copy-btn"
                title="Copy referral code"
              >
                {copied === "Referral Code" ? <i className="fas fa-check"></i> : <i className="fas fa-copy"></i>}
              </button>
            </div>
          </div>

          {/* Referral URL */}
          <div className="form-group">
            <label className="form-label">Your Referral Link</label>
            <div className="input-group">
              <input value={referralUrl} readOnly className="form-input readonly" />
              <button
                onClick={() => copyToClipboard(referralUrl, "Referral URL")}
                className="copy-btn"
                title="Copy referral URL"
              >
                {copied === "Referral URL" ? <i className="fas fa-check"></i> : <i className="fas fa-copy"></i>}
              </button>
              <button onClick={() => shareReferral("native")} className="share-btn" title="Share">
                <i className="fas fa-share-alt"></i>
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="form-group">
            <label className="form-label">Share on Social Media</label>
            <div className="social-buttons">
              <button onClick={() => shareReferral("twitter")} className="social-btn twitter">
                <i className="fab fa-twitter"></i>
                <span>Twitter</span>
              </button>
              <button onClick={() => shareReferral("facebook")} className="social-btn facebook">
                <i className="fab fa-facebook-f"></i>
                <span>Facebook</span>
              </button>
              <button onClick={() => shareReferral("whatsapp")} className="social-btn whatsapp">
                <i className="fab fa-whatsapp"></i>
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Referral List */}
      <div className="referrals-list-card">
        <div className="card-header">
          <div className="header-icon">
            <i className="fas fa-list"></i>
          </div>
          <div className="header-text">
            <h2 className="card-title">Your Referrals</h2>
            <p className="card-description">People who joined using your referral code</p>
          </div>
        </div>

        <div className="card-content">
          {referrals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="empty-title">No referrals yet</h3>
              <p className="empty-description">Share your referral link to start earning commissions!</p>
            </div>
          ) : (
            <div className="referrals-list">
              {referrals.map((referral, index) => (
                <div key={index} className="referral-item">
                  <div className="referral-info">
                    <div className="referral-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="referral-details">
                      <p className="referral-name">{referral.username}</p>
                      <div className="referral-date">
                        <i className="fas fa-calendar"></i>
                        <span>Joined {new Date(referral.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="referral-status">
                    <span className="status-badge active">Active</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works-card">
        <div className="how-it-works-header">
          <div className="how-it-works-icon">
            <i className="fas fa-question-circle"></i>
          </div>
          <h3 className="how-it-works-title">How Referrals Work</h3>
        </div>
        <div className="how-it-works-content">
          <div className="step-item">
            <div className="step-number">1</div>
            <p>Share your referral code or link with friends</p>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <p>When someone signs up using your code, they become your referral</p>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <p>You earn 10% of everything they earn - for their entire lifetime!</p>
          </div>
          <div className="step-item">
            <div className="step-number">4</div>
            <p>Commission is automatically added to your balance</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Referrals
