import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { volunteerService } from '../services/volunteerService';
import { donationService } from '../services/donationService';
import { 
  LayoutDashboard, 
  HeartHandshake, 
  HandHeart, 
  Megaphone, 
  Users, 
  BarChart3, 
  Settings as SettingsIcon, 
  LogOut, 
  Heart, 
  Menu, 
  X, 
  Bell, 
  ExternalLink, 
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react';

export const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pendingVolunteersCount, setPendingVolunteersCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const vStats = volunteerService.getVolunteerStats();
    setPendingVolunteersCount(vStats.pending);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    showToast('Signed Out', 'Admin session terminated safely.', 'info');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Donation Ledger', path: '/admin/donations', icon: HeartHandshake },
    { label: 'Volunteer Management', path: '/admin/volunteers', icon: HandHeart, badge: pendingVolunteersCount },
    { label: 'Campaigns & Projects', path: '/admin/campaigns', icon: Megaphone },
    { label: 'Donor Directory', path: '/admin/donors', icon: Users },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { label: 'System Settings', path: '/admin/settings', icon: SettingsIcon }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F5F9', color: 'var(--text-main)' }}>
      {/* ====================================================================
          DESKTOP SIDEBAR
          ==================================================================== */}
      <aside
        style={{
          width: sidebarCollapsed ? '80px' : '260px',
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s ease',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
          borderRight: '1px solid #1E293B',
          flexShrink: 0
        }}
        className="admin-sidebar-desktop"
      >
        {/* Sidebar Header */}
        <div style={{
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid #1E293B',
          height: '70px'
        }}>
          {!sidebarCollapsed && (
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--primary) 0%, #065F46 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <Heart size={18} fill="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#FFFFFF', lineHeight: 1.1 }}>
                  Give<span style={{ color: 'var(--primary)' }}>Hope</span> <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '600' }}>Admin</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', letterSpacing: '0.04em' }}>
                  MANAGEMENT CONSOLE
                </div>
              </div>
            </Link>
          )}

          {sidebarCollapsed && (
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #065F46 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Heart size={20} fill="#FFFFFF" />
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const IconComp = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  position: 'relative'
                })}
              >
                <IconComp size={20} />
                {!sidebarCollapsed && <span>{item.label}</span>}
                {!sidebarCollapsed && item.badge > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    backgroundColor: 'var(--status-warning)',
                    color: '#92400E',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid #1E293B',
          backgroundColor: '#0B1120'
        }}>
          {!sidebarCollapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={currentUser?.name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#FFFFFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {currentUser?.name?.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: '600' }}>
                    Executive Admin
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex'
                }}
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center'
              }}
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>

      {/* ====================================================================
          MAIN CONTENT AREA
          ==================================================================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <header style={{
          height: '70px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-light)',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--navy)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center'
              }}
              className="desktop-sidebar-toggle"
              aria-label="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>

            <button
              onClick={() => setMobileSidebarOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--navy)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'none'
              }}
              className="mobile-sidebar-toggle"
              aria-label="Open Mobile Menu"
            >
              <Menu size={24} />
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary-dark)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: '700'
            }}>
              <ShieldCheck size={15} color="var(--primary)" />
              <span>Admin Management Environment</span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              to="/"
              target="_blank"
              className="btn btn-sm btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
            >
              <span>Public Website</span>
              <ExternalLink size={14} />
            </Link>

            {/* Notification Bell Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  padding: '8px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
                aria-label="Notifications"
              >
                <Bell size={18} color="var(--navy)" />
                {pendingVolunteersCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: 'var(--status-danger)',
                    color: '#FFF',
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {pendingVolunteersCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '320px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--border-light)',
                  padding: '1rem',
                  zIndex: 100
                }}>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--navy)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                    Notifications & Alerts
                  </div>
                  {pendingVolunteersCount > 0 ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ padding: '0.5rem', backgroundColor: 'var(--status-warning-bg)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--status-warning)' }}>
                        <strong>{pendingVolunteersCount} Volunteer Applications</strong> are awaiting administrative review.
                      </div>
                      <Link
                        to="/admin/volunteers"
                        onClick={() => setNotificationsOpen(false)}
                        style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.82rem', textAlign: 'center', marginTop: '0.25rem' }}
                      >
                        Review Applications →
                      </Link>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                      No pending alert items.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Outlet Main View */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            zIndex: 1000,
            display: 'flex'
          }}
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            style={{
              width: '280px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.25rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: '800', fontSize: '1.2rem' }}>
                Give<span style={{ color: 'var(--primary)' }}>Hope</span> <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: '600' }}>Admin</span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              {navItems.map((item) => {
                const IconComp = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    onClick={() => setMobileSidebarOpen(false)}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                      fontWeight: isActive ? '700' : '500',
                      textDecoration: 'none'
                    })}
                  >
                    <IconComp size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ width: '100%', color: 'var(--status-danger)', borderColor: '#334155' }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Responsive Inline CSS */}
      <style>{`
        @media (max-width: 1024px) {
          .admin-sidebar-desktop { display: none !important; }
          .desktop-sidebar-toggle { display: none !important; }
          .mobile-sidebar-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
};
