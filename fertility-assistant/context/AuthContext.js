import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange } from '../lib/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase_config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only initialize once per app load
    if (initialized) return;

    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Listen to user profile changes in real-time
        unsubscribeProfile = onSnapshot(
          doc(db, 'users', firebaseUser.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              setUserProfile(userDoc.data());
            }
          },
          (error) => {
            console.error('Error listening to user profile:', error);
          }
        );
      } else {
        setUser(null);
        setUserProfile(null);
        if (unsubscribeProfile) {
          unsubscribeProfile();
        }
      }
      setLoading(false);
      setInitialized(true);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, [initialized]);

  const value = {
    user,
    userProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}