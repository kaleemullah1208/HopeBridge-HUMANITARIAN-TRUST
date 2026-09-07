import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignService } from '../../services/campaignService';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import { SkeletonCard } from '../../components/common/SkeletonCard';
import { 
  Search, 
  Filter, 
  Heart, 
  Flame, 
  Users, 
  MapPin, 
  Calendar, 
  ArrowRight,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

export const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('urgent');

  const categories = [
    'All',
    'Disaster Relief',
    'Education',
    'Healthcare',
    'Seasonal Relief',
    'Infrastructure',
    'Food Security'
  ];

  useEffect(() => {
    const unsub = campaignService.subscribeCampaigns((data) => {
      setCampaigns(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || 
                          (selectedStatus === 'Urgent' ? c.isUrgent : c.status === selectedStatus);

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'urgent') return (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0);
    if (sortBy === 'raised') return b.raisedAmount - a.raisedAmount;
    if (sortBy === 'goal') return b.goalAmount - a.goalAmount;
    return 0;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Page Header */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '4.5rem 0 3.5rem 0',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-tag" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#A7F3D0', borderColor: 'rgba(255,255,255,0.2)' }}>
            Humanitarian Missions
          </span>
          <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Active Relief & Development Campaigns
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#CBD5E1', lineHeight: '1.7' }}>
            Choose a cause close to your heart. Every single donation is deployed with full financial transparency and photographic proof of distribution.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar Section */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-light)', padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Top row: Search input & dropdowns */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="input-icon-wrap" style={{ flex: '1 1 320px' }}>
                <Search size={18} className="input-icon" />
                <input
                  type="text"
                  placeholder="Search campaigns by keyword, cause, or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <SlidersHorizontal size={16} color="var(--text-muted)" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="form-control"
                    style={{ padding: '0.6rem 0.9rem', fontSize: '0.88rem', width: 'auto' }}
                  >
                    <option value="urgent">Sort: Most Urgent First</option>
                    <option value="raised">Sort: Highest Raised</option>
                    <option value="goal">Sort: Highest Goal</option>
                  </select>
                </div>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="form-control"
                  style={{ padding: '0.6rem 0.9rem', fontSize: '0.88rem', width: 'auto' }}
                >
                  <option value="All">Status: All</option>
                  <option value="Urgent">Status: Urgent Appeals Only</option>
                  <option value="Active">Status: Active</option>
                  <option value="Completed">Status: Completed</option>
                </select>
              </div>
            </div>

            {/* Bottom row: Category Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border-medium)',
                    backgroundColor: selectedCategory === cat ? 'var(--primary)' : '#FFFFFF',
                    color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-main)',
                    fontSize: '0.84rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="section" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <SkeletonCard key={idx} height={340} />
              ))}
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <Filter size={48} color="var(--text-light)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.3rem', color: 'var(--navy)' }}>No matching campaigns found</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                Try adjusting your search terms, changing the category filter, or resetting criteria.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedStatus('All'); }}
                className="btn btn-outline-primary"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-8">
              {filteredCampaigns.map((camp) => (
                <div key={camp.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Thumbnail & Badges */}
                  <div style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
                    <img
                      src={camp.image}
                      alt={camp.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <Badge variant={camp.isUrgent ? 'Urgent' : 'primary'}>
                        {camp.isUrgent && <Flame size={13} />} {camp.category}
                      </Badge>
                      {camp.status === 'Completed' && (
                        <Badge variant="Completed">Goal Achieved 🎉</Badge>
                      )}
                    </div>

                    <div style={{
                      position: 'absolute',
                      bottom: '0.75rem',
                      right: '1rem',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Users size={12} /> {camp.donorsCount} Donors
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {camp.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <MapPin size={13} color="var(--primary)" />
                        <span>{camp.location}</span>
                      </div>
                    )}

                    <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', lineHeight: '1.3' }}>
                      {camp.title}
                    </h3>

                    <p style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-muted)',
                      lineClamp: 3,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {camp.description}
                    </p>

                    <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
                      <ProgressBar
                        current={camp.raisedAmount}
                        total={camp.goalAmount}
                        isUrgent={camp.isUrgent}
                      />
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <Link to={`/campaigns/${camp.id}`} className="btn btn-sm btn-outline" style={{ flex: 1 }}>
                      View Details
                    </Link>
                    <Link to={`/donate?campaign=${camp.id}`} className="btn btn-sm btn-primary" style={{ flex: 1 }}>
                      <Heart size={14} fill="#FFFFFF" /> Donate
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
