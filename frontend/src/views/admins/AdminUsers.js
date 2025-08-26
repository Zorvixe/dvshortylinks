"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import "./AdminUsers.css"

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      })

      console.log("Fetched users:", res.data) // Debugging line

      // Ensure we always set an array
      if (Array.isArray(res.data)) {
        setUsers(res.data)
      } else if (res.data && Array.isArray(res.data.users)) {
        setUsers(res.data.users)
      } else {
        setUsers([])
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
      setUsers([]) // Prevent crash
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (id) => {
    try {
      await axios.put(
        `${apiUrl}/api/admin/users/${id}/toggle-active`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        },
      )
      fetchUsers()
    } catch (error) {
      console.error("Failed to toggle user status:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) => {
        const matchesSearch =
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter =
          filterStatus === "all" ||
          (filterStatus === "active" && user.is_active) ||
          (filterStatus === "inactive" && !user.is_active)
        return matchesSearch && matchesFilter
      })
    : []

  if (loading) {
    return (
      <div className="admin-users-admd">
        <div className="users-loading-admd">
          <div className="loading-spinner-admd"></div>
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-users-admd">
      <div className="users-header-admd">
        <div className="header-content-admd">
          <h1 className="users-title-admd">User Management</h1>
          <p className="users-subtitle-admd">Manage and monitor all platform users</p>
        </div>
        <div className="users-stats-admd">
          <div className="stat-item-admd">
            <span className="stat-value-admd">{users.length}</span>
            <span className="stat-label-admd">Total Users</span>
          </div>
          <div className="stat-item-admd">
            <span className="stat-value-admd">{users.filter((u) => u.is_active).length}</span>
            <span className="stat-label-admd">Active</span>
          </div>
          <div className="stat-item-admd">
            <span className="stat-value-admd">{users.filter((u) => !u.is_active).length}</span>
            <span className="stat-label-admd">Inactive</span>
          </div>
        </div>
      </div>

      <div className="users-controls-admd">
        <div className="search-container-admd">
          <div className="search-input-wrapper-admd">
            <span className="search-icon-admd">🔍</span>
            <input
              type="text"
              placeholder="Search users by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-admd"
            />
          </div>
        </div>

        <div className="filter-container-admd">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select-admd">
            <option value="all">All Users</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      <div className="users-table-container-admd">
        <div className="table-wrapper-admd">
          <table className="users-table-admd">
            <thead>
              <tr>
                <th>User Info</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="user-row-admd">
                  <td className="user-info-admd">
                    <div className="user-avatar-admd">{user.username.charAt(0).toUpperCase()}</div>
                    <div className="user-details-admd">
                      <div className="user-name-admd">{user.username}</div>
                      <div className="user-email-admd">{user.email}</div>
                      <div className="user-id-admd">ID: {user.id}</div>
                    </div>
                  </td>
                  <td className="user-status-admd">
                    <span className={`status-badge-admd ${user.is_active ? "active" : "inactive"}`}>
                      <span className="status-dot-admd"></span>
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="user-date-admd">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="user-actions-admd">
                    <button
                      onClick={() => toggleActive(user.id)}
                      className={`action-btn-admd ${user.is_active ? "deactivate" : "activate"}`}
                    >
                      {user.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-users-admd">
          <div className="no-users-icon-admd">👥</div>
          <h3>No users found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
