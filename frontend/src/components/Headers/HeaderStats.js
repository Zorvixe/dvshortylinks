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
} from "lucide-react";

import "./HeaderStats.css"

export default function HeaderStats() {
  const { user, loading: authLoading } = useAuth();
  const token = localStorage.getItem("token");
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          <div>
            {/* Card stats */}
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
            <div className="mt-4 p-4 bg-dark rounded-3 shadow-lg text-center">
              <p className="text-white mb-3 fs-5 fw-semibold">
                📢 Join our community for updates & support
              </p>
              <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                <a
                  href="https://t.me/DvShortyLinks_Help"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-telegram text-center py-2 px-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                  style={{ width: '200px' }}
                >
                  <i className="fab fa-telegram fs-5"></i>
                  Telegram
                </a>
               <a
                  href="https://t.me/DvShortyLinks_Help"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-telegram text-center py-2 px-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                  style={{ width: '200px' }}
                >
                  <i className="fab fa-telegram fs-5"></i>
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
