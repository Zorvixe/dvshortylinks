"use client"

import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useEffect, useRef } from "react"

// components
import AdminNavbar from "../components/Navbars/AdminNavbar.js"
import Sidebar from "../components/Sidebar/Sidebar.js"
import HeaderStats from "../components/Headers/HeaderStats.js"
import FooterAdmin from "../components/Footers/FooterAdmin.js"

// views
import Dashboard from "../views/user/Dashboard.js"
import Maps from "../views/user/Maps.js"
import Settings from "../views/user/Settings.js"
import ShortenUrl from "../views/user/ShortenUrl.js"
import ManageLinks from "../views/user/ManageLinks.js"
import MyLinks from "../views/user/MyLinks.js"
import AllLinks from "../views/user/AllLinks.js"
import Api from "../views/user/ApiPage.js"
import HiddenLinks from "../views/user/HiddenLinks.js"
import MassShrinker from "../views/user/MassShrinker.js"
import Statistics from "../views/user/Statistics.js"
import Referrals from "../views/user/Referrals.js"
import Payments from "../views/user/Payments.js"

export default function Admin() {
  const location = useLocation()
  const contentRef = useRef(null)

  useEffect(() => {
    // Scroll to the content area after route change
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 50) // Small delay for smooth UX
  }, [location.pathname])

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <HeaderStats />
        <div ref={contentRef} className="px-4 md:px-10 mx-auto w-full -m-24">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="maps" element={<Maps />} />
            <Route path="ShortenUrl" element={<ShortenUrl />} />
            <Route path="manageLinks" element={<ManageLinks />} />
            <Route path="myLinks" element={<MyLinks />} />
            <Route path="allLinks" element={<AllLinks />} />
            <Route path="api" element={<Api />} />
            <Route path="hiddenlinks" element={<HiddenLinks />} />
            <Route path="massshrinker" element={<MassShrinker />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="payments" element={<Payments />} />
            <Route path="settings" element={<Settings />} />
            <Route path="/" element={<Navigate to="dashboard" replace />} />
          </Routes>
          <FooterAdmin />
        </div>
      </div>
    </>
  )
}
