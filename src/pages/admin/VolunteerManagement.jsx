import React, { useState, useEffect } from 'react';
import { volunteerService } from '../../services/volunteerService';
import { campaignService } from '../../services/campaignService';
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
  HandHeart, 
  Award, 
  Clock, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  Radio,
  UserCheck,
  Loader2
} from 'lucide-react';

export const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, totalHours: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState('All');
  const [interestFilter, setInterestFilter] = useState('All');
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Detail Modal & Action State
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [assignedCampaign, setAssignedCampaign] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    setInitialLoading(true);

    // Subscribe to Live Volunteers in Firestore
    const unsubVolunteers = volunteerService.subscribeVolunteers((liveVols) => {
      setVolunteers(liveVols);
      setStats(volunteerService.getVolunteerStats(liveVols));
      setInitialLoading(false);

      // Keep detail modal synced if open
      if (selectedVolunteer) {
        const found = liveVols.find((v) => v.id === selectedVolunteer.id);
        if (found) setSelectedVolunteer(found);
      }
    });

    // Subscribe to Live Campaigns
    const unsubCampaigns = campaignService.subscribeCampaigns((liveCampaigns) => {
      setCampaigns(liveCampaigns);
    });

    return () => {
      unsubVolunteers();
      unsubCampaigns();
    };
  }, []);

  const handleApprove = async (id, name, campaign = null) => {
    setActionLoading(true);
    setActionLoadingId(id);

    // Optimistic UI state update
    setVolunteers((prev) => 
      prev.map((v) => (v.id === id ? { ...v, status: 'Approved', approvedDate: new Date().toISOString().split('T')[0], assignedCampaign: campaign || v.assignedCampaign } : v))
    );

    const res = await volunteerService.updateVolunteerStatus(id, 'Approved', campaign);
    setActionLoading(false);
    setActionLoadingId(null);

    if (res.success) {
      showToast('Volunteer Approved', `${name} is now approved & verified in Firestore!`, 'success');
      if (selectedVolunteer && selectedVolunteer.id === id) {
        setSelectedVolunteer(res.volunteer);
      }
    } else {
      showToast('Approval Error', res.error || 'Could not approve volunteer.', 'error');
    }
  };

  const handleReject = async (id, name) => {
    setActionLoading(true);
    setActionLoadingId(id);

    // Optimistic UI state update
    setVolunteers((prev) => 
      prev.map((v) => (v.id === id ? { ...v, status: 'Rejected' } : v))
    );

    const res = await volunteerService.updateVolunteerStatus(id, 'Rejected');
    setActionLoading(false);
    setActionLoadingId(null);

    if (res.success) {
      showToast('Application Rejected', `Application for ${name} has been rejected.`, 'info');
      if (selectedVolunteer && selectedVolunteer.id === id) {
        setSelectedVolunteer(res.volunteer);
      }
    } else {
      showToast('Rejection Error', res.error || 'Could not reject application.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this volunteer record?')) {
      const res = await volunteerService.deleteVolunteer(id);
      if (res.success) {
        showToast('Record Removed', 'Volunteer record deleted from Firestore.', 'info');
        setVolunteers((prev) => prev.filter((v) => v.id !== id));
        if (selectedVolunteer && selectedVolunteer.id === id) {
          setSelectedVolunteer(null);
        }
      } else {
        showToast('Delete Error', res.error || 'Could not delete volunteer.', 'error');
      }
    }
  };

  const handleExportCSV = () => {
    const exportData = filteredVolunteers.map((v) => ({
      ID: v.id,
      Name: v.name,
      Email: v.email,
      Phone: v.phone,
      City: v.city || '',
      InterestArea: v.areaOfInterest,
      Skills: (v.skills || []).join('; '),
      Availability: v.availability,
      Status: v.status,
      HoursContributed: v.hoursContributed || 0,
      AppliedDate: v.appliedDate
    }));

    reportService.exportToCSV(exportData, `GiveHope_Volunteers_${new Date().toISOString().split('T')[0]}.csv`);
    showToast('Export Complete', 'Volunteer directory exported to CSV.', 'success');
  };

  const openDetailModal = (v) => {
    setSelectedVolunteer(v);
    setAssignedCampaign(v.assignedCampaign || '');
  };

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch = v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.phone?.includes(searchQuery) ||
                          (v.skills && v.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesStatus = statusTab === 'All' || v.status === statusTab;
    const matchesInterest = interestFilter === 'All' || v.areaOfInterest === interestFilter;

    return matchesSearch && matchesStatus && matchesInterest;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--navy)', margin: 0, fontWeight: '800' }}>
              Volunteer Force & Deployment
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
              Live Firestore
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
            Onboard, review qualifications, verify field hours, and deploy volunteers across active disaster relief campaigns.
          </p>
        </div>

        <button 
          onClick={handleExportCSV} 
          className="btn btn-sm btn-outline" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Download size={15} /> Export Directory
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card" style={{ padding: '1.25rem', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Total Applications
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--navy)', marginTop: '0.25rem' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Registered on GiveHope
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Active & Certified
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#059669', marginTop: '0.25rem' }}>
            {stats.approved}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Ready for field deployment
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Pending Reviews
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: stats.pending > 0 ? '#F59E0B' : 'var(--navy)', marginTop: '0.25rem' }}>
            {stats.pending}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Applications awaiting action
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Total Service Hours
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.25rem' }}>
            {stats.totalHours.toLocaleString()} hrs
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Direct field contributions
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="card" style={{ padding: '1.25rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
            {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: statusTab === tab ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: statusTab === tab ? '#FFFFFF' : 'var(--navy)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab} {tab === 'Pending' && stats.pending > 0 && `(${stats.pending})`}
              </button>
            ))}
          </div>

          {/* Search & Secondary Filter */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="input-icon-wrap" style={{ flex: '1 1 300px' }}>
              <Search size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
              />
            </div>

            <select
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', minWidth: '220px' }}
            >
              <option value="All">All Areas of Interest</option>
              <option value="Disaster Relief Operations">Disaster Relief Operations</option>
              <option value="Medical & Health Camps">Medical & Health Camps</option>
              <option value="Child Education & Mentorship">Child Education & Mentorship</option>
              <option value="Clean Water Well Infrastructure">Clean Water Infrastructure</option>
              <option value="Media, PR & Awareness">Media, PR & Awareness</option>
              <option value="Fundraising & Donor Relations">Fundraising & Relations</option>
              <option value="General Assistance">General Assistance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)', fontWeight: '700' }}>
              Volunteer Directory ({filteredVolunteers.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time synchronization with online submissions</p>
          </div>
        </div>

        <div className="table-responsive">
          {initialLoading ? (
            <SkeletonTable rows={6} cols={6} />
          ) : filteredVolunteers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
              <AlertCircle size={36} style={{ margin: '0 auto 0.75rem auto', color: 'var(--text-light)' }} />
              <div style={{ fontWeight: '600', fontSize: '1.05rem', color: 'var(--navy)' }}>No volunteers found</div>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>No volunteer applications matched your search criteria.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Volunteer Info</th>
                  <th>Core Skills</th>
                  <th>Primary Focus</th>
                  <th>Availability</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVolunteers.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--navy)' }}>{v.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.email}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>{v.phone} • {v.city || 'Lahore'}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '240px' }}>
                        {(v.skills || []).slice(0, 2).map((s, idx) => (
                          <span key={idx} className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                            {s}
                          </span>
                        ))}
                        {(v.skills || []).length > 2 && (
                          <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                            +{v.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--navy)', fontWeight: '500' }}>
                      {v.areaOfInterest}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {v.availability}
                    </td>
                    <td>
                      <Badge variant={v.status}>{v.status}</Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          onClick={() => openDetailModal(v)}
                          className="btn btn-sm btn-outline"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                          title="View Profile Details"
                        >
                          <Eye size={13} /> View
                        </button>

                        {v.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(v.id, v.name)}
                              disabled={actionLoadingId === v.id}
                              className="btn btn-sm btn-primary"
                              style={{ 
                                padding: '0.3rem 0.5rem', 
                                backgroundColor: '#10B981', 
                                borderColor: '#10B981',
                                opacity: actionLoadingId === v.id ? 0.7 : 1
                              }}
                              title="Quick Approve"
                            >
                              {actionLoadingId === v.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            </button>
                            <button
                              onClick={() => handleReject(v.id, v.name)}
                              disabled={actionLoadingId === v.id}
                              className="btn btn-sm btn-danger-outline"
                              style={{ padding: '0.3rem 0.5rem' }}
                              title="Reject Application"
                            >
                              {actionLoadingId === v.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleDelete(v.id)}
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

      {/* Volunteer Profile Modal */}
      {selectedVolunteer && (
        <Modal
          isOpen={!!selectedVolunteer}
          onClose={() => setSelectedVolunteer(null)}
          title={`Volunteer Profile: ${selectedVolunteer.name}`}
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Top Overview */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-subtle)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '0.2rem', fontWeight: '800' }}>
                  {selectedVolunteer.name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reference ID: <strong className="font-mono">{selectedVolunteer.id}</strong></div>
              </div>
              <Badge variant={selectedVolunteer.status}>{selectedVolunteer.status}</Badge>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Email Address</span>
                <strong>{selectedVolunteer.email}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Phone Contact</span>
                <strong>{selectedVolunteer.phone}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>City / Residence</span>
                <span>{selectedVolunteer.city || 'Lahore'} ({selectedVolunteer.address || 'Not specified'})</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Application Date</span>
                <span>{selectedVolunteer.appliedDate || 'Recent'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Area of Interest</span>
                <strong style={{ color: 'var(--primary)' }}>{selectedVolunteer.areaOfInterest}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Availability Schedule</span>
                <span>{selectedVolunteer.availability}</span>
              </div>
            </div>

            {/* Skills */}
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', marginBottom: '0.35rem' }}>Skills & Proficiencies</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(selectedVolunteer.skills || []).map((s, idx) => (
                  <span key={idx} className="badge badge-primary" style={{ fontSize: '0.78rem' }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Experience & Motivation */}
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '0.25rem' }}>Background & Motivation</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                "{selectedVolunteer.message || selectedVolunteer.experience || 'Ready to serve in GiveHope relief drives.'}"
              </p>
            </div>

            {/* Campaign Assignment */}
            <div className="form-group">
              <label className="form-label">Assign to Humanitarian Campaign</label>
              <select
                value={assignedCampaign}
                onChange={(e) => setAssignedCampaign(e.target.value)}
                className="form-control"
              >
                <option value="">-- No Specific Campaign --</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedVolunteer(null)}>
                Close
              </button>

              {selectedVolunteer.status !== 'Rejected' && (
                <button
                  className="btn btn-danger-outline"
                  disabled={actionLoading}
                  onClick={() => handleReject(selectedVolunteer.id, selectedVolunteer.name)}
                >
                  Reject Application
                </button>
              )}

              {selectedVolunteer.status !== 'Approved' && (
                <button
                  disabled={actionLoading}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#10B981', borderColor: '#10B981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={() => handleApprove(selectedVolunteer.id, selectedVolunteer.name, assignedCampaign)}
                >
                  <ButtonLoader loading={actionLoading} loadingText="Approving...">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <UserCheck size={16} />
                      <span>Approve & Certify</span>
                    </span>
                  </ButtonLoader>
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VolunteerManagement;
