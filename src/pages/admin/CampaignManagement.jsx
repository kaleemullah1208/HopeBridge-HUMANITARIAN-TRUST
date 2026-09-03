import React, { useState, useEffect } from 'react';
import { campaignService } from '../../services/campaignService';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Flame, 
  Users, 
  Calendar, 
  MapPin, 
  LayoutGrid, 
  Table as TableIcon,
  CheckCircle2,
  PieChart
} from 'lucide-react';

export const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Disaster Relief',
    goalAmount: 1000000,
    raisedAmount: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: 'Lahore & Punjab Flood Plains',
    beneficiariesCount: 5000,
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1000&q=80',
    description: '',
    longDescription: '',
    status: 'Active',
    isUrgent: false,
    featured: true
  });

  const { showToast } = useToast();

  const loadCampaigns = () => {
    const list = campaignService.getCampaigns();
    setCampaigns(list);
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const openCreateModal = () => {
    setEditingCampaignId(null);
    setFormData({
      title: '',
      category: 'Disaster Relief',
      goalAmount: 1000000,
      raisedAmount: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: 'Sindh & Rural Flood Belts',
      beneficiariesCount: 5000,
      image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1000&q=80',
      description: '',
      longDescription: '',
      status: 'Active',
      isUrgent: false,
      featured: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (camp) => {
    setEditingCampaignId(camp.id);
    setFormData({
      title: camp.title,
      category: camp.category,
      goalAmount: camp.goalAmount,
      raisedAmount: camp.raisedAmount,
      startDate: camp.startDate,
      endDate: camp.endDate,
      location: camp.location,
      beneficiariesCount: camp.beneficiariesCount,
      image: camp.image,
      description: camp.description,
      longDescription: camp.longDescription || camp.description,
      status: camp.status,
      isUrgent: camp.isUrgent,
      featured: camp.featured
    });
    setIsModalOpen(true);
  };

  const handleSaveCampaign = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.goalAmount || !formData.description) {
      showToast('Missing Info', 'Please fill in title, target goal, and description.', 'error');
      return;
    }

    if (editingCampaignId) {
      const res = await campaignService.updateCampaign(editingCampaignId, formData);
      if (res.success) {
        showToast('Campaign Updated', `Saved changes for "${formData.title}".`, 'success');
        setIsModalOpen(false);
        loadCampaigns();
      }
    } else {
      const res = await campaignService.createCampaign(formData);
      if (res.success) {
        showToast('Campaign Launched', `New mission "${formData.title}" created successfully!`, 'success');
        setIsModalOpen(false);
        loadCampaigns();
      }
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete campaign "${title}"?`)) {
      const res = await campaignService.deleteCampaign(id);
      if (res.success) {
        showToast('Campaign Deleted', `Campaign "${title}" was removed.`, 'info');
        loadCampaigns();
      }
    }
  };

  const totalTargetGoal = campaigns.reduce((acc, c) => acc + (c.goalAmount || 0), 0);
  const totalRaisedOverall = campaigns.reduce((acc, c) => acc + (c.raisedAmount || 0), 0);

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--navy)' }}>Campaign & Project Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Create, monitor, and manage humanitarian relief programs and development projects.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={16} /> Create New Campaign
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Projects</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.2rem' }}>
            {campaigns.filter((c) => c.status === 'Active').length}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Campaign Target</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--navy)', marginTop: '0.2rem' }}>
            Rs. {totalTargetGoal.toLocaleString()}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Funds Raised</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#059669', marginTop: '0.2rem' }}>
            Rs. {totalRaisedOverall.toLocaleString()}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overall Achievement</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent)', marginTop: '0.2rem' }}>
            {totalTargetGoal > 0 ? Math.round((totalRaisedOverall / totalTargetGoal) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="input-icon-wrap" style={{ flex: '1 1 260px' }}>
            <Search size={16} className="input-icon" />
            <input
              type="text"
              placeholder="Search campaigns by name, location, or cause..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ padding: '0.55rem 0.75rem 0.55rem 2.4rem', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="All">Category: All</option>
              <option value="Disaster Relief">Disaster Relief</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Seasonal Relief">Seasonal Relief</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Food Security">Food Security</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="All">Status: All</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Paused">Paused</option>
            </select>

            <div style={{ display: 'flex', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '0.55rem 0.75rem',
                  border: 'none',
                  backgroundColor: viewMode === 'grid' ? 'var(--primary)' : '#FFFFFF',
                  color: viewMode === 'grid' ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                style={{
                  padding: '0.55rem 0.75rem',
                  border: 'none',
                  backgroundColor: viewMode === 'table' ? 'var(--primary)' : '#FFFFFF',
                  color: viewMode === 'table' ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label="Table View"
              >
                <TableIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid or Table Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-3 gap-6">
          {filteredCampaigns.map((c) => (
            <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '180px' }}>
                <img src={c.image} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.35rem' }}>
                  <Badge variant={c.isUrgent ? 'Urgent' : 'primary'}>
                    {c.isUrgent && <Flame size={12} />} {c.category}
                  </Badge>
                  <Badge variant={c.status}>{c.status}</Badge>
                </div>
              </div>

              <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)', lineHeight: '1.3' }}>{c.title}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="var(--primary)" /> {c.location || 'Nationwide'}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                  <ProgressBar current={c.raisedAmount} total={c.goalAmount} isUrgent={c.isUrgent} />
                </div>
              </div>

              <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => openEditModal(c)}
                  className="btn btn-sm btn-outline"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                >
                  <Edit size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.title)}
                  className="btn btn-sm btn-danger-outline"
                  style={{ padding: '0.45rem 0.65rem' }}
                  title="Delete Campaign"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Campaign Title</th>
                  <th>Category</th>
                  <th>Target Goal</th>
                  <th>Raised</th>
                  <th>Donors</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--navy)' }}>{c.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.location}</div>
                    </td>
                    <td><Badge variant="primary">{c.category}</Badge></td>
                    <td style={{ fontWeight: '700' }}>Rs. {Number(c.goalAmount).toLocaleString()}</td>
                    <td style={{ fontWeight: '700', color: 'var(--primary)' }}>Rs. {Number(c.raisedAmount).toLocaleString()}</td>
                    <td>{c.donorsCount}</td>
                    <td><Badge variant={c.status}>{c.status}</Badge></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button onClick={() => openEditModal(c)} className="btn btn-sm btn-outline" style={{ padding: '0.35rem 0.5rem' }}>
                          <Edit size={13} />
                        </button>
                        <button onClick={() => handleDelete(c.id, c.title)} className="btn btn-sm btn-danger-outline" style={{ padding: '0.35rem 0.5rem' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Campaign Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCampaignId ? 'Edit Relief Campaign' : 'Create New Relief Campaign'}
        maxWidth="740px"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveCampaign}>
              {editingCampaignId ? 'Save Campaign Changes' : 'Launch Campaign'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div className="form-group">
            <label className="form-label">Campaign Title <span className="required">*</span></label>
            <input
              type="text"
              required
              placeholder="e.g. Winter Clothes & Blanket Relief Drive 2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-control"
              >
                <option value="Disaster Relief">Disaster Relief</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Seasonal Relief">Seasonal Relief</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Food Security">Food Security</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Campaign Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="form-control"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Paused">Paused</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Target Goal Amount (PKR) <span className="required">*</span></label>
              <input
                type="number"
                required
                value={formData.goalAmount}
                onChange={(e) => setFormData({ ...formData, goalAmount: Number(e.target.value) })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Currently Raised Amount (PKR)</label>
              <input
                type="number"
                value={formData.raisedAmount}
                onChange={(e) => setFormData({ ...formData, raisedAmount: Number(e.target.value) })}
                className="form-control"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Location / Target Region</label>
              <input
                type="text"
                placeholder="e.g. Tharparkar Arid Villages, Sindh"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Beneficiaries Estimated Count</label>
              <input
                type="number"
                value={formData.beneficiariesCount}
                onChange={(e) => setFormData({ ...formData, beneficiariesCount: Number(e.target.value) })}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Hero Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Short Description <span className="required">*</span></label>
            <textarea
              rows={2}
              required
              placeholder="Brief summary of this relief mission..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Narrative & Field Details</label>
            <textarea
              rows={4}
              placeholder="Detailed explanation of the crisis and fund usage..."
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              className="form-control"
            />
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600' }}>
              <input
                type="checkbox"
                checked={formData.isUrgent}
                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                style={{ accentColor: 'var(--status-danger)' }}
              />
              <span>Mark as Urgent Disaster Appeal</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600' }}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span>Feature on Public Homepage</span>
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
};
