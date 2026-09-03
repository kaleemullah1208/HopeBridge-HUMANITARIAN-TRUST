import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getFromStorage, saveToStorage, KEYS } from './storageService';
import { INITIAL_VOLUNTEERS } from '../data/mockData';

export const volunteerService = {
  // Get all volunteer applications
  getVolunteers: () => {
    return getFromStorage(KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
  },

  // Get volunteer by ID
  getVolunteerById: (id) => {
    const volunteers = getFromStorage(KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
    return volunteers.find((v) => v.id === id) || null;
  },

  // Submit volunteer application
  applyVolunteer: async (formData) => {
    const volunteers = getFromStorage(KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
    const newId = `VOL-${Math.floor(100 + Math.random() * 900)}`;

    const newVolunteer = {
      id: newId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address || '',
      city: formData.city || 'Lahore',
      skills: Array.isArray(formData.skills) ? formData.skills : (formData.skills ? formData.skills.split(',').map((s) => s.trim()) : ['General Support']),
      areaOfInterest: formData.areaOfInterest || 'General Assistance',
      availability: formData.availability || 'Weekends',
      experience: formData.experience || 'No previous NGO experience stated.',
      message: formData.message || 'Looking forward to supporting the community.',
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
      approvedDate: null,
      assignedCampaign: formData.campaignId || null,
      hoursContributed: 0
    };

    volunteers.unshift(newVolunteer);
    saveToStorage(KEYS.VOLUNTEERS, volunteers);

    try {
      await setDoc(doc(db, 'volunteers', newId), newVolunteer);
    } catch (err) {
      console.warn('Firestore setDoc volunteer note:', err);
    }

    return { success: true, volunteer: newVolunteer };
  },

  // Approve / Reject / Update volunteer status
  updateVolunteerStatus: async (id, status, assignedCampaign = null) => {
    const volunteers = getFromStorage(KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
    const index = volunteers.findIndex((v) => v.id === id);

    if (index === -1) {
      return { success: false, error: 'Volunteer record not found' };
    }

    volunteers[index].status = status;
    if (status === 'Approved' && !volunteers[index].approvedDate) {
      volunteers[index].approvedDate = new Date().toISOString().split('T')[0];
    }
    if (assignedCampaign) {
      volunteers[index].assignedCampaign = assignedCampaign;
    }

    saveToStorage(KEYS.VOLUNTEERS, volunteers);

    try {
      await updateDoc(doc(db, 'volunteers', id), {
        status: volunteers[index].status,
        approvedDate: volunteers[index].approvedDate,
        assignedCampaign: volunteers[index].assignedCampaign
      });
    } catch (err) {
      console.warn('Firestore updateDoc volunteer note:', err);
    }

    return { success: true, volunteer: volunteers[index] };
  },

  // Delete volunteer record
  deleteVolunteer: async (id) => {
    let volunteers = getFromStorage(KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
    volunteers = volunteers.filter((v) => v.id !== id);
    saveToStorage(KEYS.VOLUNTEERS, volunteers);

    try {
      await deleteDoc(doc(db, 'volunteers', id));
    } catch (err) {
      console.warn('Firestore deleteDoc volunteer note:', err);
    }

    return { success: true };
  },

  // Get volunteer statistics
  getVolunteerStats: () => {
    const volunteers = getFromStorage(KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
    const approved = volunteers.filter((v) => v.status === 'Approved');
    const totalHours = approved.reduce((sum, v) => sum + (v.hoursContributed || 0), 0);

    return {
      total: volunteers.length,
      approved: approved.length,
      pending: volunteers.filter((v) => v.status === 'Pending').length,
      rejected: volunteers.filter((v) => v.status === 'Rejected').length,
      totalHours
    };
  }
};
