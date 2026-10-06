import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Game,
  Category,
  Proposal,
  Poll,
  Comment,
  Donation,
  Announcement,
  GameStatus,
  GlobalAnalytics,
  MascotConfig,
  SupportSettings,
  Score,
  UserProfile,
  UserRole,
  Report,
  ModerationLog,
} from '../types';

export const DEFAULT_SUPPORT_SETTINGS: SupportSettings = {
  enabled: true,
  title: 'Apoya ANAPSE VIDEO GAMES',
  subtitle: 'Ayúdanos a seguir creando videojuegos independientes.',
  yape: {
    enabled: true,
    phone: '+51 912391502',
    holderName: 'ANAPSE GAMES',
  },
  paypal: {
    enabled: true,
    email: 'anapse_j@yahoo.es',
    url: 'https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=anapse_j%40yahoo.es',
  },
  qr: {
    enabled: false,
    imageUrl: '',
  },
  whatsapp: {
    enabled: false,
    phone: '',
  },
  customAmounts: [2, 5, 10, 20],
};
import {
  INITIAL_GAMES,
  INITIAL_CATEGORIES,
  INITIAL_PROPOSALS,
  INITIAL_POLLS,
  INITIAL_ANNOUNCEMENTS,
} from '../lib/initialData';
import { useAuth } from './AuthContext';

export const DEFAULT_MASCOT_CONFIG: MascotConfig = {
  enabled: true,
  position: 'bottom-right',
  size: 'medium',
  frequencySeconds: 15,
  displayDurationSeconds: 5,
  showCloud: true,
  allowClickInteraction: true,
  spriteSourceType: 'placeholder_engine',
  frameSpeedMs: 300,
  messages: [
    '¡Hola Gamer! Bienvenido a ANAPSE VIDEO GAMES 🎮',
    '¡Gracias por jugar en nuestra plataforma central!',
    '¿Ya viste los juegos nuevos del catálogo?',
    '¡Cuéntanos qué juego quieres que desarrollemos en Propuestas! 💡',
    '¡Vota en las Encuestas de la comunidad! 🗳️',
    '¿Sabías que puedes apoyar a tus juegos favoritos? ❤️',
    '¡Compite por el TOP 1 en el ranking global! 🏆',
  ],
};

