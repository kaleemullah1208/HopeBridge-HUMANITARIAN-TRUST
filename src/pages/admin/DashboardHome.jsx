import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { DonationReceiptModal } from '../../components/common/DonationReceiptModal';
import { donationService } from '../../services/donationService';
import { volunteerService } from '../../services/volunteerService';
import { campaignService } from '../../services/campaignService';
import { donorService } from '../../services/donorService';
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
  RefreshCw
} from 'lucide-react';
import { MONTHLY_ANALYTICS_DATA, CATEGORY_DISTRIBUTION } from '../../data/mockData';

export const DashboardHome = () => {
  const [donationStats, setDonationStats] = useState({ totalRaised: 0, completedCount: 0, averageDonation: 0 });
  const [volunteerStats, setVolunteerStats] = useState({ total: 0, approved: 0, pending: 0 });
  const [campaignsCount, setCampaignsCount] = useState(0);
  const [recentDonations, setRecentDonations] = useState([]);
  const [recentVolunteers, setRecentVolunteers] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loadingLive, setLoadingLive] = useState(false);
  const { showToast } = useToast();

  const loadData = async () => {
    // 1. Immediate render from cache
    setDonationStats(donationService.getDonationStats());
    setVolunteerStats(volunteerService.getVolunteerStats());
    const allCampaigns = campaignService.getCampaigns();
    setCampaignsCount(allCampaigns.filter((c) => c.status === 'Active').length);
    setRecentDonations(donationService.getDonations().slice(0, 5));
    setRecentVolunteers(volunteerService.getVolunteers().slice(0, 5));

    // 2. Fetch live data from Firestore in background
    setLoadingLive(true);
    try {
      await Promise.allSettled([
        donorService.fetchDonors(),
        volunteerService.fetchVolunteers(),
        donationService.fetchDonations(),
        campaignService.fetchCampaignsFromFirestore()
      ]);

      setDonationStats(donationService.getDonationStats());
      setVolunteerStats(volunteerService.getVolunteerStats());
      const updatedCampaigns = campaignService.getCampaigns();
      setCampaignsCount(updatedCampaigns.filter((c) => c.status === 'Active').length);
      setRecentDonations(donationService.getDonations().slice(0, 5));
      setRecentVolunteers(volunteerService.getVolunteers().slice(0, 5));
    } catch (err) {
      console.warn('Dashboard live sync note:', err);
    }
    setLoadingLive(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveVolunteer = async (id, name) => {
    const res = await volunteerService.updateVolunteerStatus(id, 'Approved');
    if (res.success) {
      showToast('Volunteer Approved', `${name} is now marked as an active volunteer.`, 'success');
      loadData();
    }
  };

  const handleRejectVolunteer = async (id, name) => {
    const res = await volunteerService.updateVolunteerStatus(id, 'Rejected');
    if (res.success) {
      showToast('Application Rejected', `Application for ${name} has been rejected.`, 'info');
      loadData();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner / Welcome */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--navy)' }}>
            Humanitarian Executive Overview
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Real-time telemetry on active campaigns, donation ledger, and field volunteer deployments.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            onClick={loadData} 
            disabled={loadingLive}
            className="btn btn-sm btn-outline" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={15} className={loadingLive ? 'spin' : ''} /> {loadingLive ? 'Syncing Firebase...' : 'Sync with Firebase'}
          </button>
          <Link to="/admin/campaigns" className="btn btn-sm btn-outline">
            <PlusCircle size={15} /> Create Campaign
          </Link>
          <Link to="/admin/donations" className="btn btn-sm btn-primary">
            <DollarSign size={15} /> Record Offline Donation
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          title="Total Funds Raised"
          value={`Rs. ${donationStats.totalRaised.toLocaleString()}`}
          icon={DollarSign}
          trend="+22.4%"
          trendPositive={true}
          description="vs last month"
          accentColor="var(--primary)"
          bgColor="var(--primary-light)"
        />

        <StatCard
          title="Completed Donations"
          value={donationStats.completedCount}
          icon={TrendingUp}
          trend="+18%"
          trendPositive={true}
          description="verified receipts"
          accentColor="#3B82F6"
          bgColor="#EFF6FF"
        />

        <StatCard
          title="Registered Volunteers"
          value={volunteerStats.total}
          icon={HandHeart}
          trend={`${volunteerStats.pending} pending`}
          trendPositive={volunteerStats.pending === 0}
          description="applications to review"
          accentColor="#F59E0B"
          bgColor="#FEF3C7"
        />

        <StatCard
          title="Active Relief Missions"
          value={campaignsCount}
          icon={Megaphone}
          description="ongoing ground projects"
          accentColor="#059669"
          bgColor="#ECFDF5"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-8">
        {/* Main Chart: Donation Trends */}
        <div className="card" style={{ gridColumn: 'span 2', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)' }}>Donation Inflow Trends</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Target vs Actual Collections (Jan - Sep 2026)</p>
            </div>
            <span className="badge badge-primary">PKR (Thousands)</span>
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

      {/* Tables Row: Recent Donations & Pending Volunteers */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left: Recent Donations */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>Recent Ledger Entries</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Latest contributions verified</p>
            </div>
            <Link to="/admin/donations" className="btn btn-sm btn-outline" style={{ fontSize: '0.78rem' }}>
              View All <ArrowRight size={13} />
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentDonations.map((d) => (
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
          </div>
        </div>

        {/* Right: Recent Volunteer Applications */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>Volunteer Applications</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pending reviews & onboarding</p>
            </div>
            <Link to="/admin/volunteers" className="btn btn-sm btn-outline" style={{ fontSize: '0.78rem' }}>
              Manage All <ArrowRight size={13} />
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Volunteer</th>
                  <th>Interest</th>
                  <th>Status</th>
                  <th>Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentVolunteers.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--navy)' }}>{v.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.phone}</div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {v.areaOfInterest}
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
                            style={{ padding: '0.3rem 0.5rem', backgroundColor: 'var(--status-success)', borderColor: 'var(--status-success)' }}
                            title="Approve Volunteer"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => handleRejectVolunteer(v.id, v.name)}
                            className="btn btn-sm btn-danger-outline"
                            style={{ padding: '0.3rem 0.5rem' }}
                            title="Reject Volunteer"
                          >
                            <CloseIcon size={14} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
