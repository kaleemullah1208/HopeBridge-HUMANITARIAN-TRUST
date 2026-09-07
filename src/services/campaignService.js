import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getFromStorage, saveToStorage, KEYS } from './storageService';
import { INITIAL_CAMPAIGNS } from '../data/mockData';
import { activityService } from './activityService';

export const campaignService = {
  // Real-time Firestore listener for all campaigns
  subscribeCampaigns: (callback, onError) => {
    try {
      const colRef = collection(db, 'campaigns');
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...docSnap.data() });
            });
            saveToStorage(KEYS.CAMPAIGNS, list);
            callback(list);
          } else {
            // Seed initial mock campaigns to Firestore if empty
            campaignService.seedInitialCampaigns();
            const cached = getFromStorage(KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
            callback(cached);
          }
        },
        (error) => {
          console.warn('Firestore subscribeCampaigns error:', error);
          if (onError) onError(error);
          const cached = getFromStorage(KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
          callback(cached);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn('subscribeCampaigns setup error:', err);
      const cached = getFromStorage(KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
      callback(cached);
      return () => {};
    }
  },

  // Seed default campaigns to Firestore if empty
  seedInitialCampaigns: async () => {
    try {
      const snap = await getDocs(collection(db, 'campaigns'));
      if (snap.empty) {
        for (const item of INITIAL_CAMPAIGNS) {
          await setDoc(doc(db, 'campaigns', item.id), item);
        }
      }
    } catch (e) {
      console.warn('Seeding initial campaigns note:', e);
    }
  },

  // Get all campaigns from local cache
  getCampaigns: () => {
    return getFromStorage(KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
  },

  // Fetch from Firestore once (fallback)
  fetchCampaignsFromFirestore: async () => {
    try {
      const snap = await getDocs(collection(db, 'campaigns'));
      if (!snap.empty) {
        const list = [];
        snap.forEach((docSnap) => list.push({ id: docSnap.id, ...docSnap.data() }));
        saveToStorage(KEYS.CAMPAIGNS, list);
        return list;
      }
    } catch (err) {
      console.warn('Firestore fetchCampaigns note:', err);
    }
    return getFromStorage(KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
  },

  // Get campaign by ID
  getCampaignById: (id) => {
    const campaigns = getFromStorage(KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
    return campaigns.find((c) => c.id === id) || null;
  },

  // Create a new campaign in Firestore
  createCampaign: async (campaignData) => {
    const campaigns = getFromStorage(KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
    const newId = `camp-${Date.now().toString().slice(-4)}`;

    const newCampaign = {
      id: newId,
      title: campaignData.title,
      category: campaignData.category || 'General Aid',
      image: campaignData.image || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?auto=format&fit=crop&w=1000&q=80',
      description: campaignData.description,
      longDescription: campaignData.longDescription || campaignData.description,
      goalAmount: Number(campaignData.goalAmount) || 100000,
      raisedAmount: Number(campaignData.raisedAmount) || 0,
      donorsCount: Number(campaignData.donorsCount) || 0,
      status: campaignData.status || 'Active',
      isUrgent: Boolean(campaignData.isUrgent),
      startDate: campaignData.startDate || new Date().toISOString().split('T')[0],
      endDate: campaignData.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: campaignData.location || 'Nationwide Relief Zones',
      beneficiariesCount: Number(campaignData.beneficiariesCount) || 1000,
      featured: Boolean(campaignData.featured),
      breakdown: campaignData.breakdown || [
        { label: 'Direct Aid Distribution', percentage: 60 },
        { label: 'Procurement & Logistics', percentage: 25 },
        { label: 'Field Operations', percentage: 15 }
      ]
    };

    campaigns.unshift(newCampaign);
    saveToStorage(KEYS.CAMPAIGNS, campaigns);

    try {
      await setDoc(doc(db, 'campaigns', newId), newCampaign);
    } catch (err) {
      console.warn('Firestore setDoc campaign note:', err);
    }

    activityService.logActivity({
      type: 'campaign_created',
      title: 'New Campaign Created',
      description: `${newCampaign.title} created with goal Rs. ${newCampaign.goalAmount.toLocaleString()}`,
      actor: 'Admin',
      icon: 'Megaphone',
      meta: { campaignId: newId }
    });

    return { success: true, campaign: newCampaign };
  },

  // Update an existing campaign in Firestore
  updateCampaign: async (id, updatedFields) => {
    const campaigns = getFromStorage(KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
    const index = campaigns.findIndex((c) => c.id === id);

    if (index === -1) {
      return { success: false, error: 'Campaign not found' };
    }

    campaigns[index] = {
      ...campaigns[index],
      ...updatedFields,
      goalAmount: Number(updatedFields.goalAmount ?? campaigns[index].goalAmount),
      raisedAmount: Number(updatedFields.raisedAmount ?? campaigns[index].raisedAmount)
    };

    saveToStorage(KEYS.CAMPAIGNS, campaigns);

    try {
      await updateDoc(doc(db, 'campaigns', id), campaigns[index]);
    } catch (err) {
      console.warn('Firestore updateDoc campaign note:', err);
    }

    activityService.logActivity({
      type: 'campaign_updated',
      title: 'Campaign Updated',
      description: `Updated details for campaign "${campaigns[index].title}"`,
      actor: 'Admin',
      icon: 'Edit',
      meta: { campaignId: id }
    });

    return { success: true, campaign: campaigns[index] };
  },

  // Delete a campaign
  deleteCampaign: async (id) => {
    let campaigns = getFromStorage(KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
    campaigns = campaigns.filter((c) => c.id !== id);
    saveToStorage(KEYS.CAMPAIGNS, campaigns);

    try {
      await deleteDoc(doc(db, 'campaigns', id));
    } catch (err) {
      console.warn('Firestore deleteDoc campaign note:', err);
    }

    return { success: true };
  },

  // Record a donation to a campaign (increment raisedAmount and donorsCount)
  recordDonationToCampaign: async (campaignId, amount) => {
    const campaigns = getFromStorage(KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
    const index = campaigns.findIndex((c) => c.id === campaignId);
    if (index !== -1) {
      campaigns[index].raisedAmount = Number(campaigns[index].raisedAmount || 0) + Number(amount);
      campaigns[index].donorsCount = Number(campaigns[index].donorsCount || 0) + 1;
      saveToStorage(KEYS.CAMPAIGNS, campaigns);

      try {
        await updateDoc(doc(db, 'campaigns', campaignId), {
          raisedAmount: campaigns[index].raisedAmount,
          donorsCount: campaigns[index].donorsCount
        });
      } catch (err) {
        console.warn('Firestore updateDoc raisedAmount note:', err);
      }

      return campaigns[index];
    }
    return null;
  }
};

export default campaignService;
