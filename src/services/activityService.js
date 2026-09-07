import { collection, doc, setDoc, onSnapshot, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getFromStorage, saveToStorage, KEYS } from './storageService';

export const activityService = {
  // Subscribe to real-time activities from Firestore
  subscribeActivities: (callback, onError) => {
    try {
      const q = query(collection(db, 'activities'), orderBy('timestamp', 'desc'), limit(20));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const activities = [];
            snapshot.forEach((docSnap) => {
              activities.push({ id: docSnap.id, ...docSnap.data() });
            });
            saveToStorage(KEYS.ACTIVITIES, activities);
            callback(activities);
          } else {
            // Fallback to cached activities
            const cached = getFromStorage(KEYS.ACTIVITIES, []);
            callback(cached);
          }
        },
        (error) => {
          console.warn('Firestore subscribeActivities note:', error);
          if (onError) onError(error);
          const cached = getFromStorage(KEYS.ACTIVITIES, []);
          callback(cached);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn('subscribeActivities setup error:', err);
      const cached = getFromStorage(KEYS.ACTIVITIES, []);
      callback(cached);
      return () => {};
    }
  },

  // Log a new activity to Firestore and local cache
  logActivity: async ({ type, title, description, actor = 'System', icon = 'Sparkles', meta = {} }) => {
    const id = `act-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const newActivity = {
      id,
      type, // 'donation' | 'volunteer_applied' | 'volunteer_approved' | 'volunteer_rejected' | 'campaign_created' | 'campaign_updated'
      title,
      description,
      actor,
      icon,
      meta,
      timestamp: new Date().toISOString()
    };

    // Update local cache
    const activities = getFromStorage(KEYS.ACTIVITIES, []);
    activities.unshift(newActivity);
    if (activities.length > 30) activities.pop();
    saveToStorage(KEYS.ACTIVITIES, activities);

    // Sync to Firestore
    try {
      await setDoc(doc(db, 'activities', id), newActivity);
    } catch (err) {
      console.warn('Firestore logActivity note:', err);
    }

    return newActivity;
  },

  // Helper to generate dynamic activity list from current donations, volunteers, and campaigns
  deriveActivities: (donations = [], volunteers = [], campaigns = []) => {
    const items = [];

    donations.slice(0, 5).forEach((d) => {
      items.push({
        id: `act-don-${d.id}`,
        type: 'donation',
        title: 'New Donation Received',
        description: `${d.donorName} donated Rs. ${Number(d.amount).toLocaleString()} for ${d.campaignTitle}`,
        actor: d.donorName,
        icon: 'DollarSign',
        timestamp: d.transactionDate || new Date().toISOString()
      });
    });

    volunteers.slice(0, 5).forEach((v) => {
      items.push({
        id: `act-vol-${v.id}`,
        type: v.status === 'Approved' ? 'volunteer_approved' : (v.status === 'Rejected' ? 'volunteer_rejected' : 'volunteer_applied'),
        title: v.status === 'Approved' ? 'Volunteer Application Approved' : (v.status === 'Rejected' ? 'Volunteer Application Rejected' : 'New Volunteer Application'),
        description: `${v.name} applied from ${v.city || 'Pakistan'} (${v.areaOfInterest || 'General'})`,
        actor: v.name,
        icon: 'HandHeart',
        timestamp: v.appliedDate ? `${v.appliedDate}T12:00:00.000Z` : new Date().toISOString()
      });
    });

    campaigns.slice(0, 3).forEach((c) => {
      items.push({
        id: `act-camp-${c.id}`,
        type: 'campaign_created',
        title: 'Campaign Live on Portal',
        description: `${c.title} • Goal: Rs. ${Number(c.goalAmount).toLocaleString()}`,
        actor: 'Admin',
        icon: 'Megaphone',
        timestamp: c.startDate ? `${c.startDate}T08:00:00.000Z` : new Date().toISOString()
      });
    });

    return items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
  }
};

export default activityService;
