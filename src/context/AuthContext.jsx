import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { authService } from '../services/authService';
import { initializeStorage, getFromStorage, saveToStorage, KEYS } from '../services/storageService';

const AuthContext = createContext(null);

const ADMIN_EMAILS = [
  'admin@gmail.com',
  'admin@ngo.org',
  'admin@givehope.ngo',
  'admin@hopebridge.org',
  'admin@admin.com'
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => getFromStorage(KEYS.CURRENT_USER, null));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeStorage();

    // Safety timeout: ensure loading becomes false after max 1.2s to prevent white/frozen screens
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const email = firebaseUser.email ? firebaseUser.email.toLowerCase() : '';
          const isAdminEmail = ADMIN_EMAILS.includes(email);
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          
          let profile;
          try {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
              profile = { id: firebaseUser.uid, uid: firebaseUser.uid, ...docSnap.data() };
              if (isAdminEmail && profile.role !== 'Admin') {
                profile.role = 'Admin';
                try {
                  await setDoc(userDocRef, { role: 'Admin' }, { merge: true });
                } catch (e) {}
              }
            }
          } catch (dbErr) {
            console.warn('Firestore doc read note:', dbErr);
          }

          if (!profile) {
            profile = {
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              name: isAdminEmail ? 'Administrator' : (firebaseUser.displayName || email.split('@')[0]),
              email: email,
              role: isAdminEmail ? 'Admin' : 'Donor',
              avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
              joinedDate: new Date().toISOString().split('T')[0]
            };
            try {
              await setDoc(userDocRef, profile, { merge: true });
            } catch (e) {}
          }

          setCurrentUser(profile);
          saveToStorage(KEYS.CURRENT_USER, profile);
        } else {
          const localUser = getFromStorage(KEYS.CURRENT_USER);
          if (localUser) {
            setCurrentUser(localUser);
          } else {
            setCurrentUser(null);
          }
        }
      } catch (err) {
        console.warn('Auth state handler note:', err);
      } finally {
        clearTimeout(safetyTimer);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const result = await authService.login(email, password);
    if (result.success) {
      setCurrentUser(result.user);
    }
    setLoading(false);
    return result;
  };

  const loginWithGoogle = async (role = 'Donor') => {
    setLoading(true);
    const result = await authService.loginWithGoogle(role);
    if (result.success) {
      setCurrentUser(result.user);
    }
    setLoading(false);
    return result;
  };

  const register = async (userData) => {
    setLoading(true);
    const result = await authService.register(userData);
    if (result.success) {
      setCurrentUser(result.user);
    }
    setLoading(false);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const switchRole = (role) => {
    const user = authService.quickSwitchRole(role);
    setCurrentUser(user);
    return user;
  };

  const updateProfile = async (fields) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    const result = await authService.updateProfile(currentUser.id, fields);
    if (result.success) {
      setCurrentUser(result.user);
    }
    return result;
  };

  const userEmail = currentUser?.email ? currentUser.email.toLowerCase() : '';
  const userRole = currentUser?.role ? currentUser.role.toLowerCase() : '';
  const isAdmin = userRole === 'admin' || ADMIN_EMAILS.includes(userEmail);

  const value = {
    currentUser,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    switchRole,
    updateProfile,
    isAdmin,
    isVolunteer: userRole === 'volunteer',
    isDonor: userRole === 'donor',
    isBeneficiary: userRole === 'beneficiary',
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
