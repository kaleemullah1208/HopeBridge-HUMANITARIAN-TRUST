import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getFromStorage, saveToStorage, KEYS } from './storageService';
import { INITIAL_DONATIONS } from '../data/mockData';
import { campaignService } from './campaignService';

export const donationService = {
  // Get all donations
  getDonations: () => {
    return getFromStorage(KEYS.DONATIONS, INITIAL_DONATIONS);
  },

  // Get donation by ID
  getDonationById: (id) => {
    const donations = getFromStorage(KEYS.DONATIONS, INITIAL_DONATIONS);
    return donations.find((d) => d.id === id) || null;
  },

  // Process and create a new donation
  createDonation: async (donationData) => {
    const donations = getFromStorage(KEYS.DONATIONS, INITIAL_DONATIONS);

    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const donationId = `DON-${year}-${randomSuffix}`;
    const taxExemptId = `TX-HB-${Math.floor(10000 + Math.random() * 90000)}`;

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
      message: donationData.message || 'Support for HopeBridge programs.',
      taxExemptId: taxExemptId,
      address: donationData.address || '',
      city: donationData.city || 'Lahore'
    };

    donations.unshift(newDonation);
    saveToStorage(KEYS.DONATIONS, donations);

    // Sync to Firestore
    try {
      await setDoc(doc(db, 'donations', donationId), newDonation);
    } catch (err) {
      console.warn('Firestore setDoc donation note:', err);
    }

    // Update campaign raised amount & donor count
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
    } else if (!newDonation.anonymous) {
      const donorId = `DNR-${Date.now().toString().slice(-3)}`;
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

  // Calculate high level donation metrics
  getDonationStats: () => {
    const donations = getFromStorage(KEYS.DONATIONS, INITIAL_DONATIONS);
    const completed = donations.filter((d) => d.status === 'Completed');
    const totalRaised = completed.reduce((sum, d) => sum + Number(d.amount), 0);
    const totalCount = donations.length;
    const completedCount = completed.length;
    const averageDonation = completedCount > 0 ? Math.round(totalRaised / completedCount) : 0;

    return {
      totalRaised,
      totalCount,
      completedCount,
      averageDonation,
      pendingCount: donations.filter((d) => d.status === 'Pending').length,
      failedCount: donations.filter((d) => d.status === 'Failed').length
    };
  }
};
