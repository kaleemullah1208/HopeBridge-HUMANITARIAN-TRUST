import React, { useState, useEffect } from 'react';
import { aidRequestService } from '../../services/aidRequestService';
import { reportService } from '../../services/reportService';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { SkeletonTable } from '../../components/common/SkeletonTable';
import { ButtonLoader } from '../../components/common/ButtonLoader';
import { useToast } from '../../context/ToastContext';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Check, 
  X, 
  Trash2, 
  HeartHandshake, 
  Clock, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  Coins,
  FileText,
  ExternalLink,
  ShieldCheck,
  SendHorizontal
} from 'lucide-react';

export const AidRequestsManagement = () => {
  const [aidRequests, setAidRequests] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, underReview: 0, approved: 0, disbursed: 0, totalDisbursedAmount: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [initialLoading, setInitialLoading] = useState(true);

  // Review Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    setInitialLoading(true);

    const unsubscribe = aidRequestService.subscribeAidRequests((liveList) => {
      setAidRequests(liveList);
      setStats(aidRequestService.getAidRequestStats(liveList));
      setInitialLoading(false);

      if (selectedRequest) {
        const found = liveList.find((r) => r.id === selectedRequest.id);
        if (found) {
          setSelectedRequest(found);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = (req) => {
    setSelectedRequest(req);
    setAdminNotes(req.adminNotes || '');
  };

  const handleStatusChange = async (status) => {
    if (!selectedRequest) return;
    setActionLoading(true);
    const res = await aidRequestService.updateAidRequestStatus(selectedRequest.id, status, adminNotes);
    setActionLoading(false);

    if (res.success) {
      showToast('Status Updated', `Application ${selectedRequest.id} is now marked as ${status}.`, 'success');
      setSelectedRequest(res.aidRequest);
    } else {
      showToast('Update Failed', res.error || 'Could not update status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this aid application?')) {
      const res = await aidRequestService.deleteAidRequest(id);
      if (res.success) {
        showToast('Application Deleted', 'Aid request was removed from Firestore.', 'info');
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest(null);
        }
      } else {
        showToast('Delete Failed', res.error || 'Could not delete aid request.', 'error');
      }
    }
  };

  const handleExportCSV = () => {
    const filename = `givehope-aid-requests-${new Date().toISOString().split('T')[0]}.csv`;
    const headers = ['ID', 'Applicant Name', 'CNIC', 'Phone', 'Email', 'City', 'Category', 'Amount (PKR)', 'Status', 'Date Applied', 'Admin Notes'];
    const rows = filteredRequests.map((r) => [
      r.id,
      r.fullName,
      r.cnic,
      r.phone,
      r.email || '',
      r.city,
      r.category,
      r.amountNeeded,
      r.status,
      r.createdAt ? r.createdAt.split('T')[0] : '',
      `"${(r.adminNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Export Complete', `${filteredRequests.length} aid applications exported to CSV.`, 'success');
  };

  const filteredRequests = aidRequests.filter((r) => {
    const matchesStatus = statusTab === 'All' || r.status === statusTab;
    const matchesCat = categoryFilter === 'All' || r.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.id?.toLowerCase().includes(q) ||
      r.fullName?.toLowerCase().includes(q) ||
      r.cnic?.toLowerCase().includes(q) ||
      r.phone?.toLowerCase().includes(q) ||
      r.city?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q);

    return matchesStatus && matchesCat && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--navy)', margin: 0 }}>
              Beneficiary Aid Requests
            </h1>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#059669',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: '700',
              border: '1px solid rgba(16, 185, 129, 0.25)'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'pulse 1.5s infinite' }} />
              Live Cloud Firestore Desk
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Review, verify, approve, and track direct fund disbursals for welfare assistance applications.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleExportCSV}
            className="btn btn-sm btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Download size={15} /> Export Ledger CSV
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Cases</span>
            <HeartHandshake size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--navy)', marginTop: '0.5rem' }}>
            {stats.total}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Logged applications</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Review</span>
            <Clock size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#D97706', marginTop: '0.5rem' }}>
            {stats.pending}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting action</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #3B82F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Under Review</span>
            <FileText size={18} color="#3B82F6" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#2563EB', marginTop: '0.5rem' }}>
            {stats.underReview}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Field/Desk verification</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approved</span>
            <CheckCircle2 size={18} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#059669', marginTop: '0.5rem' }}>
            {stats.approved}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ready for disbursal</span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #0D9488' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Disbursed</span>
            <Coins size={18} color="#0D9488" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F766E', marginTop: '0.5rem' }}>
            PKR {(stats.totalDisbursedAmount || 0).toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stats.disbursed} settled cases</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['All', 'Pending', 'Under Review', 'Approved', 'Disbursed', 'Rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: statusTab === tab ? 'var(--primary)' : 'var(--border-light)',
                  backgroundColor: statusTab === tab ? 'var(--primary-light)' : 'transparent',
                  color: statusTab === tab ? 'var(--primary-dark)' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab}
                {tab === 'Pending' && stats.pending > 0 && (
                  <span style={{
                    marginLeft: '0.35rem',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-full)',
                    padding: '1px 5px',
                    fontSize: '0.68rem'
                  }}>
                    {stats.pending}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', minWidth: '160px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="All">All Categories</option>
              <option value="Medical Aid">Medical Aid</option>
              <option value="Food Ration">Food Ration</option>
              <option value="Education">Education</option>
              <option value="Emergency Relief">Emergency Relief</option>
            </select>

            {/* Search Input */}
            <div className="input-icon-wrap" style={{ minWidth: '240px' }}>
              <Search size={16} className="input-icon" />
              <input
                type="text"
                placeholder="Search applicant, CNIC, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ padding: '0.45rem 0.75rem 0.45rem 2.25rem', fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Aid Requests Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {initialLoading ? (
          <div style={{ padding: '1.5rem' }}>
            <SkeletonTable rows={5} columns={6} />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <HeartHandshake size={48} color="var(--text-light)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '0.35rem' }}>No Aid Applications Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {searchQuery || statusTab !== 'All' || categoryFilter !== 'All'
                ? 'Try adjusting your search queries or filter categories.'
                : 'Beneficiary aid applications will appear here in real-time as they are submitted.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Ref ID</th>
                  <th>Applicant / CNIC</th>
                  <th>Category</th>
                  <th>Requested Amount</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Applied On</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <span className="font-mono" style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--primary)' }}>
                        {req.id}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '700', color: 'var(--navy)', fontSize: '0.9rem' }}>{req.fullName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          CNIC: <span className="font-mono">{req.cnic || 'N/A'}</span> • {req.phone}
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge variant={req.category}>{req.category}</Badge>
                    </td>
                    <td>
                      <span style={{ fontWeight: '800', color: '#059669', fontSize: '0.9rem' }}>
                        PKR {Number(req.amountNeeded || 0).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--navy)' }}>{req.city}</span>
                    </td>
                    <td>
                      <Badge variant={req.status}>{req.status}</Badge>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {req.createdAt ? req.createdAt.split('T')[0] : 'Recent'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenModal(req)}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: '0.3rem 0.6rem' }}
                          title="Review & Manage Application"
                        >
                          <Eye size={14} /> Review
                        </button>
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="btn btn-sm btn-outline"
                          style={{ padding: '0.3rem 0.6rem', color: '#EF4444', borderColor: '#FCA5A5' }}
                          title="Delete Case"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review & Status Update Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Review Aid Application: ${selectedRequest.id}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header info bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Requested Category & Amount:</span>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>PKR {Number(selectedRequest.amountNeeded).toLocaleString()}</span>
                  <Badge variant={selectedRequest.category}>{selectedRequest.category}</Badge>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Status:</span>
                <div>
                  <Badge variant={selectedRequest.status}>{selectedRequest.status}</Badge>
                </div>
              </div>
            </div>

            {/* Applicant Profile Grid */}
            <div className="grid grid-cols-2 gap-4" style={{ fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Applicant Name:</span>
                <div style={{ fontWeight: '700', color: 'var(--navy)' }}>{selectedRequest.fullName}</div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>CNIC / National ID:</span>
                <div className="font-mono" style={{ fontWeight: '700', color: 'var(--navy)' }}>{selectedRequest.cnic}</div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Phone / WhatsApp:</span>
                <div style={{ fontWeight: '600', color: 'var(--navy)' }}>{selectedRequest.phone}</div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Email Address:</span>
                <div style={{ color: 'var(--text-main)' }}>{selectedRequest.email || 'Not provided'}</div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Residential Address:</span>
                <div style={{ color: 'var(--navy)' }}>{selectedRequest.address}, {selectedRequest.city}</div>
              </div>
            </div>

            {/* Statement of Need */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--navy)', textTransform: 'uppercase' }}>
                Statement of Need & Situation:
              </span>
              <p style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.9rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '0.35rem', lineHeight: '1.6' }}>
                {selectedRequest.description}
              </p>
            </div>

            {/* Supporting Document */}
            {selectedRequest.documentUrl && (
              <div style={{ background: '#F0FDFA', border: '1px solid #CCFBF1', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#0F766E' }}>
                  <FileText size={16} />
                  <span>Applicant attached supporting document / verification proof.</span>
                </div>
                <a
                  href={selectedRequest.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}
                >
                  Open Proof <ExternalLink size={12} />
                </a>
              </div>
            )}

            {/* Admin Notes */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>
                GiveHope Admin / Field Verification Notes:
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Field coordinator visited house. Verified medical bill copy with Fatima Memorial Hospital..."
                className="form-control"
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleStatusChange('Under Review')}
                  className="btn btn-sm btn-secondary"
                  style={{ backgroundColor: '#EFF6FF', color: '#2563EB', borderColor: '#BFDBFE' }}
                >
                  Mark Under Review
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleStatusChange('Approved')}
                  className="btn btn-sm btn-secondary"
                  style={{ backgroundColor: '#ECFDF5', color: '#059669', borderColor: '#A7F3D0' }}
                >
                  <Check size={14} /> Approve Request
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleStatusChange('Disbursed')}
                  className="btn btn-sm btn-primary"
                >
                  <Coins size={14} /> Mark Disbursed & Settled
                </button>
              </div>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleStatusChange('Rejected')}
                className="btn btn-sm btn-outline"
                style={{ color: '#DC2626', borderColor: '#FECACA' }}
              >
                <X size={14} /> Reject
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AidRequestsManagement;
