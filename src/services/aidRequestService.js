import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getFromStorage, saveToStorage, KEYS } from './storageService';
import { INITIAL_AID_REQUESTS } from '../data/mockData';
import { activityService } from './activityService';

export const aidRequestService = {
  // Real-time Firestore listener for all aid requests
  subscribeAidRequests: (callback, onError) => {
    try {
      const colRef = collection(db, 'aid_requests');
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...docSnap.data() });
            });
            // Sort newest first
            list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            saveToStorage(KEYS.AID_REQUESTS, list);
            callback(list);
          } else {
            // Seed initial mock aid requests to Firestore if empty
            aidRequestService.seedInitialAidRequests();
            const cached = getFromStorage(KEYS.AID_REQUESTS, INITIAL_AID_REQUESTS);
            callback(cached);
          }
        },
        (error) => {
          console.warn('Firestore subscribeAidRequests error:', error);
          if (onError) onError(error);
          const cached = getFromStorage(KEYS.AID_REQUESTS, INITIAL_AID_REQUESTS);
          callback(cached);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn('subscribeAidRequests setup error:', err);
      const cached = getFromStorage(KEYS.AID_REQUESTS, INITIAL_AID_REQUESTS);
      callback(cached);
      return () => {};
    }
  },

  // Seed default aid requests to Firestore if empty
  seedInitialAidRequests: async () => {
    try {
      const snap = await getDocs(collection(db, 'aid_requests'));
      if (snap.empty) {
        for (const item of INITIAL_AID_REQUESTS) {
          await setDoc(doc(db, 'aid_requests', item.id), item);
        }
      }
    } catch (e) {
      console.warn('Seeding initial aid requests note:', e);
    }
  },

  // Get cached aid requests
  getAidRequests: () => {
    return getFromStorage(KEYS.AID_REQUESTS, INITIAL_AID_REQUESTS);
  },

  // Create a new aid request in Firestore
  createAidRequest: async (aidData) => {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const aidId = `AID-${year}-${randomSuffix}`;
    const name = aidData.applicantName || aidData.fullName || 'Anonymous Beneficiary';
    const reasonText = aidData.reason || aidData.description || 'Request for humanitarian assistance.';

    const newRequest = {
      id: aidId,
      applicantId: aidData.applicantId || 'guest',
      applicantName: name,
      fullName: name,
      email: aidData.email || '',
      phone: aidData.phone || '',
      cnic: aidData.cnic || 'Unspecified',
      city: aidData.city || 'Lahore',
      address: aidData.address || '',
      category: aidData.category || 'Medical Aid',
      amountNeeded: Number(aidData.amountNeeded) || 10000,
      reason: reasonText,
      description: reasonText,
      documentUrl: aidData.documentUrl || '',
      status: 'Pending',
      submittedBy: aidData.submittedBy || (aidData.volunteerId ? 'volunteer' : (aidData.applicantId && aidData.applicantId !== 'guest' ? 'beneficiary' : 'guest')),
      volunteerId: aidData.volunteerId || null,
      volunteerName: aidData.volunteerName || null,
      volunteerPhone: aidData.volunteerPhone || null,
      adminNotes: '',
      createdAt: new Date().toISOString(),
      disbursedAt: null
    };

    // Update local cache optimistically
    const list = getFromStorage(KEYS.AID_REQUESTS, INITIAL_AID_REQUESTS);
    list.unshift(newRequest);
    saveToStorage(KEYS.AID_REQUESTS, list);

    // Sync to Firestore
    try {
      await setDoc(doc(db, 'aid_requests', aidId), newRequest);
    } catch (err) {
      console.warn('Firestore setDoc aid_requests note:', err);
    }

    // Log Activity
    const isVolunteerSubmission = newRequest.submittedBy === 'volunteer';
    activityService.logActivity({
      type: 'aid_request_submitted',
      title: isVolunteerSubmission ? 'Field Aid Request Logged' : 'New Aid Application',
      description: isVolunteerSubmission
        ? `Volunteer ${newRequest.volunteerName || 'Field Lead'} submitted an aid request for ${newRequest.fullName} (PKR ${Number(newRequest.amountNeeded).toLocaleString()})`
        : `${newRequest.fullName} submitted an aid request for ${newRequest.category} (PKR ${Number(newRequest.amountNeeded).toLocaleString()})`,
      actor: isVolunteerSubmission ? (newRequest.volunteerName || 'Volunteer') : newRequest.fullName,
      icon: 'HeartHandshake',
      meta: { aidId: newRequest.id, category: newRequest.category, amount: newRequest.amountNeeded, submittedBy: newRequest.submittedBy }
    });

    return { success: true, aidRequest: newRequest };
  },

  // Update aid request status in Firestore
  updateAidRequestStatus: async (id, status, adminNotes = null) => {
    const list = getFromStorage(KEYS.AID_REQUESTS, INITIAL_AID_REQUESTS);
    const index = list.findIndex((item) => item.id === id);

    if (index === -1) {
      return { success: false, error: 'Aid request not found' };
    }

    list[index].status = status;
    if (adminNotes !== null) {
      list[index].adminNotes = adminNotes;
    }
    if (status === 'Disbursed' && !list[index].disbursedAt) {
      list[index].disbursedAt = new Date().toISOString();
    }

    saveToStorage(KEYS.AID_REQUESTS, list);

    try {
      const updatePayload = {
        status: list[index].status,
        adminNotes: list[index].adminNotes || '',
        disbursedAt: list[index].disbursedAt || null
      };
      await updateDoc(doc(db, 'aid_requests', id), updatePayload);
    } catch (err) {
      console.warn('Firestore updateDoc aid_requests note:', err);
    }

    activityService.logActivity({
      type: `aid_${status.toLowerCase().replace(' ', '_')}`,
      title: `Aid Request ${status}`,
      description: `Application #${id} for ${list[index].fullName} was updated to "${status}"`,
      actor: 'Admin',
      icon: status === 'Approved' || status === 'Disbursed' ? 'CheckCircle2' : 'Clock',
      meta: { aidId: id, status }
    });

    return { success: true, aidRequest: list[index] };
  },

  // Delete an aid request
  deleteAidRequest: async (id) => {
    let list = getFromStorage(KEYS.AID_REQUESTS, INITIAL_AID_REQUESTS);
    list = list.filter((item) => item.id !== id);
    saveToStorage(KEYS.AID_REQUESTS, list);

    try {
      await deleteDoc(doc(db, 'aid_requests', id));
    } catch (err) {
      console.warn('Firestore deleteDoc aid_requests note:', err);
    }

    return { success: true };
  },

  // Get aid requests for a specific applicant (by UID, email, or CNIC)
  getUserAidRequests: (applicantId, email, cnic, customList = null) => {
    const all = customList || getFromStorage(KEYS.AID_REQUESTS, INITIAL_AID_REQUESTS);
    return all.filter((r) => {
      const matchUid = applicantId && r.applicantId === applicantId;
      const matchEmail = email && r.email && r.email.toLowerCase() === email.toLowerCase();
      const matchCnic = cnic && r.cnic && r.cnic.replace(/\D/g, '') === cnic.replace(/\D/g, '');
      return matchUid || matchEmail || matchCnic;
    });
  },

  // Calculate statistics from aid requests
  getAidRequestStats: (customList = null) => {
    const list = customList || getFromStorage(KEYS.AID_REQUESTS, INITIAL_AID_REQUESTS);
    const pending = list.filter((r) => r.status === 'Pending').length;
    const underReview = list.filter((r) => r.status === 'Under Review').length;
    const approved = list.filter((r) => r.status === 'Approved').length;
    const rejected = list.filter((r) => r.status === 'Rejected').length;
    const disbursed = list.filter((r) => r.status === 'Disbursed').length;

    const totalAmountRequested = list.reduce((sum, r) => sum + (Number(r.amountNeeded) || 0), 0);
    const totalAmountDisbursed = list
      .filter((r) => r.status === 'Disbursed' || r.status === 'Approved')
      .reduce((sum, r) => sum + (Number(r.amountNeeded) || 0), 0);

    return {
      total: list.length,
      pending,
      underReview,
      approved,
      rejected,
      disbursed,
      totalAmountRequested,
      totalAmountDisbursed
    };
  }
};

export default aidRequestService;
