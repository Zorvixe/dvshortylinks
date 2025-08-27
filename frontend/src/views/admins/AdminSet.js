// src/views/admin/AdminSet.js
"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminSet.css";

export default function AdminSet() {
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({ username: "", email: "" });
  const [pw, setPw] = useState({ current_password: "", new_password: "", confirm_password: "" });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401 || res.status === 403) {
          setError("Session expired. Please log in again.");
          // brief delay so user can see the message
          setTimeout(() => navigate("/adminlogin"), 800);
          return;
        }
        if (!res.ok) throw new Error((await res.text()) || "Failed to load admin details");
        const data = await res.json();
        setForm({
          username: data.admin?.username || "",
          email: data.admin?.email || "",
        });
      } catch (e) {
        setError(e.message || "Failed to load admin details");
      } finally {
        setLoading(false);
      }
    })();
  }, [API, token, navigate]);

  // FIX: correct spread in the change handlers
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onChangePw = (e) => setPw((p) => ({ ...p, [e.target.name]: e.target.value }));

  const saveProfile = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/admin/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      localStorage.setItem("adminData", JSON.stringify({
        username: data.admin.username,
        email: data.admin.email,
      }));

      setMsg("Profile updated successfully");
    } catch (e1) {
      setError(e1.message);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    if (pw.new_password !== pw.confirm_password) {
      setError("New passwords do not match");
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch(`${API}/api/admin/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          current_password: pw.current_password,
          new_password: pw.new_password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to change password");
      setPw({ current_password: "", new_password: "", confirm_password: "" });
      setMsg("Password changed successfully");
    } catch (e2) {
      setError(e2.message);
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="adms-container">
        <div className="adms-header">
          <h1>Admin Settings</h1>
        </div>
        <div className="adms-loading">
          <div className="adms-loading-line"></div>
          <div className="adms-loading-line adms-shorter"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="adms-container">
      <div className="adms-header">
        <h1>Admin Settings</h1>
        <p>Manage your account settings</p>
      </div>

      {error && (
        <div className="adms-alert adms-error">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {msg && (
        <div className="adms-alert adms-success">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </svg>
          <span>{msg}</span>
        </div>
      )}

      <div className="adms-content">
        <div className="adms-card">
          <div className="adms-card-header">
            <h2>Profile Information</h2>
            <p>Update your account details</p>
          </div>
          
          <form onSubmit={saveProfile} className="adms-card-body">
            <div className="adms-form-group">
              <div className="adms-input-group">
                <label className="adms-label">Username</label>
                <input
                  type="text"
                  className="adms-input"
                  name="username"
                  value={form.username}
                  onChange={onChange}
                  required
                />
              </div>
              
              <div className="adms-input-group">
                <label className="adms-label">Email Address</label>
                <input
                  type="email"
                  className="adms-input"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
            
            <div className="adms-card-footer">
              <button className="adms-btn adms-btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <svg className="adms-spinner" width="14" height="14" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    </svg>
                    Saving...
                  </>
                ) : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        <div className="adms-card">
          <div className="adms-card-header">
            <h2>Update Password</h2>
            <p>Change your account password</p>
          </div>
          
          <form onSubmit={changePassword} className="adms-card-body">
            <div className="adms-form-group">
              <div className="adms-input-group">
                <label className="adms-label">Current Password</label>
                <input
                  type="password"
                  className="adms-input"
                  name="current_password"
                  value={pw.current_password}
                  onChange={onChangePw}
                  required
                />
              </div>
              
              <div className="adms-input-group">
                <label className="adms-label">New Password</label>
                <input
                  type="password"
                  className="adms-input"
                  name="new_password"
                  value={pw.new_password}
                  onChange={onChangePw}
                  required
                />
              </div>
              
              <div className="adms-input-group">
                <label className="adms-label">Confirm New Password</label>
                <input
                  type="password"
                  className="adms-input"
                  name="confirm_password"
                  value={pw.confirm_password}
                  onChange={onChangePw}
                  required
                />
              </div>
            </div>
            
            <div className="adms-card-footer">
              <button className="adms-btn adms-btn-primary" disabled={pwSaving}>
                {pwSaving ? (
                  <>
                    <svg className="adms-spinner" width="14" height="14" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    </svg>
                    Updating...
                  </>
                ) : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}