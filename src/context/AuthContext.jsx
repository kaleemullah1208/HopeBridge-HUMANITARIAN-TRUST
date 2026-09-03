import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { authService } from '../services/authService';
import { initializeStorage, getFromStorage, saveToStorage, KEYS } from '../services/storageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => getFromStorage(KEYS.CURRENT_USER, null));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeStorage();

    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          let profile;
          const email = firebaseUser.email ? firebaseUser.email.toLowerCase() : '';
          const isAdminEmail = email === 'admin@gmail.com' || email === 'admin@ngo.org';

          if (docSnap.exists()) {
            profile = docSnap.data();
          } else {
            profile = {
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              name: isAdminEmail ? 'Administrator' : (firebaseUser.displayName || email.split('@')[0]),
              email: email,
              role: isAdminEmail ? 'Admin' : 'Donor',
              avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
              joinedDate: new Date().toISOString().split('T')[0]
            };
          }

          setCurrentUser(profile);
          saveToStorage(KEYS.CURRENT_USER, profile);
        } catch (error) {
          console.warn('Error fetching Firestore user profile on auth change:', error);
          const localUser = getFromStorage(KEYS.CURRENT_USER);
          if (localUser) {
            setCurrentUser(localUser);
          }
        }
      } else {
        const localUser = getFromStorage(KEYS.CURRENT_USER);
        if (localUser) {
          setCurrentUser(localUser);
        } else {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
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

  const value = {
    currentUser,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    switchRole,
    updateProfile,
    isAdmin: currentUser?.role === 'Admin' || currentUser?.email?.toLowerCase() === 'admin@gmail.com' || currentUser?.email?.toLowerCase() === 'admin@ngo.org',
    isVolunteer: currentUser?.role === 'Volunteer',
    isDonor: currentUser?.role === 'Donor',
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
