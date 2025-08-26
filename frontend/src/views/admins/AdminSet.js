// src/views/admin/AdminSet.js
"use client";
import { useEffect, useState } from "react";
import "./AdminSet.css"

export default function AdminSet() {
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("adminToken");

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
          return;
        }
        if (!res.ok) throw new Error(await res.text());
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
  }, [API, token]);

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

      // Keep small admin header info for sidebar
      localStorage.setItem("adminData", JSON.stringify({
        username: data.admin.username,
        email: data.admin.email,
      }));

      setMsg("Profile updated.");
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
      setMsg("Password changed.");
    } catch (e2) {
      setError(e2.message);
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="placeholder-wave">
          <span className="placeholder col-6"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="h4 mb-3">Admin Settings</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {msg && <div className="alert alert-success">{msg}</div>}

      {/* Profile (username & email only) */}
      <form onSubmit={saveProfile} className="card mb-4">
        <div className="card-header fw-semibold">Profile</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={form.username}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>
          </div>
        </div>
        <div className="card-footer text-end">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>

      {/* Change password */}
      <form onSubmit={changePassword} className="card">
        <div className="card-header fw-semibold">Change Password</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Current password</label>
              <input
                type="password"
                className="form-control"
                name="current_password"
                value={pw.current_password}
                onChange={onChangePw}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">New password</label>
              <input
                type="password"
                className="form-control"
                name="new_password"
                value={pw.new_password}
                onChange={onChangePw}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Confirm new password</label>
              <input
                type="password"
                className="form-control"
                name="confirm_password"
                value={pw.confirm_password}
                onChange={onChangePw}
                required
              />
            </div>
          </div>
        </div>
        <div className="card-footer text-end">
          <button className="btn btn-primary" disabled={pwSaving}>
            {pwSaving ? "Updating..." : "Change password"}
          </button>
        </div>
      </form>
    </div>
  );
}
