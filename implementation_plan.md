# Implementation Plan - NGO Donation & Volunteer Management System

Build a complete, modern, professional, and fully responsive web application called **“NGO Donation & Volunteer Management System”** using **React.js**, **React Router**, **Lucide React**, **Recharts**, and a clean service architecture with local storage persistence.

## User Review Required

> [!IMPORTANT]
> **No Firebase integration is performed in this phase**, as requested. All data operations are abstracted into modular service modules (`services/authService.js`, `services/campaignService.js`, `services/donationService.js`, `services/volunteerService.js`, `services/userService.js`, `services/donorService.js`, `services/reportService.js`) using local storage and comprehensive mock datasets. This ensures a 100% plug-and-play transition to Firebase Authentication and Cloud Firestore later with zero UI refactoring.

## Architectural Design

### 1. Technology & Design System
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM (v6/v7) with nested routes, layout wrappers, and protected admin routes.
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Donation Trends, Category Distribution, Volunteer Growth, Campaign Progress)
- **Styling**: Modern, custom CSS design system with CSS tokens, responsive flex/grid layouts, glassmorphism headers, humanitarian color palette:
  - Primary Brand: Emerald / Deep Teal (`#0D9488` / `#059669`)
  - Accent / Warmth: Golden Amber (`#F59E0B`)
  - Trust / Corporate: Slate Navy (`#0F172A` / `#1E293B`)
  - Neutral / Canvas: Soft Warm Gray / Off-white (`#F8FAFC`, `#FFFFFF`, `#F1F5F9`)
  - Status Indicators: Emerald (Active/Completed/Approved), Amber (Pending/Urgent), Rose (Failed/Rejected)
- **State & Persistence**:
  - `AuthContext`: Manages current authenticated user session (Admin vs Donor vs Volunteer vs Guest) with persistent local storage.
  - `ToastContext`: Global custom toast notification system for instant user feedback across actions (donations, approvals, campaign updates).
  - Local Storage Data Stores: Initialize realistic seed data for Campaigns, Donations, Volunteers, Donors, and Users if none exist, allowing full in-browser CRUD and state changes during demonstrations.

---

## Page Structure & Features

```
Public Website
├── /                     -> Home Page (Hero, Live Impact Stats, Featured Campaigns, 4 Pillars of Impact, Live Donation Ticker, Testimonials, CTAs)
├── /about                -> About Page (Mission, Vision, Story Timeline, Values, Leadership & Team, Financial Transparency Breakdown)
├── /campaigns            -> Campaigns Catalog (Search, Category Filters, Urgent Badges, Progress Bars, Direct Donate Trigger)
├── /campaigns/:id        -> Campaign Detail (Hero Banner, Narrative, Fund Allocation Breakdown, Live Campaign Donors, Quick Donation Widget)
├── /volunteer            -> Volunteer Portal (Benefits, Roles, Onboarding steps, Interactive Volunteer Application Form with Validation)
├── /donate               -> Donation Page (Multi-step flow: Campaign selection, Presets Rs.500-10000 + Custom, Payment Method Simulation, Printable Tax Receipt Generation)
├── /contact              -> Contact Page (Direct Inquiry Form, NGO Contact Cards, Emergency Relief Helpline, FAQs, Map Mockup)
├── /login                -> Authentication (Email/Password, Quick Demo Switcher: Admin / Donor / Volunteer)
└── /register             -> Account Registration (Role choice, validation, instant session setup)

Admin Portal (Protected Routes under /admin)
├── /admin                -> Admin Dashboard (KPI Stat Cards, Recharts Analytics, Recent Activity, Pending Volunteer Quick-Approval Widget)
├── /admin/donations      -> Donation Management (Search, Filters, Sort, View Receipt Modal, Manual Donation Entry, CSV Export)
├── /admin/volunteers     -> Volunteer Management (Status Tabs: All/Pending/Approved/Rejected, Profile & Skill Detail Modal, Status Workflow)
├── /admin/campaigns      -> Campaign Management (Grid/Table view, Create Campaign Modal, Edit Campaign Modal, Delete with Confirm)
├── /admin/donors         -> Donor Directory (Lifetime Value, Donor Tier Badges, Historical Donation Modal)
├── /admin/reports        -> Financial & Volunteer Reports (Export CSV, Print Summary, Date Range Filter, ROI & Retention Charts)
└── /admin/settings       -> NGO Settings (Org profile, Admin account, Payment Gateway Config, Reset Demo Data)
```

---

## Proposed Changes

### Configuration & Tooling
- Initialize modern Vite + React project.
- Configure `package.json` with dependencies (`react`, `react-dom`, `react-router-dom`, `lucide-react`, `recharts`, `canvas-confetti`).
- Setup standard index HTML with Google Fonts (`Inter`, `Plus Jakarta Sans`).

### Data & Services Layer (`src/data/`, `src/services/`)
- `src/data/mockData.js`: Comprehensive, realistic initial dataset containing:
  - 6+ Campaigns (Flood Relief, Child Education, Winter Clothes, Emergency Medical Aid, Clean Water Project, Hunger Relief)
  - 15+ Detailed Donation transactions
  - 10+ Volunteer Applications with realistic skills, availability, and statuses
  - 8+ Donors with tier classifications and total contribution stats
  - Seed admin and user credentials
  - Impact analytics history (monthly records for charts)
