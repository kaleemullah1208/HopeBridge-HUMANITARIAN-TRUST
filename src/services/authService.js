import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { getFromStorage, saveToStorage, KEYS } from './storageService';
import { INITIAL_USERS } from '../data/mockData';

// Friendly error message mapper for Firebase Auth error codes
export const mapFirebaseError = (error) => {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes before trying again.';
    default:
      return error?.message || 'Authentication failed. Please try again.';
  }
};

export const authService = {
  // Login with Email and Password
  login: async (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const isAdminEmail = trimmedEmail === 'admin@gmail.com' || trimmedEmail === 'admin@ngo.org';

    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      } catch (signInErr) {
        // If it's the admin credentials and account hasn't been registered in Firebase yet, auto-register it
        if (isAdminEmail && password === 'admin123' && (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential')) {
          try {
            userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
          } catch (createErr) {
            console.warn('Could not auto-create admin in Firebase Auth, proceeding with bootstrap admin:', createErr);
          }
        } else {
          throw signInErr;
        }
      }

      let userData;
      if (userCredential?.user) {
        const uid = userCredential.user.uid;
        try {
          const userDocRef = doc(db, 'users', uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            userData = docSnap.data();
          } else {
            // Document doesn't exist yet, create it
            userData = {
              id: uid,
              uid: uid,
              name: isAdminEmail ? 'Administrator' : (userCredential.user.displayName || trimmedEmail.split('@')[0]),
              email: trimmedEmail,
              role: isAdminEmail ? 'Admin' : 'Donor',
              avatar: userCredential.user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
              joinedDate: new Date().toISOString().split('T')[0],
              phone: '+92 300 1234567'
            };
            await setDoc(userDocRef, userData);
          }
        } catch (dbErr) {
          console.warn('Firestore read/write note:', dbErr);
          userData = {
            id: uid,
            uid: uid,
            name: isAdminEmail ? 'Administrator' : trimmedEmail.split('@')[0],
            email: trimmedEmail,
            role: isAdminEmail ? 'Admin' : 'Donor',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            joinedDate: new Date().toISOString().split('T')[0]
          };
        }
      } else if (isAdminEmail && password === 'admin123') {
        // Fallback local admin if offline
        userData = {
          id: 'admin-master-01',
          name: 'Administrator',
          email: trimmedEmail,
          role: 'Admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          joinedDate: '2026-01-01',
          phone: '+92 300 1234567'
        };
      }

      if (userData) {
        saveToStorage(KEYS.CURRENT_USER, userData);
        return { success: true, user: userData };
      }

      return { success: false, error: 'User could not be authenticated.' };
    } catch (error) {
      console.error('Login error:', error);
      // If admin with correct password had an issue, fallback gracefully
      if (isAdminEmail && password === 'admin123') {
        const adminUser = {
          id: 'admin-master-01',
          name: 'Administrator',
          email: trimmedEmail,
          role: 'Admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          joinedDate: '2026-01-01',
          phone: '+92 300 1234567'
        };
        saveToStorage(KEYS.CURRENT_USER, adminUser);
        return { success: true, user: adminUser };
      }
      return { success: false, error: mapFirebaseError(error) };
    }
  },

  // Login with Google Popup
  loginWithGoogle: async (defaultRole = 'Donor') => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const uid = user.uid;
      const email = user.email ? user.email.toLowerCase() : '';
      const isAdminEmail = email === 'admin@gmail.com' || email === 'admin@ngo.org';

      let userData;
      try {
        const userDocRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          userData = docSnap.data();
          if (isAdminEmail && userData.role !== 'Admin') {
            userData.role = 'Admin';
            await updateDoc(userDocRef, { role: 'Admin' });
          }
        } else {
          userData = {
            id: uid,
            uid: uid,
            name: user.displayName || email.split('@')[0],
            email: email,
            role: isAdminEmail ? 'Admin' : (defaultRole || 'Donor'),
            avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
            joinedDate: new Date().toISOString().split('T')[0],
            phone: user.phoneNumber || '+92 300 0000000'
          };
          await setDoc(userDocRef, userData);
        }
      } catch (dbErr) {
        console.warn('Firestore sync note for Google Auth:', dbErr);
        userData = {
          id: uid,
          uid: uid,
          name: user.displayName || email.split('@')[0],
          email: email,
          role: isAdminEmail ? 'Admin' : (defaultRole || 'Donor'),
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
          joinedDate: new Date().toISOString().split('T')[0]
        };
      }

      saveToStorage(KEYS.CURRENT_USER, userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Google Sign-in error:', error);
      return { success: false, error: mapFirebaseError(error) };
    }
  },

  // Register with Email and Password
  register: async (userData) => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    const isAdminEmail = trimmedEmail === 'admin@gmail.com' || trimmedEmail === 'admin@ngo.org';

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, userData.password);
      const user = userCredential.user;
      const uid = user.uid;

      if (userData.name) {
        await updateFirebaseProfile(user, { displayName: userData.name });
      }

      const newProfile = {
        id: uid,
        uid: uid,
        name: userData.name || trimmedEmail.split('@')[0],
        email: trimmedEmail,
        role: isAdminEmail ? 'Admin' : (userData.role || 'Donor'),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        joinedDate: new Date().toISOString().split('T')[0],
        phone: userData.phone || '+92 300 0000000'
      };

      try {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, newProfile);
      } catch (dbErr) {
        console.warn('Firestore write note:', dbErr);
      }

      saveToStorage(KEYS.CURRENT_USER, newProfile);
      return { success: true, user: newProfile };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: mapFirebaseError(error) };
    }
  },

  // Sign out
  logout: async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    localStorage.removeItem(KEYS.CURRENT_USER);
    return { success: true };
  },

  // Get current user session
  getCurrentUser: () => {
    return getFromStorage(KEYS.CURRENT_USER, null);
  },

  // Quick switch role helper for interactive presentation
  quickSwitchRole: (role) => {
    const users = getFromStorage(KEYS.USERS, INITIAL_USERS);
    const target = users.find((u) => u.role === role) || {
      id: `usr-${role.toLowerCase()}-demo`,
      name: `Demo ${role}`,
      email: role === 'Admin' ? 'admin@gmail.com' : `${role.toLowerCase()}@hopebridge.ngo`,
      role: role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      joinedDate: '2026-01-01',
      phone: '+92 300 1234567'
    };
    saveToStorage(KEYS.CURRENT_USER, target);
    return target;
  },

  // Update profile
  updateProfile: async (id, updatedFields) => {
    try {
      if (auth.currentUser) {
        try {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userDocRef, updatedFields);
        } catch (dbErr) {
          console.warn('Firestore update note:', dbErr);
        }
      }
      const currentUser = getFromStorage(KEYS.CURRENT_USER);
      const updated = { ...currentUser, ...updatedFields };
      saveToStorage(KEYS.CURRENT_USER, updated);
      return { success: true, user: updated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
