

"use client"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import Footer from "components/Footers/Footer.js"

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleDashboard = () => {
    navigate("/admin/dashboard")
  }

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const handleEditProfile = () => {
    // Add edit profile functionality
    console.log("Edit profile clicked")
  }

  return (
    <>
      {/* Custom Navbar for Profile */}
      <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            {/* Left - DVShortyLinks Logo */}
            <a
              className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
              href="#pablo"
              onClick={(e) => {
                e.preventDefault()
                navigate("/")
              }}
            >
              DVShortyLinks
            </a>

            {/* Mobile menu button */}
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>

          {/* Right - Dashboard Button */}
          <div className="lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none hidden">
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="flex items-center">
                <button
                  className="bg-lightBlue-500 text-white active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleDashboard}
                >
                  <i className="fas fa-tachometer-alt text-lg leading-lg mr-2"></i>
                  Dashboard
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="profile-page">
        <section className="relative block h-500-px">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')",
            }}
          >
            <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
            style={{ transform: "translateZ(0)" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
            </svg>
          </div>
        </section>

        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative">
                      {/* User Avatar */}
                      <div className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px w-150-px h-150-px bg-gradient-to-r from-lightBlue-500 to-lightBlue-600 flex items-center justify-center">
                          <img
                            alt="Profile"
                            src={require("assets/img/team-2-800x800.jpg")|| "/placeholder.svg"}
                            className="shadow-xl rounded-full h-full w-full object-cover"
                          />
                       
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                    <div className="py-6 px-3 mt-32 sm:mt-0">
                      <button
                        className="bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={handleEditProfile}
                      >
                        <i className="fas fa-edit mr-2"></i>
                        Edit Profile
                      </button>
                      <button
                        className="bg-red-500 active:bg-red-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150 ml-2"
                        type="button"
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Logout
                      </button>
                    </div>
                  </div>

                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {user?.totalLinks || 0}
                        </span>
                        <span className="text-sm text-blueGray-400">Total Links</span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {user?.totalClicks || 0}
                        </span>
                        <span className="text-sm text-blueGray-400">Total Clicks</span>
                      </div>
                      <div className="lg:mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          ₹{user?.totalEarnings || "0.00"}
                        </span>
                        <span className="text-sm text-blueGray-400">Earnings</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-12">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
                    {user?.username || "Guest User"}
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                    <i className="fas fa-envelope mr-2 text-lg text-blueGray-400"></i>
                    {user?.email || "No email provided"}
                  </div>
                  <div className="mb-2 text-blueGray-600 mt-10">
                    <i className="fas fa-calendar-alt mr-2 text-lg text-blueGray-400"></i>
                    Member since {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : "Unknown"}
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-wallet mr-2 text-lg text-blueGray-400"></i>
                    Current Balance: ₹{user?.balance || "0.00"}
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-link mr-2 text-lg text-blueGray-400"></i>
                    URL Shortener Specialist
                  </div>
                </div>

                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                        {user?.bio ||
                          `Welcome to ${user?.username || "your"} profile! You're part of the DVShortyLinks community, where you can create shortened URLs and earn money from clicks. Track your performance, manage your links, and grow your earnings all in one place.`}
                      </p>

                      {/* User Stats Cards */}
                      <div className="flex flex-wrap mt-8">
                        <div className="w-full lg:w-4/12 px-4 mb-4">
                          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg p-6 text-center">
                            <i className="fas fa-mouse-pointer text-3xl mb-3"></i>
                            <h4 className="text-xl font-bold">Click Rate</h4>
                            <p className="text-emerald-100">
                              {user?.totalLinks > 0
                                ? Math.round(((user?.totalClicks || 0) / user.totalLinks) * 100) / 100
                                : 0}{" "}
                              clicks/link
                            </p>
                          </div>
                        </div>

                        <div className="w-full lg:w-4/12 px-4 mb-4">
                          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 text-center">
                            <i className="fas fa-chart-line text-3xl mb-3"></i>
                            <h4 className="text-xl font-bold">Performance</h4>
                            <p className="text-purple-100">{user?.totalClicks > 0 ? "Active" : "Getting Started"}</p>
                          </div>
                        </div>

                        <div className="w-full lg:w-4/12 px-4 mb-4">
                          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6 text-center">
                            <i className="fas fa-trophy text-3xl mb-3"></i>
                            <h4 className="text-xl font-bold">Rank</h4>
                            <p className="text-orange-100">
                              {user?.totalEarnings >= 1000
                                ? "Pro"
                                : user?.totalEarnings >= 100
                                  ? "Advanced"
                                  : user?.totalEarnings >= 10
                                    ? "Intermediate"
                                    : "Beginner"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 p-6 bg-blueGray-50 rounded-lg">
                        <h4 className="text-xl font-bold text-blueGray-700 mb-4">
                          <i className="fas fa-info-circle mr-2"></i>
                          Account Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                          <div>
                            <strong className="text-blueGray-600">Username:</strong>
                            <p className="text-blueGray-700">{user?.username || "Not set"}</p>
                          </div>
                          <div>
                            <strong className="text-blueGray-600">Email:</strong>
                            <p className="text-blueGray-700">{user?.email || "Not set"}</p>
                          </div>
                          <div>
                            <strong className="text-blueGray-600">Account Status:</strong>
                            <p className="text-green-600 font-semibold">
                              <i className="fas fa-check-circle mr-1"></i>
                              Active
                            </p>
                          </div>
                          <div>
                            <strong className="text-blueGray-600">Referral Code:</strong>
                            <p className="text-blueGray-700">{user?.referralCode || "Not available"}</p>
                          </div>
                        </div>
                      </div>

                      <a
                        href="#pablo"
                        className="font-normal text-lightBlue-500 mt-4 inline-block"
                        onClick={(e) => {
                          e.preventDefault()
                          handleDashboard()
                        }}
                      >
                        <i className="fas fa-arrow-right mr-2"></i>
                        Go to Dashboard
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
