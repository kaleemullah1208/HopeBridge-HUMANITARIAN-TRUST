import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getFromStorage, saveToStorage, KEYS } from './storageService';
import { INITIAL_DONORS } from '../data/mockData';
import { donationService } from './donationService';

export const donorService = {
  // Get all donors (from cache/storage)
  getDonors: () => {
    return getFromStorage(KEYS.DONORS, INITIAL_DONORS);
  },

  // Fetch live donors AND all registered Firebase users from Firestore
  fetchDonors: async () => {
    let combinedDonors = [...getFromStorage(KEYS.DONORS, INITIAL_DONORS)];
    const existingEmails = new Set(combinedDonors.map((d) => d.email?.toLowerCase()));

    try {
      // 1. Fetch from Firestore 'donors' collection
      const donorsSnap = await getDocs(collection(db, 'donors'));
      if (!donorsSnap.empty) {
        donorsSnap.forEach((docSnap) => {
          const data = { id: docSnap.id, ...docSnap.data() };
          const emailLower = data.email?.toLowerCase();
          const existingIdx = combinedDonors.findIndex((d) => d.email?.toLowerCase() === emailLower);
          if (existingIdx !== -1) {
            combinedDonors[existingIdx] = { ...combinedDonors[existingIdx], ...data };
          } else {
            combinedDonors.unshift(data);
            if (emailLower) existingEmails.add(emailLower);
          }
        });
      }

      // 2. Fetch all registered users from Firestore 'users' collection
      const usersSnap = await getDocs(collection(db, 'users'));
      if (!usersSnap.empty) {
        usersSnap.forEach((docSnap) => {
          const user = { id: docSnap.id, ...docSnap.data() };
          const emailLower = user.email?.toLowerCase();
          if (emailLower && !existingEmails.has(emailLower)) {
            // New registered user from Firebase not yet in donors list
            const userDonorEntry = {
              id: user.uid || user.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
              name: user.name || (emailLower.split('@')[0]),
              email: user.email,
              phone: user.phone || '+92 300 0000000',
              city: user.city || 'Online User',
              totalDonated: 0,
              donationsCount: 0,
              lastDonationDate: user.joinedDate || new Date().toISOString().split('T')[0],
              tier: user.role === 'Admin' ? 'System Admin' : (user.role === 'Volunteer' ? 'Active Volunteer' : 'Bronze Friend'),
              role: user.role || 'Donor',
              status: 'Active',
              isRegisteredUser: true
            };
            combinedDonors.unshift(userDonorEntry);
            existingEmails.add(emailLower);
          }
        });
      }

      // 3. Recalculate donation statistics for all donors
      const allDonations = donationService.getDonations();
      combinedDonors = combinedDonors.map((donor) => {
        const userDonations = allDonations.filter(
          (don) => don.email?.toLowerCase() === donor.email?.toLowerCase() && don.status === 'Completed'
        );
        const totalDonated = userDonations.reduce((sum, d) => sum + Number(d.amount), 0);
        const donationsCount = userDonations.length;
        const lastDonation = userDonations[0]?.transactionDate?.split('T')[0] || donor.lastDonationDate;

        let tier = donor.tier || 'Bronze Friend';
        if (totalDonated >= 100000) tier = 'Platinum Champion';
        else if (totalDonated >= 40000) tier = 'Gold Benefactor';
        else if (totalDonated >= 15000) tier = 'Silver Supporter';

        return {
          ...donor,
          totalDonated: totalDonated > 0 ? totalDonated : (donor.totalDonated || 0),
          donationsCount: donationsCount > 0 ? donationsCount : (donor.donationsCount || 0),
          lastDonationDate: lastDonation,
          tier
        };
      });

      saveToStorage(KEYS.DONORS, combinedDonors);
      return combinedDonors;
    } catch (err) {
      console.warn('Firestore fetchDonors note:', err);
      return combinedDonors;
    }
  },

  // Get donor by ID
  getDonorById: (id) => {
    const donors = getFromStorage(KEYS.DONORS, INITIAL_DONORS);
    return donors.find((d) => d.id === id) || null;
  },

  // Get all donations made by a donor's email
  getDonorDonations: (email) => {
    if (!email) return [];
    const donations = donationService.getDonations();
    return donations.filter((d) => d.email?.toLowerCase() === email.toLowerCase());
  },

  // Delete donor record
  deleteDonor: async (id) => {
    let donors = getFromStorage(KEYS.DONORS, INITIAL_DONORS);
    donors = donors.filter((d) => d.id !== id);
    saveToStorage(KEYS.DONORS, donors);

    try {
      await deleteDoc(doc(db, 'donors', id));
    } catch (err) {
      console.warn('Firestore deleteDoc donor note:', err);
    }

    return { success: true };
  }
};
