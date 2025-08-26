"use client"
import { useState } from "react"
import "./AdminMainHeader.css"

const AdminMainHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}")

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminData")
    window.location.href = "/adminlogin"
  }

  return (
    <header className="admin-main-header">
      {/* Left */}
      <div className="header-left">
        <h2 className="header-logo">DVSHORTYLINKS</h2>
      </div>

      {/* Right */}
      <div className="header-right">
        <button className="notif-btn" aria-label="Notifications">
          🔔
        </button>
        <div className="profile-menu">
          <button
            className="profile-btn"
            onClick={() => setDropdownOpen((o) => !o)}
          >
            <span className="avatar">
              {adminData?.username?.charAt(0)?.toUpperCase() || "A"}
            </span>
            <span className="profile-name">
              {adminData?.username || "Admin"}
            </span>
          </button>
          {dropdownOpen && (
            <div className="dropdown">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AdminMainHeader
