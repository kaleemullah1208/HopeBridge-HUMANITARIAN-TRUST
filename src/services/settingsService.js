import { doc, getDoc, setDoc, onSnapshot, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getFromStorage, saveToStorage, resetStorageToDefaults, KEYS } from './storageService';
import { INITIAL_NGO_SETTINGS, INITIAL_DONATIONS, INITIAL_VOLUNTEERS, INITIAL_CAMPAIGNS, INITIAL_DONORS } from '../data/mockData';

export const settingsService = {
  // Subscribe to real-time NGO settings in Firestore
  subscribeSettings: (callback, onError) => {
    try {
      const docRef = doc(db, 'settings', 'ngo_profile');
      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            saveToStorage(KEYS.SETTINGS, data);
            callback(data);
          } else {
            const cached = getFromStorage(KEYS.SETTINGS, INITIAL_NGO_SETTINGS);
            settingsService.seedInitialSettings();
            callback(cached);
          }
        },
        (error) => {
          console.warn('Firestore subscribeSettings note:', error);
          if (onError) onError(error);
          const cached = getFromStorage(KEYS.SETTINGS, INITIAL_NGO_SETTINGS);
          callback(cached);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn('subscribeSettings setup error:', err);
      const cached = getFromStorage(KEYS.SETTINGS, INITIAL_NGO_SETTINGS);
      callback(cached);
      return () => {};
    }
  },

  // Seed default NGO settings into Firestore if not present
  seedInitialSettings: async () => {
    try {
      const docRef = doc(db, 'settings', 'ngo_profile');
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        await setDoc(docRef, INITIAL_NGO_SETTINGS);
      }
    } catch (e) {
      console.warn('Seeding initial settings note:', e);
    }
  },

  // Get NGO settings
  getSettings: () => {
    return getFromStorage(KEYS.SETTINGS, INITIAL_NGO_SETTINGS);
  },

  // Update NGO settings in Firestore and local storage
  updateSettings: async (newSettings) => {
    const current = getFromStorage(KEYS.SETTINGS, INITIAL_NGO_SETTINGS);
    const updated = { ...current, ...newSettings };
    saveToStorage(KEYS.SETTINGS, updated);

    try {
      await setDoc(doc(db, 'settings', 'ngo_profile'), updated, { merge: true });
    } catch (err) {
      console.warn('Firestore setDoc settings note:', err);
    }

    return { success: true, settings: updated };
  },

  // Reset entire system to demo default dataset in Firestore & Local Storage
  resetSystemData: async () => {
    resetStorageToDefaults();

    try {
      // Re-seed donations
      const donSnap = await getDocs(collection(db, 'donations'));
      for (const d of donSnap.docs) {
        await deleteDoc(d.ref);
      }
      for (const item of INITIAL_DONATIONS) {
        await setDoc(doc(db, 'donations', item.id), item);
      }

      // Re-seed volunteers
      const volSnap = await getDocs(collection(db, 'volunteers'));
      for (const v of volSnap.docs) {
        await deleteDoc(v.ref);
      }
      for (const item of INITIAL_VOLUNTEERS) {
        await setDoc(doc(db, 'volunteers', item.id), item);
      }

      // Re-seed campaigns
      const campSnap = await getDocs(collection(db, 'campaigns'));
      for (const c of campSnap.docs) {
        await deleteDoc(c.ref);
      }
      for (const item of INITIAL_CAMPAIGNS) {
        await setDoc(doc(db, 'campaigns', item.id), item);
      }

      // Re-seed donors
      const dnrSnap = await getDocs(collection(db, 'donors'));
      for (const dn of dnrSnap.docs) {
        await deleteDoc(dn.ref);
      }
      for (const item of INITIAL_DONORS) {
        await setDoc(doc(db, 'donors', item.id), item);
      }

      // Re-seed settings
      await setDoc(doc(db, 'settings', 'ngo_profile'), INITIAL_NGO_SETTINGS);
    } catch (err) {
      console.warn('Firestore resetSystemData note:', err);
    }

    return { success: true };
  }
};

export default settingsService;
