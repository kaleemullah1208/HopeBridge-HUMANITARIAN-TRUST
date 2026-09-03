import React, { useState, useEffect } from 'react';
import { donationService } from '../../services/donationService';
import { campaignService } from '../../services/campaignService';
import { reportService } from '../../services/reportService';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { DonationReceiptModal } from '../../components/common/DonationReceiptModal';
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
  RefreshCw
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
  const [loadingLive, setLoadingLive] = useState(false);
  
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

  const loadData = async () => {
    setDonations(donationService.getDonations());
    setStats(donationService.getDonationStats());
    const campList = campaignService.getCampaigns();
    setCampaigns(campList);

    setLoadingLive(true);
    const liveDonations = await donationService.fetchDonations();
    setDonations(liveDonations);
    setStats(donationService.getDonationStats());
    setLoadingLive(false);

    if (!newDonation.campaignId && campList.length > 0) {
      setNewDonation((prev) => ({ ...prev, campaignId: campList[0].id }));
    }
  };

  useEffect(() => {
    loadData();
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

    const success = reportService.exportToCSV(exportData, `Donation_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
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

    const selectedCamp = campaigns.find((c) => c.id === newDonation.campaignId);
    const payload = {
      ...newDonation,
      amount: Number(newDonation.amount),
      campaignTitle: selectedCamp ? selectedCamp.title : 'General Humanitarian Fund'
    };

    const res = await donationService.createDonation(payload);
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
      loadData();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const res = await donationService.updateDonationStatus(id, newStatus);
    if (res.success) {
      showToast('Status Updated', `Donation ${id} status changed to ${newStatus}.`, 'success');
      loadData();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete transaction record ${id}?`)) {
      const res = await donationService.deleteDonation(id);
      if (res.success) {
        showToast('Record Deleted', `Transaction ${id} removed.`, 'info');
        loadData();
      }
    }
  };

  const filteredDonations = donations.filter((d) => {
    const matchesSearch = d.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.donorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.campaignTitle?.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--navy)' }}>Donation Ledger & Receipts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Comprehensive record of all incoming financial contributions, receipts, and payment statuses.
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
          <button onClick={handleExportCSV} className="btn btn-sm btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Download size={15} /> Export CSV
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="btn btn-sm btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={15} /> Record Offline Donation
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Collected</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.2rem' }}>
            Rs. {stats.totalRaised.toLocaleString()}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completed Transactions</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--navy)', marginTop: '0.2rem' }}>
            {stats.completedCount}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Approvals</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--status-warning)', marginTop: '0.2rem' }}>
            {stats.pendingCount}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Average Gift Size</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#059669', marginTop: '0.2rem' }}>
            Rs. {stats.averageDonation.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="input-icon-wrap" style={{ flex: '1 1 280px' }}>
            <Search size={16} className="input-icon" />
            <input
              type="text"
              placeholder="Search by Donor, Email, TxID, or Campaign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ padding: '0.55rem 0.75rem 0.55rem 2.4rem', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="All">Status: All</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>

            <select
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="All">Campaign: All</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>

            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="All">Gateway: All</option>
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
              style={{ width: 'auto', padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="date-desc">Newest Date</option>
              <option value="date-asc">Oldest Date</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Donations Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>TxID / Date</th>
                <th>Donor Information</th>
                <th>Allocated Campaign</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No donation records found matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDonations.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--navy)', fontSize: '0.85rem' }}>{d.id}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(d.transactionDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--navy)' }}>{d.donorName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.email}</div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '200px', fontSize: '0.85rem', color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {d.campaignTitle}
                      </div>
                      <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>{d.donationType || 'One-Time'}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1rem' }}>
                        Rs. {Number(d.amount).toLocaleString()}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {d.paymentMethod}
                    </td>
                    <td>
                      <select
                        value={d.status}
                        onChange={(e) => handleStatusChange(d.id, e.target.value)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          border: '1px solid var(--border-medium)',
                          backgroundColor: d.status === 'Completed' ? 'var(--status-success-bg)' : (d.status === 'Pending' ? 'var(--status-warning-bg)' : 'var(--status-danger-bg)'),
                          color: d.status === 'Completed' ? 'var(--status-success-text)' : (d.status === 'Pending' ? 'var(--status-warning-text)' : 'var(--status-danger-text)'),
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => setSelectedReceipt(d)}
                          className="btn btn-sm btn-outline"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                          title="View Official Tax Receipt"
                        >
                          <Eye size={13} /> Receipt
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="btn btn-sm btn-danger-outline"
                          style={{ padding: '0.35rem 0.5rem' }}
                          title="Delete Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Offline Donation Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Manual / Offline Donation"
        maxWidth="580px"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateDonation}>
              Save Donation & Issue Receipt
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateDonation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Donor Full Name <span className="required">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. Haji Muhammad Younas"
                value={newDonation.donorName}
                onChange={(e) => setNewDonation({ ...newDonation, donorName: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Donor Email (Optional)</label>
              <input
                type="email"
                placeholder="donor@example.com"
                value={newDonation.email}
                onChange={(e) => setNewDonation({ ...newDonation, email: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Amount (PKR) <span className="required">*</span></label>
              <input
                type="number"
                required
                placeholder="50000"
                value={newDonation.amount}
                onChange={(e) => setNewDonation({ ...newDonation, amount: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                value={newDonation.paymentMethod}
                onChange={(e) => setNewDonation({ ...newDonation, paymentMethod: e.target.value })}
                className="form-control"
              >
                <option value="Cash / Cheque Collection">Cash / Cheque Collection</option>
                <option value="Direct Bank Wire">Direct Bank Wire</option>
                <option value="JazzCash Merchant">JazzCash Merchant</option>
                <option value="EasyPaisa Merchant">EasyPaisa Merchant</option>
                <option value="Credit Card">Credit Card</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assign to Campaign</label>
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
            <label className="form-label">Internal / Dedication Notes</label>
            <input
              type="text"
              placeholder="e.g. Received via Cheque #98124 HBL Branch"
              value={newDonation.message}
              onChange={(e) => setNewDonation({ ...newDonation, message: e.target.value })}
              className="form-control"
            />
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
