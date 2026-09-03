import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Campaigns } from './pages/public/Campaigns';
import { CampaignDetails } from './pages/public/CampaignDetails';
import { Volunteer } from './pages/public/Volunteer';
import { Donate } from './pages/public/Donate';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';
import { NotFound } from './pages/public/NotFound';

// Admin Pages
import { DashboardHome } from './pages/admin/DashboardHome';
import { DonationsManagement } from './pages/admin/DonationsManagement';
import { VolunteerManagement } from './pages/admin/VolunteerManagement';
import { CampaignManagement } from './pages/admin/CampaignManagement';
import { DonorManagement } from './pages/admin/DonorManagement';
import { ReportsAnalytics } from './pages/admin/ReportsAnalytics';
import { Settings } from './pages/admin/Settings';

// Public Layout Wrapper with Navbar & Footer
const PublicLayout = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/campaigns" element={<PublicLayout><Campaigns /></PublicLayout>} />
      <Route path="/campaigns/:id" element={<PublicLayout><CampaignDetails /></PublicLayout>} />
      <Route path="/volunteer" element={<PublicLayout><Volunteer /></PublicLayout>} />
      <Route path="/donate" element={<PublicLayout><Donate /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

      {/* Admin Portal (Protected Routes) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="donations" element={<DonationsManagement />} />
        <Route path="volunteers" element={<VolunteerManagement />} />
        <Route path="campaigns" element={<CampaignManagement />} />
        <Route path="donors" element={<DonorManagement />} />
        <Route path="reports" element={<ReportsAnalytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  );
};

export default App;
