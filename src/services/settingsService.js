import { getFromStorage, saveToStorage, resetStorageToDefaults, KEYS } from './storageService';
import { INITIAL_NGO_SETTINGS } from '../data/mockData';

export const settingsService = {
  // Get NGO settings
  getSettings: () => {
    return getFromStorage(KEYS.SETTINGS, INITIAL_NGO_SETTINGS);
  },

  // Update NGO settings
  updateSettings: async (newSettings) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const current = getFromStorage(KEYS.SETTINGS, INITIAL_NGO_SETTINGS);
    const updated = { ...current, ...newSettings };
    saveToStorage(KEYS.SETTINGS, updated);
    return { success: true, settings: updated };
  },

  // Reset entire system to demo default dataset
  resetSystemData: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    resetStorageToDefaults();
    return { success: true };
  }
};
