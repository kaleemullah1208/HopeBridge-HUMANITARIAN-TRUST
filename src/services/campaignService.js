import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getFromStorage, saveToStorage, KEYS } from './storageService';
import { INITIAL_CAMPAIGNS } from '../data/mockData';

export const campaignService = {
  // Get all campaigns (from Firestore or local cache)
  getCampaigns: () => {
    return getFromStorage(KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
  },

  // Async fetch from Firestore and sync
  fetchCampaignsFromFirestore: async () => {
    try {
      const snap = await getDocs(collection(db, 'campaigns'));
      if (!snap.empty) {
        const list = [];
        snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
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

  // Create a new campaign
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

    return { success: true, campaign: newCampaign };
  },

  // Update an existing campaign
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

  // Record a donation to a campaign
  recordDonationToCampaign: (campaignId, amount) => {
    const campaigns = getFromStorage(KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
    const index = campaigns.findIndex((c) => c.id === campaignId);
    if (index !== -1) {
      campaigns[index].raisedAmount += Number(amount);
      campaigns[index].donorsCount += 1;
      saveToStorage(KEYS.CAMPAIGNS, campaigns);

      try {
        updateDoc(doc(db, 'campaigns', campaignId), {
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
