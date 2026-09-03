import React, { useState, useEffect } from 'react';
import { volunteerService } from '../../services/volunteerService';
import { campaignService } from '../../services/campaignService';
import { reportService } from '../../services/reportService';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
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
  AlertCircle
} from 'lucide-react';

export const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, totalHours: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState('All');
  const [interestFilter, setInterestFilter] = useState('All');
  
  // Detail Modal
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [assignedCampaign, setAssignedCampaign] = useState('');

  const { showToast } = useToast();

  const loadData = () => {
    const list = volunteerService.getVolunteers();
    setVolunteers(list);
    setStats(volunteerService.getVolunteerStats());
    setCampaigns(campaignService.getCampaigns());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id, name, campaign = null) => {
    const res = await volunteerService.updateVolunteerStatus(id, 'Approved', campaign);
    if (res.success) {
      showToast('Volunteer Approved', `${name} is now certified and approved!`, 'success');
      loadData();
      if (selectedVolunteer && selectedVolunteer.id === id) {
        setSelectedVolunteer(res.volunteer);
      }
    }
  };

  const handleReject = async (id, name) => {
    const res = await volunteerService.updateVolunteerStatus(id, 'Rejected');
    if (res.success) {
      showToast('Application Rejected', `Application for ${name} has been rejected.`, 'info');
      loadData();
      if (selectedVolunteer && selectedVolunteer.id === id) {
        setSelectedVolunteer(res.volunteer);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this volunteer application?')) {
      const res = await volunteerService.deleteVolunteer(id);
      if (res.success) {
        showToast('Record Removed', 'Volunteer application deleted.', 'info');
        loadData();
        setSelectedVolunteer(null);
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

    reportService.exportToCSV(exportData, `Volunteers_Directory_${new Date().toISOString().split('T')[0]}.csv`);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--navy)' }}>Volunteer Force & Applications</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Review volunteer credentials, approve applications, and assign volunteers to ground relief missions.
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn btn-sm btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Download size={15} /> Export Volunteer Directory
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Applications</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--navy)', marginTop: '0.2rem' }}>
            {stats.total}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active / Approved</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--status-success)', marginTop: '0.2rem' }}>
            {stats.approved}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Review</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--status-warning)', marginTop: '0.2rem' }}>
            {stats.pending}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Field Hours Contributed</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.2rem' }}>
            {stats.totalHours} hrs
          </div>
        </div>
      </div>

      {/* Filter and Tab Controls */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Top Row: Search & Dropdown */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="input-icon-wrap" style={{ flex: '1 1 280px' }}>
              <Search size={16} className="input-icon" />
              <input
                type="text"
                placeholder="Search by volunteer name, skill, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ padding: '0.55rem 0.75rem 0.55rem 2.4rem', fontSize: '0.88rem' }}
              />
            </div>

            <select
              value={interestFilter}
              onChange={(e) => setInterestFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="All">Area: All Sectors</option>
              <option value="Disaster Relief Operations">Disaster Relief Operations</option>
              <option value="Medical & Health Camps">Medical & Health Camps</option>
              <option value="Child Education & Mentorship">Child Education & Mentorship</option>
              <option value="Media, PR & Awareness">Media, PR & Awareness</option>
              <option value="Fundraising & Donor Relations">Fundraising</option>
              <option value="Clean Water Well Infrastructure">Clean Water Tech</option>
            </select>
          </div>

          {/* Bottom Row: Status Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
            {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: statusTab === tab ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: statusTab === tab ? '#FFFFFF' : 'var(--text-main)',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {tab === 'All' ? 'All Applications' : tab}
                {tab === 'Pending' && stats.pending > 0 && (
                  <span style={{ marginLeft: '6px', backgroundColor: 'var(--status-warning)', color: '#92400E', padding: '1px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>
                    {stats.pending}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Volunteer Name</th>
                <th>Contact & Location</th>
                <th>Interest Area & Skills</th>
                <th>Availability</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVolunteers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No volunteer applications found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--navy)' }}>{v.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>ID: {v.id}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'var(--navy)' }}>{v.email}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{v.phone} ({v.city || 'Lahore'})</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>
                        {v.areaOfInterest}
                      </div>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {(v.skills || []).slice(0, 2).map((s, idx) => (
                          <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                            {s}
                          </span>
                        ))}
                        {(v.skills || []).length > 2 && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{(v.skills || []).length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {v.availability}
                    </td>
                    <td>
                      <Badge variant={v.status}>{v.status}</Badge>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {v.appliedDate}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => openDetailModal(v)}
                          className="btn btn-sm btn-outline"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                          title="View Complete Profile & Application"
                        >
                          <Eye size={13} /> View
                        </button>

                        {v.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(v.id, v.name)}
                              className="btn btn-sm btn-primary"
                              style={{ padding: '0.35rem 0.5rem', backgroundColor: 'var(--status-success)', borderColor: 'var(--status-success)' }}
                              title="Approve Volunteer"
                            >
                              <Check size={13} />
                            </button>
                            <button
                              onClick={() => handleReject(v.id, v.name)}
                              className="btn btn-sm btn-danger-outline"
                              style={{ padding: '0.35rem 0.5rem' }}
                              title="Reject Application"
                            >
                              <X size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Volunteer Detail & Action Modal */}
      {selectedVolunteer && (
        <Modal
          isOpen={!!selectedVolunteer}
          onClose={() => setSelectedVolunteer(null)}
          title={`Volunteer Application - ${selectedVolunteer.name}`}
          maxWidth="680px"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setSelectedVolunteer(null)}>
                Close
              </button>
              {selectedVolunteer.status !== 'Approved' && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleApprove(selectedVolunteer.id, selectedVolunteer.name, assignedCampaign)}
                  style={{ backgroundColor: 'var(--status-success)', borderColor: 'var(--status-success)' }}
                >
                  <Check size={16} /> Approve as Active Volunteer
                </button>
              )}
              {selectedVolunteer.status !== 'Rejected' && (
                <button
                  className="btn btn-danger-outline"
                  onClick={() => handleReject(selectedVolunteer.id, selectedVolunteer.name)}
                >
                  <X size={16} /> Reject Application
                </button>
              )}
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--navy)' }}>{selectedVolunteer.name}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Applied: {selectedVolunteer.appliedDate} | Reference ID: {selectedVolunteer.id}
                </div>
              </div>
              <Badge variant={selectedVolunteer.status} style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                {selectedVolunteer.status}
              </Badge>
            </div>

            {/* Contact details */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
              fontSize: '0.88rem'
            }}>
              <div><strong>Email:</strong> {selectedVolunteer.email}</div>
              <div><strong>Phone / WhatsApp:</strong> {selectedVolunteer.phone}</div>
              <div><strong>City:</strong> {selectedVolunteer.city || 'Lahore'}</div>
              <div><strong>Address:</strong> {selectedVolunteer.address || 'Not specified'}</div>
              <div><strong>Availability:</strong> {selectedVolunteer.availability}</div>
              <div><strong>Hours Logged:</strong> {selectedVolunteer.hoursContributed || 0} Hours</div>
            </div>

            {/* Skills & Interest */}
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--navy)', marginBottom: '0.4rem' }}>
                Area of Interest & Skills
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>
                {selectedVolunteer.areaOfInterest}
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {(selectedVolunteer.skills || []).map((s, idx) => (
                  <span key={idx} className="badge badge-primary" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--navy)', marginBottom: '0.3rem' }}>
                Prior Experience / Background
              </div>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-light)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {selectedVolunteer.experience || 'No previous NGO experience mentioned.'}
              </div>
            </div>

            {/* Motivation Message */}
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--navy)', marginBottom: '0.3rem' }}>
                Applicant Statement
              </div>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-light)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: '1.6' }}>
                "{selectedVolunteer.message || 'Looking forward to participating.'}"
              </div>
            </div>

            {/* Assign to Campaign */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <label className="form-label">Assign to Specific Relief Campaign</label>
              <select
                value={assignedCampaign}
                onChange={(e) => setAssignedCampaign(e.target.value)}
                className="form-control"
              >
                <option value="">No specific campaign (General Standby)</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>{c.title} ({c.category})</option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
