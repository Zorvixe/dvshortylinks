"use client"
import { useEffect, useMemo, useState } from "react"
import "./CpmAdmin.css"

/** Force-render timestamps in India Standard Time (IST) */
const formatIST = (ts) => {
  if (!ts && ts !== 0) return "--"
  const date = typeof ts === "number" ? new Date(ts) : new Date(String(ts))
  if (isNaN(date.getTime())) return "--"
  return (
    new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date) + " IST"
  )
}

const CpmAdmin = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"

  const [cpmRates, setCpmRates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editingRate, setEditingRate] = useState(null)

  const [formData, setFormData] = useState({
    country_code: "",
    country_name: "",
    rate: "",
    is_active: true,
  })

  const token = useMemo(() => localStorage.getItem("adminToken"), [])

  const resetForm = () => {
    setEditingRate(null)
    setFormData({
      country_code: "",
      country_name: "",
      rate: "",
      is_active: true,
    })
  }

  const fetchCpmRates = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`${apiUrl}/api/admin/cpm-rates`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Failed to fetch CPM rates")
      const data = await response.json()
      setCpmRates(Array.isArray(data) ? data : data.rates || [])
    } catch (err) {
      setError(err.message || "Unable to load CPM rates")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCpmRates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---------- Handlers ----------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    let v = type === "checkbox" ? checked : value
    if (name === "country_code") v = v.toUpperCase()
    setFormData((prev) => ({ ...prev, [name]: v }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // client guard
    const numRate = Number.parseFloat(formData.rate)
    if (Number.isNaN(numRate) || numRate < 0) {
      setError("Rate must be a valid positive number")
      return
    }
    if (!formData.country_code || !formData.country_name) {
      setError("Country code and country name are required")
      return
    }

    try {
      const url = editingRate
        ? `${apiUrl}/api/admin/cpm-rates/${editingRate.id}`
        : `${apiUrl}/api/admin/cpm-rates`
      const method = editingRate ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country_code: formData.country_code.toUpperCase().trim(),
          country_name: formData.country_name.trim(),
          rate: numRate,
          is_active: !!formData.is_active,
        }),
      })

      if (!response.ok) {
        let msg = editingRate ? "Failed to update CPM rate" : "Failed to save CPM rate"
        try {
          const errorData = await response.json()
          msg = errorData.error || errorData.message || msg
        } catch (_) {}
        throw new Error(msg)
      }

      setSuccess(editingRate ? "CPM rate updated successfully!" : "CPM rate added successfully!")
      resetForm()
      fetchCpmRates()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (row) => {
    setEditingRate(row)
    setFormData({
      country_code: row.country_code || "",
      country_name: row.country_name || "",
      rate: row.rate ?? "",
      is_active: !!row.is_active,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this CPM rate?")) return
    setError("")
    setSuccess("")
    try {
      const response = await fetch(`${apiUrl}/api/admin/cpm-rates/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        let msg = "Failed to delete"
        try {
          const err = await response.json()
          msg = err.error || err.message || msg
        } catch (_) {}
        throw new Error(msg)
      }
      setSuccess("Deleted successfully")
      fetchCpmRates()
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    setError("")
    setSuccess("")
    try {
      const current = cpmRates.find((r) => r.id === id)
      if (!current) throw new Error("Rate not found in local state")

      const response = await fetch(`${apiUrl}/api/admin/cpm-rates/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country_code: current.country_code,
          country_name: current.country_name,
          rate: Number.parseFloat(current.rate),
          is_active: !currentStatus,
        }),
      })

      if (!response.ok) {
        let msg = "Failed to update status"
        try {
          const err = await response.json()
          msg = err.error || err.message || msg
        } catch (_) {}
        throw new Error(msg)
      }

      setSuccess("Status updated successfully!")
      fetchCpmRates()
    } catch (err) {
      setError(err.message)
    }
  }

  // ---------- Render ----------
  return (
    <div className="cpm-admin">
      <div className="cpm-header">
        <h1>CPM Management</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary btn-small" onClick={fetchCpmRates}>
            Refresh
          </button>
          {editingRate && (
            <button className="btn btn-secondary btn-small" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Form */}
      <div className="cpm-form-container">
        <form className="cpm-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Country Code</label>
              <input
                type="text"
                name="country_code"
                placeholder="e.g., US, IN, GB"
                maxLength={3}
                value={formData.country_code}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Country Name</label>
              <input
                type="text"
                name="country_name"
                placeholder="e.g., United States"
                value={formData.country_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rate (USD per 1000)</label>
              <input
                type="number"
                name="rate"
                min="0"
                step="0.01"
                placeholder="e.g., 2.50"
                value={formData.rate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                Active
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Clear
            </button>
            <button type="submit" className="btn btn-primary">
              {editingRate ? "Update Rate" : "Add Rate"}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="cpm-table-container">
        <h2>Current CPM Rates</h2>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : cpmRates.length === 0 ? (
          <div className="no-data">No CPM rates found.</div>
        ) : (
          <div className="cpm-table-wrap">
            <table className="cpm-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Code</th>
                  <th>Country</th>
                  <th>Rate (USD)</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cpmRates.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>
                      <span className="country-code">{r.country_code}</span>
                    </td>
                    <td>{r.country_name}</td>
                    <td className="rate">
                      {typeof r.rate === "number" ? r.rate.toFixed(2) : Number(r.rate || 0).toFixed(2)}
                    </td>
                    <td>
                      <button
                        className={`status-toggle ${r.is_active ? "active" : "inactive"}`}
                        onClick={() => toggleStatus(r.id, r.is_active)}
                      >
                        {r.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td>
                      {r.updated_at
                        ? formatIST(r.updated_at)
                        : r.created_at
                        ? formatIST(r.created_at)
                        : "--"}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-edit btn-small" onClick={() => handleEdit(r)}>
                          Edit
                        </button>
                        <button className="btn btn-delete btn-small" onClick={() => handleDelete(r.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats summary */}
        <div className="cpm-stats">
          <div className="stat-card">
            <h3>Total Countries</h3>
            <div className="stat-value">{cpmRates.length}</div>
          </div>
          <div className="stat-card">
            <h3>Active Countries</h3>
            <div className="stat-value">{cpmRates.filter((r) => r.is_active).length}</div>
          </div>
          <div className="stat-card">
            <h3>Avg. Rate</h3>
            <div className="stat-value">
              {cpmRates.length
                ? (
                    cpmRates.reduce((sum, r) => sum + Number.parseFloat(r.rate || 0), 0) / cpmRates.length
                  ).toFixed(2)
                : "0.00"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CpmAdmin
