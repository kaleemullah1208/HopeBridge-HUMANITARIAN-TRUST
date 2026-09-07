import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getFromStorage, saveToStorage, KEYS } from './storageService';
import { INITIAL_DONATIONS } from '../data/mockData';
import { campaignService } from './campaignService';
import { activityService } from './activityService';

export const donationService = {
  // Real-time Firestore listener for all donations
  subscribeDonations: (callback, onError) => {
    try {
      const colRef = collection(db, 'donations');
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...docSnap.data() });
            });
            // Sort newest first
            list.sort((a, b) => new Date(b.transactionDate || 0) - new Date(a.transactionDate || 0));
            saveToStorage(KEYS.DONATIONS, list);
            callback(list);
          } else {
            // Seed initial mock donations to Firestore if empty
            donationService.seedInitialDonations();
            const cached = getFromStorage(KEYS.DONATIONS, INITIAL_DONATIONS);
            callback(cached);
          }
        },
        (error) => {
          console.warn('Firestore subscribeDonations error:', error);
          if (onError) onError(error);
          const cached = getFromStorage(KEYS.DONATIONS, INITIAL_DONATIONS);
          callback(cached);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn('subscribeDonations setup error:', err);
      const cached = getFromStorage(KEYS.DONATIONS, INITIAL_DONATIONS);
      callback(cached);
      return () => {};
    }
  },

  // Seed default donations to Firestore if empty
  seedInitialDonations: async () => {
    try {
      const snap = await getDocs(collection(db, 'donations'));
      if (snap.empty) {
        for (const item of INITIAL_DONATIONS) {
          await setDoc(doc(db, 'donations', item.id), item);
        }
      }
    } catch (e) {
      console.warn('Seeding initial donations note:', e);
    }
  },

  // Get cached donations
  getDonations: () => {
    return getFromStorage(KEYS.DONATIONS, INITIAL_DONATIONS);
  },

  // Fetch live donations once (fallback)
  fetchDonations: async () => {
    let donations = [...getFromStorage(KEYS.DONATIONS, INITIAL_DONATIONS)];
    try {
      const snap = await getDocs(collection(db, 'donations'));
      if (!snap.empty) {
        const firestoreDonations = [];
        snap.forEach((docSnap) => {
          firestoreDonations.push({ id: docSnap.id, ...docSnap.data() });
        });
        firestoreDonations.sort((a, b) => new Date(b.transactionDate || 0) - new Date(a.transactionDate || 0));
        saveToStorage(KEYS.DONATIONS, firestoreDonations);
        return firestoreDonations;
      }
    } catch (err) {
      console.warn('Firestore fetchDonations note:', err);
    }
    return donations;
  },

  // Get donation by ID
  getDonationById: (id) => {
    const donations = getFromStorage(KEYS.DONATIONS, INITIAL_DONATIONS);
    return donations.find((d) => d.id === id) || null;
  },

  // Process and create a new donation in Firestore
  createDonation: async (donationData) => {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const donationId = `DON-${year}-${randomSuffix}`;
    const taxExemptId = `TX-GH-${Math.floor(10000 + Math.random() * 90000)}`;

    const newDonation = {
      id: donationId,
      donorName: donationData.anonymous ? 'Anonymous Supporter' : (donationData.donorName || 'Generous Donor'),
      email: donationData.email || 'donor@example.com',
      phone: donationData.phone || '+92 300 0000000',
      amount: Number(donationData.amount) || 1000,
      currency: donationData.currency || 'PKR',
      campaignId: donationData.campaignId || 'camp-001',
      campaignTitle: donationData.campaignTitle || 'General Humanitarian Relief Fund',
      donationType: donationData.donationType || 'One-Time',
      paymentMethod: donationData.paymentMethod || 'Debit/Credit Card',
      status: 'Completed',
      transactionDate: new Date().toISOString(),
      anonymous: Boolean(donationData.anonymous),
      message: donationData.message || 'Support for GiveHope programs.',
      taxExemptId: taxExemptId,
      address: donationData.address || '',
      city: donationData.city || 'Lahore'
    };

    // Update local cache optimistically
    const donations = getFromStorage(KEYS.DONATIONS, INITIAL_DONATIONS);
    donations.unshift(newDonation);
    saveToStorage(KEYS.DONATIONS, donations);

    // Sync to Firestore
    try {
      await setDoc(doc(db, 'donations', donationId), newDonation);
    } catch (err) {
      console.warn('Firestore setDoc donation note:', err);
    }

    // Record activity in Firestore
    activityService.logActivity({
      type: 'donation',
      title: 'New Donation Received',
      description: `${newDonation.donorName} donated Rs. ${newDonation.amount.toLocaleString()} for ${newDonation.campaignTitle}`,
      actor: newDonation.donorName,
      icon: 'DollarSign',
      meta: { donationId: newDonation.id, amount: newDonation.amount }
    });

    // Update campaign raised amount & donor count in Firestore
    if (newDonation.campaignId) {
      campaignService.recordDonationToCampaign(newDonation.campaignId, newDonation.amount);
    }

    // Update donor record
    const donors = getFromStorage(KEYS.DONORS, []);
    const existingDonorIndex = donors.findIndex((dn) => dn.email?.toLowerCase() === newDonation.email.toLowerCase());
    if (existingDonorIndex !== -1) {
      donors[existingDonorIndex].totalDonated += newDonation.amount;
      donors[existingDonorIndex].donationsCount += 1;
      donors[existingDonorIndex].lastDonationDate = newDonation.transactionDate.split('T')[0];
      try {
        updateDoc(doc(db, 'donors', donors[existingDonorIndex].id), donors[existingDonorIndex]);
      } catch (e) {}
    } else if (!newDonation.anonymous) {
      const donorId = `DNR-${Date.now().toString().slice(-4)}`;
      const newDonorRec = {
        id: donorId,
        name: newDonation.donorName,
        email: newDonation.email,
        phone: newDonation.phone,
        totalDonated: newDonation.amount,
        donationsCount: 1,
        lastDonationDate: newDonation.transactionDate.split('T')[0],
        tier: newDonation.amount > 50000 ? 'Platinum Champion' : (newDonation.amount > 20000 ? 'Gold Benefactor' : 'Bronze Friend'),
        city: newDonation.city,
        status: 'Active'
      };
      donors.unshift(newDonorRec);
      try {
        setDoc(doc(db, 'donors', donorId), newDonorRec);
      } catch (err) {
        console.warn('Firestore setDoc donor note:', err);
      }
    }
    saveToStorage(KEYS.DONORS, donors);

    return { success: true, donation: newDonation };
  },

  // Update status (e.g. Completed, Pending, Failed)
  updateDonationStatus: async (id, status) => {
    const donations = getFromStorage(KEYS.DONATIONS, INITIAL_DONATIONS);
    const index = donations.findIndex((d) => d.id === id);

    if (index === -1) {
      return { success: false, error: 'Donation not found' };
    }

    donations[index].status = status;
    saveToStorage(KEYS.DONATIONS, donations);

    try {
      await updateDoc(doc(db, 'donations', id), { status });
    } catch (err) {
      console.warn('Firestore updateDoc donation status note:', err);
    }

    activityService.logActivity({
      type: 'donation_status',
      title: `Donation Status Updated (${status})`,
      description: `Donation #${id} marked as ${status}`,
      actor: 'Admin',
      icon: 'CheckCircle2'
    });

    return { success: true, donation: donations[index] };
  },

  // Delete donation
  deleteDonation: async (id) => {
    let donations = getFromStorage(KEYS.DONATIONS, INITIAL_DONATIONS);
    donations = donations.filter((d) => d.id !== id);
    saveToStorage(KEYS.DONATIONS, donations);

    try {
      await deleteDoc(doc(db, 'donations', id));
    } catch (err) {
      console.warn('Firestore deleteDoc donation note:', err);
    }

    return { success: true };
  },

  // Calculate high-level donation metrics from a list (or cache)
  getDonationStats: (customList = null) => {
    const donations = customList || getFromStorage(KEYS.DONATIONS, INITIAL_DONATIONS);
    const completed = donations.filter((d) => d.status === 'Completed');
    const totalRaised = completed.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const totalCount = donations.length;
    const completedCount = completed.length;
    const averageDonation = completedCount > 0 ? Math.round(totalRaised / completedCount) : 0;
    const uniqueDonorsCount = new Set(donations.map((d) => d.email?.toLowerCase()).filter(Boolean)).size;

    return {
      totalRaised,
      totalCount,
      completedCount,
      averageDonation,
      uniqueDonorsCount: uniqueDonorsCount || completedCount,
      pendingCount: donations.filter((d) => d.status === 'Pending').length,
      failedCount: donations.filter((d) => d.status === 'Failed').length
    };
  }
};

export default donationService;
