"use client"
import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"

export default function CardSettings() {
  const [profileData, setProfileData] = useState({
    newUsername: "",
    newEmail: ""
  })

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [loading, setLoading] = useState(false)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/details`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (response.ok) {
          setProfileData({
            newUsername: data.username || "",
            newEmail: data.email || ""
          })
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error)
      }
    }

    if (token) fetchUserDetails()
  }, [token])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res1 = await fetch(`${apiUrl}/settings/username`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newUsername: profileData.newUsername })
      })

      const res2 = await fetch(`${apiUrl}/settings/email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newEmail: profileData.newEmail })
      })

      const data1 = await res1.json()
      const data2 = await res2.json()

      if (res1.ok || res2.ok) {
        toast.success("Profile updated successfully!")
      }

      if (!res1.ok && data1?.error) {
        toast.error(`Username Error: ${data1.error}`)
      }

      if (!res2.ok && data2?.error) {
        toast.error(`Email Error: ${data2.error}`)
      }
    } catch (err) {
      toast.error("Something went wrong while updating.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { oldPassword, newPassword, confirmPassword } = passwordData

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${apiUrl}/settings/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword,
          newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Password updated successfully.")
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        toast.error(data.error || "Failed to update password.")
      }
    } catch (err) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">My account</h6>
          <button
            onClick={handleProfileUpdate}
            className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            type="button"
          >
            Save
          </button>
        </div>
      </div>

      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleProfileUpdate}>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">User Information</h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Username</label>
                <input
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                  value={profileData.newUsername}
                  onChange={(e) => setProfileData({ ...profileData, newUsername: e.target.value })}
                />
              </div>
            </div>

            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Email address</label>
                <input
                  type="email"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                  value={profileData.newEmail}
                  onChange={(e) => setProfileData({ ...profileData, newEmail: e.target.value })}
                />
              </div>
            </div>
          </div>
        </form>

        <hr className="mt-6 border-b-1 border-blueGray-300" />

        <form onSubmit={handlePasswordUpdate}>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">Change Password</h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Old Password</label>
                <input
                  type="password"
                  className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                />
              </div>
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">New Password</label>
                <input
                  type="password"
                  className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Confirm Password</label>
                <input
                  type="password"
                  className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-lightBlue-500 text-white px-4 py-2 rounded shadow hover:shadow-md transition-all"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  )
}
