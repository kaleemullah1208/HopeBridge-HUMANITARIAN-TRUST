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
  CreditCard,
  UserCheck,
  Check,
  Info,
  ExternalLink,
  UploadCloud,
  ChevronRight
} from 'lucide-react';

export const RequestAid = () => {
  const { currentUser, isAuthenticated, isVolunteer } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // If volunteer is logged in, default to field submission mode on behalf of needy family
  const [submitAsVolunteer, setSubmitAsVolunteer] = useState(isVolunteer);

  const [formData, setFormData] = useState({
    applicantName: isVolunteer ? '' : (currentUser?.name || ''),
    phone: '',
    cnic: '',
    email: isVolunteer ? '' : (currentUser?.email || ''),
    city: 'Lahore',
    address: '',
    category: 'Medical Aid',
    amountNeeded: 25000,
    reason: '',
    documentUrl: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedAid, setSubmittedAid] = useState(null);

  const categories = [
    { 
      id: 'Medical Aid', 
      label: 'Medical & Healthcare', 
      icon: '🏥', 
      desc: 'Hospital bills, urgent surgery, essential prescription medicines, and dialysis funds' 
    },
    { 
      id: 'Food Ration', 
      label: 'Food & Monthly Ration', 
      icon: '🍞', 
      desc: 'Emergency staple food packages & monthly sustenance for deserving families' 
    },
    { 
      id: 'Education', 
      label: 'Education & Fees', 
      icon: '📚', 
      desc: 'School/College tuition fee, semester dues, books, and scholarship aid' 
    },
    { 
      id: 'Emergency Relief', 
      label: 'Emergency Financial Relief', 
      icon: '⚡', 
      desc: 'Disaster recovery, immediate rent crisis, or critical family emergency' 
    }
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

    if (!formData.applicantName.trim() || !formData.phone.trim() || !formData.cnic.trim()) {
      showToast('Incomplete Form', 'Please provide the Applicant Name, Active Contact Phone, and CNIC number.', 'error');
      return;
    }

    if (!formData.amountNeeded || formData.amountNeeded <= 0) {
      showToast('Invalid Amount', 'Please specify the assistance amount required (PKR).', 'error');
      return;
    }

    if (!formData.reason.trim() || formData.reason.trim().length < 20) {
      showToast('Need More Details', 'Please provide a clear statement of need (at least 20 characters) for field verification.', 'warning');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        applicantName: formData.applicantName.trim(),
        fullName: formData.applicantName.trim(),
        phone: formData.phone.trim(),
        cnic: formData.cnic.trim(),
        email: formData.email.trim(),
        city: formData.city,
        address: formData.address.trim(),
        category: formData.category,
        amountNeeded: Number(formData.amountNeeded),
        reason: formData.reason.trim(),
        description: formData.reason.trim(),
        documentUrl: formData.documentUrl.trim(),
        applicantId: isAuthenticated ? (currentUser?.uid || currentUser?.id) : 'guest',
        submittedBy: isVolunteer && submitAsVolunteer ? 'volunteer' : (isAuthenticated ? 'beneficiary' : 'guest'),
        volunteerId: isVolunteer && submitAsVolunteer ? (currentUser?.uid || currentUser?.id) : null,
        volunteerName: isVolunteer && submitAsVolunteer ? currentUser?.name : null,
        volunteerPhone: isVolunteer && submitAsVolunteer ? (currentUser?.phone || '') : null
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
        showToast(
          'Application Submitted',
          isVolunteer && submitAsVolunteer
            ? `Field case logged under your volunteer referral (${currentUser?.name}).`
            : 'Your aid request has been received. Our verification desk will review it shortly.',
          'success'
        );
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

  // SUCCESS CONFIRMATION VIEW
  if (submittedAid) {
    return (
      <div className="section-spacing bg-surface-50 min-h-[80vh] flex items-center justify-center px-4">
        <div className="container-custom max-w-2xl">
          <div className="bg-white border border-emerald-500/30 rounded-3xl text-center p-8 sm:p-10 shadow-2xl relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500"></div>

            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-3xl font-display font-extrabold text-surface-900 mb-2">
              Application Logged Successfully!
            </h2>
            <p className="text-surface-600 text-sm mb-6 max-w-md mx-auto">
              Your request for humanitarian assistance has been logged in GiveHope's live verification desk.
            </p>

            <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6 text-left mb-8 space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-surface-200">
                <span className="text-xs font-bold uppercase tracking-wider text-surface-500">Tracking Reference ID</span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-300 text-sm">
                  {submittedAid.id}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Beneficiary:</span>
                <span className="font-bold text-surface-900">{submittedAid.applicantName || submittedAid.fullName}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Assistance Category:</span>
                <span className="font-medium text-surface-900">{submittedAid.category}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Amount Requested:</span>
                <span className="font-extrabold text-emerald-600 text-base">
                  PKR {Number(submittedAid.amountNeeded).toLocaleString()}
                </span>
              </div>

              {submittedAid.submittedBy === 'volunteer' && (
                <div className="flex justify-between text-xs pt-2 border-t border-surface-200">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> Field Referrer:
                  </span>
                  <span className="font-medium text-emerald-900">{submittedAid.volunteerName || 'Verified Volunteer'}</span>
                </div>
              )}

              <div className="flex justify-between text-sm pt-2 border-t border-surface-200">
                <span className="text-surface-500">Initial Status:</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-xs">
                  <Clock className="w-3.5 h-3.5" /> Pending Verification
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isAuthenticated ? (
                <Link
                  to="/my-aid-requests"
                  className="btn btn-primary flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold shadow-md shadow-emerald-600/20"
                >
                  <FileText className="w-4 h-4" /> Track My Requests
                </Link>
              ) : (
                <Link
                  to="/register?role=Beneficiary"
                  className="btn btn-primary flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold shadow-md shadow-emerald-600/20"
                >
                  <User className="w-4 h-4" /> Create Account to Track
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setSubmittedAid(null);
                  setFormData({
                    applicantName: isVolunteer ? '' : (currentUser?.name || ''),
                    phone: '',
                    cnic: '',
                    email: isVolunteer ? '' : (currentUser?.email || ''),
                    city: 'Lahore',
                    address: '',
                    category: 'Medical Aid',
                    amountNeeded: 25000,
                    reason: '',
                    documentUrl: ''
                  });
                }}
                className="btn btn-secondary flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold"
              >
                Submit Another Case
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-spacing bg-surface-50 min-h-screen">
      <div className="container-custom">
        {/* Header Hero */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-4 shadow-sm">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            GiveHope Welfare & Emergency Assistance Desk
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-surface-900 tracking-tight mb-4">
            Apply for <span className="text-gradient">Humanitarian Aid & Relief</span>
          </h1>
          <p className="text-sm sm:text-base text-surface-600 leading-relaxed max-w-2xl mx-auto">
            GiveHope delivers direct, zero-deduction financial and ration relief for families facing medical emergencies, food poverty, or educational crises.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Main Form Column */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-surface-200 p-6 sm:p-10 rounded-3xl shadow-xl">
              
              {/* Verified Volunteer Banner / Toggle */}
              {isVolunteer && (
                <div className="mb-8 p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-surface-900 text-sm sm:text-base">
                          Volunteer Field Submission Mode
                        </span>
                        <span className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                          Verified Field Lead
                        </span>
                      </div>
                      <p className="text-xs text-surface-600 mt-0.5">
                        Logging aid request on behalf of a deserving family encountered in the field. Tagged with Volunteer ID: <strong className="font-mono text-emerald-800">{currentUser?.uid ? currentUser.uid.slice(0, 8) : 'VOL-LEAD'}</strong>.
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={submitAsVolunteer}
                      onChange={(e) => setSubmitAsVolunteer(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. Category Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-surface-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">1</span>
                      Select Assistance Category <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-xs text-surface-500 font-medium">Choose primary need</span>
                  </div>

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
                              ? 'border-emerald-500 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/30'
                              : 'border-surface-200 bg-white hover:border-surface-300 hover:bg-surface-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-1.5">
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
                    <label className="text-sm font-bold text-surface-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">2</span>
                      Estimated Amount Required (PKR) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
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
                            ? 'bg-emerald-600 text-white shadow-sm'
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
                      className="w-full pl-14 pr-4 py-3 rounded-xl border border-surface-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-semibold text-surface-900 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* 3. Applicant Personal Information */}
                <div className="space-y-4 pt-2">
                  <label className="block text-sm font-bold text-surface-900 border-b border-surface-200 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">3</span>
                    Beneficiary / Applicant Information
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-surface-700 mb-1.5">
                        Beneficiary Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="applicantName"
                        value={formData.applicantName}
                        onChange={handleChange}
                        placeholder="e.g. Muhammad Aslam"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm text-surface-900 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-surface-700 mb-1.5">
                        CNIC / National ID Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cnic"
                        value={formData.cnic}
                        onChange={handleChange}
                        placeholder="35201-1234567-1"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm font-mono text-surface-900 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-surface-700 mb-1.5">
                        Active Phone / WhatsApp Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+92 300 1234567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm font-mono text-surface-900 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-surface-700 mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="applicant@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm text-surface-900 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-surface-700 mb-1.5">
                        City / District <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm text-surface-900 bg-white transition-all"
                        required
                      >
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Islamabad / Rawalpindi">Islamabad / Rawalpindi</option>
                        <option value="Peshawar">Peshawar</option>
                        <option value="Quetta">Quetta</option>
                        <option value="Faisalabad">Faisalabad</option>
                        <option value="Multan">Multan</option>
                        <option value="Tharparkar">Tharparkar</option>
                        <option value="Other">Other District</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-surface-700 mb-1.5">
                        Residential Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House, street & landmark description for field verification"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm text-surface-900 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Statement of Need and Proof */}
                <div className="space-y-4 pt-2">
                  <label className="block text-sm font-bold text-surface-900 border-b border-surface-200 pb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">4</span>
                    Statement of Need & Verification Documents
                  </label>

                  <div>
                    <label className="block text-xs font-bold text-surface-700 mb-1.5">
                      Reason for Request / Family Financial Situation <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Please explain in detail why this assistance is required, dependents, income source, and how funds will be used..."
                      className="w-full p-3.5 rounded-xl border border-surface-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm text-surface-900 transition-all"
                      required
                    ></textarea>
                    <p className="text-[11px] text-surface-500 mt-1">Minimum 20 characters. Detailed statements speed up committee review.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-surface-700 mb-1.5">
                      Supporting Document Link / Google Drive URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="documentUrl"
                      value={formData.documentUrl}
                      onChange={handleChange}
                      placeholder="https://drive.google.com/... or hospital estimate / fee challan image link"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm text-surface-900 transition-all"
                    />
                    <p className="text-[11px] text-surface-500 mt-1">Medical prescription, hospital bill, salary slip, or educational challan link.</p>
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="pt-4 border-t border-surface-200">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? (
                      <ButtonLoader text="Submitting Aid Application..." />
                    ) : (
                      <>
                        <HeartHandshake className="w-5 h-5" /> 
                        {isVolunteer && submitAsVolunteer 
                          ? 'Submit Verified Field Aid Case' 
                          : 'Submit Official Aid Application'}
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-surface-500 mt-4">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>All submitted data is strictly protected under GiveHope's Non-Profit Privacy Charter.</span>
                  </div>
                </div>

              </form>
            </div>
          </div>

          {/* Right Column: Process & Helpline */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Timeline Guide */}
            <div className="bg-white border border-surface-200 p-6 rounded-3xl shadow-sm">
              <h3 className="text-base font-bold text-surface-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" /> Verification & Disbursal Steps
              </h3>
              <ol className="space-y-4 relative border-l-2 border-emerald-200 ml-3 pl-4 text-xs sm:text-sm">
                <li className="relative">
                  <span className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white"></span>
                  <p className="font-bold text-surface-900">1. Intake & Reference ID</p>
                  <p className="text-xs text-surface-600 mt-0.5">Assigned a tracking ID and queued in Firestore.</p>
                </li>
                <li className="relative">
                  <span className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white"></span>
                  <p className="font-bold text-surface-900">2. Desk & Field Check</p>
                  <p className="text-xs text-surface-600 mt-0.5">Coordinator verifies CNIC and vendor/hospital records.</p>
                </li>
                <li className="relative">
                  <span className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-teal-600 border-2 border-white"></span>
                  <p className="font-bold text-surface-900">3. Direct Disbursal</p>
                  <p className="text-xs text-surface-600 mt-0.5">Funds disbursed via direct hospital pay, bank transfer, or ration delivery.</p>
                </li>
              </ol>
            </div>

            {/* Urgent Hotline Card */}
            <div className="bg-gradient-to-br from-surface-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-emerald-500/20 rounded-full blur-xl"></div>
              <h4 className="font-display font-bold text-base mb-2 flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-amber-400" /> Urgent Life-Critical Crisis?
              </h4>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                For active ICU hospitalization, emergency surgery, or disaster rescue, contact our 24/7 rapid response lead directly:
              </p>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">24/7 Welfare Hotline</span>
                <p className="font-mono text-xl font-extrabold mt-0.5">+92 (42) 3588-4422</p>
              </div>
            </div>

            {/* Portal Link if logged in */}
            {isAuthenticated && (
              <div className="bg-emerald-50/80 border border-emerald-200 p-5 rounded-3xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-surface-900 text-sm">Track Applications</h5>
                    <p className="text-xs text-surface-600">Check live status of your cases.</p>
                  </div>
                </div>
                <Link
                  to="/my-aid-requests"
                  className="mt-3.5 w-full py-2.5 px-4 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
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
