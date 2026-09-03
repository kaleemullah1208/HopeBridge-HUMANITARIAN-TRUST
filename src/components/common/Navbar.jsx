import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Heart, 
  Menu, 
  X, 
  ShieldAlert, 
  User, 
  LogOut, 
  HandHeart, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const { currentUser, logout, switchRole, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRoleSwitch = (role) => {
    switchRole(role);
    setRoleDropdownOpen(false);
    showToast('Role Switched', `Active demo mode changed to ${role}.`, 'info');
    if (role === 'Admin') {
      navigate('/admin');
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast('Logged Out', 'You have been safely signed out.', 'info');
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--primary)' : 'var(--navy)',
    fontWeight: isActive ? '700' : '500',
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius-md)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    textDecoration: 'none'
  });

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-light)',
      boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
    }}>
      {/* Top Notification Bar for Demo convenience */}
      <div style={{
        background: 'linear-gradient(90deg, #0F172A 0%, #1E293B 100%)',
        color: '#F8FAFC',
        fontSize: '0.8rem',
        padding: '0.35rem 1rem',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <span>🇵🇰 Tax-Exempt Non-Profit Reg # <strong>PB/2021/9842</strong> | Emergency Relief Helpline: <strong>+92 (42) 3588-4422</strong></span>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.5rem' }}>
          <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: '600' }}>
            <Sparkles size={13} /> Demo Role:
          </span>
          <button 
            onClick={() => handleRoleSwitch('Admin')} 
            style={{
              background: currentUser?.role === 'Admin' ? 'var(--primary)' : 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#FFF',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Admin
          </button>
          <button 
            onClick={() => handleRoleSwitch('Donor')} 
            style={{
              background: currentUser?.role === 'Donor' ? 'var(--primary)' : 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#FFF',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Donor
          </button>
          <button 
            onClick={() => handleRoleSwitch('Volunteer')} 
            style={{
              background: currentUser?.role === 'Volunteer' ? 'var(--primary)' : 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#FFF',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Volunteer
          </button>
        </div>
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary) 0%, #065F46 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 10px rgba(13, 148, 136, 0.3)'
          }}>
            <Heart size={24} fill="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.25rem', color: 'var(--navy)', lineHeight: 1.1 }}>
              Hope<span style={{ color: 'var(--primary)' }}>Bridge</span>
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              HUMANITARIAN TRUST
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
          <NavLink to="/" style={navLinkStyle}>Home</NavLink>
          <NavLink to="/about" style={navLinkStyle}>About</NavLink>
          <NavLink to="/campaigns" style={navLinkStyle}>Campaigns</NavLink>
          <NavLink to="/volunteer" style={navLinkStyle}>
            <HandHeart size={16} color="var(--primary)" /> Volunteers
          </NavLink>
          <NavLink to="/contact" style={navLinkStyle}>Contact</NavLink>
        </nav>

        {/* Action Buttons & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
          {isAdmin && (
            <Link to="/admin" className="btn btn-sm btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--primary-border)' }}>
              <ShieldAlert size={16} color="var(--primary)" /> Admin Portal
            </Link>
          )}

          <Link to="/donate" className="btn btn-sm btn-accent" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Heart size={15} fill="#FFFFFF" /> Donate Now
          </Link>

          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={currentUser.name}
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span>{currentUser.name.split(' ')[0]}</span>
                <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>{currentUser.role}</span>
                <ChevronDown size={14} />
              </button>

              {roleDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-light)',
                  width: '220px',
                  padding: '0.5rem',
                  zIndex: 100
                }}>
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--navy)' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setRoleDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.88rem',
                        color: 'var(--primary)',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: '600'
                      }}
                    >
                      <ShieldAlert size={16} /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.88rem',
                      color: 'var(--status-danger)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-sm btn-outline">
              <User size={15} /> Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: 'var(--navy)',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
          className="mobile-nav-toggle"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-light)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Home</NavLink>
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>About</NavLink>
          <NavLink to="/campaigns" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Campaigns</NavLink>
          <NavLink to="/volunteer" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Volunteers</NavLink>
          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Contact</NavLink>
          
          <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '0.5rem 0' }} />

          <Link to="/donate" onClick={() => setMobileMenuOpen(false)} className="btn btn-accent" style={{ justifyContent: 'center' }}>
            <Heart size={16} fill="#FFFFFF" /> Donate Now
          </Link>

          {isAdmin && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'center' }}>
              <ShieldAlert size={16} color="var(--primary)" /> Admin Portal
            </Link>
          )}

          {currentUser ? (
            <button onClick={handleLogout} className="btn btn-outline" style={{ justifyContent: 'center', color: 'var(--status-danger)' }}>
              <LogOut size={16} /> Sign Out ({currentUser.name})
            </button>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline" style={{ justifyContent: 'center' }}>
              <User size={16} /> Sign In
            </Link>
          )}
        </div>
      )}

      {/* Responsive Inline CSS for Mobile Nav */}
      <style>{`
        @media (max-width: 868px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};
