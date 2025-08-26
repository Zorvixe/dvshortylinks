"use client"
import { useState, useEffect, createContext, useContext } from "react"
import "./AdminSidebar.css"
import Logo from "../../assets/img/dv_logo.png"

const SidebarContext = createContext()
export const useSidebar = () => {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider")
  return ctx
}

const Sidebar = ({ currentPage, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [userInfo, setUserInfo] = useState({ username: "Admin User" })
  const [quickStats, setQuickStats] = useState({ totalUsers: 0, pendingWithdrawals: 0 })
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/admindashboard", description: "Overview & Analytics" },
    { id: "users", label: "Users", icon: "👥", path: "/adminusers", description: "User Management" },
    { id: "withdrawals", label: "Withdrawals", icon: "💰", path: "/adminwithdrawals", description: "Payment Processing" },
    { id: "announcements", label: "Announcements", icon: "📢", path: "/adminannouncements", description: "Platform Updates" },
    { id: "cpm", label: "CPM Rates", icon: "📈", path: "/cpmadmin", description: "CPM Management" },
    { id: "adminrevenue", label: "Revenue", icon: "💵", path: "/adminrevenue", description: "Revenue Analytics" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminData")
    window.location.href = "/adminlogin"
  }
  const handleSetting = () => {
    window.location.href = "/adminset"
  }

  const handleNavigation = (item) => {
    if (onNavigate) onNavigate(item.id)
    else window.location.href = item.path
    // Close mobile drawer after navigation
    setIsMobileOpen(false)
  }

  // Persisted admin + quick stats
  useEffect(() => {
    const adminData = localStorage.getItem("adminData")
    if (adminData) setUserInfo(JSON.parse(adminData))

    const fetchQuickStats = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/admin/dashboard/overview`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        })
        if (!response.ok) throw new Error("Failed to fetch stats")
        const data = await response.json()
        setQuickStats({ totalUsers: data.users, pendingWithdrawals: data.pendingWithdrawals })
      } catch (err) {
        console.error("Error fetching quick stats:", err)
      }
    }
    fetchQuickStats()
  }, [apiUrl])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.documentElement.style.overflow = "hidden"
    } else {
      document.documentElement.style.overflow = ""
    }
    return () => (document.documentElement.style.overflow = "")
  }, [isMobileOpen])

  // Close on escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsMobileOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <SidebarContext.Provider value={{ isCollapsed, isMobileOpen, setIsMobileOpen }}>
      {/* Mobile hamburger */}
      <button
        className="mobile-toggle-amdm"
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsMobileOpen((v) => !v)}
      >
        {isMobileOpen ? "✕" : "☰"}
      </button>

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay-amdm ${isMobileOpen ? "active-amdm" : ""}`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden={!isMobileOpen}
      />

      <div
        className={`admin-sidebar-amdm ${isCollapsed ? "collapsed-amdm" : ""} ${
          isMobileOpen ? "mobile-open-amdm" : ""
        }`}
        role="navigation"
        aria-label="Admin sidebar"
      >
        {/* Header */}
        <div className="sidebar-header-amdm">
          <div className="logo-container-amdm">
            <div className=""><img src={Logo} alt="DVSHORTYLINKS Logo" className="dv_logo_admin" /></div>
            {!isCollapsed && (
              <div className="logo-text-amdm">
               
                <h4 className="logo-title-amdm" title="DVSHORTYLINKS">DVSHORTYLINKS</h4>
                <p className="logo-subtitle-amdm">Management Console</p>
              </div>
            )}
          </div>
          <button
            className="collapse-btn-amdm"
            onClick={() => setIsCollapsed((v) => !v)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={isCollapsed}
          >
            <span className={`collapse-icon-amdm ${isCollapsed ? "collapsed-amdm" : ""}`}>
              {isCollapsed ? "→" : "←"}
            </span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav-amdm">
          <div className="nav-section-amdm">
            <div className="nav-section-title-amdm">{!isCollapsed && <span>Main Navigation</span>}</div>
            <ul className="nav-list-amdm">
              {navigationItems.map((item) => (
                <li key={item.id} className="nav-item-amdm">
                  <button
                    className={`nav-link-amdm ${currentPage === item.id ? "active-amdm" : ""}`}
                    onClick={() => handleNavigation(item)}
                    title={isCollapsed ? item.label : ""}
                    aria-current={currentPage === item.id ? "page" : undefined}
                  >
                    <span className="nav-icon-amdm" aria-hidden="true">{item.icon}</span>
                    {!isCollapsed && (
                      <div className="nav-content-amdm">
                        <span className="nav-label-amdm">{item.label}</span>
                        <span className="nav-description-amdm">{item.description}</span>
                      </div>
                    )}
                    {currentPage === item.id && <div className="active-indicator-amdm" aria-hidden="true"></div>}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Stats */}
          {!isCollapsed && (
            <div className="nav-section-amdm" aria-label="Quick stats">
              <div className="nav-section-title-amdm"><span>Quick Stats</span></div>
              <div className="quick-stats-amdm">
                <div className="stat-item-amdm" title="Total Users">
                  <div className="stat-icon-amdm" aria-hidden="true">👥</div>
                  <div className="stat-content-amdm">
                    <span className="stat-value-amdm">{quickStats.totalUsers}</span>
                    <span className="stat-label-amdm">Total Users</span>
                  </div>
                </div>
                <div className="stat-item-amdm" title="Pending Withdrawals">
                  <div className="stat-icon-amdm" aria-hidden="true">⏳</div>
                  <div className="stat-content-amdm">
                    <span className="stat-value-amdm">{quickStats.pendingWithdrawals}</span>
                    <span className="stat-label-amdm">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer-amdm">
          <div className="user-profile-amdm">
            <div className="user-avatar-amdm" aria-hidden="true">
              {userInfo.username?.charAt(0).toUpperCase() || "A"}
            </div>
            {!isCollapsed && (
              <div className="user-info-amdm">
                <div className="user-name-amdm" title={userInfo.username}>{userInfo.username}</div>
                <div className="user-role-amdm">Administrator</div>
              </div>
            )}
          </div>

          <div className="sidebar-actions-amdm">
            <button className="action-btn-amdm settings-amdm" title="Settings" onClick={handleSetting}>
              <span className="action-icon-amdm" aria-hidden="true">⚙️</span>
              {!isCollapsed && <span>Settings</span>}
            </button>
            <button className="action-btn-amdm logout-amdm" title="Logout" onClick={handleLogout}>
              <span className="action-icon-amdm" aria-hidden="true">🚪</span>
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>

          {!isCollapsed && (
            <div className="version-info-amdm">
              <p>Admin Panel v2.1.0</p>
            </div>
          )}
        </div>
      </div>
    </SidebarContext.Provider>
  )
}

export default Sidebar