- `src/services/storageService.js`: Generic local storage persistence layer with automated seed data initialization and reset utility.
- `src/services/authService.js`: Interface for login, register, logout, get current user, switch roles.
- `src/services/campaignService.js`: CRUD for campaigns, progress recalculations, fund allocation tracking.
- `src/services/donationService.js`: CRUD for donations, receipt generation, stats aggregation.
- `src/services/volunteerService.js`: Application submissions, status transitions (Pending -> Approved / Rejected), notes.
- `src/services/donorService.js`: Donor records and transaction linking.
- `src/services/reportService.js`: CSV export generator, financial aggregation, retention analytics.
- `src/services/settingsService.js`: NGO organization profile and system preferences.

### Contexts & Hooks (`src/context/`)
- `src/context/AuthContext.jsx`: Authentication provider with quick demo login buttons, role checking (`isAdmin`).
- `src/context/ToastContext.jsx`: Lightweight toast notification provider with success, error, info, and warning alerts.

### Reusable UI Components (`src/components/common/`)
- `Navbar.jsx`: Sticky glassmorphic navbar with mobile responsive drawer, active route indicators, quick CTA buttons.
- `Footer.jsx`: Comprehensive NGO footer with mission, quick links, trust badges, newsletter signup.
- `Modal.jsx`: Accessible modal dialog with backdrop blur, keyboard dismiss, and smooth animations.
- `Card.jsx` & `StatCard.jsx`: Reusable KPI cards with trends, icons, and gradients.
- `ProgressBar.jsx`: Animated, colored progress bar with percentage indicator.
- `Badge.jsx`: Status badge (Pending, Approved, Completed, Urgent, etc.).
- `Button.jsx`: Primary, secondary, outline, danger, and icon button variants with loading state.
- `Table.jsx` & `Pagination.jsx`: Clean data table component with sorting, empty states, and pagination controls.
- `DonationReceiptModal.jsx`: Professional, printable donation receipt with transaction ID, tax exemption note, NGO stamp, and download/print trigger.

### Public Pages (`src/pages/public/`)
- `Home.jsx`: Engaging humanitarian landing page.
- `About.jsx`: Rich NGO background, leadership team, financial transparency audit cards.
- `Campaigns.jsx`: Browse and filter campaigns.
- `CampaignDetails.jsx`: In-depth campaign story, donor wall, direct donation.
- `Volunteer.jsx`: Volunteer appeal, perks, and interactive application form.
- `Donate.jsx`: Dedicated donation station with amount presets, payment simulation, and instant receipt.
- `Contact.jsx`: Interactive contact form, office locations, emergency contacts, FAQ accordion.
- `Login.jsx` & `Register.jsx`: Clean authentication with 1-click demo role switcher.

### Admin Dashboard Pages (`src/pages/admin/`)
- `AdminLayout.jsx`: Responsive layout with collapsible sidebar, dynamic header, notification dropdown, and mobile menu.
- `DashboardHome.jsx`: Executive summary, Recharts visualizations, quick-action widgets.
- `DonationsManagement.jsx`: Complete donation table with filters, search, manual donation modal, receipt viewer, CSV export.
- `VolunteerManagement.jsx`: Volunteer applications workflow, status approvals, skill review modal.
- `CampaignManagement.jsx`: Campaign CRUD, modal forms, status toggles.
- `DonorManagement.jsx`: Donor CRM with giving history and tier badges.
- `ReportsAnalytics.jsx`: Comprehensive analytics, date filters, printable reports.
- `Settings.jsx`: NGO settings, admin profile, payment gateway simulator, demo data reset.

---

## Verification Plan

### Automated & Build Checks
1. `npm run build`: Verify that the entire project compiles with 0 TypeScript/JSX errors and clean bundles.
2. `npm run lint` / code inspection: Verify all imports, routes, and hooks are correct.

### Manual Functional Testing
1. **Public Site Flows**:
   - Navigate to Home, About, Campaigns, Campaign Details, Volunteer, Donate, Contact.
   - Test submitting a Volunteer application: Verify validation, form submit, toast alert, and data appearing in the Admin volunteer dashboard.
   - Test making a Donation: Choose Rs. 5,000, select JazzCash or Card, submit, verify successful receipt generation modal, and verify campaign progress bar increases!
   - Test Contact Form: Submit and verify feedback.
2. **Authentication Flow**:
   - Click "Login as Admin" demo button: Instantly logs in as Admin and redirects to `/admin`.
   - Test "Login as Donor" and role restrictions.
   - Test Logout.
3. **Admin Dashboard Flow**:
   - Verify all 5 KPI cards compute values dynamically from mock database.
   - Check all Recharts charts (Area chart, Bar chart, Pie chart, Line chart).
   - In **Campaign Management**: Add a new campaign, edit an existing one, delete a campaign.
   - In **Volunteer Management**: View a pending application, click "Approve", verify badge changes to Approved and counter updates.
   - In **Donation Management**: Search by donor name, filter by status, click "View Receipt", click "Export to CSV".
   - In **Settings**: Update NGO name or click "Reset Demo Data" to test store refresh.
4. **Responsive Testing**:
   - Test mobile viewport (hamburger menu opens, tables scroll or display cleanly, dashboard sidebar collapses to mobile drawer).
