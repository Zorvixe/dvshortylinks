"use client";

import React, { useState, useEffect } from "react";
import CardStats from "components/Cards/CardStats.js";
import { useAuth } from "contexts/AuthContext";
import {
  DollarSign,
  Eye,
  Calendar,
  TrendingUp,
  Users,
  Link2 as LinkIcon,
  Check,
  Copy,
} from "lucide-react";

import "./HeaderStats.css";

export default function HeaderStats() {
  const { user, loading: authLoading } = useAuth();
  const token = localStorage.getItem("token");
  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "https://api.dvshortylinks.com";
  const SHORT_BASE =
    process.env.REACT_APP_SHORT_BASE_URL || "https://go.dvshortylinks.com";

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick Shorten states
  const [urlInput, setUrlInput] = useState("");
  const [shortLoading, setShortLoading] = useState(false);
  const [shortResult, setShortResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState({ show: false, msg: "", type: "success" });

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Quick Shorten ----------
  const showNotice = (msg, type = "success") => {
    setNotice({ show: true, msg, type });
    setTimeout(() => setNotice({ show: false, msg: "", type }), 2500);
  };

  const isValidUrl = (val) => {
    try {
      const test = /^https?:\/\//i.test(val) ? val : `https://${val}`;
      new URL(test);
      return true;
    } catch {
      return false;
    }
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    const value = urlInput.trim();
    if (!value || !isValidUrl(value)) {
      showNotice("Please enter a valid URL.", "error");
      return;
    }

    setShortLoading(true);
    setShortResult("");
    setCopied(false);

    try {
      const res = await fetch(`${API_BASE_URL}/api/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: value }),
      });

      const data = await res.json();
      const composed =
        data?.shortenedUrl ||
        data?.short_url ||
        (data?.shortCode ? `${SHORT_BASE}/${data.shortCode}` : "");

      if (res.ok && composed) {
        setShortResult(composed);
        setUrlInput("");
        showNotice("Short link created!", "success");
      } else {
        showNotice(data?.error || "Failed to shorten URL", "error");
      }
    } catch {
      showNotice("Network error. Please try again.", "error");
    } finally {
      setShortLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortResult);
      setCopied(true);
      showNotice("Copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      showNotice("Failed to copy", "error");
    }
  };

  // ---------- Stats cards ----------
  const stats = [
    {
      title: "Current Balance",
      value: `$${dashboardData?.user?.balance || "0.00"}`,
      description: "Available for withdrawal",
      icon: DollarSign,
      colorClass: "bg-emerald-500",
    },
    {
      title: "Total Views",
      value: dashboardData?.user?.total_views || "0",
      description: "All time clicks",
      icon: Eye,
      colorClass: "bg-red-500",
    },
    {
      title: "Today's Earnings",
      value: `$${dashboardData?.today?.today_earnings || "0.00"}`,
      description: `${dashboardData?.today?.today_views || "0"} views today`,
      icon: TrendingUp,
      colorClass: "bg-purple-500",
    },
    {
      title: "Monthly Earnings",
      value: `$${dashboardData?.monthly?.monthly_earnings || "0.00"}`,
      description: `${dashboardData?.monthly?.monthly_views || "0"} views this month`,
      icon: Calendar,
      colorClass: "bg-orange-500",
    },
    {
      title: "Referral Earnings",
      value: `$${dashboardData?.user?.referral_earnings || "0.00"}`,
      description: "10% commission on referrals",
      icon: Users,
      colorClass: "bg-yellow-500",
    },
    {
      title: "Total Withdrawn",
      value: `$${dashboardData?.user?.total_withdrawn || "0.00"}`,
      description: "All time withdrawals",
      icon: DollarSign,
      colorClass: "bg-emerald-500",
    },
  ];

  if (loading || authLoading) {
    return <div className="text-center py-10">Loading stats...</div>;
  }

  return (
    <>
      {/* Header */}
      <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          {/* --- BIG Quick Shorten Card --- */}
          <div className="w-full mb-8">
            <div className="quk-card">
              <div className="quk-card-header">
                <div className="quk-card-icon">
                  <LinkIcon size={20} />
                </div>
                <div>
                  <h3 className="quk-card-title">Quick Shorten</h3>
                  <p className="quk-card-subtitle">Paste your long URL, shorten, and copy.</p>
                </div>
              </div>

              <form onSubmit={handleShorten} className="quk-form">
                <div className="quk-input-group">
                  <input
                    type="url"
                    inputMode="url"
                    placeholder="https://example.com/very/long/url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="quk-input"
                    required
                  />
                  <button
                    type="submit"
                    disabled={shortLoading}
                    className="quk-btn"
                  >
                    {shortLoading ? (
                      <>
                        <span className="quk-btn-spinner"></span>
                        Shortening…
                      </>
                    ) : (
                      <>
                        <i className="fas fa-compress-alt"></i>
                        Shorten
                      </>
                    )}
                  </button>
                </div>
              </form>

              {shortResult && (
                <div className="quk-result-group">
                  <input
                    readOnly
                    value={shortResult}
                    className="quk-result-input"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="quk-copy-btn"
                    type="button"
                  >
                    {copied ? (
                      <>
                        <Check size={16} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} /> Copy
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Card stats */}
          <div>
            <div className="flex flex-wrap">
              {stats.map((stat, index) => (
                <div key={index} className="w-full md:w-6/12 xl:w-4/12 px-4 mb-6">
                  <CardStats
                    statSubtitle={stat.title}
                    statTitle={stat.value}
                    statArrow="up"
                    statPercent="12"
                    statPercentColor="text-emerald-500"
                    statDescripiron={stat.description}
                    statIconName={stat.icon}
                    statIconColor={stat.colorClass}
                  />
                </div>
              ))}
            </div>

            {/* Community CTA */}
            <div className="quk-cta-container">
              <p className="quk-cta-text">📢 Join our community for updates & support</p>
              <div className="quk-cta-buttons">
                <a
                  href="https://t.me/DvShortyLinkscom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quk-telegram-btn"
                >
                  <i className="fab fa-telegram"></i>
                  Telegram
                </a>
                <a
                  href="https://t.me/DvShortyLinks_Help"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quk-telegram-btn"
                >
                  <i className="fab fa-telegram"></i>
                  Telegram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}