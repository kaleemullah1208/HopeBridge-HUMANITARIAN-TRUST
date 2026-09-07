import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { campaignService } from '../../services/campaignService';
import { donationService } from '../../services/donationService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DonationReceiptModal } from '../../components/common/DonationReceiptModal';
import { ButtonLoader } from '../../components/common/ButtonLoader';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  Lock,
  Sparkles,
  Award,
  Wallet
} from 'lucide-react';

export const Donate = () => {
  const [searchParams] = useSearchParams();
  const initialCampaignId = searchParams.get('campaign') || '';
  const initialAmount = Number(searchParams.get('amount')) || 5000;

  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(initialCampaignId);
  const [amount, setAmount] = useState(initialAmount);
  const [customAmount, setCustomAmount] = useState(initialAmount);
  const [donationType, setDonationType] = useState('One-Time');
  const [paymentMethod, setPaymentMethod] = useState('JazzCash');
  const [submitting, setSubmitting] = useState(false);
  const [receiptDonation, setReceiptDonation] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const [donorData, setDonorData] = useState({
    name: currentUser ? currentUser.name : '',
    email: currentUser ? currentUser.email : '',
    phone: currentUser ? currentUser.phone : '+92 300 1234567',
    city: 'Lahore',
    anonymous: false,
    message: ''
  });

  useEffect(() => {
    const unsub = campaignService.subscribeCampaigns((list) => {
      setCampaigns(list);
      if (!selectedCampaignId && list.length > 0) {
        setSelectedCampaignId(list[0].id);
      }
    });
    return () => unsub();
  }, [selectedCampaignId]);

  const presetAmounts = [500, 1000, 2500, 5000, 10000, 25000, 50000];

  const handleAmountSelect = (val) => {
    setAmount(val);
    setCustomAmount(val);
  };

  const handleCustomChange = (e) => {
    const val = Number(e.target.value);
    setCustomAmount(val);
    setAmount(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      showToast('Invalid Amount', 'Please select or enter a donation amount.', 'error');
      return;
    }

    if (!donorData.anonymous && (!donorData.name || !donorData.email)) {
      showToast('Missing Details', 'Please provide your name and email to issue your tax receipt.', 'error');
      return;
    }

    setSubmitting(true);

    const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);

    const payload = {
      donorName: donorData.anonymous ? 'Anonymous Supporter' : donorData.name,
      email: donorData.email || 'donor@example.com',
      phone: donorData.phone,
      city: donorData.city,
      amount: Number(amount),
      currency: 'PKR',
      campaignId: selectedCampaignId,
      campaignTitle: selectedCampaign ? selectedCampaign.title : 'General Humanitarian Fund',
      donationType: donationType,
      paymentMethod: paymentMethod,
      anonymous: donorData.anonymous,
      message: donorData.message
    };

    const result = await donationService.createDonation(payload);
    setSubmitting(false);

    if (result.success) {
      setReceiptDonation(result.donation);
      setShowReceiptModal(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.55 }
        });
      } catch (err) {}
      showToast('Donation Successful!', `Thank you for donating Rs. ${amount.toLocaleString()}!`, 'success');
    } else {
      showToast('Donation Failed', result.error || 'Unable to process transaction.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: 'var(--bg-page)' }}>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #064E3B 100%)',
        color: '#FFFFFF',
        padding: '3.5rem 0',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <span className="section-tag" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#A7F3D0', borderColor: 'rgba(255,255,255,0.2)' }}>
            100% Tax-Exempt & Zakat Compliant
          </span>
          <h1 style={{ fontSize: '2.5rem', color: '#FFFFFF', marginTop: '0.4rem', marginBottom: '0.75rem' }}>
            Make a Life-Saving Contribution
          </h1>
          <p style={{ fontSize: '1rem', color: '#CBD5E1', lineHeight: '1.6' }}>
            Your generosity provides immediate relief rations, medical care, solar clean water, and children's school fees.
          </p>
        </div>
      </section>

      {/* Main Donation Container */}
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Step 1: Campaign Selection & Frequency */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' }}>1</div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--navy)' }}>Select Campaign & Giving Frequency</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Allocate To Campaign</label>
                  <select
                    value={selectedCampaignId}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    className="form-control"
                  >
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Donation Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setDonationType('One-Time')}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid',
                        borderColor: donationType === 'One-Time' ? 'var(--primary)' : 'var(--border-medium)',
                        backgroundColor: donationType === 'One-Time' ? 'var(--primary-light)' : '#FFFFFF',
                        color: donationType === 'One-Time' ? 'var(--primary-dark)' : 'var(--text-main)',
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        cursor: 'pointer'
                      }}
                    >
                      One-Time
                    </button>
                    <button
                      type="button"
                      onClick={() => setDonationType('Monthly')}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid',
                        borderColor: donationType === 'Monthly' ? 'var(--primary)' : 'var(--border-medium)',
                        backgroundColor: donationType === 'Monthly' ? 'var(--primary-light)' : '#FFFFFF',
                        color: donationType === 'Monthly' ? 'var(--primary-dark)' : 'var(--text-main)',
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        cursor: 'pointer'
                      }}
                    >
                      Monthly Recurring
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Choose Amount */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' }}>2</div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--navy)' }}>Choose Contribution Amount (PKR)</h3>
              </div>

              {/* Preset buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                {presetAmounts.map((amt) => {
                  const isSelected = amount === amt;
                  return (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => handleAmountSelect(amt)}
                      style={{
                        padding: '0.85rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid',
                        borderColor: isSelected ? 'var(--primary)' : 'var(--border-light)',
                        backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                        color: isSelected ? 'var(--primary-dark)' : 'var(--navy)',
                        fontWeight: '800',
                        fontSize: '0.98rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? '0 2px 8px rgba(13, 148, 136, 0.2)' : 'none'
                      }}
                    >
                      Rs. {amt.toLocaleString()}
                    </button>
                  );
                })}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Or Enter Custom Amount (Rs.)</label>
                <div className="input-icon-wrap">
                  <span className="input-icon" style={{ fontWeight: '800', color: 'var(--primary)' }}>PKR</span>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={customAmount}
                    onChange={handleCustomChange}
                    className="form-control"
                    placeholder="Enter custom amount in PKR"
                    style={{ fontSize: '1.1rem', fontWeight: '700' }}
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Donor Information */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' }}>3</div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--navy)' }}>Donor Information</h3>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={donorData.anonymous}
                    onChange={(e) => setDonorData({ ...donorData, anonymous: e.target.checked })}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>Donate Anonymously (Hide name on public wall)</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Full Name {!donorData.anonymous && <span className="required">*</span>}</label>
                  <input
                    type="text"
                    disabled={donorData.anonymous}
                    required={!donorData.anonymous}
                    placeholder={donorData.anonymous ? 'Anonymous Supporter' : 'e.g. Dr. Tariq Mansoor'}
                    value={donorData.name}
                    onChange={(e) => setDonorData({ ...donorData, name: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (For Tax Receipt) <span className="required">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. donor@example.com"
                    value={donorData.email}
                    onChange={(e) => setDonorData({ ...donorData, email: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={donorData.phone}
                    onChange={(e) => setDonorData({ ...donorData, phone: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Lahore, Karachi, Islamabad"
                    value={donorData.city}
                    onChange={(e) => setDonorData({ ...donorData, city: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Dedication Note or Message (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Dedicated in memory of parents / Sadaqah Jariyah"
                  value={donorData.message}
                  onChange={(e) => setDonorData({ ...donorData, message: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            {/* Step 4: Simulated Payment Method Selector */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' }}>4</div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--navy)' }}>Simulated Payment Gateway</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                {[
                  { id: 'JazzCash', name: 'JazzCash', icon: Smartphone },
                  { id: 'EasyPaisa', name: 'EasyPaisa', icon: Wallet },
                  { id: 'Debit/Credit Card', name: 'Debit/Credit Card', icon: CreditCard },
                  { id: 'Bank Transfer', name: 'Bank Transfer', icon: Building2 }
                ].map((pm) => {
                  const isSelected = paymentMethod === pm.id;
                  const IconComp = pm.icon;
                  return (
                    <button
                      type="button"
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      style={{
                        padding: '1rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid',
                        borderColor: isSelected ? 'var(--primary)' : 'var(--border-light)',
                        backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                        color: isSelected ? 'var(--primary-dark)' : 'var(--navy)',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <IconComp size={22} color={isSelected ? 'var(--primary)' : 'var(--text-muted)'} />
                      <span>{pm.name}</span>
                    </button>
                  );
                })}
              </div>

              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                marginTop: '1rem',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Lock size={16} color="var(--primary)" />
                <span>Simulated Sandbox Mode: Submitting will generate an official instant tax receipt without charging real money.</span>
              </div>
            </div>

            {/* Total Summary & Submit Action */}
            <div style={{
              background: 'linear-gradient(135deg, var(--navy) 0%, #1E293B 100%)',
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem'
            }}>
              <div>
                <span style={{ fontSize: '0.82rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Donation Amount
                </span>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#A7F3D0', fontFamily: 'var(--font-heading)' }}>
                  Rs. {amount ? Number(amount).toLocaleString() : 0}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>
                  {donationType} Contribution via {paymentMethod}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-lg btn-accent"
                style={{ fontWeight: '800', padding: '1rem 2.25rem', fontSize: '1.05rem', boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)' }}
              >
                <ButtonLoader loading={submitting} loadingText="Processing Contribution...">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Heart size={20} fill="#FFFFFF" />
                    <span>Complete Donation & Get Receipt</span>
                  </span>
                </ButtonLoader>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Donation Receipt Modal */}
      <DonationReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        donation={receiptDonation}
      />
    </div>
  );
};
