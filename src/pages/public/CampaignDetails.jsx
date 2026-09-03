import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { campaignService } from '../../services/campaignService';
import { donationService } from '../../services/donationService';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Calendar, 
  Users, 
  Flame, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft,
  PieChart,
  HandHeart,
  Sparkles
} from 'lucide-react';

export const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [campaignDonations, setCampaignDonations] = useState([]);
  const [customAmount, setCustomAmount] = useState(2500);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const data = campaignService.getCampaignById(id);
    if (data) {
      setCampaign(data);
      const allDonations = donationService.getDonations();
      const matched = allDonations.filter((d) => d.campaignId === id || d.campaignTitle === data.title);
      setCampaignDonations(matched);
    }
  }, [id]);

  if (!campaign) {
    return (
      <div className="container section" style={{ textAlign: 'center', minHeight: '50vh' }}>
        <h2>Campaign Not Found</h2>
        <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          The requested humanitarian mission could not be located.
        </p>
        <Link to="/campaigns" className="btn btn-primary">
          Back to All Campaigns
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link Copied!', 'Campaign URL copied to your clipboard. Share with friends and family.', 'success');
  };

  const handleQuickDonate = (amount) => {
    navigate(`/donate?campaign=${campaign.id}&amount=${amount}`);
  };

  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)));
  const percentage = Math.min(Math.round((campaign.raisedAmount / campaign.goalAmount) * 100), 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: 'var(--bg-page)' }}>
      {/* Breadcrumb Header */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
          <Link to="/campaigns" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            <ArrowLeft size={16} /> Back to Campaigns
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge variant={campaign.isUrgent ? 'Urgent' : 'primary'}>
              {campaign.isUrgent && <Flame size={13} />} {campaign.category}
            </Badge>
            <button
              onClick={handleShare}
              className="btn btn-sm btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>
      </section>

      {/* Main Campaign Details Grid */}
      <section className="section" style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          <div className="grid grid-cols-3 gap-8" style={{ alignItems: 'start' }}>
            {/* Left 2 Columns: Full Story, Photos, Breakdown */}
            <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Main Image */}
              <div style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                maxHeight: '440px',
                position: 'relative'
              }}>
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  style={{ width: '100%', height: '440px', objectFit: 'cover' }}
                />
              </div>

              {/* Title & Metadata */}
              <div>
                <h1 style={{ fontSize: '2.2rem', color: 'var(--navy)', marginBottom: '1rem', lineHeight: 1.25 }}>
                  {campaign.title}
                </h1>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                  color: 'var(--text-muted)',
                  fontSize: '0.88rem',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-light)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={16} color="var(--primary)" />
                    <span>{campaign.location || 'Nationwide Relief Zones'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={16} color="var(--primary)" />
                    <span>Timeline: {campaign.startDate} to {campaign.endDate} ({daysLeft} days left)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={16} color="var(--primary)" />
                    <span>{campaign.beneficiariesCount?.toLocaleString()} Beneficiaries</span>
                  </div>
                </div>
              </div>

              {/* Long Narrative */}
              <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '1rem' }}>
                  The Mission & Field Story
                </h2>
                <div style={{
                  color: 'var(--text-main)',
                  lineHeight: '1.8',
                  fontSize: '1rem',
                  whiteSpace: 'pre-line'
                }}>
                  {campaign.longDescription || campaign.description}
                </div>
              </div>

              {/* Fund Allocation Breakdown */}
              {campaign.breakdown && campaign.breakdown.length > 0 && (
                <div className="card" style={{ padding: '2rem' }}>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PieChart size={22} color="var(--primary)" />
                    Transparent Fund Allocation Breakdown
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Every rupee donated to this campaign is strictly compartmentalized based on verified procurement schedules.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {campaign.breakdown.map((item, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '0.92rem', marginBottom: '0.35rem' }}>
                          <span style={{ color: 'var(--navy)' }}>{item.label}</span>
                          <span style={{ color: 'var(--primary)' }}>{item.percentage}%</span>
                        </div>
                        <div className="progress-track" style={{ height: '8px' }}>
                          <div className="progress-fill" style={{ width: `${item.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Campaign Donors Wall */}
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--navy)' }}>
                    Supporters of this Cause ({campaignDonations.length})
                  </h2>
                  <span className="badge badge-primary">Verified Contributions</span>
                </div>

                {campaignDonations.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Be the very first hero to contribute towards this urgent appeal!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {campaignDonations.map((d) => (
                      <div key={d.id} style={{
                        padding: '1rem',
                        backgroundColor: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.88rem'
                      }}>
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--navy)' }}>{d.donorName}</div>
                          {d.message && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', marginTop: '2px' }}>"{d.message}"</div>}
                        </div>
                        <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1rem' }}>
                          Rs. {Number(d.amount).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right 1 Column: Sticky Donation Checkout Box */}
            <div style={{ position: 'sticky', top: '90px' }}>
              <div className="card" style={{ padding: '2rem', borderTop: '6px solid var(--primary)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                    Campaign Target
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--navy)', fontFamily: 'var(--font-heading)' }}>
                    Rs. {Number(campaign.raisedAmount).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    raised of Rs. {Number(campaign.goalAmount).toLocaleString()} goal ({percentage}%)
                  </div>
                </div>

                <ProgressBar current={campaign.raisedAmount} total={campaign.goalAmount} isUrgent={campaign.isUrgent} showLabel={false} height={10} />

                {/* Quick Presets */}
                <div>
                  <label className="form-label">Select Contribution Amount (PKR)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {[1000, 2500, 5000, 10000, 25000, 50000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setCustomAmount(amt)}
                        style={{
                          padding: '0.6rem 0.2rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid',
                          borderColor: customAmount === amt ? 'var(--primary)' : 'var(--border-medium)',
                          backgroundColor: customAmount === amt ? 'var(--primary-light)' : '#FFFFFF',
                          color: customAmount === amt ? 'var(--primary-dark)' : 'var(--text-main)',
                          fontWeight: '700',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        Rs. {amt.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div className="input-icon-wrap">
                    <span className="input-icon" style={{ fontWeight: '700', color: 'var(--primary)' }}>Rs.</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(Number(e.target.value))}
                      className="form-control"
                      placeholder="Enter custom amount"
                      style={{ fontWeight: '700' }}
                    />
                  </div>
                </div>

                {/* Donate CTA */}
                <button
                  onClick={() => handleQuickDonate(customAmount)}
                  className="btn btn-lg btn-accent"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '700' }}
                >
                  <Heart size={20} fill="#FFFFFF" /> Donate Rs. {customAmount ? customAmount.toLocaleString() : 0}
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldCheck size={16} color="var(--primary)" />
                    <span>Official Tax-Exempt Receipt Generated Instantly</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} color="var(--primary)" />
                    <span>JazzCash, EasyPaisa, Card & Wire Transfer Supported</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', textAlign: 'center' }}>
                  <Link
                    to={`/volunteer?campaign=${campaign.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: 'var(--primary)',
                      fontSize: '0.88rem',
                      fontWeight: '600'
                    }}
                  >
                    <HandHeart size={16} /> Volunteer on this Ground Mission
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
