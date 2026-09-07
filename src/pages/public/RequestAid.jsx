import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { aidRequestService } from '../../services/aidRequestService';
import { ButtonLoader } from '../../components/common/ButtonLoader';
import confetti from 'canvas-confetti';
import { 
  HeartHandshake, 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Coins, 
  Building2, 
  ArrowRight,
  Sparkles,
  PhoneCall,
  User,
  MapPin,
  CreditCard
} from 'lucide-react';

export const RequestAid = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    cnic: '',
    city: 'Lahore',
    address: '',
    category: 'Medical Aid',
    amountNeeded: 25000,
    description: '',
    documentUrl: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedAid, setSubmittedAid] = useState(null);

  const categories = [
    { id: 'Medical Aid', label: 'Medical & Healthcare', icon: '🏥', desc: 'Hospital bills, surgery funds, essential medicines, dialysis support' },
    { id: 'Food Ration', label: 'Food & Monthly Ration', icon: '🍞', desc: 'Essential monthly staple food packages for deserving families' },
    { id: 'Education', label: 'Education & Fees', icon: '📚', desc: 'School/College tuition fee, books, uniforms, and academic assistance' },
    { id: 'Emergency Relief', label: 'Emergency Financial', icon: '⚡', desc: 'Disaster recovery, immediate rent crisis, or critical family emergency' }
  ];

  const presetAmounts = [10000, 25000, 50000, 100000, 250000];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amountNeeded' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.cnic.trim()) {
      showToast('Incomplete Form', 'Please provide your Full Name, Active Phone, and CNIC number.', 'error');
      return;
    }

    if (!formData.amountNeeded || formData.amountNeeded <= 0) {
      showToast('Invalid Amount', 'Please specify the assistance amount required.', 'error');
      return;
    }

    if (!formData.description.trim() || formData.description.trim().length < 20) {
      showToast('Need More Details', 'Please provide a clear description of your situation (at least 20 characters) to help our verification team.', 'warning');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        applicantId: currentUser?.uid || currentUser?.id || 'guest',
        amountNeeded: Number(formData.amountNeeded)
      };

      const result = await aidRequestService.createAidRequest(payload);

      if (result.success) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        setSubmittedAid(result.aidRequest);
        showToast('Application Submitted', 'Your aid request has been received. Our team will verify it shortly.', 'success');
      } else {
        showToast('Submission Failed', result.error || 'Could not submit aid request. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Aid request submit error:', err);
      showToast('Error', 'An unexpected error occurred. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedAid) {
    return (
      <div className="section-spacing bg-surface-50 min-h-[80vh] flex items-center justify-center">
        <div className="container-custom max-w-2xl">
          <div className="card-glass border border-emerald-500/30 text-center p-8 sm:p-10 shadow-2xl relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-primary-500 to-emerald-400"></div>

            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-3xl font-display font-bold text-surface-900 mb-2">
              Application Submitted Successfully!
            </h2>
            <p className="text-surface-600 mb-6">
              Your request for humanitarian assistance has been logged in GiveHope's verification desk.
            </p>

            <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6 text-left mb-8 space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-surface-200">
                <span className="text-xs font-semibold uppercase tracking-wider text-surface-500">Application Reference</span>
                <span className="font-mono font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg border border-primary-200">
                  {submittedAid.id}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Applicant:</span>
                <span className="font-medium text-surface-900">{submittedAid.fullName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Category:</span>
                <span className="font-medium text-surface-900">{submittedAid.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Amount Requested:</span>
                <span className="font-bold text-emerald-600">PKR {Number(submittedAid.amountNeeded).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Current Status:</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full text-xs">
                  <Clock className="w-3.5 h-3.5" /> Pending Verification
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isAuthenticated ? (
                <Link
                  to="/my-aid-requests"
                  className="btn btn-primary flex items-center justify-center gap-2 py-3.5"
                >
                  <FileText className="w-4 h-4" /> Track My Requests
                </Link>
              ) : (
                <Link
                  to="/register?role=Beneficiary"
                  className="btn btn-primary flex items-center justify-center gap-2 py-3.5"
                >
                  <User className="w-4 h-4" /> Create Account to Track
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setSubmittedAid(null);
                  setFormData({
                    fullName: currentUser?.name || '',
                    email: currentUser?.email || '',
                    phone: currentUser?.phone || '',
                    cnic: '',
                    city: 'Lahore',
                    address: '',
                    category: 'Medical Aid',
                    amountNeeded: 25000,
                    description: '',
                    documentUrl: ''
                  });
                }}
                className="btn btn-secondary flex items-center justify-center gap-2 py-3.5"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-spacing bg-surface-50">
      <div className="container-custom">
        {/* Header Hero */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold mb-4 shadow-sm">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            GiveHope Welfare & Beneficiary Support Desk
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-surface-900 tracking-tight mb-4">
            Apply for <span className="text-gradient">Emergency Aid & Relief</span>
          </h1>
          <p className="text-lg text-surface-600 leading-relaxed">
            If you or someone you know is facing acute medical hardship, food scarcity, or educational fee crises, GiveHope is here to provide verified, zero-deduction humanitarian assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Main Form */}
          <div className="lg:col-span-8">
            <div className="card-glass border border-surface-200 p-6 sm:p-10 rounded-3xl shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. Category Selection */}
                <div>
                  <label className="block text-sm font-bold text-surface-900 mb-3">
                    1. Select Assistance Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map((cat) => {
                      const isSelected = formData.category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, category: cat.id }))}
                          className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                            isSelected
                              ? 'border-primary-500 bg-primary-50/70 shadow-md ring-2 ring-primary-500/20'
                              : 'border-surface-200 bg-white hover:border-surface-300 hover:bg-surface-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-2xl">{cat.icon}</span>
                            <span className="font-bold text-surface-900 text-sm">{cat.label}</span>
                          </div>
                          <p className="text-xs text-surface-500 leading-relaxed">{cat.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Amount Needed */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-bold text-surface-900">
                      2. Required Amount (PKR) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      100% Direct Disbursal
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                    {presetAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, amountNeeded: amt }))}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          formData.amountNeeded === amt
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'bg-surface-100 text-surface-700 hover:bg-surface-200 border border-surface-200'
                        }`}
                      >
                        PKR {amt.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 font-bold text-sm">
                      PKR
                    </span>
                    <input
                      type="number"
                      name="amountNeeded"
                      value={formData.amountNeeded || ''}
                      onChange={handleChange}
                      min="1000"
                      step="500"
                      placeholder="Or enter custom required amount"
                      className="input pl-14 font-semibold text-base"
                      required
                    />
                  </div>
                </div>

                {/* 3. Applicant Personal Information */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-surface-900 border-b border-surface-200 pb-2">
                    3. Applicant / Beneficiary Information
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-surface-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Muhammad Aslam"
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-surface-700 mb-1">
                        CNIC / National ID <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cnic"
                        value={formData.cnic}
                        onChange={handleChange}
                        placeholder="e.g. 35201-1234567-1"
                        className="input font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-surface-700 mb-1">
                        Active Phone / WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+92 300 1234567"
                        className="input font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-surface-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="applicant@example.com"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-surface-700 mb-1">
                        City / District <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Lahore, Karachi, Rawalpindi"
                        className="input"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-surface-700 mb-1">
                        Residential Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House / Street / Area description for field verification"
                        className="input"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Request Description and Verification Proof */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-surface-900 border-b border-surface-200 pb-2">
                    4. Statement of Need & Verification Documents
                  </label>

                  <div>
                    <label className="block text-xs font-semibold text-surface-700 mb-1">
                      Reason for Request / Situation Details <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Please explain in detail why you need this assistance, family income situation, dependents, and how these funds will be utilized..."
                      className="input py-3"
                      required
                    ></textarea>
                    <p className="text-[11px] text-surface-500 mt-1">Minimum 20 characters. The more detail provided, the faster our committee can process your case.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-surface-700 mb-1">
                      Supporting Document Link / Google Drive URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="documentUrl"
                      value={formData.documentUrl}
                      onChange={handleChange}
                      placeholder="https://drive.google.com/... or cloud image of hospital bill / fee challan"
                      className="input"
                    />
                    <p className="text-[11px] text-surface-500 mt-1">You may provide a link to medical reports, prescription, fee challan, or CNIC scan.</p>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-surface-200">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary w-full py-4 text-base font-bold shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <ButtonLoader text="Submitting Aid Application..." />
                    ) : (
                      <>
                        <HeartHandshake className="w-5 h-5" /> Submit Official Aid Application
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-surface-500 mt-3 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    All applicant data is strictly confidential and protected by GiveHope's Privacy Policy.
                  </p>
                </div>

              </form>
            </div>
          </div>

          {/* Right Sidebar - Info & Guidelines */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* How It Works Card */}
            <div className="card-glass border border-surface-200 p-6 rounded-3xl shadow-sm">
              <h3 className="text-lg font-bold text-surface-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-600" /> Process Timeline
              </h3>
              <ol className="space-y-4 relative border-l-2 border-primary-200 ml-3 pl-4 text-sm">
                <li className="relative">
                  <span className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-primary-600 border-2 border-white"></span>
                  <p className="font-bold text-surface-900">1. Application Intake</p>
                  <p className="text-xs text-surface-600">Your form is assigned a unique reference ID and logged in our system.</p>
                </li>
                <li className="relative">
                  <span className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white"></span>
                  <p className="font-bold text-surface-900">2. Desk & Field Verification</p>
                  <p className="text-xs text-surface-600">Our volunteer coordinator calls you to verify CNIC and hospital/school documents.</p>
                </li>
                <li className="relative">
                  <span className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
                  <p className="font-bold text-surface-900">3. Approval & Disbursal</p>
                  <p className="text-xs text-surface-600">Funds are transferred directly to vendor/hospital or via JazzCash/Easypaisa/Bank.</p>
                </li>
              </ol>
            </div>

            {/* Helpline Card */}
            <div className="bg-gradient-to-br from-primary-900 to-surface-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl"></div>
              <h4 className="font-display font-bold text-lg mb-2 flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-amber-400" /> Immediate Emergency?
              </h4>
              <p className="text-xs text-primary-100 mb-4 leading-relaxed">
                If there is an ICU emergency, oxygen crisis, or critical accident, call our rapid response hotline directly:
              </p>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">24/7 Welfare Hotline</span>
                <p className="font-mono text-xl font-bold mt-0.5">+92 300 0000000</p>
              </div>
            </div>

            {/* Beneficiary Portal Link */}
            {isAuthenticated && (
              <div className="card-glass border border-emerald-200 bg-emerald-50/50 p-5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-surface-900 text-sm">Already applied?</h5>
                    <p className="text-xs text-surface-600">Check real-time status of your cases.</p>
                  </div>
                </div>
                <Link
                  to="/my-aid-requests"
                  className="mt-3 btn btn-outline btn-sm w-full flex items-center justify-center gap-1 text-xs"
                >
                  View My Aid Requests <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestAid;
