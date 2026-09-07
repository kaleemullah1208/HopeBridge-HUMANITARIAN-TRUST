import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Globe, 
  Share2, 
  MessageCircle, 
  Clock, 
  Sparkles 
} from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }
    showToast('Subscribed!', 'Thank you for subscribing to our humanitarian monthly newsletter.', 'success');
    setEmail('');
  };

  return (
    <footer style={{
      backgroundColor: 'var(--navy)',
      color: '#CBD5E1',
      paddingTop: '4.5rem',
      paddingBottom: '2rem',
      borderTop: '1px solid #334155'
    }}>
      <div className="container">
        <div className="grid grid-cols-4 gap-8" style={{ marginBottom: '3.5rem' }}>
          {/* Column 1: Organization Bio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--primary) 0%, #065F46 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <Heart size={20} fill="#FFFFFF" />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.25rem', color: '#FFFFFF' }}>
                  Give<span style={{ color: 'var(--primary)' }}>Hope</span>
                </span>
                <span style={{ display: 'block', fontSize: '0.65rem', color: '#94A3B8', letterSpacing: '0.05em' }}>
                  WELFARE & RELIEF TRUST
                </span>
              </div>
            </Link>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: '1.6' }}>
              GiveHope is a registered non-profit humanitarian organization committed to disaster relief, quality education, healthcare equity, and community empowerment.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#94A3B8', padding: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} aria-label="Social Link">
                <Globe size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: '#94A3B8', padding: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} aria-label="WhatsApp / Chat">
                <MessageCircle size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#94A3B8', padding: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} aria-label="Share">
                <Share2 size={18} />
              </a>
              <a href="mailto:contact@givehope.ngo" style={{ color: '#94A3B8', padding: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '1.25rem', fontWeight: '700' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/about" style={{ color: '#94A3B8', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowRight size={14} color="var(--primary)" /> Our Mission & Values
                </Link>
              </li>
              <li>
                <Link to="/campaigns" style={{ color: '#94A3B8', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowRight size={14} color="var(--primary)" /> Active Campaigns
                </Link>
              </li>
              <li>
                <Link to="/volunteer" style={{ color: '#94A3B8', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowRight size={14} color="var(--primary)" /> Become a Volunteer
                </Link>
              </li>
              <li>
                <Link to="/donate" style={{ color: '#94A3B8', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowRight size={14} color="var(--primary)" /> Make a Donation
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: '#94A3B8', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowRight size={14} color="var(--primary)" /> Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Emergency */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '1.25rem', fontWeight: '700' }}>
              Emergency & HQ
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.88rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Plot 42-B, Main Boulevard, Gulberg III, Lahore, Pakistan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>+92 (42) 3588-4422 (24/7 Helpline)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>support@givehope.ngo</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Clock size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter & Trust Certification */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '1rem', fontWeight: '700' }}>
              Stay Updated
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '1rem' }}>
              Get monthly field reports, emergency alerts, and transparent audit summaries.
            </p>
            <form onSubmit={handleNewsletter} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #475569',
                  backgroundColor: 'rgba(255, 255, 255, 0.07)',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn btn-sm btn-primary" style={{ width: '100%' }}>
                Subscribe Now
              </button>
            </form>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.75rem',
              color: '#A7F3D0'
            }}>
              <ShieldCheck size={20} color="#10B981" style={{ flexShrink: 0 }} />
              <span>100% Tax-Exempt & Sharia Zakat Compliant Certified</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid #1E293B',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem',
          color: '#64748B'
        }}>
          <div>
            © {new Date().getFullYear()} GiveHope Humanitarian Welfare Trust. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/about" style={{ color: '#94A3B8' }}>Privacy Policy</Link>
            <Link to="/about" style={{ color: '#94A3B8' }}>Terms of Service</Link>
            <Link to="/about" style={{ color: '#94A3B8' }}>Annual Audit Reports</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
