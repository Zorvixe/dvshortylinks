"use client"

import { useState } from "react"
import UserDropdown from "../Dropdowns/UserDropdown.js"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

import "./AdminNavbar.css"

export default function AdminNavbar() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleAddNewLink = () => {
    navigate("ShortenUrl")
    // Add your link creation logic here
    console.log("Add new link clicked")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Add your search logic here
    console.log("Search query:", searchQuery)
  }

  return (
    <>
      {/* Modern Navbar */}
      <nav className="navbar-container big_device">
        <div className="navbar-content">
          {/* Left Section - Add New Link Button */}
          <div className="navbar-left">
            <button
              className="add-link-btn"
              onClick={handleAddNewLink}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                e.currentTarget.style.setProperty("--x", `${x}px`)
                e.currentTarget.style.setProperty("--y", `${y}px`)
                e.currentTarget.classList.add("hover-effect")
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove("hover-effect")
              }}
            >
              <i className="fas fa-plus icon-plus"></i>
              <span>Add New Link</span>
            </button>
          </div>

          {/* Center Section - User Info Card */}
          <div className="navbar-center">
            <div className="user-info-card">
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="user-details">
                <div className="username">{user?.username || "Guest"}</div>
                <div className="balance">
                  <span className="balance-label">Balance:</span>
                  <span className="balance-amount">₹{user?.balance || "0.00"}</span>
                </div>
              </div>
              <div className="user-status">
                <div className="status-indicator active"></div>
              </div>
            </div>
          </div>

          {/* Right Section - Search & User Dropdown */}
          <div className="navbar-right">
            {/* Search Form */}
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-container">
                <div className="search-icon">
                  <i className="fas fa-search"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search links, stats..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </form>

            {/* User Dropdown */}
            <div className="user-dropdown-container">
              <UserDropdown />
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="mobile-menu-toggle">
          <button className="mobile-toggle-btn">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
      <nav className="navbar-container_small_device small_device">
        <div className="navbar-content">
          {/* Center Section - User Info Card */}
          <div className="navbar-center_small_device">
            <div className="user-info-card">
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="user-details">
                <div className="username">{user?.username || "Guest"}</div>
                <div className="balance">
                  <span className="balance-label">Balance:</span>
                  <span className="balance-amount">₹{user?.balance || "0.00"}</span>
                </div>
              </div>
              <div className="user-status">
                <div className="status-indicator active"></div>
              </div>
            </div>
          </div>
          <div className="navbar-left_small_device">
            <button
              className="add-link-btn"
              onClick={handleAddNewLink}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                e.currentTarget.style.setProperty("--x", `${x}px`)
                e.currentTarget.style.setProperty("--y", `${y}px`)
                e.currentTarget.classList.add("hover-effect")
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove("hover-effect")
              }}
            >
              <i className="fas fa-plus icon-plus"></i>
              <span>Add New Link</span>
            </button>
          </div>
        </div>

      </nav>
    </>
  )
}
