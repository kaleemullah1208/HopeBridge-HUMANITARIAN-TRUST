import {
  INITIAL_CAMPAIGNS,
  INITIAL_DONATIONS,
  INITIAL_VOLUNTEERS,
  INITIAL_DONORS,
  INITIAL_USERS,
  INITIAL_NGO_SETTINGS,
  INITIAL_AID_REQUESTS
} from '../data/mockData';

const KEYS = {
  CAMPAIGNS: 'givehope_campaigns',
  DONATIONS: 'givehope_donations',
  VOLUNTEERS: 'givehope_volunteers',
  DONORS: 'givehope_donors',
  USERS: 'givehope_users',
  CURRENT_USER: 'givehope_current_user',
  SETTINGS: 'givehope_settings',
  ACTIVITIES: 'givehope_activities',
  AID_REQUESTS: 'givehope_aid_requests'
};

const LEGACY_KEYS = {
  CAMPAIGNS: 'hopebridge_campaigns',
  DONATIONS: 'hopebridge_donations',
  VOLUNTEERS: 'hopebridge_volunteers',
  DONORS: 'hopebridge_donors',
  USERS: 'hopebridge_users',
  CURRENT_USER: 'hopebridge_current_user',
  SETTINGS: 'hopebridge_settings'
};

// Initialize default storage data
export const initializeStorage = () => {
  // Migrate legacy data if exists
  Object.keys(LEGACY_KEYS).forEach((k) => {
    const oldKey = LEGACY_KEYS[k];
    const newKey = KEYS[k];
    if (localStorage.getItem(oldKey) && !localStorage.getItem(newKey)) {
      try {
        localStorage.setItem(newKey, localStorage.getItem(oldKey));
      } catch (e) {}
    }
  });

  if (!localStorage.getItem(KEYS.CAMPAIGNS)) {
    localStorage.setItem(KEYS.CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS));
  }
  if (!localStorage.getItem(KEYS.DONATIONS)) {
    localStorage.setItem(KEYS.DONATIONS, JSON.stringify(INITIAL_DONATIONS));
  }
  if (!localStorage.getItem(KEYS.VOLUNTEERS)) {
    localStorage.setItem(KEYS.VOLUNTEERS, JSON.stringify(INITIAL_VOLUNTEERS));
  }
  if (!localStorage.getItem(KEYS.DONORS)) {
    localStorage.setItem(KEYS.DONORS, JSON.stringify(INITIAL_DONORS));
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_NGO_SETTINGS));
  }
  if (!localStorage.getItem(KEYS.AID_REQUESTS)) {
    localStorage.setItem(KEYS.AID_REQUESTS, JSON.stringify(INITIAL_AID_REQUESTS));
  }
};

export const getFromStorage = (key, defaultValue = null) => {
  try {
    let item = localStorage.getItem(key);
    if (!item) {
      // Check legacy key
      const matchKey = Object.keys(KEYS).find((k) => KEYS[k] === key);
      if (matchKey && LEGACY_KEYS[matchKey]) {
        item = localStorage.getItem(LEGACY_KEYS[matchKey]);
      }
    }
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return defaultValue;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
    return false;
  }
};

export const resetStorageToDefaults = () => {
  localStorage.setItem(KEYS.CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS));
  localStorage.setItem(KEYS.DONATIONS, JSON.stringify(INITIAL_DONATIONS));
  localStorage.setItem(KEYS.VOLUNTEERS, JSON.stringify(INITIAL_VOLUNTEERS));
  localStorage.setItem(KEYS.DONORS, JSON.stringify(INITIAL_DONORS));
  localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_NGO_SETTINGS));
  localStorage.setItem(KEYS.AID_REQUESTS, JSON.stringify(INITIAL_AID_REQUESTS));
  localStorage.removeItem(KEYS.CURRENT_USER);
};

export { KEYS };
