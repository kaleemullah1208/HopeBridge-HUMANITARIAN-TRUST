# GiveHope - NGO Donation & Volunteer Management System

<div align="center">

![GiveHope Banner](https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&h=400&q=80)

**A Modern, Real-Time & Comprehensive Web Application for Non-Profit & Humanitarian Organizations**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Realtime%20Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React Router](https://img.shields.io/badge/React_Router-6.28.0-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Recharts](https://img.shields.io/badge/Recharts-Analytics-22C55E?style=for-the-badge)](https://recharts.org/)
[![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-F59E0B?style=for-the-badge)](https://lucide.dev/)

[Live Demo](http://localhost:3000) • [Public Website](#-public-website-features) • [Admin Console](#-admin-management-console) • [Firebase Setup](#-firebase-configuration) • [Getting Started](#-getting-started)

</div>

---

## 📖 Project Overview

**GiveHope Humanitarian Trust** is a full-featured, responsive, real-time non-profit web platform engineered to bridge the gap between compassionate donors, active volunteers, and vulnerable communities. 

The application is built using **React.js**, **Vite**, **Firebase Authentication**, **Cloud Firestore (with real-time `onSnapshot` listeners)**, and **Recharts**, designed with a modern humanitarian visual language that communicates **Trust, Hope, Compassion, and Professionalism**.

---

## 🌟 Key Features

### 🌐 Public Website & Portals

1. **Home Page (`/`)**:
   - Hero section with humanitarian messaging: *"Together We Can Make a Difference"*.
   - Live impact statistics counters (`18,500+` Lives Impacted, `1,200+` Volunteers, `Rs. 2.8M+` Funds Raised, `50+` Relief Campaigns).
   - Urgent & Featured Campaigns cards with live progress bars and quick donation triggers.
   - **4 Pillars of GiveHope**: Emergency Disaster Relief, Mobile Medical Camps, Child Education & Meals, Solar Water Wells.
   - **Live Supporter Wall**: Real-time ticker of recent contributions.
   - Direct CTA buttons tailored for Donors, Volunteers, and Welfare Help-Seekers.

2. **Beneficiary & Aid Request Portal (`/request-aid` & `/my-aid-requests`)**:
   - **Public Aid Application Form (`/request-aid`)**:
     - Categories: *Medical & Healthcare, Food & Monthly Ration, Education & School Fees, Emergency Financial Relief*.
     - Verification Details: Full Name, Active WhatsApp, CNIC / National ID (`35201-XXXXXXX-X`), Residential Address, Amount Needed (PKR), Statement of Need, and Supporting Document Drive/Proof link.
     - Generates unique tracking Reference ID (`AID-XXXX`).
   - **Beneficiary Case Tracker (`/my-aid-requests`)**:
     - Real-time 4-step progress timeline: `Submitted (1)` ➔ `Under Review & Field Verification (2)` ➔ `Approved & Allocated (3)` ➔ `Disbursed & Settled (4)`.
     - Displays GiveHope administration remarks and disbursal confirmation.

3. **Volunteer Hub & Member Portal (`/volunteer`)**:
   - Interactive application form with multi-select skills, availability schedule, and instant reference ID (`VOL-XXX`).
   - For logged-in verified volunteers, renders the **Active Volunteer Member Hub** with logged service hours, skills badges, and upcoming field operation drives.

4. **Donation Station (`/donate`)**:
   - Multi-step donation experience:
     1. Campaign selection & Giving Frequency (*One-Time* vs *Monthly Recurring*).
     2. Preset Amounts (*Rs. 500, Rs. 1,000, Rs. 2,500, Rs. 5,000, Rs. 10,000, Rs. 25,000, Rs. 50,000, or Custom*).
     3. Donor Information (*Name, Email, Phone, City, Anonymous Donation Toggle, Dedication note*).
     4. Simulated Payment Methods (*JazzCash, EasyPaisa, Debit/Credit Cards, Direct Bank Wire*).
   - Generates an official, printable/downloadable **Tax-Exempt Donation Receipt** with unique Receipt #, Tax ID, and digital verification seal.

5. **Campaigns Catalog & Details (`/campaigns`, `/campaigns/:id`)**:
   - Category and status filters, goal progress trackers, transparent fund breakdown, and direct checkout.

---

### 👥 4 User Roles & Conditional Navigation

The system cleanly bifurcates functionality for four distinct user personas:
- **Donor**: Direct access to donate funds, explore campaigns, and generate tax receipts.
- **Volunteer**: Navbar switches to "Volunteer Drives", application form intelligently switches to active Field Hub with service hours.
- **Beneficiary (Needy / Help-Seeker)**: Dedicated "Request Aid" and "My Aid Status" links, direct case tracker.
- **Admin**: Full administrative console with real-time Firestore synchronization.

---

### 🛡️ Admin Management Console (`/admin`)

- **Dashboard Home (`/admin`)**:
  - **7 Real-Time KPI Stat Cards** + **Secondary Operational Metrics Bar** with live pending Aid Requests and Volunteer counters.
  - Live activity audit feed.
- **Beneficiary Aid Requests Desk (`/admin/aid-requests`)**:
  - Real-time Cloud Firestore ledger (`subscribeAidRequests`).
  - Search by Name, CNIC, Phone, City, or category.
  - Review Modal: Inspect verified documents, update case status (`Pending`, `Under Review`, `Approved`, `Disbursed`, `Rejected`), and append administrator notes.
  - 1-click CSV Export.
- **Donation Ledger (`/admin/donations`)**:
  - Real-time donation tracking with receipt modals, filters, and offline donation logging.
- **Volunteer Management (`/admin/volunteers`)**:
  - Review pending applications, approve/reject volunteers, and assign to specific relief campaigns.
- **Campaigns & Projects (`/admin/campaigns`)**:
  - Create and edit relief campaigns with goals, deadlines, and featured status toggles.
- **Donor Directory (`/admin/donors`) & Reports (`/admin/reports`)**:
  - Donor lifetime giving metrics and statistical analytics charts.

---

### 🔒 Firebase Security Rules (`firestore.rules`)

Production-ready Cloud Firestore security rules guaranteeing data isolation:
- `users`: Authenticated owner read/update; Admin full control.
- `aid_requests`: Applicants read their own cases; public create; Admin full update/delete/disbursal.
- `donations`: Donors read their contributions; public create; Admin manage.
- `volunteers`: Volunteers read their own profiles; Admin approve/assign.
- `campaigns`, `activities`, `settings`: Public read; Admin write.
  - **Real-Time Visualizations**: Recharts Area Chart for monthly inflow trends vs target, and Donut Chart for cause allocation.
  - **Live Ledger Entries Table**: Real-time entries with instant receipt viewer.
  - **Pending Volunteer Review Desk**: Quick review with 1-click Approve / Reject actions that immediately update the database without page reload.
- **Donation Ledger (`/admin/donations`)**:
  - Live Firestore stream of all donor contributions.
  - Search by Donor, Email, Transaction ID, or Campaign.
  - Multi-filtering by Status (*Completed, Pending, Failed*), Campaign, and Payment Method.
  - **"Record Offline Donation"** modal for logging cash/cheque contributions.
  - **"Export CSV"** button for generating spreadsheet ledger reports.
  - Instant Official Receipt modal with Print & Download support.
- **Volunteer Management (`/admin/volunteers`)**:
  - Real-time application updates and status tabs: *All Applications, Pending Review, Approved & Active, Rejected*.
  - Search and filter by interest area.
  - Detailed Volunteer Profile Modal showing full application, skills, motivation, and assigned campaign dropdown.
  - Instant Approve/Reject actions with live count updates and CSV directory export.
- **Campaign Management (`/admin/campaigns`)**:
  - Live target progress tracking and donor count synchronization.
  - Grid View & Table View toggles.
  - **"Create New Campaign"** modal with category, target goal, dates, location, beneficiaries count, and description.
  - **"Edit Campaign"** modal for live updates.
  - **"Delete Campaign"** with confirmation dialog.
- **Donor Directory & CRM (`/admin/donors`)**:
  - Real-time aggregated Donor table with Lifetime Total Donated, donation count, last gift date, and **Donor Tier Badges** (*Platinum Champion, Gold Benefactor, Silver Supporter, Bronze Friend*).
  - **Donor Profile Modal** displaying all historical contributions made by that specific donor.
  - CSV export.
- **Audit Reports & Analytics (`/admin/reports`)**:
  - Financial summary cards, monthly collection bar charts, and donor/volunteer growth line charts.
  - Printable Audited Financial Statements Summary.
  - Timeframe selector (*Last 30 Days, Last 6 Months, Fiscal Year 2026, All-Time*).
- **Settings & Demo Maintenance (`/admin/settings`)**:
  - Organization legal details & tax registration parameters.
  - Administrator profile and password update simulator.
  - Notification routing toggles.
  - Payment gateway simulator config.
  - **"Reset Demo Data"** button to restore initial clean sample records anytime.

---

## 💻 Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Library** | [React.js 18](https://react.dev/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Routing** | [React Router DOM v6](https://reactrouter.com/) |
| **Authentication** | [Firebase Authentication](https://firebase.google.com/docs/auth) (Google & Email/Password) |
| **Real-Time Database** | [Cloud Firestore `onSnapshot` Streams](https://firebase.google.com/docs/firestore) |
| **Charts & Data Viz** | [Recharts 2](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Styling** | Custom Responsive CSS Design System (CSS Tokens, Shimmer Animations, Micro-interactions) |
| **Feedback & UX** | Custom Skeletons, Button Loaders, Pulse Emblem & Canvas Confetti |

---

## 📁 Project Structure

```
src/
├── components/
│   └── common/
│       ├── Badge.jsx                 # Status & tier badges
│       ├── Button.jsx                # Reusable button styles
│       ├── ButtonLoader.jsx          # Button spinner for pending async actions
│       ├── DonationReceiptModal.jsx  # Printable official tax receipt modal
│       ├── ErrorState.jsx            # Error state card with retry action
│       ├── Footer.jsx                # Humanitarian footer with trust badges
│       ├── Loader.jsx                # GiveHope branded pulsing emblem loader
│       ├── Modal.jsx                 # Accessible dialog overlay
│       ├── Navbar.jsx                # Sticky glassmorphic navbar & drawer
│       ├── PageLoader.jsx            # Page/section level loader
│       ├── ProgressBar.jsx           # Calculated progress tracker
│       ├── ProtectedRoute.jsx        # Admin route guard
│       ├── SkeletonCard.jsx          # Shimmer card placeholder
│       ├── SkeletonTable.jsx         # Shimmer table rows placeholder
│       ├── StatCard.jsx              # Executive KPI cards
│       └── ToastContainer.jsx        # Global notifications UI
├── context/
│   ├── AuthContext.jsx               # Firebase Auth & role state provider
│   └── ToastContext.jsx              # Toast notification provider
├── data/
│   └── mockData.js                   # Comprehensive seed data
├── firebase/
│   └── config.js                     # Firebase app & Firestore initialization
├── layouts/
│   └── AdminLayout.jsx               # Collapsible dashboard sidebar & topbar
├── pages/
│   ├── admin/
│   │   ├── CampaignManagement.jsx    # Campaign CRUD & status toggles
│   │   ├── DashboardHome.jsx         # 7 KPI stat cards, live activity & Recharts
│   │   ├── DonationsManagement.jsx   # Real-time ledger, offline entries & CSV export
│   │   ├── DonorManagement.jsx       # Real-time donor CRM & giving history
│   │   ├── ReportsAnalytics.jsx      # Audit reports & analytics
│   │   ├── Settings.jsx              # Org config & demo reset
│   │   └── VolunteerManagement.jsx   # Real-time volunteer review & approval workflow
│   └── public/
│       ├── About.jsx                 # Mission, values, team & milestones
│       ├── CampaignDetails.jsx       # Real-time mission story & quick donate widget
│       ├── Campaigns.jsx             # Real-time searchable campaigns catalog
│       ├── Contact.jsx               # Inquiries form, helpline & FAQ
│       ├── Donate.jsx                # Multi-step checkout & receipt generator
│       ├── Home.jsx                  # Landing page with hero & 4 pillars
│       ├── Login.jsx                 # Firebase Auth & Google Sign-In
│       ├── NotFound.jsx              # 404 page
│       ├── Register.jsx              # Account creation with role selection
│       └── Volunteer.jsx             # Volunteer portal & application form
├── services/
│   ├── activityService.js            # Real-time activity feed & event logger
│   ├── authService.js                # Firebase Auth & Google login methods
│   ├── campaignService.js            # Real-time campaign sync & Firestore updates
│   ├── donationService.js            # Real-time donations stream & dynamic KPI calculations
│   ├── donorService.js               # Real-time donor CRM & tier metrics
│   ├── reportService.js              # Aggregations & CSV export utilities
│   ├── settingsService.js            # System settings & reset methods
│   ├── storageService.js             # Local cache & fallback persistence layer
│   └── volunteerService.js           # Real-time volunteer applications workflow
├── App.jsx                           # Route declarations
├── index.css                         # Design system, shimmer & print stylesheets
└── main.jsx                          # Root DOM mount
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/kaleemullah1208/HopeBridge-HUMANITARIAN-TRUST.git
   cd HopeBridge-HUMANITARIAN-TRUST
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@gmail.com` | `admin123` | Full Access to `/admin` Console |
| **Donor** | `donor@example.com` | `donor123` | Public Portal & Donations |
| **Volunteer** | `volunteer@example.com` | `vol123` | Volunteer Portal & Applications |

*(Google Sign-In is also available for instant authentication on `/login` and `/register`)*

---

## 📄 License & Humanitarian Disclaimer

This project is created for non-profit and humanitarian management purposes. All rights reserved by **GiveHope Humanitarian Trust**.
