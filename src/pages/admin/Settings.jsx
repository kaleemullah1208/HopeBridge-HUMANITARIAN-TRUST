import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Settings as SettingsIcon, 
  Building2, 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const Settings = () => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [settings, setSettings] = useState(null);
  const [adminProfile, setAdminProfile] = useState({
    name: currentUser?.name || 'Ihsan Ullah',
    email: currentUser?.email || 'admin@ngo.org',
    phone: currentUser?.phone || '+92 300 1234567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [savingSettings, setSavingSettings] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const unsub = settingsService.subscribeSettings((data) => {
      setSettings(data);
    });
    return () => unsub();
  }, []);

  const handleSaveOrgSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    const res = await settingsService.updateSettings(settings);
    setSavingSettings(false);
    if (res.success) {
      showToast('Settings Saved', 'NGO Organization Profile updated successfully.', 'success');
    }
  };

  const handleSaveAdminProfile = async (e) => {
    e.preventDefault();
    if (adminProfile.newPassword && adminProfile.newPassword !== adminProfile.confirmPassword) {
      showToast('Password Mismatch', 'New passwords do not match.', 'error');
      return;
    }

    setSavingProfile(true);
    const res = await updateProfile({
      name: adminProfile.name,
      email: adminProfile.email,
      phone: adminProfile.phone
    });
    setSavingProfile(false);

    if (res.success) {
      showToast('Profile Updated', 'Admin credentials updated successfully.', 'success');
      setAdminProfile((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    }
  };

  const handleResetData = async () => {
    if (window.confirm('⚠️ WARNING: This will reset all campaigns, donations, volunteers, and donors back to the initial demo seed data. Do you want to proceed?')) {
      setResetting(true);
      await settingsService.resetSystemData();
      setResetting(false);
      showToast('System Reset Complete', 'All demo records have been restored to initial defaults.', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  if (!settings) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px' }}>
      {/* Top Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--navy)' }}>System Settings & Preferences</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Manage NGO organizational credentials, notification routing, gateway parameters, and demo sandbox.
        </p>
      </div>

      {/* 1. NGO Organization Details */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={20} color="var(--primary)" />
          NGO Organization Profile & Legal Identifiers
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          These details are automatically printed on official donation receipts and tax exemption certificates.
        </p>

        <form onSubmit={handleSaveOrgSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Official Trust Legal Name</label>
              <input
                type="text"
                value={settings.orgName}
                onChange={(e) => setSettings({ ...settings, orgName: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Brand / Short Name</label>
              <input
                type="text"
                value={settings.shortName}
                onChange={(e) => setSettings({ ...settings, shortName: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Govt Registration Number</label>
              <input
                type="text"
                value={settings.registrationNumber}
                onChange={(e) => setSettings({ ...settings, registrationNumber: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">National Tax Number (NTN)</label>
              <input
                type="text"
                value={settings.ntnNumber}
                onChange={(e) => setSettings({ ...settings, ntnNumber: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Official Support Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Helpline Phone</label>
              <input
                type="text"
                value={settings.helpline}
                onChange={(e) => setSettings({ ...settings, helpline: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Headquarters Physical Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="form-control"
            />
          </div>

          <button
            type="submit"
            disabled={savingSettings}
            className="btn btn-primary"
            style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Save size={16} /> {savingSettings ? 'Saving Settings...' : 'Save Organization Profile'}
          </button>
        </form>
      </div>

      {/* 2. Admin Profile & Security */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={20} color="var(--primary)" />
          Administrator Account & Security
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Update executive login details and administrative password.
        </p>

        <form onSubmit={handleSaveAdminProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Administrator Full Name</label>
              <input
                type="text"
                value={adminProfile.name}
                onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Admin Email Address</label>
              <input
                type="email"
                value={adminProfile.email}
                onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">New Password (Leave blank to keep unchanged)</label>
              <input
                type="password"
                placeholder="••••••••"
                value={adminProfile.newPassword}
                onChange={(e) => setAdminProfile({ ...adminProfile, newPassword: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={adminProfile.confirmPassword}
                onChange={(e) => setAdminProfile({ ...adminProfile, confirmPassword: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="btn btn-primary"
            style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Save size={16} /> {savingProfile ? 'Updating Profile...' : 'Update Admin Account'}
          </button>
        </form>
      </div>

      {/* 3. Notification Routing & Gateways */}
      <div className="grid grid-cols-2 gap-8">
        {/* Notification Preferences */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} color="var(--primary)" />
            Automated Notification Routing
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.9rem' }}>
              <span>Send instant email on every donation</span>
              <input
                type="checkbox"
                checked={settings.notifications.emailOnDonation}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, emailOnDonation: e.target.checked }
                })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.9rem' }}>
              <span>Send alert on new volunteer signup</span>
              <input
                type="checkbox"
                checked={settings.notifications.emailOnVolunteerSignup}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, emailOnVolunteerSignup: e.target.checked }
                })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.9rem' }}>
              <span>Send daily executive summary digest</span>
              <input
                type="checkbox"
                checked={settings.notifications.dailySummaryDigest}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, dailySummaryDigest: e.target.checked }
                })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
            </label>
          </div>
        </div>

        {/* Payment Gateways Simulator */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={18} color="var(--primary)" />
            Active Payment Channels
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.9rem' }}>
              <span>JazzCash Mobile Account</span>
              <input
                type="checkbox"
                checked={settings.paymentGateways.jazzCashEnabled}
                onChange={(e) => setSettings({
                  ...settings,
                  paymentGateways: { ...settings.paymentGateways, jazzCashEnabled: e.target.checked }
                })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.9rem' }}>
              <span>EasyPaisa Mobile Account</span>
              <input
                type="checkbox"
                checked={settings.paymentGateways.easyPaisaEnabled}
                onChange={(e) => setSettings({
                  ...settings,
                  paymentGateways: { ...settings.paymentGateways, easyPaisaEnabled: e.target.checked }
                })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '0.9rem' }}>
              <span>Debit & Credit Cards (Visa/MasterCard)</span>
              <input
                type="checkbox"
                checked={settings.paymentGateways.stripeCardEnabled}
                onChange={(e) => setSettings({
                  ...settings,
                  paymentGateways: { ...settings.paymentGateways, stripeCardEnabled: e.target.checked }
                })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* 4. Demo Data Reset / Maintenance */}
      <div className="card" style={{ padding: '2rem', border: '1px solid var(--status-danger-border)', backgroundColor: 'var(--status-danger-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--status-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RotateCcw size={20} />
              Reset Demo System Sandbox Data
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#7F1D1D', marginTop: '0.35rem', maxWidth: '600px' }}>
              Restores all initial campaigns, volunteer applications, donation transactions, and donor CRM records back to pristine factory defaults.
            </p>
          </div>

          <button
            onClick={handleResetData}
            disabled={resetting}
            className="btn btn-danger"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700' }}
          >
            <RotateCcw size={16} /> {resetting ? 'Resetting Data...' : 'Reset All Demo Data'}
          </button>
        </div>
      </div>
    </div>
  );
};
