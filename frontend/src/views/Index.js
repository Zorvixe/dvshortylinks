"use client"

import React, { useState, useEffect } from "react"
import { Form, Button, Offcanvas } from "react-bootstrap"
import useAOS from "hooks/useAOS"
import useDynamicCSS from "hooks/useDynamicCSS"
import "assets/custom.css"
import "aos/dist/aos.css" // For animations

// Authentication context
const AuthContext = React.createContext()

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const login = (token) => {
    localStorage.setItem("token", token)
    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
  }

  return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>
}

const useAuth = () => React.useContext(AuthContext)

const Header = () => {
  const { isLoggedIn, logout } = useAuth()
  const [showOffcanvas, setShowOffcanvas] = useState(false)

  useDynamicCSS("https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css")

  const handleClose = () => setShowOffcanvas(false)
  const handleShow = () => setShowOffcanvas(true)

  // Navigation links for both desktop and mobile
  const navLinks = [
    { name: "Home", href: "#", active: true },
    { name: "About", href: "#about_us" },
    { name: "Service Users", href: "#services_users" },
    { name: "Testimonal", href: "#testimonal" },
  ]

  // Add Dashboard link if logged in
  if (isLoggedIn) {
    navLinks.push({ name: "Dashboard", href: "/admin/dashboard" })
  }

  return (
    <div
      className="header_section"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/banner-bg.png)`,
        backgroundSize: "100% 100%",
        width: "100%",
      }}
    >
      <div className="container">
        <div className="custom_bg">
          <div className="custom_menu">
            {/* Logo - Always on the left */}
            <div className="mobile-logo">
              <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="Logo" style={{ height: "80px" }} />
            </div>

            {/* Desktop Menu - Hidden on mobile */}
            <ul className="d-none d-md-flex flex-wrap mb-0 desktop-menu">
              {navLinks.map((link, index) => (
                <li className="mx-2" key={index}>
                  <a href={link.href} className={link.active ? "active" : ""}>
                    {link.name}
                  </a>
                </li>
              ))}

              {/* Conditionally show Sign In/Sign Out */}
              {isLoggedIn ? (
                <li className="mx-2">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      logout()
                    }}
                  >
                    Sign Out
                  </a>
                </li>
              ) : (
                <li className="mx-2">
                  <a href="/auth/Login">Sign In</a>
                </li>
              )}
            </ul>

            {/* Mobile Menu Button - Visible only on mobile, positioned on the right */}
            <div className="d-md-none mobile-menu-button">
              <Button variant="outline-light" onClick={handleShow} className="mobile-toggle-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 12H21M3 6H21M3 18H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas show={showOffcanvas} onHide={handleClose} placement="start" className="mobile-offcanvas">
        <Offcanvas.Header closeButton className="mobile-offcanvas-header">
          <Offcanvas.Title className="mobile-offcanvas-title">
            <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="Logo" style={{ height: "50px" }} />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="mobile-offcanvas-body">
          <nav className="mobile-nav">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={`mobile-nav-link ${link.active ? "active" : ""}`}
                onClick={handleClose}
              >
                <span className="mobile-nav-icon">
                  {link.name === "Home" && "🏠"}
                  {link.name === "About" && "ℹ️"}
                  {link.name === "Service Users" && "👥"}
                  {link.name === "Testimonal" && "💬"}
                  {link.name === "Dashboard" && "📊"}
                </span>
                <span className="mobile-nav-text">{link.name}</span>
              </a>
            ))}

            {/* Mobile Sign In/Sign Out */}
            <div className="mobile-auth-section">
              {isLoggedIn ? (
                <Button
                  variant="danger"
                  className="mobile-auth-btn sign-out-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    logout()
                    handleClose()
                  }}
                >
                  <span className="mobile-nav-icon">🚪</span>
                  <span>Sign Out</span>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  href="/auth/Login"
                  className="mobile-auth-btn sign-in-btn"
                  onClick={handleClose}
                >
                  <span className="mobile-nav-icon">🔑</span>
                  <span>Sign In</span>
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="mobile-menu-footer">
            <div className="mobile-social-section">
              <p className="mobile-social-title">Follow Us</p>
              <div className="mobile-social-links">
                <a href="#" className="mobile-social-link">
                  📘
                </a>
                <a href="#" className="mobile-social-link">
                  🐦
                </a>
                <a href="#" className="mobile-social-link">
                  📷
                </a>
                <a href="#" className="mobile-social-link">
                  💼
                </a>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <BannerSection />
    </div>
  )
}

const BannerSection = () => {
  const { isLoggedIn } = useAuth()

  useAOS() // Initialize AOS
  return (
    <div className="banner_section layout_padding d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row">
          <div className="col-12 d-flex flex-column justify-content-center align-items-center">
            <div className="dv_logo_con" data-aos="fade-up">
              <img className="dv_logo" src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" />
            </div>
            <h5 className="text-light text-center">🔗 Earn 10$ per 1000 views Fixed CPM India Flag 💸</h5>
            <p className="text-light text-center">
              ⚡ Dvshortylinks.com Was #1 Best Link Shortner In INDIA India Flagand Globally. We Are Offering Highest
              CPM Rates Compare To Other Shortners... 💰
            </p>
            {/* Show login button only when not logged in */}
            {!isLoggedIn && (
              <div className="mt-3">
                <a href="/auth/login" className="btn btn-primary">
                  Create Account
                </a>
              </div>
            )}
            {isLoggedIn && (
              <div className="mt-3">
                <a href="/admin/dashboard" className="btn btn-primary">
                  Dashboard
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const DomainSection = () => {
  useAOS() // Initialize AOS
  return (
    <div className="domain_section">
      <div className="container">
        <div className="domain_box" data-aos="fade-up">
          <div className="domain_rate">
            <ul>
              <li>
                <a href="#">
                  <span style={{ color: "#8b2791" }}></span>https://Dvshortylinks.com/
                </a>
              </li>
            </ul>
          </div>
          <div className="domain_main">
            <Form className="example">
              <Form.Control type="text" placeholder="Your URL Here.." name="Your URL Here.." />
              <Button type="submit">
                GET{" "}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

const AboutSection = () => {
  useAOS() // Initialize AOS
  const aboutItems = [
    {
      icon: "high-cpm.png",
      title: "High CPM",
      text: "Normal CPM is $5 to $15. Depending on your traffic, your CPM will increase.",
    },
    {
      icon: "payments.png",
      title: "Payments On Time",
      text: "You will usually receive payment within 24–48 hours after withdrawal. Holidays may delay this.",
    },
    {
      icon: "referral.png",
      title: "Referral and Earn",
      text: "Refer friends and earn 10% commission for life.",
    },
    {
      icon: "wallet.png",
      title: "All Payment Methods",
      text: "UPI, Paytm Wallet, Bank Transfer, PayPal, and Payeer are supported.",
    },
    {
      icon: "withdraw.png",
      title: "Minimum Withdraw",
      text: "You can withdraw as low as $5.",
    },
    {
      icon: "support.png",
      title: "Support Team",
      text: "24/7 live support via chat, Telegram, Instagram, and support tickets.",
    },
  ]

  return (
    <div className="about_section py-5 bg-light" id="about_us">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Why Choose Us</h2>
          <p className="text-muted">Explore the benefits you get from our platform</p>
        </div>
        <div className="row">
          {aboutItems.map((item, index) => (
            <div
              className="col-md-4 mb-4 d-flex align-items-stretch"
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="card border-0 shadow-lg hover-shadow transition w-100 rounded-4">
                <div className="card-body text-center p-4">
                  <div
                    className="icon-wrapper mb-3 mx-auto rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/${item.icon}`}
                      alt={`icon-${index}`}
                      style={{ width: "40px", height: "40px", objectFit: "contain" }}
                    />
                  </div>
                  <h5 className="fw-semibold">{item.title}</h5>
                  <p className="text-muted small">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const HostingSection = () => {
  return (
    <div
      className="hosting_section layout_padding"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/hosting-bg.png)`,
        backgroundSize: "100% 100%",
        width: "100%",
        float: "left",
        padding: "40px 0px 60px 0px",
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h1 className="hosting_taital">HOW DVSHORTYLINKS WORKS</h1>
            <p className="hosting_text">
              Dvshortylinks is a powerful URL shortening platform that lets you earn money every time someone clicks
              your shortened link. Just create an account, shorten any URL, and share it anywhere online. You'll get
              paid for every visit depending on the user's country.
            </p>
            <div className="click_bt">
              <a href="#">Start Earning</a>
            </div>
          </div>
          <div className="col-md-6">
            <div className="hosting_img">
              <img src={`${process.env.PUBLIC_URL}/images/hosting-img.png`} alt="how-it-works" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AccountSection = () => {
  useAOS() // Initialize AOS
  const pricingPlans = [
    {
      number: "1",
      type: "Create an account",
      img: "create.png",
    },
    {
      number: "2",
      type: "Shorten your link",
      img: "short.png",
    },
    {
      number: "3",
      type: "Earn Money",
      img: "earn.png",
    },
  ]

  return (
    <div className="pricing_section layout_padding">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h1 className="pricing_taital">How You Start</h1>
            <p className="pricing_text">How can you start making money? It's just 3 steps. It's just that easy!</p>
          </div>
        </div>
        <div className="pricing_section_2">
          <div className="row">
            {pricingPlans.map((plan, index) => (
              <div
                className="col-md-4 d-flex justify-content-center"
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="pricing_box text-center shadow p-3 rounded">
                  <h3 className="number_text mb-5">{plan.number}</h3>
                  <img
                    src={`${process.env.PUBLIC_URL}/images/${plan.img}`}
                    className="image_3 mx-auto d-block mb-3"
                    alt={`plan-${index}`}
                  />
                  <h5 className="cloud_text">{plan.type}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const ServicesUsersSection = () => {
  useAOS() // Initialize AOS
  const services = [
    {
      icon1: "mouse.png",
      icon2: "mouse.png",
      title: "1,164,000",
      description: "Total Clicks",
    },
    {
      icon1: "url-icon-primary.png",
      icon2: "url-icon-primary.png",
      title: "3,322,568",
      description: "Total URLs Shortened",
    },
    {
      icon1: "user-icon-primary.png",
      icon2: "user-icon-primary.png",
      title: "1,500+",
      description: "Registered Users",
    },
  ]

  return (
    <div className="services_section layout_padding" id="services_users">
      <div className="container">
        <div className="row">
          <div className="col-md-12" data-aos="fade-up">
            <h1 className="services_taital">Our Service Users</h1>
            <p className="services_text">
              We proudly serve a growing network of users who trust our platform for secure and high-performance URL
              shortening.
            </p>
          </div>
        </div>
        <div className="services_section_2">
          <div className="row" data-aos="fade-up">
            {services.map((service, index) => (
              <div className="col-md-4" key={index}>
                <div className="service_box">
                  <div className="services_icon">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/${service.icon1}`}
                      className="image_1"
                      alt={`icon-${index}-1`}
                    />
                    <img
                      src={`${process.env.PUBLIC_URL}/images/${service.icon2}`}
                      className="image_2"
                      alt={`icon-${index}-2`}
                    />
                  </div>
                  <h3 className="wordpress_text">{service.title}</h3>
                  <p className="opposed_text">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const TestimonialSection = () => {
  useAOS() // Initialize AOS
  return (
    <div className="testimonial_section layout_padding" id="testimonal">
      <div className="container">
        <div className="row" data-aos="fade-up">
          <div className="col-md-12">
            <h1 className="testimonial_taital">Testimonials</h1>
            <p className="testimonial_text">
              Member satisfaction is our major goal. See what our Members are saying about us.
            </p>
            <div className="testimonial_section_2">
              <p className="ipsum_text">
                Highly recommend...!! Best Site to earn money using shorten links. Its pay $5 - $15 per 1000 visit
                accoording to the country. Highly recommend this site, if you try to earn using shorten links.
              </p>
              <div className="quick_img">
                <img src={`${process.env.PUBLIC_URL}/images/quick-icon.png`} alt="quick" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const FooterSection = () => {
  return (
    <div className="footer_section layout_padding text-white">
      <div className="container">
        <div className="row">
          {/* Left: Logo & About */}
          <div className="col-md-3 mb-4">
            <img
              src={`${process.env.PUBLIC_URL}/images/logo.png`}
              alt="Logo"
              style={{ width: "150px", marginBottom: "15px" }}
            />
            <p>
              DVShortyLinks is a trusted URL shortener platform that helps you earn real money for every valid click on
              your links. Start sharing and earning instantly!
            </p>
          </div>
          {/* Center: Useful Links */}
          <div className="col-md-3 mb-4">
            <h5 className="footer_text">Useful Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white">
                  <i className="fas fa-arrow-right me-2"></i> Home
                </a>
              </li>
              <li>
                <a href="#about_us" className="text-white">
                  <i className="fas fa-arrow-right me-2"></i> About
                </a>
              </li>
              <li>
                <a href="#services_users" className="text-white">
                  <i className="fas fa-arrow-right me-2"></i> Service Users
                </a>
              </li>
              <li>
                <a href="#testimonal" className="text-white">
                  <i className="fas fa-arrow-right me-2"></i> Testimonial
                </a>
              </li>
              <li>
                <a href="#" className="text-white">
                  <i className="fas fa-arrow-right me-2"></i> Contact Us
                </a>
              </li>
            </ul>
          </div>
          {/* Right: Address + Payments */}
          <div className="col-md-3 mb-4">
            <h5 className="footer_text">Address</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="fas fa-map-marker-alt me-2"></i> India - DVShortyLinks
              </li>
              <li className="mb-2">
                <i className="fas fa-phone me-2"></i> +91 1234567890
              </li>
              <li className="mb-2">
                <i className="fas fa-envelope me-2"></i> support@dvshortylinks.com
              </li>
            </ul>
          </div>
          {/* Register CTA */}
          <div className="col-md-3 text-center">
            <h5 className="text-white">PAYMENT METHODS:</h5>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <img src={`${process.env.PUBLIC_URL}/images/upi.webp`} alt="UPI" className="payment_footer_icons" />
              <img src={`${process.env.PUBLIC_URL}/images/paytm.webp`} alt="Paytm" className="payment_footer_icons" />
              <img src={`${process.env.PUBLIC_URL}/images/bank.webp`} alt="Bank" className="payment_footer_icons" />
              <img src={`${process.env.PUBLIC_URL}/images/paypal.webp`} alt="PayPal" className="payment_footer_icons" />
            </div>
            <div className="mt-3">
              <h5 className="text-white">Create Your Account</h5>
              <a href="/register" className="btn btn-primary">
                Register
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CopyrightSection = () => {
  const currentYear = new Date().getFullYear()
  return (
    <div className="copyright_section">
      <div className="container">
        <p className="copyright_text">
          <span>Copyright &copy; {currentYear}</span> All Rights Reserved. Designed, Developed & Maintained by{" "}
          <a href="https://www.zorvixetechnologies.com">Zorvixe Technologies</a>.
        </p>
      </div>
    </div>
  )
}

const Index = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <DomainSection />
        <AboutSection />
        <HostingSection />
        <AccountSection />
        <ServicesUsersSection />
        <TestimonialSection />
        <FooterSection />
        <CopyrightSection />
      </div>
    </AuthProvider>
  )
}

export default Index
