import { getFromStorage, saveToStorage, KEYS } from './storageService';
import { INITIAL_DONORS } from '../data/mockData';
import { donationService } from './donationService';

export const donorService = {
  // Get all donors
  getDonors: () => {
    return getFromStorage(KEYS.DONORS, INITIAL_DONORS);
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
    await new Promise((resolve) => setTimeout(resolve, 200));
    let donors = getFromStorage(KEYS.DONORS, INITIAL_DONORS);
    donors = donors.filter((d) => d.id !== id);
    saveToStorage(KEYS.DONORS, donors);
    return { success: true };
  }
};
