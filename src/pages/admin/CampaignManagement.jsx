import React, { useState, useEffect } from 'react';
import { campaignService } from '../../services/campaignService';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { SkeletonCard } from '../../components/common/SkeletonCard';
import { SkeletonTable } from '../../components/common/SkeletonTable';
import { ButtonLoader } from '../../components/common/ButtonLoader';
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
  PieChart,
  Radio,
  Sparkles
} from 'lucide-react';

export const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    setInitialLoading(true);

    // Subscribe to Live Campaigns from Firestore
    const unsubscribe = campaignService.subscribeCampaigns((liveCampaigns) => {
      setCampaigns(liveCampaigns);
      setInitialLoading(false);
    });

    return () => {
      unsubscribe();
    };
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

    setSubmitting(true);
    if (editingCampaignId) {
      const res = await campaignService.updateCampaign(editingCampaignId, formData);
      setSubmitting(false);
      if (res.success) {
        showToast('Campaign Updated', `Saved changes for "${formData.title}".`, 'success');
        setIsModalOpen(false);
      } else {
        showToast('Error', res.error || 'Failed to update campaign.', 'error');
      }
    } else {
      const res = await campaignService.createCampaign(formData);
      setSubmitting(false);
      if (res.success) {
        showToast('Campaign Launched', `New mission "${formData.title}" created in Firestore!`, 'success');
        setIsModalOpen(false);
      } else {
        showToast('Error', res.error || 'Failed to launch campaign.', 'error');
      }
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete campaign "${title}"?`)) {
      const res = await campaignService.deleteCampaign(id);
      if (res.success) {
        showToast('Campaign Deleted', `Campaign "${title}" was removed from Firestore.`, 'info');
      }
    }
  };

  const totalTargetGoal = campaigns.reduce((acc, c) => acc + (Number(c.goalAmount) || 0), 0);
  const totalRaisedOverall = campaigns.reduce((acc, c) => acc + (Number(c.raisedAmount) || 0), 0);

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--navy)', margin: 0 }}>
              Humanitarian Campaigns Management
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
            Create and track relief programs, set financial targets, monitor real-time raised funds, and adjust urgency badges.
          </p>
        </div>

        <button 
          onClick={openCreateModal} 
          className="btn btn-sm btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} /> Launch New Campaign
        </button>
      </div>

      {/* Program Portfolio Overview */}
      <div className="grid grid-cols-4 gap-6">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Active Missions
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.25rem' }}>
            {campaigns.filter((c) => c.status === 'Active').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Live on GiveHope Portal
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Portfolio Target Goal
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--navy)', marginTop: '0.25rem' }}>
            Rs. {totalTargetGoal.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Required for full ground delivery
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Total Raised to Date
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#059669', marginTop: '0.25rem' }}>
            Rs. {totalRaisedOverall.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {totalTargetGoal > 0 ? `${Math.round((totalRaisedOverall / totalTargetGoal) * 100)}% portfolio completed` : '0%'}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Completed Relief Missions
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#3B82F6', marginTop: '0.25rem' }}>
            {campaigns.filter((c) => c.status === 'Completed').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            100% target reached & deployed
          </div>
        </div>
      </div>

      {/* Filter and View Mode Toolbar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="input-icon-wrap" style={{ flex: '1 1 300px' }}>
            <Search size={18} className="input-icon" />
            <input
              type="text"
              placeholder="Search campaigns by title, region, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', minWidth: '150px' }}
            >
              <option value="All">All Categories</option>
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
              style={{ width: 'auto', minWidth: '130px' }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Draft">Draft</option>
            </select>

            <div style={{ display: 'flex', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '0.45rem 0.75rem',
                  backgroundColor: viewMode === 'grid' ? 'var(--primary)' : '#FFFFFF',
                  color: viewMode === 'grid' ? '#FFFFFF' : 'var(--navy)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  padding: '0.45rem 0.75rem',
                  backgroundColor: viewMode === 'table' ? 'var(--primary)' : '#FFFFFF',
                  color: viewMode === 'table' ? '#FFFFFF' : 'var(--navy)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Table View"
              >
                <TableIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Listing (Grid View or Table View) */}
      {initialLoading ? (
        <div className="grid grid-cols-3 gap-6">
          <SkeletonCard height="340px" />
          <SkeletonCard height="340px" />
          <SkeletonCard height="340px" />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-3 gap-6">
          {filteredCampaigns.map((camp) => (
            <div key={camp.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Campaign Image */}
              <div style={{ position: 'relative', height: '180px', width: '100%' }}>
                <img
                  src={camp.image}
                  alt={camp.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '0.4rem' }}>
                  <span className="badge badge-secondary" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', color: '#FFF' }}>
                    {camp.category}
                  </span>
                  {camp.isUrgent && (
                    <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Flame size={12} fill="#FFF" /> Urgent
                    </span>
                  )}
                </div>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <Badge variant={camp.status}>{camp.status}</Badge>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)', lineHeight: '1.3' }}>
                  {camp.title}
                </h3>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5', flex: 1 }}>
                  {camp.description?.slice(0, 110)}...
                </p>

                {/* Progress Bar */}
                <ProgressBar
                  current={camp.raisedAmount}
                  goal={camp.goalAmount}
                  showLabel={true}
                  color="var(--primary)"
                />

                {/* Meta details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-light)', borderTop: '1px solid var(--border-light)', paddingTop: '0.6rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} /> {camp.location?.split(',')[0]}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={13} /> {camp.donorsCount || 0} donors
                  </span>
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button
                    onClick={() => openEditModal(camp)}
                    className="btn btn-sm btn-outline"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(camp.id, camp.title)}
                    className="btn btn-sm btn-danger-outline"
                    style={{ padding: '0.35rem 0.6rem' }}
                    title="Delete Campaign"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Campaign Title</th>
                  <th>Category</th>
                  <th>Progress / Raised</th>
                  <th>Target Goal</th>
                  <th>Donors</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((camp) => (
                  <tr key={camp.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--navy)' }}>{camp.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{camp.location}</div>
                    </td>
                    <td>
                      <span className="badge badge-secondary">{camp.category}</span>
                    </td>
                    <td style={{ minWidth: '180px' }}>
                      <ProgressBar
                        current={camp.raisedAmount}
                        goal={camp.goalAmount}
                        showLabel={true}
                        height="6px"
                      />
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--navy)' }}>
                      Rs. {Number(camp.goalAmount).toLocaleString()}
                    </td>
                    <td>{camp.donorsCount || 0}</td>
                    <td>
                      <Badge variant={camp.status}>{camp.status}</Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => openEditModal(camp)}
                          className="btn btn-sm btn-outline"
                          style={{ padding: '0.3rem 0.5rem' }}
                          title="Edit Campaign"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(camp.id, camp.title)}
                          className="btn btn-sm btn-danger-outline"
                          style={{ padding: '0.3rem 0.5rem', color: 'var(--status-danger)' }}
                          title="Delete Campaign"
                        >
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
        title={editingCampaignId ? "Update Campaign Details" : "Launch New Relief Campaign"}
        maxWidth="680px"
      >
        <form onSubmit={handleSaveCampaign}>
          <div className="form-group">
            <label className="form-label">Campaign Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Solar Drinking Water Wells in Cholistan"
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
              <label className="form-label">Target Funding Goal (PKR) *</label>
              <input
                type="number"
                required
                min="10000"
                value={formData.goalAmount}
                onChange={(e) => setFormData({ ...formData, goalAmount: Number(e.target.value) })}
                className="form-control"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Target Field Location</label>
              <input
                type="text"
                placeholder="e.g. Sindh & Balochistan Flood Plains"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Beneficiaries</label>
              <input
                type="number"
                value={formData.beneficiariesCount}
                onChange={(e) => setFormData({ ...formData, beneficiariesCount: Number(e.target.value) })}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Featured Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Short Summary Description *</label>
            <textarea
              rows={2}
              required
              placeholder="Brief overview shown on cards..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">Campaign Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="form-control"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.75rem' }}>
              <input
                type="checkbox"
                id="isUrgent"
                checked={formData.isUrgent}
                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--status-danger)' }}
              />
              <label htmlFor="isUrgent" style={{ fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', color: 'var(--navy)' }}>
                Mark as Urgent
              </label>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.75rem' }}>
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <label htmlFor="featured" style={{ fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', color: 'var(--navy)' }}>
                Feature on Home
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <ButtonLoader
              type="submit"
              loading={submitting}
              loadingText="Saving Mission..."
              className="btn btn-primary"
              icon={<CheckCircle2 size={16} />}
            >
              {editingCampaignId ? "Update Campaign" : "Publish Campaign Live"}
            </ButtonLoader>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CampaignManagement;
