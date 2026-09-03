# HopeBridge - NGO Donation & Volunteer Management System

<div align="center">

![HopeBridge Logo](https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&h=400&q=80)

**A Modern, Professional & Comprehensive Web Application for Non-Profit & Humanitarian Organizations**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React Router](https://img.shields.io/badge/React_Router-6.28.0-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Recharts](https://img.shields.io/badge/Recharts-Analytics-22C55E?style=for-the-badge)](https://recharts.org/)
[![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-F59E0B?style=for-the-badge)](https://lucide.dev/)

[Live Demo](http://localhost:3000) • [Public Website](#-public-website-features) • [Admin Console](#-admin-management-console) • [Firebase Setup](#-firebase-configuration) • [Getting Started](#-getting-started)

</div>

---

## 📖 Project Overview

**HopeBridge Humanitarian Welfare Trust** is a full-featured, responsive non-profit web platform engineered to bridge the gap between compassionate donors, active volunteers, and vulnerable communities. 

The application is built using **React.js**, **Vite**, **Firebase Authentication**, **Cloud Firestore**, and **Recharts**, designed with a modern humanitarian visual language that communicates **Trust, Hope, Compassion, and Professionalism**.

---

## 🌟 Key Features

### 🌐 Public Website

1. **Home Page (`/`)**:
   - Hero section with humanitarian messaging: *"Together We Can Make a Difference"*.
   - Live impact statistics counters (`18,500+` Lives Impacted, `1,200+` Volunteers, `Rs. 2.8M+` Funds Raised, `50+` Relief Campaigns).
   - Urgent & Featured Campaigns cards with live progress bars and quick donation triggers.
   - **4 Pillars of HopeBridge**: Emergency Disaster Relief, Mobile Medical Camps, Child Education & Meals, Solar Water Wells.
   - **Live Supporter Wall**: Real-time ticker of recent contributions.
   - Interactive Volunteer callout banner.

2. **About Us Page (`/about`)**:
   - Mission, Vision, and 4 Core Values (*100% Transparency, Human Dignity First, Rapid Emergency Action, Sustainable Impact*).
   - **Financial Stewardship & Audit Ratios**: 91% Direct Program Aid, 5% Logistics & Transport, 4% Admin & Audit.
   - Legal certifications: Govt Punjab Non-Profit Reg `PB/2021/9842`, FBR Income Tax Ordinance Sec. 61 & 2(36) Tax-Deductible, Sharia Zakat Compliant.
   - Executive Leadership & Field Coordinators directory.
   - Historical milestone timeline from 2021 inception to 2026 expansion.

3. **Campaigns Catalog (`/campaigns`)**:
   - Category filtering (*Disaster Relief, Education, Healthcare, Seasonal Relief, Infrastructure, Food Security*).
   - Status filtering (*All, Urgent Appeals Only, Active, Completed*).
   - Live search input & sorting (*Most Urgent, Highest Raised, Highest Goal*).
   - Rich interactive campaign cards with donor count badges, locations, and progress tracking.

4. **Campaign Details (`/campaigns/:id`)**:
   - Hero banner, location, beneficiaries count, and countdown timeline.
   - Full narrative with humanitarian field story.
   - Transparent fund allocation percentage breakdown.
   - Live campaign donor wall.
   - Sticky Quick Donation Widget with presets (Rs. 1,000 – 50,000 + Custom) and direct checkout.
   - Share button with clipboard copy toast.

5. **Volunteer Portal (`/volunteer`)**:
   - Benefits of volunteering, field roles, and verified hours certification.
   - Multi-field interactive application form with multi-select skills, availability schedule, experience, motivation statement, and validation.
   - Confetti feedback and instant reference ID (`VOL-XXX`) generation.

6. **Donation Station (`/donate`)**:
   - Multi-step donation experience:
     1. Campaign selection & Giving Frequency (*One-Time* vs *Monthly Recurring*).
     2. Preset Amounts (*Rs. 500, Rs. 1,000, Rs. 2,500, Rs. 5,000, Rs. 10,000, Rs. 25,000, Rs. 50,000, or Custom*).
     3. Donor Information (*Name, Email, Phone, City, Anonymous Donation Toggle, Dedication note*).
     4. Simulated Payment Methods (*JazzCash, EasyPaisa, Debit/Credit Cards, Direct Bank Wire*).
   - Generates an official, printable/downloadable **Tax-Exempt Donation Receipt** with unique Receipt #, Tax ID, and digital verification seal.

7. **Contact Us Page (`/contact`)**:
   - Department-specific inquiry form (*General, Donations, Volunteers, Corporate CSR, Emergency Relief*).
   - 24/7 Helpline `+92 (42) 3588-4422`, WhatsApp Hotline, and regional hubs directory.
   - Interactive FAQ accordion for Zakat eligibility, tax rebates, and corporate partnerships.

---

### 🔐 Authentication & Access Control

- **Firebase Authentication**:
  - **Google Sign-In** via popup (`signInWithPopup` with `GoogleAuthProvider`) for seamless 1-click access.
  - **Email & Password Authentication** with full validation, password strength requirements, and friendly error message translations.
- **Admin Access**:
  - **Admin Email**: `admin@gmail.com` (or `admin@ngo.org`)
  - **Admin Password**: `admin123`
  - 1-click **Autofill** button on the login screen for instant demo testing.
  - Full route protection via [`ProtectedRoute.jsx`](file:///d:/Full%20stack/Projects/NGO%20Donation%20&%20Volunteer%20Management/src/components/common/ProtectedRoute.jsx).

---

### 🛡️ Admin Management Console (`/admin`)

- **Dashboard Home (`/admin`)**:
  - 4 Key Metric Stat Cards (Total Raised, Completed Donations, Registered Volunteers, Active Campaigns).
  - Recharts Visualizations (Area Chart for monthly inflow trends vs target, Donut Chart for cause allocation).
  - Recent Ledger Entries table with instant receipt viewer.
  - Pending Volunteer Applications quick-review widget with 1-click Approve / Reject actions.
- **Donation Ledger (`/admin/donations`)**:
  - Search by Donor, Email, Transaction ID, or Campaign.
  - Multi-filtering by Status (*Completed, Pending, Failed*), Campaign, and Payment Method.
  - **"Record Offline Donation"** modal for logging cash/cheque contributions.
  - **"Export CSV"** button for generating spreadsheet ledger reports.
  - Instant Official Receipt modal with Print & Download support.
- **Volunteer Management (`/admin/volunteers`)**:
  - Status tabs: *All Applications, Pending Review, Approved & Active, Rejected*.
  - Search and filter by interest area.
  - Detailed Volunteer Profile Modal showing full application, skills, motivation, and assigned campaign dropdown.
  - Instant Approve/Reject actions and CSV directory export.
- **Campaign Management (`/admin/campaigns`)**:
  - Grid View & Table View toggles.
  - **"Create New Campaign"** modal with category, target goal, dates, location, beneficiaries count, and description.
  - **"Edit Campaign"** modal for live updates.
  - **"Delete Campaign"** with confirmation dialog.
- **Donor Directory & CRM (`/admin/donors`)**:
  - Donor table with Lifetime Total Donated, donation count, last gift date, and **Donor Tier Badges** (*Platinum Champion, Gold Benefactor, Silver Supporter, Bronze Friend*).
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
| **Database** | [Cloud Firestore](https://firebase.google.com/docs/firestore) |
| **Charts & Data Viz** | [Recharts 2](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Styling** | Custom Responsive CSS Design System (CSS Tokens, Glassmorphism, Micro-animations) |
| **Micro-Interactions** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |

---

## 📁 Project Structure

```
src/
├── components/
│   └── common/
│       ├── Badge.jsx                 # Status & tier badges
│       ├── Button.jsx                # Reusable button styles
│       ├── DonationReceiptModal.jsx  # Printable official tax receipt modal
│       ├── Footer.jsx                # Humanitarian footer with trust badges
│       ├── Modal.jsx                 # Accessible dialog overlay
│       ├── Navbar.jsx                # Sticky glassmorphic navbar & drawer
│       ├── ProgressBar.jsx           # Calculated progress tracker
│       ├── ProtectedRoute.jsx        # Admin route guard
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
│   │   ├── DashboardHome.jsx         # Executive overview & Recharts
│   │   ├── DonationsManagement.jsx   # Ledger, offline entries & CSV export
│   │   ├── DonorManagement.jsx       # Donor CRM & giving history
│   │   ├── ReportsAnalytics.jsx      # Audit reports & analytics
│   │   ├── Settings.jsx              # Org config & demo reset
│   │   └── VolunteerManagement.jsx   # Volunteer review & approval workflow
│   └── public/
│       ├── About.jsx                 # Mission, values, team & milestones
│       ├── CampaignDetails.jsx       # Mission story & quick donate widget
│       ├── Campaigns.jsx             # Searchable campaigns catalog
│       ├── Contact.jsx               # Inquiries form, helpline & FAQ
│       ├── Donate.jsx                # Multi-step checkout & receipt generator
│       ├── Home.jsx                  # Landing page with hero & 4 pillars
│       ├── Login.jsx                 # Firebase Auth & Google Sign-In
│       ├── NotFound.jsx              # 404 page
│       ├── Register.jsx              # Account creation with role selection
│       └── Volunteer.jsx             # Volunteer portal & application form
├── services/
│   ├── authService.js                # Firebase Auth & Google login methods
│   ├── campaignService.js            # Campaign operations & Firestore sync
│   ├── donationService.js            # Donations recording & stats
│   ├── donorService.js               # Donor CRM methods
│   ├── reportService.js              # Aggregations & CSV export utilities
│   ├── settingsService.js            # System settings & reset methods
│   ├── storageService.js             # Local cache & persistence layer
│   └── volunteerService.js           # Volunteer application workflow
├── App.jsx                           # Route declarations
├── index.css                         # Design system & print stylesheets
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

This project is created for non-profit and humanitarian management purposes. All rights reserved by **HopeBridge Humanitarian Welfare Trust**.
