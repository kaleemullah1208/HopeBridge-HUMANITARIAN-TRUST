import React, { useState, useEffect } from 'react';
import { donationService } from '../../services/donationService';
import { campaignService } from '../../services/campaignService';
import { reportService } from '../../services/reportService';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { DonationReceiptModal } from '../../components/common/DonationReceiptModal';
import { SkeletonTable } from '../../components/common/SkeletonTable';
import { ButtonLoader } from '../../components/common/ButtonLoader';
import { useToast } from '../../context/ToastContext';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  SlidersHorizontal,
  DollarSign,
  Radio,
  FileSpreadsheet
} from 'lucide-react';

export const DonationsManagement = () => {
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({ totalRaised: 0, completedCount: 0, pendingCount: 0, averageDonation: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [campaignFilter, setCampaignFilter] = useState('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Modals state
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDonation, setNewDonation] = useState({
    donorName: '',
    email: '',
    phone: '',
    amount: '',
    campaignId: '',
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    message: 'Manual offline donation entry.'
  });

  const { showToast } = useToast();

  useEffect(() => {
    setInitialLoading(true);

    // Subscribe to Live Donations
    const unsubDonations = donationService.subscribeDonations((liveDonations) => {
      setDonations(liveDonations);
      setStats(donationService.getDonationStats(liveDonations));
      setInitialLoading(false);
    });

    // Subscribe to Live Campaigns
    const unsubCampaigns = campaignService.subscribeCampaigns((liveCampaigns) => {
      setCampaigns(liveCampaigns);
      if (liveCampaigns.length > 0) {
        setNewDonation((prev) => ({ ...prev, campaignId: prev.campaignId || liveCampaigns[0].id }));
      }
    });

    return () => {
      unsubDonations();
      unsubCampaigns();
    };
  }, []);

  const handleExportCSV = () => {
    const exportData = filteredDonations.map((d) => ({
      TransactionID: d.id,
      Donor: d.donorName,
      Email: d.email,
      Phone: d.phone || '',
      Amount: d.amount,
      Currency: d.currency || 'PKR',
      Campaign: d.campaignTitle,
      PaymentMethod: d.paymentMethod,
      Status: d.status,
      Date: d.transactionDate,
      TaxExemptID: d.taxExemptId || ''
    }));

    const success = reportService.exportToCSV(exportData, `GiveHope_Donation_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    if (success) {
      showToast('Export Successful', 'Donation ledger exported to CSV file.', 'success');
    }
  };

  const handleCreateDonation = async (e) => {
    e.preventDefault();
    if (!newDonation.donorName || !newDonation.amount || Number(newDonation.amount) <= 0) {
      showToast('Validation Error', 'Please specify a donor name and valid donation amount.', 'error');
      return;
    }

    setSubmitting(true);
    const selectedCamp = campaigns.find((c) => c.id === newDonation.campaignId);
    const payload = {
      ...newDonation,
      amount: Number(newDonation.amount),
      campaignTitle: selectedCamp ? selectedCamp.title : 'General Humanitarian Fund'
    };

    const res = await donationService.createDonation(payload);
    setSubmitting(false);

    if (res.success) {
      showToast('Donation Recorded', `Successfully logged Rs. ${Number(newDonation.amount).toLocaleString()} for ${newDonation.donorName}.`, 'success');
      setIsAddModalOpen(false);
      setNewDonation({
        donorName: '',
        email: '',
        phone: '',
        amount: '',
        campaignId: campaigns[0]?.id || '',
        paymentMethod: 'Bank Transfer',
        status: 'Completed',
        message: 'Manual offline donation entry.'
      });
    } else {
      showToast('Error', res.error || 'Failed to save donation record.', 'error');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const res = await donationService.updateDonationStatus(id, newStatus);
    if (res.success) {
      showToast('Status Updated', `Donation ${id} marked as ${newStatus}.`, 'info');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this donation entry?')) {
      const res = await donationService.deleteDonation(id);
      if (res.success) {
        showToast('Donation Removed', `Entry ${id} has been deleted.`, 'info');
      }
    }
  };

  // Filter & Sort Logic
  const filteredDonations = donations.filter((d) => {
    const matchesSearch = 
      (d.donorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.taxExemptId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.campaignTitle || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    const matchesCampaign = campaignFilter === 'All' || d.campaignId === campaignFilter;
    const matchesPayment = paymentMethodFilter === 'All' || d.paymentMethod === paymentMethodFilter;

    return matchesSearch && matchesStatus && matchesCampaign && matchesPayment;
  }).sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.transactionDate) - new Date(a.transactionDate);
    if (sortBy === 'date-asc') return new Date(a.transactionDate) - new Date(b.transactionDate);
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    if (sortBy === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--navy)', margin: 0 }}>
              Donation Ledger & Receipts
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
            Track and verify all online and offline humanitarian transactions in real time with FBR tax receipts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            onClick={handleExportCSV} 
            className="btn btn-sm btn-outline" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Download size={15} /> Export CSV
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="btn btn-sm btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={15} /> Record Offline Donation
          </button>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-4 gap-6">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Total Funds Raised
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.25rem' }}>
            Rs. {stats.totalRaised.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {stats.completedCount} verified transactions
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Total Transactions
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--navy)', marginTop: '0.25rem' }}>
            {donations.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            All payment channels
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Average Contribution
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#3B82F6', marginTop: '0.25rem' }}>
            Rs. {stats.averageDonation.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Per completed donation
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Pending Verification
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: stats.pendingCount > 0 ? '#F59E0B' : 'var(--navy)', marginTop: '0.25rem' }}>
            {stats.pendingCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Awaiting gateway clearance
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="input-icon-wrap" style={{ flex: '1 1 280px' }}>
            <Search size={18} className="input-icon" />
            <input
              type="text"
              placeholder="Search by Donor, Email, Transaction ID, Receipt #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', minWidth: '130px' }}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>

            <select
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', minWidth: '170px' }}
            >
              <option value="All">All Campaigns</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>

            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', minWidth: '140px' }}
            >
              <option value="All">All Payment Modes</option>
              <option value="JazzCash">JazzCash</option>
              <option value="EasyPaisa">EasyPaisa</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
              style={{ width: 'auto', minWidth: '140px' }}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)' }}>Donation Ledger ({filteredDonations.length})</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time updates as donors contribute</p>
          </div>
        </div>

        <div className="table-responsive">
          {initialLoading ? (
            <SkeletonTable rows={6} cols={6} />
          ) : filteredDonations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
              <AlertCircle size={36} style={{ margin: '0 auto 0.75rem auto', color: 'var(--text-light)' }} />
              <div style={{ fontWeight: '600', fontSize: '1.05rem', color: 'var(--navy)' }}>No donations match your filters</div>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Try modifying your search keywords or clear status filters.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Donor Details</th>
                  <th>Campaign</th>
                  <th>Amount</th>
                  <th>Channel</th>
                  <th>Status</th>
                  <th>Receipt / Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--navy)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {d.id}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '2px' }}>
                        {d.transactionDate ? new Date(d.transactionDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--navy)' }}>
                        {d.donorName} {d.anonymous && <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>Anon</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.email}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--navy)' }}>
                        {d.campaignTitle}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>{d.donationType || 'One-Time'}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.98rem' }}>
                        Rs. {Number(d.amount).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{d.currency || 'PKR'}</div>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {d.paymentMethod}
                    </td>
                    <td>
                      <select
                        value={d.status}
                        onChange={(e) => handleStatusChange(d.id, e.target.value)}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '0.2rem 0.4rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-medium)',
                          backgroundColor: d.status === 'Completed' ? 'var(--status-success-bg)' : (d.status === 'Pending' ? 'var(--status-warning-bg)' : 'var(--status-danger-bg)'),
                          color: d.status === 'Completed' ? 'var(--status-success-text)' : (d.status === 'Pending' ? 'var(--status-warning-text)' : 'var(--status-danger-text)')
                        }}
                      >
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          onClick={() => setSelectedReceipt(d)}
                          className="btn btn-sm btn-outline"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          title="Generate Tax Receipt"
                        >
                          <Eye size={13} /> Receipt
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="btn btn-sm btn-danger-outline"
                          style={{ padding: '0.3rem 0.5rem', color: 'var(--status-danger)' }}
                          title="Delete Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Offline Donation Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Offline Donation"
        maxWidth="540px"
      >
        <form onSubmit={handleCreateDonation}>
          <div className="form-group">
            <label className="form-label">Donor Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Tariq Mehmood"
              value={newDonation.donorName}
              onChange={(e) => setNewDonation({ ...newDonation, donorName: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="donor@example.com"
                value={newDonation.email}
                onChange={(e) => setNewDonation({ ...newDonation, email: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                placeholder="+92 300 1234567"
                value={newDonation.phone}
                onChange={(e) => setNewDonation({ ...newDonation, phone: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Donation Amount (PKR) *</label>
              <input
                type="number"
                required
                min="100"
                placeholder="e.g. 5000"
                value={newDonation.amount}
                onChange={(e) => setNewDonation({ ...newDonation, amount: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Channel</label>
              <select
                value={newDonation.paymentMethod}
                onChange={(e) => setNewDonation({ ...newDonation, paymentMethod: e.target.value })}
                className="form-control"
              >
                <option value="Cash / Cheque">Cash / Cheque</option>
                <option value="Bank Transfer">Bank Transfer (Direct SWIFT/IBAN)</option>
                <option value="JazzCash">JazzCash Agent</option>
                <option value="EasyPaisa">EasyPaisa Shop</option>
                <option value="Debit Card">POS Terminal Card</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Campaign *</label>
            <select
              value={newDonation.campaignId}
              onChange={(e) => setNewDonation({ ...newDonation, campaignId: e.target.value })}
              className="form-control"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Internal Note / Message</label>
            <textarea
              rows={2}
              placeholder="e.g. Direct bank deposit received at Gulberg branch."
              value={newDonation.message}
              onChange={(e) => setNewDonation({ ...newDonation, message: e.target.value })}
              className="form-control"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <ButtonLoader
              type="submit"
              loading={submitting}
              loadingText="Logging Donation..."
              className="btn btn-primary"
              icon={<CheckCircle2 size={16} />}
            >
              Log Donation Entry
            </ButtonLoader>
          </div>
        </form>
      </Modal>

      {/* Official Receipt Modal */}
      <DonationReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        donation={selectedReceipt}
      />
    </div>
  );
};

export default DonationsManagement;
