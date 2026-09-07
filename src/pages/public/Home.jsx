import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { campaignService } from '../../services/campaignService';
import { donationService } from '../../services/donationService';
import { volunteerService } from '../../services/volunteerService';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import { 
  Heart, 
  HandHeart, 
  ShieldCheck, 
  Users, 
  Flame, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  MapPin, 
  CheckCircle2,
  Award,
  TrendingUp,
  Stethoscope,
  GraduationCap,
  Droplet,
  Utensils
} from 'lucide-react';

export const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [stats, setStats] = useState({
    livesImpacted: '18,500+',
    volunteers: '1,200+',
    fundsRaised: 'Rs. 2.8M+',
    campaignsCount: '50+'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubCamp = campaignService.subscribeCampaigns((allCampaigns) => {
      setCampaigns(allCampaigns.slice(0, 3));
    });

    const unsubDon = donationService.subscribeDonations((allDonations) => {
      setRecentDonations(allDonations.slice(0, 5));
      const totalRaised = allDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
      setStats((prev) => ({
        ...prev,
        fundsRaised: `Rs. ${(totalRaised / 1000000).toFixed(1)}M+`
      }));
    });

    return () => {
      unsubCamp();
      unsubDon();
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* ====================================================================
          HERO SECTION
          ==================================================================== */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #064E3B 100%)',
        color: '#FFFFFF',
        padding: '5.5rem 0 6rem 0',
        overflow: 'hidden'
      }}>
        {/* Background ambient glow circles */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="grid grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                width: 'fit-content',
                fontSize: '0.85rem',
                color: '#A7F3D0'
              }}>
                <Sparkles size={16} color="var(--accent)" />
                <span>Empowering Humanity, Saving Lives Together</span>
              </div>

              <h1 style={{
                fontSize: '3.2rem',
                fontWeight: '800',
                lineHeight: 1.15,
                color: '#FFFFFF',
                fontFamily: 'var(--font-heading)'
              }}>
                Together We Can <br />
                <span style={{
                  background: 'linear-gradient(90deg, #14B8A6 0%, #F59E0B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Make a Real Difference.
                </span>
              </h1>

              <p style={{ fontSize: '1.15rem', color: '#CBD5E1', lineHeight: '1.7', maxWidth: '540px' }}>
                Join GiveHope in providing emergency flood relief rations, life-saving medical aid, solar water borewells, and school sponsorships to vulnerable families across Pakistan.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                <Link to="/donate" className="btn btn-lg btn-accent" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
                  <Heart size={20} fill="#FFFFFF" /> Donate Now
                </Link>
                <Link to="/volunteer" className="btn btn-lg btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.12)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.25)' }}>
                  <HandHeart size={20} color="#14B8A6" /> Become a Volunteer
                </Link>
              </div>

              {/* Trust Indicators */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                fontSize: '0.82rem',
                color: '#94A3B8'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={18} color="#10B981" />
                  <span>100% Tax-Exempt Certified</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={18} color="#10B981" />
                  <span>Verified Field Distribution</span>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80"
                  alt="NGO Flood Relief and Child Care"
                  style={{ width: '100%', height: '420px', objectFit: 'cover' }}
                />

                {/* Floating Urgent Badge Card */}
                <div style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  right: '1.5rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.88)',
                  backdropFilter: 'blur(12px)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#F59E0B', fontSize: '0.82rem', fontWeight: '700' }}>
                      <Flame size={16} /> URGENT RELIEF APPEAL
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '0.98rem', color: '#FFFFFF', marginTop: '2px' }}>
                      Flood Emergency Survival Ration Kits
                    </div>
                  </div>
                  <Link to="/campaigns/camp-001" className="btn btn-sm btn-primary" style={{ flexShrink: 0 }}>
                    Support Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          LIVE IMPACT STATISTICS STRIP
          ==================================================================== */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-light)',
        padding: '2.5rem 0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
      }}>
        <div className="container">
          <div className="grid grid-cols-4 gap-6" style={{ textAlign: 'center' }}>
            <div style={{ padding: '0.5rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                {stats.livesImpacted}
              </div>
              <div style={{ fontWeight: '600', color: 'var(--navy)', marginTop: '0.2rem' }}>Lives Directly Impacted</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Across 4 provinces</div>
            </div>

            <div style={{ padding: '0.5rem', borderLeft: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>
                {stats.volunteers}
              </div>
              <div style={{ fontWeight: '600', color: 'var(--navy)', marginTop: '0.2rem' }}>Registered Volunteers</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active ground forces</div>
            </div>

            <div style={{ padding: '0.5rem', borderLeft: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--navy)', fontFamily: 'var(--font-heading)' }}>
                {stats.fundsRaised}
              </div>
              <div style={{ fontWeight: '600', color: 'var(--navy)', marginTop: '0.2rem' }}>Total Funds Raised</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>100% Transparent ledger</div>
            </div>

            <div style={{ padding: '0.5rem', borderLeft: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#059669', fontFamily: 'var(--font-heading)' }}>
                {stats.campaignsCount}
              </div>
              <div style={{ fontWeight: '600', color: 'var(--navy)', marginTop: '0.2rem' }}>Relief Campaigns</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Completed successfully</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          FEATURED CAMPAIGNS SECTION
          ==================================================================== */}
      <section className="section" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-tag">Urgent & Active Campaigns</span>
            <h2 className="section-title">Be the Spark of Hope</h2>
            <p className="section-subtitle">
              Explore our current humanitarian missions. Every single rupee contributes directly to procuring supplies and empowering those in need.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {campaigns.map((camp) => (
              <div key={camp.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={camp.image}
                    alt={camp.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                    <Badge variant={camp.isUrgent ? 'Urgent' : 'primary'}>
                      {camp.isUrgent && <Flame size={13} />} {camp.category}
                    </Badge>
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    right: '1rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(6px)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Users size={12} /> {camp.donorsCount} Donors
                  </div>
                </div>

                <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', lineHeight: '1.3' }}>
                    {camp.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {camp.description}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                    <ProgressBar current={camp.raisedAmount} total={camp.goalAmount} isUrgent={camp.isUrgent} />
                  </div>
                </div>

                <div className="card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <Link to={`/campaigns/${camp.id}`} className="btn btn-sm btn-outline" style={{ flex: 1 }}>
                    View Details
                  </Link>
                  <Link to={`/donate?campaign=${camp.id}`} className="btn btn-sm btn-primary" style={{ flex: 1 }}>
                    <Heart size={14} fill="#FFFFFF" /> Donate
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/campaigns" className="btn btn-outline-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              Explore All Relief Campaigns <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
          HOW WE HELP / 4 PILLARS OF GIVEHOPE
          ==================================================================== */}
      <section className="section" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-tag">Humanitarian Pillars</span>
            <h2 className="section-title">How GiveHope Transforms Lives</h2>
            <p className="section-subtitle">
              We operate with zero bureaucratic delays to bring sustainable, dignity-affirming solutions directly into the hands of those who need it most.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Flame size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)' }}>Emergency Disaster Relief</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Rapid 24-hour ground deployment of ration bags, waterproof family tents, and water purification packs during floods and earthquakes.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                color: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Stethoscope size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)' }}>Mobile Medical Camps</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Free doctor consultations, ultrasound diagnostics, maternal prenatal care, and essential prescription medications in off-grid villages.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <GraduationCap size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)' }}>Child Education & Meals</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Full annual school fee sponsorships, uniforms, books, and daily nutritious midday lunch for street children and orphans.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Droplet size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)' }}>Solar Clean Water Wells</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Sustainable deep-drilling solar pump filtration borewells installed in arid desert towns, giving clean drinking water for generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          LIVE RECENT DONATIONS TICKER STRIP
          ==================================================================== */}
      <section style={{
        backgroundColor: 'var(--navy)',
        color: '#FFFFFF',
        padding: '3rem 0',
        borderTop: '1px solid #334155',
        borderBottom: '1px solid #334155'
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Live Supporter Wall
              </span>
              <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginTop: '0.2rem' }}>
                Recent Generous Contributions
              </h3>
            </div>
            <Link to="/donate" className="btn btn-sm btn-accent">
              Add Your Name to the Wall <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {recentDonations.slice(0, 3).map((item) => (
              <div key={item.id} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '700', color: '#FFFFFF', fontSize: '0.95rem' }}>{item.donorName}</span>
                  <span style={{ fontWeight: '800', color: '#A7F3D0', fontSize: '1.05rem' }}>Rs. {Number(item.amount).toLocaleString()}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                  {item.campaignTitle}
                </div>
                {item.message && (
                  <div style={{ fontSize: '0.78rem', color: '#CBD5E1', fontStyle: 'italic', marginTop: '0.25rem' }}>
                    "{item.message}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          VOLUNTEER CALLOUT BANNER
          ==================================================================== */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, var(--primary-light) 0%, #E6FFFA 100%)',
        borderTop: '1px solid var(--primary-border)'
      }}>
        <div className="container">
          <div className="grid grid-cols-2 gap-8 items-center">
            <div>
              <span className="section-tag">Join Our Volunteer Force</span>
              <h2 style={{ fontSize: '2.4rem', color: 'var(--navy)', marginBottom: '1.25rem' }}>
                Your Time & Skills Can Save a Life.
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.75rem' }}>
                Whether you are a medical professional, teacher, driver, student, or logistics coordinator, we have meaningful volunteer positions across all provinces. Receive certified training, field experience, and official volunteer certificates.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/volunteer" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
                  <HandHeart size={18} /> Apply as a Volunteer
                </Link>
                <Link to="/about" className="btn btn-outline" style={{ padding: '0.85rem 1.75rem' }}>
                  Learn More About Us
                </Link>
              </div>
            </div>

            <div style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              border: '4px solid #FFFFFF'
            }}>
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80"
                alt="GiveHope Volunteers packing food boxes"
                style={{ width: '100%', height: '360px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
