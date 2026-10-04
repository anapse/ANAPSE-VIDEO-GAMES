import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isModerator: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            setProfile(userSnap.data() as UserProfile);
          } else {
            const isAdminEmail = user.email === 'elherreroanapse@gmail.com';
            const newProfile: UserProfile = {
              uid: user.uid,
              displayName: user.displayName || user.email?.split('@')[0] || 'Gamer Anapse',
              email: user.email || '',
              photoURL: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
              role: isAdminEmail ? 'ADMINISTRADOR' : 'USUARIO',
              favoriteCategory: 'Arcade',
              badges: ['Gamer Pionero', isAdminEmail ? 'Fundador ANAPSE' : 'Jugador Oficial'],
              lastSeen: new Date().toISOString(),
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
          const isAdminEmail = user.email === 'elherreroanapse@gmail.com';
          setProfile({
            uid: user.uid,
            displayName: user.displayName || 'Gamer Anapse',
            email: user.email || '',
            photoURL: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
            role: isAdminEmail ? 'ADMINISTRADOR' : 'USUARIO',
            badges: ['Gamer ANAPSE'],
            lastSeen: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Periodic heartbeat to update lastSeen every 60 seconds
  useEffect(() => {
    if (!currentUser) return;

    const updateHeartbeat = async () => {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, { lastSeen: new Date().toISOString() }, { merge: true });
      } catch {
        // Silent catch for background heartbeat
      }
    };

    updateHeartbeat();
    const interval = setInterval(updateHeartbeat, 60 * 1000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Error signing in with Google:', err);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error('Error signing in with Email:', err);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error('Error signing up with Email:', err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      setProfile(null);
    } catch (err) {
      setProfile(null);
    }
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!profile) return;
    
    // STRICT SECURITY: Remove role/privilege changes from user payload
    const safeData = { ...data };
    delete safeData.role;
    delete safeData.badges;

    const updated = { ...profile, ...safeData };
    setProfile(updated);
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), safeData, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`);
      }
    }
  };

  const isAdmin =
    profile?.role === 'ADMINISTRADOR' || profile?.email === 'elherreroanapse@gmail.com';
  const isStaff =
    isAdmin ||
    profile?.role === 'MAYORDOMO' ||
    profile?.role === 'EDITOR' ||
    profile?.role === 'MODERADOR';
  const isModerator = isStaff;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        loading,
        isAdmin,
        isStaff,
        isModerator,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        updateProfileData,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
