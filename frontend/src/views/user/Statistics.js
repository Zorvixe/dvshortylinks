"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "../../assets/Statistics.css";

const n = (v) => {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
};
const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

const Statistics = () => {
  const { token, API_BASE_URL } = useAuth();
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  useEffect(() => {
    fetchStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/statistics`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        showNotification("Failed to fetch statistics", "error");
        return;
      }

      const data = await response.json().catch(() => null);

      // Normalize various possible API shapes into a plain array
      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data?.statistics)) {
        list = data.statistics;
      } else if (Array.isArray(data?.days)) {
        list = data.days;
      } else if (data && typeof data === "object") {
        const values = Object.values(data);
        if (Array.isArray(values)) list = values;
      }

      setStatistics(list);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
      showNotification("Network error while fetching statistics", "error");
    } finally {
      setLoading(false);
    }
  };

  const getTotalStats = () => {
    const arr = safeArray(statistics);
    return arr.reduce(
      (totals, day) => ({
        views: totals.views + n(day.views),
        earnings: totals.earnings + n(day.link_earnings),
        referralEarnings: totals.referralEarnings + n(day.referral_earnings),
      }),
      { views: 0, earnings: 0, referralEarnings: 0 }
    );
  };

  const getAverageStats = () => {
    const arr = safeArray(statistics);
    if (arr.length === 0) return { views: 0, earnings: "0.00", cpm: "0.00" };
    const totals = getTotalStats();
    const viewsAvg = Math.round(totals.views / arr.length);
    const earnAvg = (totals.earnings / arr.length).toFixed(2);
    const cpm = totals.views > 0 ? (totals.earnings / (totals.views / 1000)).toFixed(2) : "0.00";
    return { views: viewsAvg, earnings: earnAvg, cpm };
  };

  const getBestPerformingDay = () => {
    const arr = safeArray(statistics);
    if (arr.length === 0) return null;
    return arr.reduce((best, current) => (n(current.views) > n(best.views) ? current : best));
  };

  const getHighestEarningDay = () => {
    const arr = safeArray(statistics);
    if (arr.length === 0) return null;
    return arr.reduce((best, current) =>
      n(current.link_earnings) > n(best.link_earnings) ? current : best
    );
  };

  if (loading) {
    return (
      <div className="statistics-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  const totals = getTotalStats();
  const averages = getAverageStats();
  const bestDay = getBestPerformingDay();
  const highestEarningDay = getHighestEarningDay();
  const statsArr = safeArray(statistics);
  const maxViews = Math.max(1, ...statsArr.map((s) => n(s.views)));

  return (
    <div className="statistics-container">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <i className={`fas ${notification.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`} />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">
          <i className="fas fa-chart-bar"></i>
          Statistics
        </h1>
        <p className="page-subtitle">Detailed analytics of your performance this month</p>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-eye"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Views</p>
            <p className="stat-value">{totals.views.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon earnings">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Earnings</p>
            <p className="stat-value">${totals.earnings.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon trending">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">Average Daily Views</p>
            <p className="stat-value">{averages.views}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon cpm">
            <i className="fas fa-chart-bar"></i>
          </div>
          <div className="stat-content">
            <p className="stat-label">Effective CPM</p>
            <p className="stat-value">${averages.cpm}</p>
          </div>
        </div>
      </div>

      {/* Daily Statistics */}
      <div className="daily-stats-card">
        <div className="card-header">
          <div className="header-icon">
            <i className="fas fa-calendar"></i>
          </div>
          <div className="header-text">
            <h2 className="card-title">Daily Statistics (Current Month)</h2>
            <p className="card-description">Detailed breakdown of your daily performance</p>
          </div>
        </div>

        <div className="card-content">
          {statsArr.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <h3 className="empty-title">No data available</h3>
              <p className="empty-description">Start creating and sharing links to see your statistics here.</p>
            </div>
          ) : (
            <div className="daily-stats-list">
              {statsArr.map((stat, index) => {
                const dateLabel = stat?.date
                  ? new Date(stat.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })
                  : "—";
                const views = n(stat.views);
                const linkEarn = n(stat.link_earnings);
                const refEarn = n(stat.referral_earnings);
                const dailyCpm = n(stat.daily_cpm);

                return (
                  <div key={index} className="daily-stat-item">
                    <div className="stat-header">
                      <div className="stat-date">
                        <i className="fas fa-calendar-day"></i>
                        <span>{dateLabel}</span>
                      </div>
                      <div className={`activity-badge ${views > 0 ? "active" : "inactive"}`}>
                        {views > 0 ? "Active" : "No Activity"}
                      </div>
                    </div>

                    <div className="stat-metrics">
                      <div className="metric-item">
                        <span className="metric-label">Views:</span>
                        <span className="metric-value">{views.toLocaleString()}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Link Earnings:</span>
                        <span className="metric-value earnings">${linkEarn.toFixed(2)}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Referral Earnings:</span>
                        <span className="metric-value referral">${refEarn.toFixed(2)}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Daily CPM:</span>
                        <span className="metric-value cpm">${dailyCpm.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Progress bar for views */}
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${Math.min((views / maxViews) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Performance Insights */}
      {statsArr.length > 0 && (
        <div className="insights-card">
          <div className="insights-header">
            <div className="insights-icon">
              <i className="fas fa-lightbulb"></i>
            </div>
            <h3 className="insights-title">Performance Insights</h3>
          </div>
          <div className="insights-content">
            <div className="insight-item">
              <i className="fas fa-chart-line"></i>
              <p>
                Best performing day:{" "}
                {bestDay
                  ? new Date(bestDay.date).toLocaleDateString() + ` (${n(bestDay.views)} views)`
                  : "N/A"}
              </p>
            </div>
            <div className="insight-item">
              <i className="fas fa-dollar-sign"></i>
              <p>
                Highest earning day:{" "}
                {highestEarningDay
                  ? new Date(highestEarningDay.date).toLocaleDateString() +
                    ` ($${n(highestEarningDay.link_earnings).toFixed(2)})`
                  : "N/A"}
              </p>
            </div>
            <div className="insight-item">
              <i className="fas fa-eye"></i>
              <p>Average daily performance: {averages.views} views generating ${averages.earnings}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap">
        <div className="w-full xl:w-12 px-4">
        </div>
      </div>
    </div>
  );
};

export default Statistics;
