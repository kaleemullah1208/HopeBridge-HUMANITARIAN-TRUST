import React, { useState, useEffect } from 'react';
import { donorService } from '../../services/donorService';
import { donationService } from '../../services/donationService';
import { reportService } from '../../services/reportService';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { SkeletonTable } from '../../components/common/SkeletonTable';
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
  Radio,
  AlertCircle
} from 'lucide-react';

export const DonorManagement = () => {
  const [donors, setDonors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [donorHistory, setDonorHistory] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    setInitialLoading(true);

    const unsubscribe = donorService.subscribeDonors((liveDonors) => {
      setDonors(liveDonors);
      setInitialLoading(false);
    });

    return () => {
      unsubscribe();
    };
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

    reportService.exportToCSV(exportData, `GiveHope_Donors_${new Date().toISOString().split('T')[0]}.csv`);
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

  const totalFundsFromDonors = donors.reduce((sum, d) => sum + (Number(d.totalDonated) || 0), 0);
  const platinumDonors = donors.filter((d) => d.tier === 'Platinum Champion').length;
  const goldDonors = donors.filter((d) => d.tier === 'Gold Benefactor').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--navy)', margin: 0 }}>
              Donor Relationship Management
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
              Live Sync
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
            Cultivate donor loyalty, track giving tiers, and view complete transaction histories for institutional and individual benefactors.
          </p>
        </div>

        <button 
          onClick={handleExportCSV} 
          className="btn btn-sm btn-outline" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Download size={15} /> Export Donors CSV
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Total Registered Donors
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--navy)', marginTop: '0.25rem' }}>
            {donors.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Active individual & CSR partners
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Lifetime Contributions
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.25rem' }}>
            Rs. {totalFundsFromDonors.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Aggregated giving history
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Platinum Champions
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#8B5CF6', marginTop: '0.25rem' }}>
            {platinumDonors}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Donated Rs. 100,000+
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Gold Benefactors
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#F59E0B', marginTop: '0.25rem' }}>
            {goldDonors}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Donated Rs. 40,000+
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="input-icon-wrap" style={{ flex: '1 1 300px' }}>
            <Search size={18} className="input-icon" />
            <input
              type="text"
              placeholder="Search donor by name, email, phone, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
          </div>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', minWidth: '180px' }}
          >
            <option value="All">All Giving Tiers</option>
            <option value="Platinum Champion">Platinum Champion (Rs. 100k+)</option>
            <option value="Gold Benefactor">Gold Benefactor (Rs. 40k+)</option>
            <option value="Silver Supporter">Silver Supporter (Rs. 15k+)</option>
            <option value="Bronze Friend">Bronze Friend</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)' }}>Donors Directory ({filteredDonors.length})</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time giving ledger calculation</p>
          </div>
        </div>

        <div className="table-responsive">
          {initialLoading ? (
            <SkeletonTable rows={5} cols={5} />
          ) : filteredDonors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
              <AlertCircle size={36} style={{ margin: '0 auto 0.75rem auto', color: 'var(--text-light)' }} />
              <div style={{ fontWeight: '600', fontSize: '1.05rem', color: 'var(--navy)' }}>No donors match your criteria</div>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Try clearing your filters.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Donor Details</th>
                  <th>Giving Tier</th>
                  <th>Total Contributed</th>
                  <th>Gifts Count</th>
                  <th>Last Donation</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--navy)' }}>{d.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.email}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>{d.phone} • {d.city || 'Pakistan'}</div>
                    </td>
                    <td>
                      <span className="badge" style={{
                        backgroundColor: d.tier?.includes('Platinum') ? '#F5F3FF' : (d.tier?.includes('Gold') ? '#FEF3C7' : '#EFF6FF'),
                        color: d.tier?.includes('Platinum') ? '#7C3AED' : (d.tier?.includes('Gold') ? '#D97706' : '#2563EB'),
                        border: '1px solid currentColor',
                        fontSize: '0.75rem'
                      }}>
                        {d.tier}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.98rem' }}>
                        Rs. {Number(d.totalDonated).toLocaleString()}
                      </div>
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--navy)' }}>
                      {d.donationsCount} donations
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {d.lastDonationDate || 'N/A'}
                    </td>
                    <td>
                      <button
                        onClick={() => openDonorModal(d)}
                        className="btn btn-sm btn-outline"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Eye size={13} /> History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Donor History Modal */}
      {selectedDonor && (
        <Modal
          isOpen={!!selectedDonor}
          onClose={() => setSelectedDonor(null)}
          title={`Donor Profile: ${selectedDonor.name}`}
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', margin: 0 }}>{selectedDonor.name}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{selectedDonor.email} • {selectedDonor.phone}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)' }}>
                  Rs. {Number(selectedDonor.totalDonated).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lifetime Giving</div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--navy)', marginBottom: '0.75rem' }}>
                Recent Transactions ({donorHistory.length})
              </h4>

              {donorHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No previous online ledger records found under this email.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '250px', overflowY: 'auto' }}>
                  {donorHistory.map((h) => (
                    <div key={h.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--navy)' }}>{h.campaignTitle}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{h.id} • {h.transactionDate?.split('T')[0]} • {h.paymentMethod}</div>
                      </div>
                      <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.95rem' }}>
                        Rs. {Number(h.amount).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedDonor(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DonorManagement;
