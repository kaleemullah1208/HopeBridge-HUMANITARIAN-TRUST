import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const Contact = () => {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'General Inquiries',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      q: "How does HopeBridge ensure 100% Zakat compliance?",
      a: "HopeBridge maintains a strictly segregated, Sharia-certified Zakat bank account. 100% of your Zakat funds are utilized solely for eligible beneficiaries (Mustahiqueen) under Sharia guidelines for emergency food, medicine, and clean water borewells with zero deduction for administrative overheads."
    },
    {
      q: "Will I receive an official tax deduction certificate for my donation?",
      a: "Yes! HopeBridge is approved under Section 61 and 2(36) of the Income Tax Ordinance. Every donation immediately generates an official Tax-Exempt Receipt containing our registration numbers and tax ID, valid for claiming tax rebates with the FBR."
    },
    {
      q: "Can overseas Pakistanis and international donors contribute?",
      a: "Yes. International Visa, MasterCard, and direct SWIFT/IBAN wire transfers are fully supported for all overseas donors. Receipts are instantly issued in PKR equivalent."
    },
    {
      q: "What is the minimum age and commitment for volunteering?",
      a: "Volunteers must be at least 16 years of age (or accompanied by an adult for younger students). We welcome volunteers with any schedule, from 2 hours on weekends to full-time disaster relief field assignments."
    },
    {
      q: "How can corporations partner for CSR sponsorships?",
      a: "Corporations can sponsor full solar water well projects, adopt community school classrooms, or fund mobile clinic operations. Please choose 'Corporate CSR & Partnerships' on the contact form to connect directly with our partnership director."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Missing Fields', 'Please complete all required fields.', 'error');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showToast('Message Received!', 'Thank you! A representative will respond to your query within 24 hours.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'General Inquiries',
        subject: '',
        message: ''
      });
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: 'var(--bg-page)' }}>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <span className="section-tag" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#A7F3D0', borderColor: 'rgba(255,255,255,0.2)' }}>
            24/7 Helpline & Support
          </span>
          <h1 style={{ fontSize: '2.6rem', color: '#FFFFFF', marginTop: '0.4rem', marginBottom: '0.75rem' }}>
            We're Here to Help You Help Others
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#CBD5E1', lineHeight: '1.6' }}>
            Have a question about campaigns, volunteer drives, corporate CSR, or disaster relief coordination? Reach out to our team anytime.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Info & Form */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-3 gap-8 items-start">
            {/* Left 1 Column: Contact Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>Emergency Helpline</h4>
                  <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.05rem' }}>+92 (42) 3588-4422</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>WhatsApp: +92 300 9988776</div>
                </div>
              </div>

              <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>Email Inquiries</h4>
                  <div style={{ fontWeight: '600', color: 'var(--navy)', fontSize: '0.92rem' }}>contact@hopebridge.ngo</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>donations@hopebridge.ngo</div>
                </div>
              </div>

              <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>Headquarters</h4>
                  <div style={{ fontSize: '0.88rem', color: 'var(--navy)', lineHeight: '1.4' }}>
                    Plot 42-B, Main Boulevard, Gulberg III, Lahore, Pakistan
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>Office Hours</h4>
                  <div style={{ fontSize: '0.88rem', color: 'var(--navy)' }}>Mon - Sat: 9:00 AM - 6:00 PM</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--status-success)', fontWeight: '600', marginTop: '2px' }}>
                    ● 24/7 Field Disaster Hotline Active
                  </div>
                </div>
              </div>
            </div>

            {/* Right 2 Columns: Contact Form */}
            <div style={{ gridColumn: 'span 2' }}>
              <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '0.35rem' }}>
                  Send Us a Direct Message
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
                  Our team responds to all formal queries, donor receipts assistance, and volunteer questions within one business day.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Your Name <span className="required">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tariq Mansoor"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address <span className="required">*</span></label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. tariq@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Contact Phone</label>
                      <input
                        type="tel"
                        placeholder="+92 300 1234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="form-control"
                      >
                        <option value="General Inquiries">General Inquiries</option>
                        <option value="Donations & Tax Receipts">Donations & Tax Receipts</option>
                        <option value="Volunteer Programs">Volunteer Programs</option>
                        <option value="Corporate CSR & Partnerships">Corporate CSR & Partnerships</option>
                        <option value="Emergency Relief Coordination">Emergency Relief Coordination</option>
                        <option value="Press & Media">Press & Media Relations</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      placeholder="Brief subject of your message"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Message <span className="required">*</span></label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Write your detailed inquiry or feedback here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-lg btn-primary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Send size={18} /> {submitting ? 'Sending Message...' : 'Send Message to HopeBridge'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Representation & Regional Centers */}
      <section className="section" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-tag">Nationwide Footprint</span>
            <h2 className="section-title">Regional Humanitarian Hubs</h2>
            <p className="section-subtitle">
              We operate central warehouses and relief coordination centers in major provincial hubs.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--navy)' }}>Central Punjab Hub (Lahore HQ)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Main Boulevard, Gulberg III, Lahore
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.5rem', fontWeight: '600' }}>
                Services: Central Logistics, Administration & Learning Centers
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #3B82F6' }}>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--navy)' }}>Southern Sindh Hub (Karachi)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Korangi Industrial Area, Karachi
              </div>
              <div style={{ fontSize: '0.8rem', color: '#3B82F6', marginTop: '0.5rem', fontWeight: '600' }}>
                Services: Flood Relief Warehousing & Tharparkar Water Logistics
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #F59E0B' }}>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--navy)' }}>Northern Region Hub (Islamabad)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Sector I-9/2, Islamabad
              </div>
              <div style={{ fontSize: '0.8rem', color: '#F59E0B', marginTop: '0.5rem', fontWeight: '600' }}>
                Services: Winter Warmth Drive & Mountain Medical Vans Base
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-page)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <div className="section-title-wrap">
            <span className="section-tag">Frequently Asked Questions</span>
            <h2 className="section-title">Common Inquiries Answered</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="card" style={{ overflow: 'hidden' }}>
                  <button
                    onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      background: '#FFFFFF',
                      border: 'none',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      gap: '1rem'
                    }}
                  >
                    <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--navy)' }}>
                      {faq.q}
                    </span>
                    {isOpen ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 1.5rem 1.25rem 1.5rem',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--text-muted)',
                      fontSize: '0.92rem',
                      lineHeight: '1.7',
                      borderTop: '1px solid var(--border-light)'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
