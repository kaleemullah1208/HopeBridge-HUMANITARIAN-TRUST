import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Target, 
  Eye, 
  ShieldCheck, 
  Users, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  PieChart
} from 'lucide-react';

export const About = () => {
  const teamMembers = [
    {
      name: "Ihsan Ullah",
      role: "Founder & Executive Director",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Over 10 years of humanitarian field leadership, driving emergency relief logistics and community welfare programs."
    },
    {
      name: "Dr. Tariq Mansoor",
      role: "Head of Medical & Healthcare Camps",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Senior consultant physician overseeing 3 mobile health clinics and emergency disaster medical triage response."
    },
    {
      name: "Amina Al-Sayed",
      role: "Director of Education & Child Welfare",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      bio: "Education strategist managing community schools, teacher development, and orphan sponsorship initiatives."
    },
    {
      name: "Bilal Ahmed",
      role: "Chief Field Operations & Logistics",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      bio: "Coordinates supply chains, 4x4 relief convoys, and solar water well installations in hard-to-reach terrain."
    }
  ];

  const milestones = [
    {
      year: "2021",
      title: "Founding & Registration",
      desc: "HopeBridge was established as a certified non-profit trust in response to urban poverty and healthcare disparities."
    },
    {
      year: "2022",
      title: "Massive Monsoon Flood Relief",
      desc: "Distributed over 25,000 emergency ration bags and set up 18 field medical tents in Sindh and Balochistan."
    },
    {
      year: "2024",
      title: "Community Learning Centers",
      desc: "Inaugurated 6 permanent learning centers providing free education, books, and hot lunches to 500+ children."
    },
    {
      year: "2026",
      title: "Solar Water & Mobile Vans Expansion",
      desc: "Commissioned 15 deep-bore solar filtration wells and launched a fleet of customized mobile clinics."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Page Header */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '4.5rem 0',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-tag" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#A7F3D0', borderColor: 'rgba(255,255,255,0.2)' }}>
            About HopeBridge Trust
          </span>
          <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Transforming Compassion into Direct Action
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#CBD5E1', lineHeight: '1.7' }}>
            HopeBridge is dedicated to building a world where every human being has immediate access to food, clean water, healthcare, education, and disaster relief with utmost dignity.
          </p>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="section" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="grid grid-cols-2 gap-8">
            <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '6px solid var(--primary)' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Target size={26} />
              </div>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--navy)' }}>Our Mission</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1rem' }}>
                To deliver swift, transparent, and dignified emergency humanitarian relief and long-term community development programs, empowering vulnerable families through sustainable health, water, and education initiatives.
              </p>
            </div>

            <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '6px solid var(--accent)' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Eye size={26} />
              </div>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--navy)' }}>Our Vision</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1rem' }}>
                A resilient and equitable society where no child drops out of school due to poverty, no village drinks contaminated water, and no disaster survivor is left without shelter, food, or medical care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section" style={{ backgroundColor: 'var(--bg-page)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-tag">Ethical Compass</span>
            <h2 className="section-title">Our Guiding Core Values</h2>
            <p className="section-subtitle">
              Every decision, campaign, and volunteer deployment is anchored in deep ethical accountability and empathy.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.5rem' }}>01</div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)' }}>100% Transparency</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Every single rupee donated is logged in our real-time ledger with verifiable procurement receipts and audited annual reporting.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.5rem' }}>02</div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)' }}>Human Dignity First</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                We serve all human beings regardless of ethnicity, religion, or background with profound respect, preserving beneficiary honor.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.5rem' }}>03</div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)' }}>Rapid Emergency Action</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Our mobile response units mobilize food, clean water, and medical kits within 24 hours of natural disaster notifications.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.5rem' }}>04</div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)' }}>Sustainable Impact</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                We invest in long-term solar water wells and education labs so communities can sustain themselves independently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Transparency & Fund Allocation */}
      <section className="section" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="grid grid-cols-2 gap-8 items-center">
            <div>
              <span className="section-tag">Financial Stewardship</span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--navy)', marginBottom: '1rem' }}>
                Where Does Your Donation Go?
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.75rem' }}>
                We maintain an industry-leading program efficiency ratio. 91% of every contribution goes directly to on-ground supplies, medical packs, school tuition, and solar infrastructure.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                    <span>Direct Program Delivery & Relief Supplies</span>
                    <span style={{ color: 'var(--primary)' }}>91%</span>
                  </div>
                  <div className="progress-track" style={{ height: '8px' }}>
                    <div className="progress-fill" style={{ width: '91%' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                    <span>Field Transport & Warehousing Logistics</span>
                    <span style={{ color: 'var(--accent)' }}>5%</span>
                  </div>
                  <div className="progress-track" style={{ height: '8px' }}>
                    <div className="progress-fill" style={{ width: '5%', background: 'var(--accent)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                    <span>Administration, Audit & Bank Gateway Fees</span>
                    <span style={{ color: '#64748B' }}>4%</span>
                  </div>
                  <div className="progress-track" style={{ height: '8px' }}>
                    <div className="progress-fill" style={{ width: '4%', background: '#64748B' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={22} color="var(--primary)" /> Governance & Legal Badges
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Registered Trust:</strong> Govt Punjab Non-Profit Reg # PB/2021/9842</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>FBR Tax Exemption:</strong> Certified under Income Tax Ordinance Sec. 61 & 2(36)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Sharia Zakat Compliant:</strong> Certified 100% Zakat fund separation policy</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Independent Audit:</strong> Financial statements audited annually by chartered accountants</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section" style={{ backgroundColor: 'var(--bg-page)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-tag">Dedicated Leadership</span>
            <h2 className="section-title">The People Behind HopeBridge</h2>
            <p className="section-subtitle">
              Passionate humanitarian professionals, physicians, educators, and field organizers working day and night.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <div key={i} className="card" style={{ overflow: 'hidden' }}>
                <img
                  src={member.image}
                  alt={member.name}
                  style={{ width: '100%', height: '240px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>{member.name}</h3>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)', marginBottom: '0.75rem' }}>
                    {member.role}
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Milestones */}
      <section className="section" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-tag">Our Journey</span>
            <h2 className="section-title">Milestones of Hope & Service</h2>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="card" style={{ padding: '1.75rem', position: 'relative' }}>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-dark)',
                  fontWeight: '800',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  marginBottom: '1rem'
                }}>
                  {m.year}
                </div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>
                  {m.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
