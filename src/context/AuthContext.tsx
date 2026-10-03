import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
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
  signOut: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  simulateRoleChange: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        // Visitor mode
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Error signing in with Google:', err);
      // Guest demo fallback
      const guestId = 'guest-' + Math.random().toString(36).substring(2, 9);
      const guestProfile: UserProfile = {
        uid: guestId,
        displayName: 'Gamer Invitado',
        photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${guestId}`,
        role: 'USUARIO',
        badges: ['Invitado'],
        createdAt: new Date().toISOString(),
      };
      setProfile(guestProfile);
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
    const updated = { ...profile, ...data };
    setProfile(updated);
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`);
      }
    }
  };

  const simulateRoleChange = (role: UserRole) => {
    if (profile) {
      setProfile({ ...profile, role });
    } else {
      setProfile({
        uid: 'demo-admin-id',
        displayName: 'Admin ANAPSE (Demo)',
        email: 'elherreroanapse@gmail.com',
        photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=adminAnapse',
        role,
        badges: ['Staff ANAPSE'],
        createdAt: new Date().toISOString(),
      });
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
        signOut,
        updateProfileData,
        simulateRoleChange,
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
