import React, { useState, useEffect } from 'react';
import { donorService } from '../../services/donorService';
import { donationService } from '../../services/donationService';
import { reportService } from '../../services/reportService';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { 
  Users, 
  Search, 
  Download, 
  Eye, 
  Award, 
  Heart, 
  Calendar, 
  DollarSign, 
  Mail, 
  Phone, 
  MapPin,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const DonorManagement = () => {
  const [donors, setDonors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [donorHistory, setDonorHistory] = useState([]);

  const [loadingLive, setLoadingLive] = useState(false);
  const { showToast } = useToast();

  const loadDonors = async () => {
    // Immediate load from cache
    setDonors(donorService.getDonors());
    setLoadingLive(true);
    const liveList = await donorService.fetchDonors();
    setDonors(liveList);
    setLoadingLive(false);
  };

  useEffect(() => {
    loadDonors();
  }, []);

  const openDonorModal = (donor) => {
    setSelectedDonor(donor);
    const history = donorService.getDonorDonations(donor.email);
    setDonorHistory(history);
  };

  const handleExportCSV = () => {
    const exportData = filteredDonors.map((d) => ({
      ID: d.id,
      Name: d.name,
      Email: d.email,
      Phone: d.phone,
      City: d.city,
      TotalDonated: d.totalDonated,
      DonationsCount: d.donationsCount,
      LastDonationDate: d.lastDonationDate,
      Tier: d.tier
    }));

    reportService.exportToCSV(exportData, `Donors_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    showToast('Export Complete', 'Donor directory exported to CSV.', 'success');
  };

  const filteredDonors = donors.filter((d) => {
    const matchesSearch = d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.phone?.includes(searchQuery) ||
                          d.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'All' || d.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const getTierBadge = (tier) => {
    if (tier?.includes('Platinum')) return <Badge variant="primary" style={{ backgroundColor: '#EDE9FE', color: '#6D28D9', borderColor: '#DDD6FE' }}>💎 {tier}</Badge>;
    if (tier?.includes('Gold')) return <Badge variant="warning">🏆 {tier}</Badge>;
    if (tier?.includes('Silver')) return <Badge variant="neutral">🥈 {tier}</Badge>;
    return <Badge variant="success">🥉 {tier}</Badge>;
  };

  const totalLifetimeRaised = donors.reduce((acc, d) => acc + (d.totalDonated || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--navy)' }}>Donor Relations & CRM</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Cultivate long-term philanthropic partnerships, view giving history, and manage donor tiers.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={loadDonors} 
            disabled={loadingLive}
            className="btn btn-sm btn-outline" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={15} className={loadingLive ? 'spin' : ''} /> {loadingLive ? 'Syncing Firebase...' : 'Sync with Firebase'}
          </button>
          <button onClick={handleExportCSV} className="btn btn-sm btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Download size={15} /> Export Donors CSV
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Registered Donors</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--navy)', marginTop: '0.2rem' }}>
            {donors.length}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lifetime Donor Giving</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.2rem' }}>
            Rs. {totalLifetimeRaised.toLocaleString()}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Average Lifetime Value (LTV)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#059669', marginTop: '0.2rem' }}>
            Rs. {donors.length > 0 ? Math.round(totalLifetimeRaised / donors.length).toLocaleString() : 0}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="input-icon-wrap" style={{ flex: '1 1 280px' }}>
            <Search size={16} className="input-icon" />
            <input
              type="text"
              placeholder="Search by Donor Name, Email, Phone, or City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ padding: '0.55rem 0.75rem 0.55rem 2.4rem', fontSize: '0.88rem' }}
            />
          </div>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
          >
            <option value="All">Donor Tier: All</option>
            <option value="Platinum Champion">Platinum Champion (&gt; Rs. 150k)</option>
            <option value="Gold Benefactor">Gold Benefactor (&gt; Rs. 100k)</option>
            <option value="Silver Supporter">Silver Supporter (&gt; Rs. 50k)</option>
            <option value="Bronze Friend">Bronze Friend (&lt; Rs. 50k)</option>
          </select>
        </div>
      </div>

      {/* Donors Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Donor Name</th>
                <th>Contact & City</th>
                <th>Total Donated (PKR)</th>
                <th>Donations Count</th>
                <th>Last Gift Date</th>
                <th>Donor Tier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No donor records found matching filter.
                  </td>
                </tr>
              ) : (
                filteredDonors.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--navy)' }}>{d.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {d.id}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'var(--navy)' }}>{d.email}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{d.phone} • {d.city}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1rem' }}>
                        Rs. {Number(d.totalDonated).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontWeight: '700' }}>
                        {d.donationsCount} Contributions
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {d.lastDonationDate}
                    </td>
                    <td>
                      {getTierBadge(d.tier)}
                    </td>
                    <td>
                      <button
                        onClick={() => openDonorModal(d)}
                        className="btn btn-sm btn-outline"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Eye size={13} /> History
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Donor History Profile Modal */}
      {selectedDonor && (
        <Modal
          isOpen={!!selectedDonor}
          onClose={() => setSelectedDonor(null)}
          title={`Donor Profile: ${selectedDonor.name}`}
          maxWidth="680px"
          footer={
            <button className="btn btn-secondary" onClick={() => setSelectedDonor(null)}>
              Close Profile
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Donor Header */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
              fontSize: '0.88rem'
            }}>
              <div><strong>Email:</strong> {selectedDonor.email}</div>
              <div><strong>Phone:</strong> {selectedDonor.phone}</div>
              <div><strong>City:</strong> {selectedDonor.city}</div>
              <div><strong>Tier:</strong> {selectedDonor.tier}</div>
              <div><strong>Lifetime Total:</strong> <span style={{ color: 'var(--primary)', fontWeight: '800' }}>Rs. {Number(selectedDonor.totalDonated).toLocaleString()}</span></div>
              <div><strong>Transactions:</strong> {selectedDonor.donationsCount} records</div>
            </div>

            {/* Donation History List */}
            <div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--navy)', marginBottom: '0.75rem' }}>
                Contribution History ({donorHistory.length})
              </h4>

              {donorHistory.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No individual ledger entries linked to this donor email.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '260px', overflowY: 'auto' }}>
                  {donorHistory.map((h) => (
                    <div
                      key={h.id}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.85rem'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--navy)' }}>{h.campaignTitle}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          TxID: {h.id} • {new Date(h.transactionDate).toLocaleDateString()} • {h.paymentMethod}
                        </div>
                      </div>
                      <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.95rem' }}>
                        Rs. {Number(h.amount).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
