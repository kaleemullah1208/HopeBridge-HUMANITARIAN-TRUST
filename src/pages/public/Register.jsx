import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ButtonLoader } from '../../components/common/ButtonLoader';
import { 
  Heart, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  UserPlus, 
  HandHeart,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Donor'
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const { register, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const res = await register(formData);
    setSubmitting(false);

    if (res.success) {
      showToast('Account Created!', `Welcome to GiveHope, ${res.user.name}!`, 'success');
      navigate('/');
    } else {
      showToast('Registration Error', res.error || 'Failed to create account.', 'error');
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleSubmitting(true);
    const res = await loginWithGoogle(formData.role);
    setGoogleSubmitting(false);

    if (res.success) {
      showToast('Google Account Connected!', `Welcome, ${res.user.name}!`, 'success');
      navigate('/');
    } else {
      showToast('Google Sign-in Failed', res.error || 'Could not register with Google.', 'error');
    }
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
      <div style={{ width: '100%', maxWidth: '520px' }}>
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
              margin: '0 auto 1rem auto'
            }}>
              <Heart size={26} fill="#FFFFFF" />
            </div>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--navy)', marginBottom: '0.35rem' }}>
              Create an Account
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Join GiveHope as a registered Donor or Volunteer
            </p>
          </div>

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
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
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{googleSubmitting ? 'Registering with Google...' : 'Sign up with Google'}</span>
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
            <span style={{ padding: '0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or register with email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }} />
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Role Selection */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">I want to register as:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'Donor' })}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid',
                    borderColor: formData.role === 'Donor' ? 'var(--primary)' : 'var(--border-light)',
                    backgroundColor: formData.role === 'Donor' ? 'var(--primary-light)' : '#FFFFFF',
                    color: formData.role === 'Donor' ? 'var(--primary-dark)' : 'var(--text-main)',
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <User size={16} /> Regular Donor
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'Volunteer' })}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid',
                    borderColor: formData.role === 'Volunteer' ? 'var(--primary)' : 'var(--border-light)',
                    backgroundColor: formData.role === 'Volunteer' ? 'var(--primary-light)' : '#FFFFFF',
                    color: formData.role === 'Volunteer' ? 'var(--primary-dark)' : 'var(--text-main)',
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <HandHeart size={16} /> Field Volunteer
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name <span className="required">*</span></label>
              <div className="input-icon-wrap">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  placeholder="e.g. Tariq Mansoor"
                  value={formData.name}
                  onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: null }); }}
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                />
              </div>
              {errors.name && <div className="form-error"><AlertCircle size={13} /> {errors.name}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address <span className="required">*</span></label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="e.g. tariq@example.com"
                  value={formData.email}
                  onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: null }); }}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                />
              </div>
              {errors.email && <div className="form-error"><AlertCircle size={13} /> {errors.email}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone / WhatsApp</label>
              <div className="input-icon-wrap">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Password <span className="required">*</span></label>
                <div className="input-icon-wrap">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => { setFormData({ ...formData, password: e.target.value }); if (errors.password) setErrors({ ...errors, password: null }); }}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  />
                </div>
                {errors.password && <div className="form-error"><AlertCircle size={13} /> {errors.password}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Confirm Password <span className="required">*</span></label>
                <div className="input-icon-wrap">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => { setFormData({ ...formData, confirmPassword: e.target.value }); if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null }); }}
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  />
                </div>
                {errors.confirmPassword && <div className="form-error"><AlertCircle size={13} /> {errors.confirmPassword}</div>}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-lg btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
            >
              <ButtonLoader loading={submitting} loadingText="Creating Account...">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserPlus size={18} />
                  <span>Register Account</span>
                </span>
              </ButtonLoader>
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
