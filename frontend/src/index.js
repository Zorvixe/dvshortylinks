import React from "react"
import ReactDOM from "react-dom"
import { useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "assets/styles/tailwind.css"
import ProtectedRoute from "./contexts/ProtectedRoute"
import Layout from "views/admins/Layout"
import "./preloader"

import Admin from "./layouts/Admin"
import Auth from "./layouts/Auth"
import ShortUrlRedirect from "views/user/ShortUrlRedirect"

import Profile from "./views/Profile"
import Index from "./views/Index"
import AuthCallback from "./contexts/AuthCallback"
import NotFound from "views/user/NotFound"
import AdRedirect from "views/user/AdRedirect"
import { trackPageview } from "./analytics"

// admins
import AdminLogin from "views/admins/AdminLogin"
import AdminDashboard from "views/admins/AdminDashboard"
import AdminUsers from "views/admins/AdminUsers"
import AdminWithdrawals from "views/admins/AdminWithdrawals"
import AdminAnnouncements from "views/admins/AdminAnnouncements"
import AdminRevenueDashboard from "views/admins/AdminRevenueDashboard"
import CpmAdmin from "views/admins/CpmAdmin"
import AdminSet from "views/admins/AdminSet";

// context
import { AuthProvider } from "./contexts/AuthContext"

// ---------- Admin protection ----------
const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken")
  if (!adminToken) {
    window.location.href = "/adminlogin"
    return null
  }
  return children
}

// ---------- Single admin layout wrapper ----------
const AdminRoute = ({ page, children }) => (
  <AdminProtectedRoute>
    <Layout currentPage={page}>{children}</Layout>
  </AdminProtectedRoute>
)

// ---------- Pageview tracker (hooks INSIDE a component) ----------
const PageViewTracker = () => {
  const location = useLocation()
  useEffect(() => {
    trackPageview(location.pathname + location.search)
  }, [location.pathname, location.search])
  return null
}

ReactDOM.render(
  <AuthProvider>
    <BrowserRouter>
      <PageViewTracker />
      <Routes>
        {/* Public */}
        <Route path="/:shortCode" element={<ShortUrlRedirect />} />
        <Route path="/go/:slug" element={<AdRedirect />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Index />} />

        {/* Regular User Protected */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Admin Auth (no layout) */}
        <Route path="/adminlogin" element={<AdminLogin />} />

        {/* Admin Console (single Layout) */}
        <Route
          path="/admindashboard"
          element={
            <AdminRoute page="dashboard">
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/adminusers"
          element={
            <AdminRoute page="users">
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/adminwithdrawals"
          element={
            <AdminRoute page="withdrawals">
              <AdminWithdrawals />
            </AdminRoute>
          }
        />
        <Route
          path="/adminannouncements"
          element={
            <AdminRoute page="announcements">
              <AdminAnnouncements />
            </AdminRoute>
          }
        />
        <Route
          path="/adminrevenue"
          element={
            <AdminRoute page="adminrevenue">
              <AdminRevenueDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/cpmadmin"
          element={
            <AdminRoute page="cpm">
              <CpmAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/adminset"
          element={
            <AdminRoute page="adminset">
              <AdminSet />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>,
  document.getElementById("root")
)