interface GameDataContextType {
  games: Game[];
  categories: Category[];
  proposals: Proposal[];
  polls: Poll[];
  comments: Comment[];
  donations: Donation[];
  announcements: Announcement[];
  selectedGame: Game | null;
  activeGameModal: Game | null;
  userLikes: Record<string, boolean>;
  userFollows: Record<string, boolean>;
  userVotes: Record<string, boolean>;
  userPollVotes: Record<string, number>;
  userRatings: Record<string, number>;
  mascotConfig: MascotConfig;
  updateMascotConfig: (newConfig: Partial<MascotConfig>) => void;
  supportSettings: SupportSettings;
  updateSupportSettings: (newSettings: Partial<SupportSettings>) => void;
  setSelectedGame: (game: Game | null) => void;
  setActiveGameModal: (game: Game | null) => void;
  addOrUpdateGame: (game: Partial<Game> & { gameId: string; name: string }) => Promise<void>;
  deleteGame: (gameId: string) => Promise<void>;
  updateGameStatus: (gameId: string, status: GameStatus) => Promise<void>;
  toggleLikeGame: (gameId: string) => Promise<void>;
  rateGame: (gameId: string, rating: number) => Promise<void>;
  toggleFollowGame: (gameId: string) => Promise<void>;
  recordGamePlay: (gameId: string) => Promise<void>;
  recordGameView: (gameId: string) => Promise<void>;
  recordPlatformVisit: () => Promise<void>;
  addProposal: (proposalData: { title: string; description: string; category: string; idea: string; imageUrl?: string }) => Promise<void>;
  voteProposal: (proposalId: string) => Promise<void>;
  updateProposalStatus: (proposalId: string, status: Proposal['status']) => Promise<void>;
  votePoll: (pollId: string, optionIndex: number) => Promise<void>;
  createPoll: (pollData: { question: string; description?: string; options: string[] }) => Promise<void>;
  addComment: (targetType: Comment['targetType'], targetId: string, content: string, parentId?: string | null) => Promise<void>;
  toggleLikeComment: (commentId: string) => Promise<void>;
  hideComment: (commentId: string, hide: boolean, reason?: string) => Promise<void>;
  deleteComment: (commentId: string, reason?: string) => Promise<void>;
  reportComment: (reportData: Omit<Report, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  resolveReport: (reportId: string, status: 'RESOLVED' | 'DISMISSED', notes?: string) => Promise<void>;
  changeUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  updateUserDisplayName: (userId: string, newName: string) => Promise<void>;
  users: UserProfile[];
  reports: Report[];
  moderationLogs: ModerationLog[];
  addDonation: (donationData: { gameId: string; gameName: string; amount: number; message?: string; isPublic: boolean; paymentMethod: string }) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  submitScore: (gameId: string, score: number, playerName?: string) => Promise<void>;
  scores: Score[];
  globalAnalytics: GlobalAnalytics;
  loadingGames?: boolean;
  gamesError?: string | null;
}

const GameDataContext = createContext<GameDataContextType | undefined>(undefined);

export const GameDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, currentUser } = useAuth();

  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState<boolean>(true);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [moderationLogs, setModerationLogs] = useState<ModerationLog[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [userCommentLikes, setUserCommentLikes] = useState<Record<string, boolean>>({});
  const [platformVisits, setPlatformVisits] = useState<number>(0);

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeGameModal, setActiveGameModal] = useState<Game | null>(null);

  const [userLikes, setUserLikes] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('anapse_user_likes');
    return saved ? JSON.parse(saved) : {};
  });
  const [userFollows, setUserFollows] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('anapse_user_follows');
    return saved ? JSON.parse(saved) : {};
  });
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('anapse_user_votes');
    return saved ? JSON.parse(saved) : {};
  });
  const [userPollVotes, setUserPollVotes] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('anapse_user_poll_votes');
    return saved ? JSON.parse(saved) : {};
  });
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('anapse_user_ratings');
    return saved ? JSON.parse(saved) : {};
  });

  const [mascotConfig, setMascotConfig] = useState<MascotConfig>(() => {
    const saved = localStorage.getItem('anapse_mascot_config');
    return saved ? { ...DEFAULT_MASCOT_CONFIG, ...JSON.parse(saved) } : DEFAULT_MASCOT_CONFIG;
  });

  const [supportSettings, setSupportSettings] = useState<SupportSettings>(() => {
    const saved = localStorage.getItem('anapse_support_settings');
    return saved ? { ...DEFAULT_SUPPORT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SUPPORT_SETTINGS;
  });

  const updateSupportSettings = (newSettings: Partial<SupportSettings>) => {
    setSupportSettings((prev) => {
      const updated = {
        ...prev,
        ...newSettings,
        yape: { ...prev.yape, ...(newSettings.yape || {}) },
        paypal: { ...prev.paypal, ...(newSettings.paypal || {}) },
        qr: { ...prev.qr, ...(newSettings.qr || {}) },
        whatsapp: { ...prev.whatsapp, ...(newSettings.whatsapp || {}) },
      };
      localStorage.setItem('anapse_support_settings', JSON.stringify(updated));
      try {
        setDoc(doc(db, 'systemConfig', 'supportSettings'), updated, { merge: true });
      } catch (e) {
        // ok
      }
      return updated;
    });
  };

  // Local storage sync
  useEffect(() => {
    localStorage.setItem('anapse_categories', JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem('anapse_proposals', JSON.stringify(proposals));
  }, [proposals]);
  useEffect(() => {
    localStorage.setItem('anapse_polls', JSON.stringify(polls));
  }, [polls]);
  useEffect(() => {
    localStorage.setItem('anapse_comments', JSON.stringify(comments));
  }, [comments]);
  useEffect(() => {
    localStorage.setItem('anapse_donations', JSON.stringify(donations));
  }, [donations]);
  useEffect(() => {
    localStorage.setItem('anapse_announcements', JSON.stringify(announcements));
  }, [announcements]);
  useEffect(() => {
    localStorage.setItem('anapse_user_likes', JSON.stringify(userLikes));
  }, [userLikes]);
  useEffect(() => {
    localStorage.setItem('anapse_user_follows', JSON.stringify(userFollows));
  }, [userFollows]);
  useEffect(() => {
    localStorage.setItem('anapse_user_votes', JSON.stringify(userVotes));
  }, [userVotes]);
  useEffect(() => {
    localStorage.setItem('anapse_user_poll_votes', JSON.stringify(userPollVotes));
  }, [userPollVotes]);
  useEffect(() => {
    localStorage.setItem('anapse_user_ratings', JSON.stringify(userRatings));
  }, [userRatings]);
  useEffect(() => {
    localStorage.setItem('anapse_mascot_config', JSON.stringify(mascotConfig));
  }, [mascotConfig]);

  const updateMascotConfig = (newConfig: Partial<MascotConfig>) => {
    setMascotConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      localStorage.setItem('anapse_mascot_config', JSON.stringify(updated));
      try {
        setDoc(doc(db, 'systemConfig', 'mascotConfig'), updated, { merge: true });
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  // Firestore Realtime listeners.
  // When a game is active, pause portal subscriptions so Firestore updates
  // do not compete with the game's rendering and main thread.
  useEffect(() => {
    if (activeGameModal) {
      return;
    }

    try {
      setLoadingGames(true);
      const unsubPlatformAnalytics = onSnapshot(
        doc(db, 'analytics', 'platform'),
        (snapshot) => {
          const data = snapshot.data();
          setPlatformVisits(Number(data?.totalVisits || 0));
        },
        () => {
          // Analytics are optional; keep the catalog working if unavailable.
        }
      );

      const unsubGames = onSnapshot(
        collection(db, 'games'),
        (snapshot) => {
          const remoteGames = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Game));
          setGames(remoteGames);
          setLoadingGames(false);
          setGamesError(null);
        },
        (error) => {
          setLoadingGames(false);
          setGamesError('No se pudo cargar el catálogo de juegos de Firebase Firestore.');
          handleFirestoreError(error, OperationType.LIST, 'games');
        }
      );

      const unsubCategories = onSnapshot(
        collection(db, 'categories'),
        (snapshot) => {
          const remote = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
          setCategories(remote);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'categories');
        }
      );

      const unsubProposals = onSnapshot(
        collection(db, 'proposals'),
        (snapshot) => {
          const remote = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Proposal));
          setProposals(remote);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'proposals');
        }
      );

      const unsubPolls = onSnapshot(
        collection(db, 'polls'),
        (snapshot) => {
          const remote = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Poll));
          setPolls(remote);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'polls');
        }
      );

      const unsubComments = onSnapshot(
        collection(db, 'comments'),
        (snapshot) => {
          const remote = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Comment));
          setComments(remote);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'comments');
        }
      );

      const unsubDonations = onSnapshot(
        collection(db, 'donations'),
        (snapshot) => {
          const remote = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Donation));
          setDonations(remote);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'donations');
        }
      );

      const unsubAnnouncements = onSnapshot(
        collection(db, 'announcements'),
        (snapshot) => {
          const remote = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement));
          setAnnouncements(remote);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'announcements');
        }
      );

      const unsubUsers = onSnapshot(
        collection(db, 'users'),
        (snapshot) => {
          const remoteUsers = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() } as UserProfile));
          setUsers(remoteUsers);
          setUsersCount(snapshot.size);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'users');
        }
      );

      const unsubReports = onSnapshot(
        collection(db, 'reports'),
        (snapshot) => {
          const remoteReports = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Report));
          setReports(remoteReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        },
        () => {
          // Ignored for non-moderators
        }
      );

      const unsubModerationLogs = onSnapshot(
        collection(db, 'moderationLogs'),
        (snapshot) => {
          const remoteLogs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ModerationLog));
          setModerationLogs(remoteLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        },
        () => {
          // Ignored for non-moderators
        }
      );

      const unsubScores = onSnapshot(
        collection(db, 'scores'),
        (snapshot) => {
          const remote = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as any));
          setScores(remote);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'scores');
        }
      );

      const unsubSupportSettings = onSnapshot(
        doc(db, 'systemConfig', 'supportSettings'),
        (docSnap) => {
          if (docSnap.exists()) {
            setSupportSettings(docSnap.data() as SupportSettings);
          }
        }
      );

      const unsubMascotConfig = onSnapshot(
        doc(db, 'systemConfig', 'mascotConfig'),
        (docSnap) => {
          if (docSnap.exists()) {
            setMascotConfig(docSnap.data() as MascotConfig);
          }
        }
      );

      return () => {
        unsubPlatformAnalytics();
        unsubGames();
        unsubCategories();
        unsubProposals();
        unsubPolls();
        unsubComments();
        unsubDonations();
        unsubAnnouncements();
        unsubUsers();
        unsubScores();
        unsubSupportSettings();
        unsubMascotConfig();
      };
    } catch (e) {
      console.warn('Realtime listeners fallback to local state:', e);
    }
  }, [activeGameModal]);

  // Listen to user-specific likes, votes, and comment likes in real-time from Firestore
  useEffect(() => {
    if (activeGameModal) {
      return;
    }

    if (!currentUser) {
      setUserLikes({});
      setUserPollVotes({});
      setUserCommentLikes({});
      return;
    }

    const unsubUserLikes = onSnapshot(
      collection(db, 'gameLikes'),
      (snapshot) => {
        const likes: Record<string, boolean> = {};
        snapshot.docs.forEach((d) => {
          const data = d.data();
          if (data.userId === currentUser.uid) {
            likes[data.gameId] = true;
          }
        });
        setUserLikes(likes);
      }
    );

    const unsubUserCommentLikes = onSnapshot(
      collection(db, 'commentLikes'),
      (snapshot) => {
        const likes: Record<string, boolean> = {};
        snapshot.docs.forEach((d) => {
          const data = d.data();
          if (data.userId === currentUser.uid) {
            likes[data.commentId] = true;
          }
        });
        setUserCommentLikes(likes);
      }
    );

    const unsubUserPollVotes = onSnapshot(
      collection(db, 'pollVotes'),
      (snapshot) => {
        const votes: Record<string, number> = {};
        snapshot.docs.forEach((d) => {
          const data = d.data();
          if (data.userId === currentUser.uid) {
            votes[data.pollId] = data.optionIndex;
          }
        });
        setUserPollVotes(votes);
      }
    );

    return () => {
      unsubUserLikes();
      unsubUserCommentLikes();
      unsubUserPollVotes();
    };
  }, [currentUser, activeGameModal]);

  const addOrUpdateGame = async (gameData: Partial<Game> & { gameId: string; name: string }) => {
    const existingIndex = games.findIndex((g) => g.gameId === gameData.gameId);
    
    // Recursive cleaner helper to eliminate any 'undefined' values from object tree before writing to Firestore
    const cleanObj = (obj: any): any => {
      const result: any = {};
      Object.keys(obj).forEach((key) => {
        if (obj[key] !== undefined) {
          if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            result[key] = cleanObj(obj[key]);
          } else {
            result[key] = obj[key];
          }
        }
      });
      return result;
    };

    const newGame: Game = {
      id: gameData.gameId,
      gameId: gameData.gameId,
      name: gameData.name,
      tagline: gameData.tagline || '',
      description: gameData.description || 'Nuevo videojuego de ANAPSE.',
      mainImage: gameData.mainImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      bannerImage: gameData.bannerImage || '',
      category: gameData.category || 'SIN CATEGORÍA',
      tags: gameData.tags || ['Nuevo'],
      status: gameData.status || 'SIN CATEGORÍA',
      webUrl: gameData.webUrl || '',
      embedAllowed: gameData.embedAllowed ?? true,
      repository: gameData.repository,
      firebaseConfig: gameData.firebaseConfig,
      version: gameData.version || '1.0.0',
      platforms: gameData.platforms || ['Web', 'Android'],
      featured: gameData.featured ?? false,
      inPromotion: gameData.inPromotion ?? false,
      visible: gameData.visible ?? true,
      likesCount: gameData.likesCount ?? 0,
      playsCount: gameData.playsCount ?? 0,
      viewsCount: gameData.viewsCount ?? 0,
      ratingAvg: gameData.ratingAvg ?? 5.0,
      ratingsCount: gameData.ratingsCount ?? 1,
      rankingConfig: gameData.rankingConfig || {
        enabled: true,
        type: 'score',
        scoreField: 'score',
        order: 'desc',
        limit: 50,
        unit: 'pts',
      },
      dashboardUrl: gameData.dashboardUrl || '',
      sampleLeaderboard: gameData.sampleLeaderboard || [],
      createdAt: gameData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      const updatedList = [...games];
      updatedList[existingIndex] = { ...updatedList[existingIndex], ...newGame };
      setGames(updatedList);
    } else {
      setGames((prev) => [newGame, ...prev]);
    }

    try {
      const sanitizedGame = cleanObj(newGame);
      await setDoc(doc(db, 'games', newGame.gameId), sanitizedGame, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `games/${newGame.gameId}`);
      throw err;
    }
  };

  const deleteGame = async (gameId: string) => {
    setGames((prev) => prev.filter((g) => g.gameId !== gameId));
    if (selectedGame?.gameId === gameId) setSelectedGame(null);
    try {
      await deleteDoc(doc(db, 'games', gameId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `games/${gameId}`);
    }
  };

  const updateGameStatus = async (gameId: string, status: GameStatus) => {
    setGames((prev) =>
      prev.map((g) => (g.gameId === gameId ? { ...g, status, updatedAt: new Date().toISOString() } : g))
    );
    try {
      await updateDoc(doc(db, 'games', gameId), { status, updatedAt: new Date().toISOString() });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `games/${gameId}`);
    }
  };

  const toggleLikeGame = async (gameId: string) => {
    const isLiked = !!userLikes[gameId];
    const newLikes = { ...userLikes, [gameId]: !isLiked };
    setUserLikes(newLikes);

    setGames((prev) =>
      prev.map((g) => (g.gameId === gameId ? { ...g, likesCount: Math.max(0, g.likesCount + (isLiked ? -1 : 1)) } : g))
    );

    try {
      if (currentUser) {
        const likeDocId = `${currentUser.uid}_${gameId}`;
        const likeDocRef = doc(db, 'gameLikes', likeDocId);
        if (isLiked) {
          await deleteDoc(likeDocRef);
        } else {
          await setDoc(likeDocRef, {
            userId: currentUser.uid,
            gameId,
            createdAt: new Date().toISOString()
          });
        }
      }

      await updateDoc(doc(db, 'games', gameId), {
        likesCount: increment(isLiked ? -1 : 1),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `games/${gameId}`);
    }
  };

  const rateGame = async (gameId: string, rating: number) => {
    const prevUserRating = userRatings[gameId];
    setUserRatings({ ...userRatings, [gameId]: rating });

    setGames((prev) =>
      prev.map((g) => {
        if (g.gameId !== gameId) return g;
        const count = prevUserRating ? g.ratingsCount : g.ratingsCount + 1;
        const total = g.ratingAvg * g.ratingsCount + rating - (prevUserRating || 0);
        const newAvg = Number((total / count).toFixed(1));
        return { ...g, ratingAvg: newAvg, ratingsCount: count };
      })
    );
  };

  const toggleFollowGame = async (gameId: string) => {
    const isFollowed = !!userFollows[gameId];
    setUserFollows({ ...userFollows, [gameId]: !isFollowed });
  };

  const recordPlatformVisit = async () => {
    setPlatformVisits((prev) => prev + 1);
    try {
      await setDoc(
        doc(db, 'analytics', 'platform'),
        { totalVisits: increment(1), updatedAt: new Date().toISOString() },
        { merge: true }
      );
    } catch (err) {
      // Keep the local dashboard responsive if Firestore is temporarily unavailable.
    }
  };

  const recordGameView = async (gameId: string) => {
    setGames((prev) =>
      prev.map((g) => (g.gameId === gameId ? { ...g, viewsCount: (g.viewsCount || 0) + 1 } : g))
    );
    try {
      await updateDoc(doc(db, 'games', gameId), {
        viewsCount: increment(1),
      });
    } catch (err) {
      // Keep the local counter responsive if Firestore is temporarily unavailable.
    }
  };

  const recordGamePlay = async (gameId: string) => {
    setGames((prev) =>
      prev.map((g) => (g.gameId === gameId ? { ...g, playsCount: g.playsCount + 1 } : g))
    );
    try {
      await updateDoc(doc(db, 'games', gameId), {
        playsCount: increment(1),
      });
    } catch (err) {
      // ignore
    }
  };

  const addProposal = async (proposalData: { title: string; description: string; category: string; idea: string; imageUrl?: string }) => {
    const newId = 'prop-' + Date.now();
    const newProposal: Proposal = {
      id: newId,
      title: proposalData.title,
      description: proposalData.description,
      category: proposalData.category,
      idea: proposalData.idea,
      imageUrl: proposalData.imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      authorId: profile?.uid || currentUser?.uid || 'guest-' + Date.now(),
      authorName: profile?.displayName || 'Gamer Comunitario',
      authorPhoto: profile?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${newId}`,
      votesCount: 1,
      commentsCount: 0,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    setProposals((prev) => [newProposal, ...prev]);
    setUserVotes((prev) => ({ ...prev, [newId]: true }));

    try {
      await setDoc(doc(db, 'proposals', newId), newProposal);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `proposals/${newId}`);
    }
  };

  const voteProposal = async (proposalId: string) => {
    const isVoted = !!userVotes[proposalId];
    const diff = isVoted ? -1 : 1;
    setUserVotes({ ...userVotes, [proposalId]: !isVoted });

    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, votesCount: Math.max(0, p.votesCount + diff) } : p))
    );

    try {
      await updateDoc(doc(db, 'proposals', proposalId), {
        votesCount: increment(diff),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `proposals/${proposalId}`);
    }
  };

  const updateProposalStatus = async (proposalId: string, status: Proposal['status']) => {
    setProposals((prev) => prev.map((p) => (p.id === proposalId ? { ...p, status } : p)));
    try {
      await updateDoc(doc(db, 'proposals', proposalId), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `proposals/${proposalId}`);
    }
  };

  const votePoll = async (pollId: string, optionIndex: number) => {
    const prevOption = userPollVotes[pollId];
    if (prevOption === optionIndex) return;

    setUserPollVotes({ ...userPollVotes, [pollId]: optionIndex });

    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;
        const newOptions = poll.options.map((opt, idx) => {
          let count = opt.votes;
          if (idx === optionIndex) count += 1;
          if (prevOption !== undefined && idx === prevOption) count = Math.max(0, count - 1);
          return { ...opt, votes: count };
        });
        const total = prevOption === undefined ? poll.totalVotes + 1 : poll.totalVotes;
        return { ...poll, options: newOptions, totalVotes: total };
      })
    );

    try {
      if (currentUser) {
        const voteDocId = `${currentUser.uid}_${pollId}`;
        await setDoc(doc(db, 'pollVotes', voteDocId), {
          userId: currentUser.uid,
          pollId,
          optionIndex,
          createdAt: new Date().toISOString()
        });
      }

      const pollRef = doc(db, 'polls', pollId);
      const pollObj = polls.find(p => p.id === pollId);
      if (pollObj) {
        const updatedOptions = pollObj.options.map((opt, idx) => {
          let count = opt.votes;
          if (idx === optionIndex) count += 1;
          if (prevOption !== undefined && idx === prevOption) count = Math.max(0, count - 1);
          return { ...opt, votes: count };
        });
        const updatedTotal = prevOption === undefined ? pollObj.totalVotes + 1 : pollObj.totalVotes;
        await updateDoc(pollRef, {
          options: updatedOptions,
          totalVotes: updatedTotal
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `polls/${pollId}`);
    }
  };

  const createPoll = async (pollData: { question: string; description?: string; options: string[] }) => {
    const newId = 'poll-' + Date.now();
    const newPoll: Poll = {
      id: newId,
      question: pollData.question,
      description: pollData.description,
      options: pollData.options.map((t) => ({ text: t, votes: 0 })),
      active: true,
      totalVotes: 0,
      createdAt: new Date().toISOString(),
    };
    setPolls((prev) => [newPoll, ...prev]);
    try {
      await setDoc(doc(db, 'polls', newId), newPoll);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `polls/${newId}`);
    }
  };

  const addComment = async (
    targetType: Comment['targetType'],
    targetId: string,
    content: string,
    parentId?: string | null
  ) => {
    const newId = 'comment-' + Date.now();
    const newComment: Comment = {
      id: newId,
      targetType,
      targetId,
      parentId: parentId || null,
      userId: profile?.uid || currentUser?.uid || 'guest-' + Date.now(),
      userName: profile?.displayName || 'Gamer Anapse',
      userRole: profile?.role || 'USUARIO',
      userPhoto: profile?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${newId}`,
      content,
      likesCount: 0,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [...prev, newComment]);

    if (targetType === 'proposal') {
      setProposals((prev) =>
        prev.map((p) => (p.id === targetId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
      );
    }

    try {
      await setDoc(doc(db, 'comments', newId), newComment);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `comments/${newId}`);
    }
  };

  const toggleLikeComment = async (commentId: string) => {
    const isLiked = !!userCommentLikes[commentId];
    const newLikes = { ...userCommentLikes, [commentId]: !isLiked };
    setUserCommentLikes(newLikes);

    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likesCount: Math.max(0, c.likesCount + (isLiked ? -1 : 1)) } : c))
    );

    try {
      if (currentUser) {
        const likeDocId = `${currentUser.uid}_${commentId}`;
        const likeDocRef = doc(db, 'commentLikes', likeDocId);
        if (isLiked) {
          await deleteDoc(likeDocRef);
        } else {
          await setDoc(likeDocRef, {
            userId: currentUser.uid,
            commentId,
            createdAt: new Date().toISOString()
          });
        }
      }

      await updateDoc(doc(db, 'comments', commentId), {
        likesCount: increment(isLiked ? -1 : 1)
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `comments/${commentId}`);
    }
  };

  const deleteComment = async (commentId: string, reason?: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId && c.parentId !== commentId));
    try {
      await deleteDoc(doc(db, 'comments', commentId));

      // Record in moderation audit logs
      if (profile) {
        const logId = 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
        const logEntry: ModerationLog = {
          id: logId,
          moderatorId: profile.uid,
          moderatorName: profile.displayName || 'Moderador',
          action: 'DELETED',
          commentId,
          reason: reason || 'Eliminado por moderación',
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'moderationLogs', logId), logEntry);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `comments/${commentId}`);
    }
  };

  const hideComment = async (commentId: string, hide: boolean, reason?: string) => {
    const updatedBy = profile?.displayName || 'Moderador ANAPSE';
    const timestamp = new Date().toISOString();

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              hidden: hide,
              hiddenBy: hide ? updatedBy : undefined,
              hiddenAt: hide ? timestamp : undefined,
              moderatedBy: updatedBy,
              moderatedAt: timestamp,
              moderationAction: hide ? 'HIDDEN' : 'RESTORED',
            }
          : c
      )
    );

    try {
      const commentRef = doc(db, 'comments', commentId);
      await updateDoc(commentRef, {
        hidden: hide,
        hiddenBy: hide ? updatedBy : null,
        hiddenAt: hide ? timestamp : null,
        moderatedBy: updatedBy,
        moderatedAt: timestamp,
        moderationAction: hide ? 'HIDDEN' : 'RESTORED',
      });

      // Record in moderation audit logs
      if (profile) {
        const logId = 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
        const logEntry: ModerationLog = {
          id: logId,
          moderatorId: profile.uid,
          moderatorName: profile.displayName || 'Moderador',
          action: hide ? 'HIDDEN' : 'RESTORED',
          commentId,
          reason: reason || (hide ? 'Comentario ocultado' : 'Comentario restaurado'),
          createdAt: timestamp,
        };
        await setDoc(doc(db, 'moderationLogs', logId), logEntry);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `comments/${commentId}`);
    }
  };

  const reportComment = async (reportData: Omit<Report, 'id' | 'createdAt' | 'status'>) => {
    const newId = 'rep-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newReport: Report = {
      id: newId,
      ...reportData,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    setReports((prev) => [newReport, ...prev]);

    try {
      await setDoc(doc(db, 'reports', newId), newReport);

      // Audit log entry for report creation
      const logId = 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
      const logEntry: ModerationLog = {
        id: logId,
        moderatorId: reportData.reportedBy,
        moderatorName: reportData.reporterName,
        action: 'REPORTED',
        commentId: reportData.commentId,
        targetUserId: reportData.commentAuthorId,
        targetUserName: reportData.commentAuthorName,
        reason: `${reportData.reason}${reportData.details ? ': ' + reportData.details : ''}`,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'moderationLogs', logId), logEntry);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `reports/${newId}`);
    }
  };

  const resolveReport = async (reportId: string, status: 'RESOLVED' | 'DISMISSED', notes?: string) => {
    const resolvedBy = profile?.displayName || 'Moderador';
    const timestamp = new Date().toISOString();

    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status, resolvedBy, resolvedAt: timestamp } : r))
    );

    try {
      await updateDoc(doc(db, 'reports', reportId), {
        status,
        resolvedBy,
        resolvedAt: timestamp,
      });

      // Audit log entry
      if (profile) {
        const logId = 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
        const logEntry: ModerationLog = {
          id: logId,
          moderatorId: profile.uid,
          moderatorName: resolvedBy,
          action: status === 'RESOLVED' ? 'RESOLVED_REPORT' : 'DISMISSED_REPORT',
          reason: notes || `Reporte ${status === 'RESOLVED' ? 'resuelto' : 'descartado'}`,
          createdAt: timestamp,
        };
        await setDoc(doc(db, 'moderationLogs', logId), logEntry);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `reports/${reportId}`);
    }
  };

  const changeUserRole = async (userId: string, newRole: UserRole) => {
    const updatedBy = profile?.displayName || 'Administrador';
    const timestamp = new Date().toISOString();

    setUsers((prev) =>
      prev.map((u) => (u.uid === userId ? { ...u, role: newRole, updatedAt: timestamp } : u))
    );

    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: timestamp,
      });

      // Audit log entry
      if (profile) {
        const logId = 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
        const logEntry: ModerationLog = {
          id: logId,
          moderatorId: profile.uid,
          moderatorName: updatedBy,
          action: 'ROLE_CHANGED',
          targetUserId: userId,
          reason: `Rol asignado a: ${newRole}`,
          createdAt: timestamp,
        };
        await setDoc(doc(db, 'moderationLogs', logId), logEntry);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const updateUserDisplayName = async (userId: string, newName: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.uid === userId ? { ...u, displayName: newName, updatedAt: new Date().toISOString() } : u))
    );
    try {
      await updateDoc(doc(db, 'users', userId), {
        displayName: newName,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const addDonation = async (donationData: {
    gameId: string;
    gameName: string;
    amount: number;
    message?: string;
    isPublic: boolean;
    paymentMethod: string;
  }) => {
    const newId = 'don-' + Date.now();
    const newDon: Donation = {
      id: newId,
      gameId: donationData.gameId,
      gameName: donationData.gameName,
      amount: donationData.amount,
      currency: 'S/',
      userId: profile?.uid || currentUser?.uid,
      userName: profile?.displayName || 'Gamer Generoso',
      message: donationData.message,
      isPublic: donationData.isPublic,
      paymentMethod: donationData.paymentMethod,
      createdAt: new Date().toISOString(),
    };
    setDonations((prev) => [newDon, ...prev]);
    try {
      await setDoc(doc(db, 'donations', newId), newDon);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `donations/${newId}`);
    }
  };

  const addCategory = async (category: Category) => {
    setCategories((prev) => [...prev, category]);
    try {
      await setDoc(doc(db, 'categories', category.id), category);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `categories/${category.id}`);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${categoryId}`);
    }
  };

  const submitScore = async (gameId: string, score: number, playerName?: string) => {
    const name = playerName || profile?.displayName || 'Gamer Anapse';
    const uid = currentUser?.uid || 'guest-' + Date.now();
    const scoreId = 'score-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    const scoreDoc: Score = {
      id: scoreId,
      gameId,
      userId: uid,
      playerName: name,
      score,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'scores', scoreId), scoreDoc);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `scores/${scoreId}`);
    }
  };

  const globalAnalytics: GlobalAnalytics = {
    totalVisits: platformVisits,
    totalPlays: games.reduce((acc, g) => acc + (g.playsCount || 0), 0),
    totalUsers: usersCount,
    totalLikes: games.reduce((acc, g) => acc + (g.likesCount || 0), 0),
    totalDonations: donations.reduce((acc, d) => acc + d.amount, 0),
    totalProposals: proposals.length,
    topGamesByPlays: [...games].sort((a, b) => b.playsCount - a.playsCount).slice(0, 5).map((g) => ({ name: g.name, count: g.playsCount })),
    dailyVisits: [
      { date: 'Lun', visits: Math.floor(games.reduce((acc, g) => acc + (g.viewsCount || 0), 0) * 0.1), plays: Math.floor(games.reduce((acc, g) => acc + (g.playsCount || 0), 0) * 0.1) },
      { date: 'Mar', visits: Math.floor(games.reduce((acc, g) => acc + (g.viewsCount || 0), 0) * 0.12), plays: Math.floor(games.reduce((acc, g) => acc + (g.playsCount || 0), 0) * 0.12) },
      { date: 'Mié', visits: Math.floor(games.reduce((acc, g) => acc + (g.viewsCount || 0), 0) * 0.14), plays: Math.floor(games.reduce((acc, g) => acc + (g.playsCount || 0), 0) * 0.14) },
      { date: 'Jue', visits: Math.floor(games.reduce((acc, g) => acc + (g.viewsCount || 0), 0) * 0.15), plays: Math.floor(games.reduce((acc, g) => acc + (g.playsCount || 0), 0) * 0.15) },
      { date: 'Vie', visits: Math.floor(games.reduce((acc, g) => acc + (g.viewsCount || 0), 0) * 0.18), plays: Math.floor(games.reduce((acc, g) => acc + (g.playsCount || 0), 0) * 0.18) },
      { date: 'Sáb', visits: Math.floor(games.reduce((acc, g) => acc + (g.viewsCount || 0), 0) * 0.2), plays: Math.floor(games.reduce((acc, g) => acc + (g.playsCount || 0), 0) * 0.2) },
      { date: 'Dom', visits: Math.floor(games.reduce((acc, g) => acc + (g.viewsCount || 0), 0) * 0.11), plays: Math.floor(games.reduce((acc, g) => acc + (g.playsCount || 0), 0) * 0.11) },
    ],
  };

  return (
    <GameDataContext.Provider
      value={{
        games,
        categories,
        proposals,
        polls,
        comments,
        donations,
        announcements,
        selectedGame,
        activeGameModal,
        userLikes,
        userFollows,
        userVotes,
        userPollVotes,
        userRatings,
        mascotConfig,
        updateMascotConfig,
        supportSettings,
        updateSupportSettings,
        setSelectedGame,
        setActiveGameModal,
        addOrUpdateGame,
        deleteGame,
        updateGameStatus,
        toggleLikeGame,
        rateGame,
        toggleFollowGame,
        recordGamePlay,
        recordGameView,
        addProposal,
        voteProposal,
        updateProposalStatus,
        votePoll,
        createPoll,
        addComment,
        toggleLikeComment,
        hideComment,
        deleteComment,
        reportComment,
        resolveReport,
        changeUserRole,
        updateUserDisplayName,
        users,
        reports,
        moderationLogs,
        addDonation,
        addCategory,
        deleteCategory,
        submitScore,
        scores,
        globalAnalytics,
        recordPlatformVisit,
        loadingGames,
        gamesError,
      }}
    >
      {children}
    </GameDataContext.Provider>
  );
};

export const useGameData = () => {
  const context = useContext(GameDataContext);
  if (!context) throw new Error('useGameData must be used within a GameDataProvider');
  return context;
};
