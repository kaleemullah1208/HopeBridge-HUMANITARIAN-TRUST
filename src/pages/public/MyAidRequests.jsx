import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { aidRequestService } from '../../services/aidRequestService';
import { Badge } from '../../components/common/Badge';
import { 
  HeartHandshake, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  Search,
  ExternalLink,
  Building2,
  Calendar,
  HelpCircle,
  Coins,
  ShieldAlert
} from 'lucide-react';

export const MyAidRequests = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const unsub = aidRequestService.subscribeAidRequests((allList) => {
      if (currentUser) {
        // Filter by user ID or user email
        const userList = allList.filter((item) => {
          return (
            (item.applicantId && item.applicantId === currentUser.uid) ||
            (item.applicantId && item.applicantId === currentUser.id) ||
            (item.email && currentUser.email && item.email.toLowerCase() === currentUser.email.toLowerCase()) ||
            (item.phone && currentUser.phone && item.phone === currentUser.phone)
          );
        });
        setRequests(userList);
      } else {
        setRequests([]);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser]);

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
    const matchesSearch = 
      req.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.cnic?.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const getStepProgress = (status) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Under Review':
        return 2;
      case 'Approved':
        return 3;
      case 'Disbursed':
        return 4;
      case 'Rejected':
        return -1;
      default:
        return 1;
    }
  };

  return (
    <div className="section-spacing bg-surface-50 min-h-[85vh]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold mb-2">
              <HeartHandshake className="w-3.5 h-3.5" /> Beneficiary Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-surface-900 tracking-tight">
              My Aid <span className="text-gradient">Applications</span>
            </h1>
            <p className="text-sm text-surface-600 mt-1">
              Track real-time verification and fund disbursal updates for your submitted assistance requests.
            </p>
          </div>

          <Link
            to="/request-aid"
            className="btn btn-primary flex items-center justify-center gap-2 self-start md:self-center shadow-md shadow-primary-500/20"
          >
            <HeartHandshake className="w-4 h-4" /> Apply for New Aid
          </Link>
        </div>

        {!isAuthenticated ? (
          <div className="card-glass border border-surface-200 p-8 rounded-3xl text-center max-w-xl mx-auto my-12 shadow-lg">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-surface-900 mb-2">Sign In to Track Applications</h3>
            <p className="text-sm text-surface-600 mb-6">
              Please sign in with the account you used during registration or application to view all your linked assistance cases.
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/login" className="btn btn-primary">
                Sign In
              </Link>
              <Link to="/register?role=Beneficiary" className="btn btn-secondary">
                Register as Beneficiary
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Filter & Search Bar */}
            <div className="card-glass border border-surface-200 p-4 rounded-2xl mb-8 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, CNIC or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 text-xs py-2"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['All', 'Pending', 'Under Review', 'Approved', 'Disbursed', 'Rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      filterStatus === st
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-surface-100 text-surface-600 hover:bg-surface-200 border border-surface-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Aid Requests */}
            {loading ? (
              <div className="text-center py-16">
                <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-surface-500 text-sm">Loading your aid applications...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="card-glass border border-surface-200 p-12 rounded-3xl text-center shadow-sm max-w-lg mx-auto">
                <div className="w-16 h-16 bg-surface-100 text-surface-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-surface-900 mb-1">No Aid Requests Found</h3>
                <p className="text-xs text-surface-500 mb-6 leading-relaxed">
                  {searchQuery || filterStatus !== 'All'
                    ? 'No applications match your current filters.'
                    : "You haven't submitted any assistance requests yet. If you need financial, ration, or medical aid, submit an application today."}
                </p>
                <Link to="/request-aid" className="btn btn-primary inline-flex items-center gap-2 text-xs">
                  <HeartHandshake className="w-4 h-4" /> Submit an Aid Request
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredRequests.map((req) => {
                  const step = getStepProgress(req.status);
                  const isRejected = req.status === 'Rejected';

                  return (
                    <div
                      key={req.id}
                      className="card-glass border border-surface-200 p-6 sm:p-8 rounded-3xl shadow-md hover:border-surface-300 transition-all"
                    >
                      {/* Top Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-200">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-200">
                            {req.id}
                          </span>
                          <span className="text-xs text-surface-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Applied on {req.createdAt ? req.createdAt.split('T')[0] : 'Recent'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={req.category}>{req.category}</Badge>
                          <Badge variant={req.status}>{req.status}</Badge>
                        </div>
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6">
                        <div className="md:col-span-8 space-y-3">
                          <h4 className="font-bold text-surface-900 text-base">Statement of Need:</h4>
                          <p className="text-sm text-surface-600 bg-surface-50 p-4 rounded-2xl border border-surface-200 leading-relaxed">
                            {req.description}
                          </p>

                          {req.adminNotes && (
                            <div className="bg-primary-50/60 border border-primary-200/80 rounded-2xl p-4">
                              <h5 className="text-xs font-bold text-primary-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary-600" /> GiveHope Administration Update
                              </h5>
                              <p className="text-xs text-primary-800 leading-relaxed">{req.adminNotes}</p>
                            </div>
                          )}
                        </div>

                        <div className="md:col-span-4 bg-surface-50/80 border border-surface-200 p-4 rounded-2xl space-y-2 text-xs">
                          <div className="flex justify-between pb-1.5 border-b border-surface-200">
                            <span className="text-surface-500">Requested Amount:</span>
                            <span className="font-bold text-emerald-600 text-sm">
                              PKR {Number(req.amountNeeded || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-surface-500">CNIC:</span>
                            <span className="font-mono text-surface-700">{req.cnic || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-surface-500">City / Region:</span>
                            <span className="font-medium text-surface-700">{req.city || 'Lahore'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-surface-500">Contact Phone:</span>
                            <span className="font-mono text-surface-700">{req.phone || 'N/A'}</span>
                          </div>
                          {req.documentUrl && (
                            <div className="pt-2">
                              <a
                                href={req.documentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold"
                              >
                                View Attached Proof <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Visual Timeline Tracker */}
                      {!isRejected ? (
                        <div className="pt-4 border-t border-surface-200">
                          <p className="text-xs font-bold text-surface-700 uppercase tracking-wider mb-4">
                            Verification & Settlement Progress:
                          </p>
                          <div className="grid grid-cols-4 gap-2 text-center relative">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                                  step >= 1
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-surface-200 text-surface-500'
                                }`}
                              >
                                1
                              </div>
                              <span className="text-[11px] font-bold text-surface-800">Submitted</span>
                              <span className="text-[10px] text-surface-500 hidden sm:inline">Case Logged</span>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                                  step >= 2
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-surface-200 text-surface-500'
                                }`}
                              >
                                2
                              </div>
                              <span className="text-[11px] font-bold text-surface-800">Under Review</span>
                              <span className="text-[10px] text-surface-500 hidden sm:inline">Desk & Field Check</span>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                                  step >= 3
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-surface-200 text-surface-500'
                                }`}
                              >
                                3
                              </div>
                              <span className="text-[11px] font-bold text-surface-800">Approved</span>
                              <span className="text-[10px] text-surface-500 hidden sm:inline">Funds Allocated</span>
                            </div>

                            {/* Step 4 */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                                  step >= 4
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-surface-200 text-surface-500'
                                }`}
                              >
                                4
                              </div>
                              <span className="text-[11px] font-bold text-surface-800">Disbursed</span>
                              <span className="text-[10px] text-surface-500 hidden sm:inline">Direct Transferred</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-4 border-t border-surface-200 flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-xl text-xs font-medium">
                          <XCircle className="w-4 h-4 flex-shrink-0" />
                          This application could not be verified or did not meet the criteria for this cycle. You may contact our helpline for assistance.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyAidRequests;
