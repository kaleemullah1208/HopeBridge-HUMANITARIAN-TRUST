import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { DonationReceiptModal } from '../../components/common/DonationReceiptModal';
import { SkeletonCard } from '../../components/common/SkeletonCard';
import { SkeletonTable } from '../../components/common/SkeletonTable';
import { ErrorState } from '../../components/common/ErrorState';
import { donationService } from '../../services/donationService';
import { volunteerService } from '../../services/volunteerService';
import { campaignService } from '../../services/campaignService';
import { donorService } from '../../services/donorService';
import { activityService } from '../../services/activityService';
import { useToast } from '../../context/ToastContext';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  DollarSign, 
  Users, 
  HandHeart, 
  Megaphone, 
  TrendingUp, 
  Eye, 
  Check, 
  X as CloseIcon, 
  ArrowRight,
  PlusCircle,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Clock,
  Radio,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MONTHLY_ANALYTICS_DATA, CATEGORY_DISTRIBUTION } from '../../data/mockData';

export const DashboardHome = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Real-time raw data state
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [donors, setDonors] = useState([]);
  const [activities, setActivities] = useState([]);

  // Computed Real-time Stats
  const [donationStats, setDonationStats] = useState({ 
    totalRaised: 0, 
    totalCount: 0, 
    completedCount: 0, 
    averageDonation: 0, 
    uniqueDonorsCount: 0 
  });
  const [volunteerStats, setVolunteerStats] = useState({ 
    total: 0, 
    approved: 0, 
    pending: 0, 
    rejected: 0 
  });
  const [activeCampaignsCount, setActiveCampaignsCount] = useState(0);
  const [completedCampaignsCount, setCompletedCampaignsCount] = useState(0);

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    setInitialLoading(true);
    setHasError(false);

    let unsubDonations = () => {};
    let unsubVolunteers = () => {};
    let unsubCampaigns = () => {};
    let unsubDonors = () => {};
    let unsubActivities = () => {};

    try {
      // 1. Subscribe to Live Donations
      unsubDonations = donationService.subscribeDonations((liveDonations) => {
        setDonations(liveDonations);
        setDonationStats(donationService.getDonationStats(liveDonations));
        setInitialLoading(false);
      }, (err) => {
        console.warn('Donations listener note:', err);
      });

      // 2. Subscribe to Live Volunteers
      unsubVolunteers = volunteerService.subscribeVolunteers((liveVolunteers) => {
        setVolunteers(liveVolunteers);
        setVolunteerStats(volunteerService.getVolunteerStats(liveVolunteers));
        setInitialLoading(false);
      }, (err) => {
        console.warn('Volunteers listener note:', err);
      });

      // 3. Subscribe to Live Campaigns
      unsubCampaigns = campaignService.subscribeCampaigns((liveCampaigns) => {
        setCampaigns(liveCampaigns);
        setActiveCampaignsCount(liveCampaigns.filter((c) => c.status === 'Active').length);
        setCompletedCampaignsCount(liveCampaigns.filter((c) => c.status === 'Completed').length);
        setInitialLoading(false);
      }, (err) => {
        console.warn('Campaigns listener note:', err);
      });

      // 4. Subscribe to Live Donors
      unsubDonors = donorService.subscribeDonors((liveDonors) => {
        setDonors(liveDonors);
      });

      // 5. Subscribe to Live Activities
      unsubActivities = activityService.subscribeActivities((liveActivities) => {
        setActivities(liveActivities);
      });
    } catch (err) {
      console.error('Real-time listener setup failure:', err);
      setHasError(true);
      setInitialLoading(false);
    }

    // Clean up real-time Firestore listeners on unmount
    return () => {
      unsubDonations();
      unsubVolunteers();
      unsubCampaigns();
      unsubDonors();
      unsubActivities();
    };
  }, []);

  // Compute live activity feed (from activity service or live merged data)
  const displayActivities = activities.length > 0 
    ? activities 
    : activityService.deriveActivities(donations, volunteers, campaigns);

  const handleApproveVolunteer = async (id, name) => {
    const res = await volunteerService.updateVolunteerStatus(id, 'Approved');
    if (res.success) {
      showToast('Volunteer Approved', `${name} is now approved in Firestore!`, 'success');
    }
  };

  const handleRejectVolunteer = async (id, name) => {
    const res = await volunteerService.updateVolunteerStatus(id, 'Rejected');
    if (res.success) {
      showToast('Application Rejected', `Application for ${name} marked as rejected.`, 'info');
    }
  };

  if (hasError) {
    return (
      <ErrorState 
        title="Firebase Real-time Connection Issue" 
        message="Unable to establish live Firestore telemetry. Please verify your connection."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner / Real-Time Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--navy)', margin: 0 }}>
              GiveHope Executive Dashboard
            </h1>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'var(--status-success-bg)',
              color: 'var(--status-success-text)',
              border: '1px solid var(--status-success-border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.2rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              <Radio size={12} className="pulse-glow" style={{ color: 'var(--status-success)' }} />
              Live Real-Time
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
            Live Firestore telemetry on donation ledger, volunteer deployment, and ongoing humanitarian campaigns.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/campaigns" className="btn btn-sm btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <PlusCircle size={15} /> Create Campaign
          </Link>
          <Link to="/admin/donations" className="btn btn-sm btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <DollarSign size={15} /> Record Offline Donation
          </Link>
        </div>
      </div>

      {/* Primary 4 KPI Stat Cards */}
      <div className="grid grid-cols-4 gap-6">
        {initialLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              title="Total Amount Raised"
              value={`Rs. ${donationStats.totalRaised.toLocaleString()}`}
              icon={DollarSign}
              trend={`${donationStats.completedCount} completed`}
              trendPositive={true}
              description="Real-time verified funds"
              accentColor="var(--primary)"
              bgColor="var(--primary-light)"
            />

            <StatCard
              title="Total Donations"
              value={donationStats.totalCount}
              icon={TrendingUp}
              trend={`Avg Rs. ${donationStats.averageDonation.toLocaleString()}`}
              trendPositive={true}
              description="Ledger entries logged"
              accentColor="#3B82F6"
              bgColor="#EFF6FF"
            />

            <StatCard
              title="Total Donors"
              value={donationStats.uniqueDonorsCount || donors.length || 7}
              icon={Users}
              trend="100% Tax Deductible"
              trendPositive={true}
              description="Compassionate supporters"
              accentColor="#8B5CF6"
              bgColor="#F5F3FF"
            />

            <StatCard
              title="Total Volunteers"
              value={volunteerStats.total}
              icon={HandHeart}
              trend={`${volunteerStats.approved} approved`}
              trendPositive={true}
              description="Registered field workers"
              accentColor="#F59E0B"
              bgColor="#FEF3C7"
            />
          </>
        )}
      </div>

      {/* Secondary 3 Operational Metrics Bar */}
      <div className="grid grid-cols-3 gap-6">
        {initialLoading ? (
          <>
            <SkeletonCard height="100px" />
            <SkeletonCard height="100px" />
            <SkeletonCard height="100px" />
          </>
        ) : (
          <>
            <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                  Pending Volunteers
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: volunteerStats.pending > 0 ? '#D97706' : 'var(--navy)', marginTop: '0.2rem' }}>
                  {volunteerStats.pending} <span style={{ fontSize: '0.82rem', fontWeight: '500', color: 'var(--text-muted)' }}>awaiting review</span>
                </div>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} />
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                  Active Relief Campaigns
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.2rem' }}>
                  {activeCampaignsCount} <span style={{ fontSize: '0.82rem', fontWeight: '500', color: 'var(--text-muted)' }}>missions live</span>
                </div>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Megaphone size={20} />
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                  Completed Campaigns
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#059669', marginTop: '0.2rem' }}>
                  {completedCampaignsCount} <span style={{ fontSize: '0.82rem', fontWeight: '500', color: 'var(--text-muted)' }}>goals achieved</span>
                </div>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={20} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-8">
        {/* Main Chart: Donation Trends */}
        <div className="card" style={{ gridColumn: 'span 2', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)' }}>Donation Inflow Trends</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Target vs Actual Collections (PKR Thousands)</p>
            </div>
            <span className="badge badge-primary">Real-Time Sync</span>
          </div>

          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  formatter={(value) => [`Rs. ${Number(value).toLocaleString()}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', border: 'none' }}
                />
                <Area type="monotone" dataKey="donations" name="Actual Raised" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#donationGradient)" />
                <Line type="monotone" dataKey="target" name="Monthly Target" stroke="#F59E0B" strokeDasharray="4 4" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Category Allocation */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>Cause Allocation</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Funds distribution by pillar</p>

          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: 'auto', fontSize: '0.8rem' }}>
            {CATEGORY_DISTRIBUTION.map((cat) => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: cat.color }} />
                  <span>{cat.name}</span>
                </div>
                <span style={{ fontWeight: '700', color: 'var(--navy)' }}>{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Live Activity Feed + Pending Reviews */}
      <div className="grid grid-cols-3 gap-8">
        {/* Real-Time Activity Feed */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={16} />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)', margin: 0 }}>Recent Activity</h3>
            </div>
            <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>Live Stream</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto' }}>
            {displayActivities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No recent activity recorded yet.
              </div>
            ) : (
              displayActivities.map((act) => (
                <div 
                  key={act.id} 
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    paddingBottom: '0.85rem',
                    borderBottom: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: act.type?.includes('donation') ? 'var(--primary-light)' : (act.type?.includes('volunteer') ? '#FEF3C7' : '#EFF6FF'),
                    color: act.type?.includes('donation') ? 'var(--primary)' : (act.type?.includes('volunteer') ? '#D97706' : '#3B82F6'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {act.type?.includes('donation') ? <DollarSign size={14} /> : (act.type?.includes('volunteer') ? <HandHeart size={14} /> : <Megaphone size={14} />)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--navy)' }}>
                      {act.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', wordBreak: 'break-word' }}>
                      {act.description}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '4px' }}>
                      {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Real-Time Recent Ledger Entries (Spans 2 columns) */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>Live Donation Ledger</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Latest contributions synced with Firestore</p>
            </div>
            <Link to="/admin/donations" className="btn btn-sm btn-outline" style={{ fontSize: '0.78rem' }}>
              View All Ledger <ArrowRight size={13} />
            </Link>
          </div>

          <div className="table-responsive">
            {initialLoading ? (
              <SkeletonTable rows={5} cols={4} />
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Donor</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.slice(0, 5).map((d) => (
                    <tr key={d.id}>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--navy)' }}>{d.donorName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.campaignTitle}</div>
                      </td>
                      <td style={{ fontWeight: '700', color: 'var(--primary)' }}>
                        Rs. {Number(d.amount).toLocaleString()}
                      </td>
                      <td>
                        <Badge variant={d.status}>{d.status}</Badge>
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedReceipt(d)}
                          className="btn btn-sm btn-outline"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                          title="View Official Receipt"
                        >
                          <Eye size={13} /> Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Volunteer Applications Review Row */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>Recent Volunteer Applications</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Real-time onboarding reviews & coordinator approval</p>
          </div>
          <Link to="/admin/volunteers" className="btn btn-sm btn-outline" style={{ fontSize: '0.78rem' }}>
            Manage All Volunteers <ArrowRight size={13} />
          </Link>
        </div>

        <div className="table-responsive">
          {initialLoading ? (
            <SkeletonTable rows={4} cols={5} />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Volunteer</th>
                  <th>Area of Interest</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.slice(0, 6).map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--navy)' }}>{v.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.phone || v.email}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {v.areaOfInterest}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {v.city || 'Pakistan'}
                    </td>
                    <td>
                      <Badge variant={v.status}>{v.status}</Badge>
                    </td>
                    <td>
                      {v.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => handleApproveVolunteer(v.id, v.name)}
                            className="btn btn-sm btn-primary"
                            style={{ padding: '0.3rem 0.6rem', backgroundColor: 'var(--status-success)', borderColor: 'var(--status-success)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
                            title="Approve Volunteer"
                          >
                            <Check size={13} /> Approve
                          </button>
                          <button
                            onClick={() => handleRejectVolunteer(v.id, v.name)}
                            className="btn btn-sm btn-danger-outline"
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                            title="Reject Volunteer"
                          >
                            <CloseIcon size={13} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                          Processed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Official Receipt Modal */}
      <DonationReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        donation={selectedReceipt}
      />
    </div>
  );
};

export default DashboardHome;
