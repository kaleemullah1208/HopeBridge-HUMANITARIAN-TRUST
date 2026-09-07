import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { volunteerService } from '../../services/volunteerService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ButtonLoader } from '../../components/common/ButtonLoader';
import { Badge } from '../../components/common/Badge';
import confetti from 'canvas-confetti';
import { 
  HandHeart, 
  Award, 
  Users, 
  HeartHandshake, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Send,
  Stethoscope,
  BookOpen,
  Truck,
  Camera,
  Calendar,
  MapPin,
  Flame,
  CheckCircle,
  FileText
} from 'lucide-react';

export const Volunteer = () => {
  const [searchParams] = useSearchParams();
  const preselectedCampaign = searchParams.get('campaign') || '';

  const { currentUser, isVolunteer } = useAuth();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [existingVolunteer, setExistingVolunteer] = useState(null);
  const [activeDrives, setActiveDrives] = useState([
    { id: 'DRIVE-101', title: 'Tharparkar Solar Water Well Installation Drive', date: 'Upcoming Weekend', location: 'Mithi, Tharparkar', role: 'Logistics & Tech' },
    { id: 'DRIVE-102', title: 'Ramadan Ration Bagging & Sorting Operation', date: 'Daily 4:00 PM', location: 'Lahore Central Warehouse', role: 'Packaging & Dispatch' },
    { id: 'DRIVE-103', title: 'Balochistan Mobile Free Health Camp', date: 'Next Month 12-15th', location: 'Khuzdar, Balochistan', role: 'Medical & Crowd Support' }
  ]);

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    city: 'Lahore',
    address: '',
    areaOfInterest: 'Disaster Relief Operations',
    availability: 'Weekends & Emergency Callouts',
    skills: ['Logistics & Warehousing'],
    experience: '',
    message: '',
    campaignId: preselectedCampaign
  });

  useEffect(() => {
    if (currentUser) {
      const unsub = volunteerService.subscribeVolunteers((list) => {
        const found = list.find((v) => 
          (v.email && currentUser.email && v.email.toLowerCase() === currentUser.email.toLowerCase()) ||
          (v.id && (v.id === currentUser.id || v.id === currentUser.uid))
        );
        if (found) {
          setExistingVolunteer(found);
        } else if (isVolunteer) {
          // If registered as volunteer but no separate record, create a mock profile view
          setExistingVolunteer({
            id: `VOL-${currentUser.uid ? currentUser.uid.slice(0, 5) : '7721'}`,
            name: currentUser.name,
            email: currentUser.email,
            phone: currentUser.phone || '+92 300 1234567',
            city: currentUser.city || 'Lahore',
            areaOfInterest: 'Field Operations & Humanitarian Aid',
            availability: 'Weekends & On-Call',
            status: 'Active',
            skills: ['General Support', 'Field Operations'],
            hoursContributed: 28
          });
        }
      });
      return () => unsub();
    }
  }, [currentUser, isVolunteer]);

  const availableSkills = [
    'Medical & First Aid',
    'Logistics & Warehousing',
    'Teaching & Tutoring',
    'Driving (4x4)',
    'Photography & Media',
    'Fundraising & PR',
    'Solar & Technical Skills',
    'General Volunteering'
  ];

  const handleSkillToggle = (skill) => {
    setFormData((prev) => {
      const exists = prev.skills.includes(skill);
      if (exists) {
        return { ...prev, skills: prev.skills.filter((s) => s !== skill) };
      } else {
        return { ...prev, skills: [...prev.skills, skill] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      showToast('Missing Fields', 'Please complete all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    const result = await volunteerService.applyVolunteer(formData);
    setSubmitting(false);

    if (result.success) {
      setSubmittedApplication(result.volunteer);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
      showToast('Application Submitted!', 'Thank you! Our volunteer coordinator will contact you shortly.', 'success');
    } else {
      showToast('Submission Error', result.error || 'Could not submit application.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Page Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #064E3B 100%)',
        color: '#FFFFFF',
        padding: '4.5rem 0',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-tag" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#A7F3D0', borderColor: 'rgba(255,255,255,0.2)' }}>
            Join the Hope Force
          </span>
          <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Be the Hands That Heal & Empower
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#CBD5E1', lineHeight: '1.7' }}>
            Volunteers are the backbone of GiveHope. Whether you have 2 hours a week or full-time availability, your passion can transform a struggling family's future.
          </p>
        </div>
      </section>

      {/* Volunteer Benefits Grid */}
      <section className="section" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-tag">Why Volunteer With Us</span>
            <h2 className="section-title">Rewarding Experiences That Last a Lifetime</h2>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>Verified Certificates</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Official certified hours and recommendation letters for academic and professional growth.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#EFF6FF',
                color: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <HeartHandshake size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>Field Leadership</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Gain real-world crisis management and logistical coordination leadership experience.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>Humanitarian Network</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Connect with thousands of compassionate doctors, engineers, social workers, and students.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>Tangible Impact</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Deliver food, health checkups, and books directly into the hands of real people.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Application Form / Volunteer Dashboard Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          {submittedApplication ? (
            <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--status-success-bg)',
                color: 'var(--status-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle2 size={42} />
              </div>

              <h2 style={{ fontSize: '1.8rem', color: 'var(--navy)' }}>
                Welcome to the GiveHope Family!
              </h2>

              <p style={{ color: 'var(--text-muted)', maxWidth: '520px', lineHeight: '1.7' }}>
                Thank you, <strong>{submittedApplication.name}</strong>. Your volunteer application has been registered with reference ID <span className="badge badge-primary" style={{ fontSize: '0.9rem' }}>{submittedApplication.id}</span>.
              </p>

              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1.25rem 2rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                textAlign: 'left',
                width: '100%',
                maxWidth: '460px'
              }}>
                <div><strong>Selected Focus:</strong> {submittedApplication.areaOfInterest}</div>
                <div style={{ marginTop: '0.35rem' }}><strong>Availability:</strong> {submittedApplication.availability}</div>
                <div style={{ marginTop: '0.35rem' }}><strong>Application Status:</strong> <span className="badge badge-warning">Pending Coordinator Review</span></div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Our field lead will review your profile and reach out via WhatsApp/Phone within 48 hours.
              </p>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={() => setSubmittedApplication(null)}
                  className="btn btn-outline"
                >
                  Back to Hub
                </button>
                <Link to="/campaigns" className="btn btn-primary">
                  Explore Active Campaigns
                </Link>
              </div>
            </div>
          ) : existingVolunteer ? (
            /* Logged-In Volunteer Member Hub */
            <div className="space-y-6">
              <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-medium)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h2 style={{ fontSize: '1.6rem', color: 'var(--navy)', margin: 0 }}>
                        Volunteer Portal: {existingVolunteer.name}
                      </h2>
                      <Badge variant={existingVolunteer.status || 'Active'}>{existingVolunteer.status || 'Active'}</Badge>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Member ID: <strong className="font-mono">{existingVolunteer.id}</strong> • City: {existingVolunteer.city || 'Lahore'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ textAlign: 'center', background: 'var(--primary-light)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-dark)' }}>
                        {existingVolunteer.hoursContributed || 24} hrs
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--primary-dark)', fontWeight: '600' }}>Impact Logged</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--navy)' }}>Core Expertise:</strong>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                      {Array.isArray(existingVolunteer.skills) && existingVolunteer.skills.map((s) => (
                        <span key={s} className="badge badge-info" style={{ fontSize: '0.7rem' }}>{s}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--navy)' }}>Assigned Domain:</strong>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{existingVolunteer.areaOfInterest || 'Field Operations'}</p>
                  </div>

                  <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--navy)' }}>Availability:</strong>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{existingVolunteer.availability || 'Weekends & On-Call'}</p>
                  </div>
                </div>

                {/* Active Field Drives for Volunteers */}
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={18} color="var(--primary)" /> Upcoming Field Operations & Volunteer Drives
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {activeDrives.map((drive) => (
                      <div
                        key={drive.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.85rem 1.25rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-light)',
                          backgroundColor: '#FFFFFF',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--navy)' }}>{drive.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
                            <span>📍 {drive.location}</span>
                            <span>⏰ {drive.date}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast('Registered for Drive', `You have been signed up for ${drive.title}. Coordinator will confirm via WhatsApp.`, 'success')}
                          className="btn btn-sm btn-primary"
                        >
                          Join Drive
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-xl)' }}>
              <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--navy)', marginBottom: '0.35rem' }}>
                  Volunteer Application Form
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Please fill out the form below. All applications are reviewed by our regional volunteer leads.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Name & Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Full Name <span className="required">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Ayesha Malik"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address <span className="required">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ayesha@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Phone & City */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">WhatsApp / Phone Number <span className="required">*</span></label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City of Residence <span className="required">*</span></label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="form-control"
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad / Rawalpindi">Islamabad / Rawalpindi</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Other">Other District</option>
                    </select>
                  </div>
                </div>

                {/* Area of Interest */}
                <div className="form-group">
                  <label className="form-label">Primary Area of Interest <span className="required">*</span></label>
                  <select
                    value={formData.areaOfInterest}
                    onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value })}
                    className="form-control"
                  >
                    <option value="Disaster Relief Operations">Disaster Relief Operations (Field Ration Packing & Distribution)</option>
                    <option value="Medical & Health Camps">Medical & Health Camps (Doctors, Nurses, First Aid)</option>
                    <option value="Child Education & Mentorship">Child Education & Mentorship (Teaching & Art)</option>
                    <option value="Media, PR & Awareness">Media, PR & Storytelling (Photography, Video, Social Media)</option>
                    <option value="Fundraising & Donor Relations">Fundraising & Corporate CSR Relations</option>
                    <option value="Clean Water Well Infrastructure">Clean Water Well & Solar Tech Maintenance</option>
                    <option value="General Assistance">General On-Call Assistance</option>
                  </select>
                </div>

                {/* Skills Selection */}
                <div className="form-group">
                  <label className="form-label">Select Your Relevant Skills (Pick one or more)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                    {availableSkills.map((skill) => {
                      const isSelected = formData.skills.includes(skill);
                      return (
                        <button
                          type="button"
                          key={skill}
                          onClick={() => handleSkillToggle(skill)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid',
                            borderColor: isSelected ? 'var(--primary)' : 'var(--border-medium)',
                            backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                            color: isSelected ? 'var(--primary-dark)' : 'var(--text-muted)',
                            fontSize: '0.82rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {isSelected && <CheckCircle2 size={13} color="var(--primary)" />}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Availability */}
                <div className="form-group">
                  <label className="form-label">Availability Schedule <span className="required">*</span></label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="form-control"
                  >
                    <option value="Weekends & Emergency Callouts">Weekends & Emergency Callouts</option>
                    <option value="Weekdays (Evenings)">Weekdays (Evenings after 5 PM)</option>
                    <option value="Full-Time (Active Disaster On-Call)">Full-Time (Active Disaster On-Call)</option>
                    <option value="Flexible / Remote Volunteer">Flexible / Remote Support</option>
                  </select>
                </div>

                {/* Previous Experience */}
                <div className="form-group">
                  <label className="form-label">Prior Volunteer or Professional Experience</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly mention any previous NGO work, clinical training, school teaching, driving experience..."
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="form-control"
                  />
                </div>

                {/* Motivation Message */}
                <div className="form-group">
                  <label className="form-label">Why do you want to join GiveHope?</label>
                  <textarea
                    rows={2}
                    placeholder="What motivates you to volunteer with us?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-control"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-lg btn-primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
                >
                  <ButtonLoader loading={submitting} loadingText="Registering Application...">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Send size={18} />
                      <span>Submit Volunteer Application</span>
                    </span>
                  </ButtonLoader>
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
