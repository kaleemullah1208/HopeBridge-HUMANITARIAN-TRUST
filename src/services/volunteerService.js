import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getFromStorage, saveToStorage, KEYS } from './storageService';
import { INITIAL_VOLUNTEERS } from '../data/mockData';
import { activityService } from './activityService';

export const volunteerService = {
  // Real-time Firestore listener for all volunteers
  subscribeVolunteers: (callback, onError) => {
    try {
      const colRef = collection(db, 'volunteers');
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...docSnap.data() });
            });
            list.sort((a, b) => new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0));
            saveToStorage(KEYS.VOLUNTEERS, list);
            callback(list);
          } else {
            // Seed initial mock volunteers if Firestore is completely empty
            volunteerService.seedInitialVolunteers();
            const cached = getFromStorage(KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
            callback(cached);
          }
        },
        (error) => {
          console.warn('Firestore subscribeVolunteers error:', error);
          if (onError) onError(error);
          const cached = getFromStorage(KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
          callback(cached);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn('subscribeVolunteers setup error:', err);
      const cached = getFromStorage(KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
      callback(cached);
      return () => {};
    }
  },

  // Seed default volunteers to Firestore if empty
  seedInitialVolunteers: async () => {
    try {
      const snap = await getDocs(collection(db, 'volunteers'));
      if (snap.empty) {
        for (const item of INITIAL_VOLUNTEERS) {
          await setDoc(doc(db, 'volunteers', item.id), item, { merge: true });
        }
      }
    } catch (e) {
      console.warn('Seeding initial volunteers note:', e);
    }
  },

  // Get cached volunteers
  getVolunteers: () => {
    return getFromStorage(KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
  },

  // Fetch live volunteers once
  fetchVolunteers: async () => {
    let combinedVolunteers = [...getFromStorage(KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS)];
    try {
      const volSnap = await getDocs(collection(db, 'volunteers'));
      if (!volSnap.empty) {
        const firestoreList = [];
        volSnap.forEach((docSnap) => {
          firestoreList.push({ id: docSnap.id, ...docSnap.data() });
        });
        firestoreList.sort((a, b) => new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0));
        saveToStorage(KEYS.VOLUNTEERS, firestoreList);
        return firestoreList;
      }
    } catch (err) {
      console.warn('Firestore fetchVolunteers note:', err);
    }
    return combinedVolunteers;
  },

  // Get volunteer by ID
  getVolunteerById: (id) => {
    const volunteers = getFromStorage(KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
    return volunteers.find((v) => v.id === id) || null;
  },

  // Submit volunteer application into Firestore
  applyVolunteer: async (formData) => {
    const newId = `VOL-${Math.floor(100 + Math.random() * 900)}`;

    const newVolunteer = {
      id: newId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address || '',
      city: formData.city || 'Lahore',
      skills: Array.isArray(formData.skills) ? formData.skills : (formData.skills ? formData.skills.split(',').map((s) => s.trim()) : ['General Support']),
      areaOfInterest: formData.areaOfInterest || 'General Assistance',
      availability: formData.availability || 'Weekends',
      experience: formData.experience || 'Looking forward to volunteering.',
      message: formData.message || 'Support for GiveHope relief activities.',
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
      approvedDate: null,
      assignedCampaign: formData.campaignId || null,
      hoursContributed: 0
    };

    // Update local cache optimistically
    const volunteers = getFromStorage(KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
    volunteers.unshift(newVolunteer);
    saveToStorage(KEYS.VOLUNTEERS, volunteers);

    // Sync to Firestore
    try {
      await setDoc(doc(db, 'volunteers', newId), newVolunteer, { merge: true });
    } catch (err) {
      console.warn('Firestore setDoc volunteer note:', err);
    }

    // Log Activity in Firestore
    activityService.logActivity({
      type: 'volunteer_applied',
      title: 'New Volunteer Application',
      description: `${newVolunteer.name} applied as a volunteer (${newVolunteer.areaOfInterest})`,
      actor: newVolunteer.name,
      icon: 'HandHeart',
      meta: { volunteerId: newId }
    });

    return { success: true, volunteer: newVolunteer };
  },

  // Approve / Reject / Update volunteer status in Firestore
  updateVolunteerStatus: async (id, status, assignedCampaign = null) => {
    const volunteers = getFromStorage(KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
    const index = volunteers.findIndex((v) => v.id === id);
    const nowIso = new Date().toISOString().split('T')[0];

    let targetVolunteer;

    if (index !== -1) {
      volunteers[index].status = status;
      if (status === 'Approved' && !volunteers[index].approvedDate) {
        volunteers[index].approvedDate = nowIso;
      }
      if (assignedCampaign) {
        volunteers[index].assignedCampaign = assignedCampaign;
      }
      targetVolunteer = { ...volunteers[index] };
    } else {
      targetVolunteer = {
        id,
        status,
        approvedDate: status === 'Approved' ? nowIso : null,
        assignedCampaign: assignedCampaign || null
      };
      volunteers.unshift(targetVolunteer);
    }

    saveToStorage(KEYS.VOLUNTEERS, volunteers);

    // Prepare Firestore update payload
    const updatePayload = {
      status: targetVolunteer.status,
      approvedDate: targetVolunteer.approvedDate || null,
      updatedAt: new Date().toISOString()
    };
    if (assignedCampaign) {
      updatePayload.assignedCampaign = assignedCampaign;
    }

    // Write to Firestore with setDoc merge
    try {
      await setDoc(doc(db, 'volunteers', id), updatePayload, { merge: true });
    } catch (err) {
      console.warn('Firestore setDoc volunteer status note:', err);
    }

    // If volunteer record matches a user, update their profile in Firestore too
    if (targetVolunteer.userId || targetVolunteer.applicantId) {
      try {
        const uid = targetVolunteer.userId || targetVolunteer.applicantId;
        await setDoc(doc(db, 'users', uid), {
          role: 'Volunteer',
          volunteerStatus: status
        }, { merge: true });
      } catch (uErr) {
        console.warn('Firestore users update note:', uErr);
      }
    }

    // Log Activity
    activityService.logActivity({
      type: status === 'Approved' ? 'volunteer_approved' : 'volunteer_rejected',
      title: `Volunteer Application ${status}`,
      description: `${targetVolunteer.name || id} was ${status.toLowerCase()} by administrator.`,
      actor: 'Admin',
      icon: status === 'Approved' ? 'Check' : 'X',
      meta: { volunteerId: id, status }
    });

    return { success: true, volunteer: targetVolunteer };
  },

  // Delete volunteer record
  deleteVolunteer: async (id) => {
    let volunteers = getFromStorage(KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
    volunteers = volunteers.filter((v) => v.id !== id);
    saveToStorage(KEYS.VOLUNTEERS, volunteers);

    try {
      await deleteDoc(doc(db, 'volunteers', id));
    } catch (err) {
      console.warn('Firestore deleteDoc volunteer note:', err);
    }

    return { success: true };
  },

  // Get volunteer statistics from a list (or cache)
  getVolunteerStats: (customList = null) => {
    const volunteers = customList || getFromStorage(KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
    const approved = volunteers.filter((v) => v.status === 'Approved');
    const totalHours = approved.reduce((sum, v) => sum + (Number(v.hoursContributed) || 0), 0);

    return {
      total: volunteers.length,
      approved: approved.length,
      pending: volunteers.filter((v) => v.status === 'Pending').length,
      rejected: volunteers.filter((v) => v.status === 'Rejected').length,
      totalHours
    };
  }
};

export default volunteerService;
