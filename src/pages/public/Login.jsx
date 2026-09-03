import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Heart, 
  Mail, 
  Lock, 
  LogIn, 
  ShieldAlert, 
  User, 
  HandHeart, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, loginWithGoogle, switchRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const validateForm = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      showToast('Welcome Back!', `Signed in as ${res.user.name} (${res.user.role}).`, 'success');
      if (res.user.role === 'Admin' || email.toLowerCase() === 'admin@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      showToast('Login Failed', res.error || 'Invalid credentials.', 'error');
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleSubmitting(true);
    const res = await loginWithGoogle('Donor');
    setGoogleSubmitting(false);

    if (res.success) {
      showToast('Google Sign-In Successful', `Welcome, ${res.user.name}!`, 'success');
      if (res.user.role === 'Admin' || res.user.email?.toLowerCase() === 'admin@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      showToast('Google Sign-In Failed', res.error || 'Could not authenticate with Google.', 'error');
    }
  };

  const autofillAdmin = () => {
    setEmail('admin@gmail.com');
    setPassword('admin123');
    setErrors({});
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      backgroundColor: 'var(--bg-page)'
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-xl)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #065F46 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              margin: '0 auto 1rem auto',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
            }}>
              <Heart size={26} fill="#FFFFFF" />
            </div>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--navy)', marginBottom: '0.35rem' }}>
              Sign In to HopeBridge
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Firebase Authentication enabled for Donors, Volunteers & Admin
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleSubmitting}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--navy)',
              fontWeight: '600',
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              marginBottom: '1.25rem'
            }}
          >
            {/* Google SVG Logo */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{googleSubmitting ? 'Connecting with Google...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            margin: '1.25rem 0',
            color: 'var(--text-light)',
            fontSize: '0.8rem'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }} />
            <span style={{ padding: '0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or sign in with email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }} />
          </div>

          {/* Admin Fast Helper Box */}
          <div style={{
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldAlert size={14} /> Admin Credentials
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Email: <strong>admin@gmail.com</strong> | Pass: <strong>admin123</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={autofillAdmin}
              className="btn btn-sm btn-primary"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
            >
              Autofill
            </button>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address <span className="required">*</span></label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: null }); }}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                />
              </div>
              {errors.email && (
                <div className="form-error">
                  <AlertCircle size={13} /> {errors.email}
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Password <span className="required">*</span></label>
                <a
                  href="#forgot"
                  onClick={(e) => { e.preventDefault(); showToast('Password Reset', 'Use admin@gmail.com / admin123 or reset via Firebase Auth console.', 'info'); }}
                  style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}
                >
                  Forgot password?
                </a>
              </div>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: null }); }}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                />
              </div>
              {errors.password && (
                <div className="form-error">
                  <AlertCircle size={13} /> {errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-lg btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
            >
              <LogIn size={18} /> {submitting ? 'Authenticating with Firebase...' : 'Sign In'}
            </button>
          </form>

          {/* Bottom link */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
