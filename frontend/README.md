🚀 DVShortyLinks – Monetized URL Shortener

DVShortyLinks is a powerful URL shortening platform that lets users earn money for every click on their shortened links.
It includes full user-facing features (registration, authentication, link management, earnings tracking) and a complete admin management system (users, withdrawals, announcements, CPM rates, and analytics).

✨ Features
🔗 User Features

Register/Login with JWT Authentication.

Social login via Google, Facebook, LinkedIn
.

Generate shortened links with custom aliases and optional password protection.

Track click analytics: country, device, browser, referrer, and unique clicks
.

Earn money based on geo-based CPM rates (India, US, UK, etc.).

Referral system: Earn 10% lifetime commission from invited users.

Withdraw funds with support for UPI, PayPal, Payeer, Bank, Paytm Wallet
.

Dashboard to track earnings, referrals, and link performance.

🛠 Admin Features

Admin authentication with dedicated JWT & session system
.

Manage users: view, search, activate/deactivate accounts.

Manage withdrawals: approve/reject and track history.

Manage announcements: create, update, delete.

Manage links & clicks: search, delete, analyze.

Manage CPM rates per country with bulk update & caching.

Dashboard overview: total users, active users, clicks, earnings, pending withdrawals.

🎨 Frontend

Built with React + Bootstrap 5
.

Fully responsive UI with mobile off-canvas navigation.

Sections:

Hero Banner with login/signup

"Why Choose Us" (High CPM, Timely Payments, Referral Program, etc.)

"How It Works" with 3-step guide

Stats counters (Clicks, Users, URLs shortened)

Testimonials

Footer with links & contact

Auth Context handles login/logout with tokens stored in localStorage.

⚙️ Tech Stack
Backend

Node.js + Express.js

PostgreSQL with advanced schema (users, links, clicks, referrals, admins, announcements, withdrawals, CPM rates).

Passport.js for Google, Facebook, LinkedIn OAuth.

JWT for secure API authentication.

Helmet, CORS, Rate Limiting for security
.

Winston for logging.

Telegram Bot Integration for notifications
.

Frontend

React.js (functional components, hooks).

React-Bootstrap for UI components.

AOS animations for smooth scroll effects.

Custom CSS for branding.

📦 Installation & Setup
Prerequisites

Node.js (>= 16)

PostgreSQL database

npm or yarn

Backend Setup
cd backend
npm install


Create a .env file:

PORT=5000
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
JWT_SECRET=your-secret
SESSION_SECRET=your-session-secret

GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

FACEBOOK_APP_ID=xxxx
FACEBOOK_APP_SECRET=xxxx
FACEBOOK_CALLBACK_URL=http://localhost:5000/auth/facebook/callback

LINKEDIN_CLIENT_ID=xxxx
LINKEDIN_CLIENT_SECRET=xxxx
LINKEDIN_CALLBACK_URL=http://localhost:5000/auth/linkedin/callback

FRONTEND_URL=http://localhost:3000
TELEGRAM_BOT_TOKEN=xxxx


Start backend:

npm start


The database will auto-initialize tables for users, links, clicks, withdrawals, announcements, admins, CPM rates, etc.

Frontend Setup
cd frontend
npm install
npm start


Runs at http://localhost:3000

Connects to backend APIs via .env or proxy.

📊 Database Schema (Highlights)

users → user accounts, referrals, balances.

links → original + shortened links, clicks, earnings.

clicks → tracks geo, device, referrer, earnings.

withdrawals → stores payout requests.

announcements → admin notices for users.

admins → separate table for admin accounts
.

cpm_rates → earnings per country with update triggers.

referral_earnings → commissions tracking.

🔐 API Routes (Examples)
User

POST /api/register → Register new user.

POST /api/login → User login.

POST /api/shorten → Create short link.

GET /api/links → Fetch user links.

POST /api/withdraw → Request withdrawal.

Admin

POST /api/admin/login → Admin login.

GET /api/admin/dashboard/overview → Admin stats.

GET /api/admin/users → Manage users.

GET /api/admin/withdrawals → Manage withdrawals.

POST /api/admin/announcements → Create announcement.

GET /api/admin/cpm-rates → View CPM rates.

📸 Screenshots (suggested to add later)

User Dashboard

Admin Dashboard

Shorten Link Form

Withdraw Page

🤝 Contributing

Fork the repo

Create your feature branch (git checkout -b feature/new-feature)

Commit changes (git commit -m "Add feature")

Push branch (git push origin feature/new-feature)

Open a Pull Request

📄 License

MIT License – free to use and modify.