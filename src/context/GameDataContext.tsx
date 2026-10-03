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
} from '../types';
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
  setSelectedGame: (game: Game | null) => void;
  setActiveGameModal: (game: Game | null) => void;
  addOrUpdateGame: (game: Partial<Game> & { gameId: string; name: string }) => Promise<void>;
  deleteGame: (gameId: string) => Promise<void>;
  updateGameStatus: (gameId: string, status: GameStatus) => Promise<void>;
  toggleLikeGame: (gameId: string) => Promise<void>;
  rateGame: (gameId: string, rating: number) => Promise<void>;
  toggleFollowGame: (gameId: string) => Promise<void>;
  recordGamePlay: (gameId: string) => Promise<void>;
  addProposal: (proposalData: { title: string; description: string; category: string; idea: string; imageUrl?: string }) => Promise<void>;
  voteProposal: (proposalId: string) => Promise<void>;
  updateProposalStatus: (proposalId: string, status: Proposal['status']) => Promise<void>;
  votePoll: (pollId: string, optionIndex: number) => Promise<void>;
  createPoll: (pollData: { question: string; description?: string; options: string[] }) => Promise<void>;
  addComment: (targetType: Comment['targetType'], targetId: string, content: string, parentId?: string | null) => Promise<void>;
  toggleLikeComment: (commentId: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  addDonation: (donationData: { gameId: string; gameName: string; amount: number; message?: string; isPublic: boolean; paymentMethod: string }) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  submitScore: (gameId: string, score: number, playerName?: string) => Promise<void>;
  globalAnalytics: GlobalAnalytics;
}

const GameDataContext = createContext<GameDataContextType | undefined>(undefined);

export const GameDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, currentUser } = useAuth();

  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem('anapse_games');
    return saved ? JSON.parse(saved) : INITIAL_GAMES;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('anapse_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });
  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const saved = localStorage.getItem('anapse_proposals');
    return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
  });
  const [polls, setPolls] = useState<Poll[]>(() => {
    const saved = localStorage.getItem('anapse_polls');
    return saved ? JSON.parse(saved) : INITIAL_POLLS;
  });
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('anapse_comments');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'c-1',
            targetType: 'game',
            targetId: 'fox-thief',
            userId: 'user-valeria',
            userName: 'Valeria Gamer',
            userPhoto: 'https://api.dicebear.com/7.x/bottts/svg?seed=valeria',
            content: '¡Me encanta el sigilo y la música retro de Fox Thief! El nivel 4 es súper desafiante 🦊🔥',
            likesCount: 15,
            createdAt: '2026-04-02T12:00:00Z',
          },
          {
            id: 'c-2',
            targetType: 'game',
            targetId: 'fox-thief',
            parentId: 'c-1',
            userId: 'user-admin',
            userName: 'ANAPSE Team',
            userPhoto: 'https://api.dicebear.com/7.x/bottts/svg?seed=anapseTeam',
            content: '¡Gracias Valeria! La próxima semana lanzaremos la actualización v1.3 con nuevas trampas y skins.',
            likesCount: 8,
            createdAt: '2026-04-02T13:30:00Z',
          },
        ];
  });
  const [donations, setDonations] = useState<Donation[]>(() => {
    const saved = localStorage.getItem('anapse_donations');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'don-1',
            gameId: 'fox-thief',
            gameName: 'FOX THIEF',
            amount: 10,
            currency: 'S/',
            userName: 'Juan Carlos',
            message: '¡Excelente juego peruano! Sigan adelante con más niveles.',
            isPublic: true,
            paymentMethod: 'Yape / Plin',
            createdAt: '2026-04-01T15:00:00Z',
          },
          {
            id: 'don-2',
            gameId: 'crazy-monkey-balloons',
            gameName: 'CRAZY MONKEY BALLOONS',
            amount: 5,
            currency: 'S/',
            userName: 'Andrea R.',
            message: 'Mis sobrinos no paran de jugarlo en la tablet ❤️',
            isPublic: true,
            paymentMethod: 'Tarjeta',
            createdAt: '2026-04-02T18:20:00Z',
          },
        ];
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('anapse_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

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

  // Local storage sync
  useEffect(() => {
    localStorage.setItem('anapse_games', JSON.stringify(games));
  }, [games]);
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
    setMascotConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Firestore Realtime listeners
  useEffect(() => {
    try {
      const unsubGames = onSnapshot(
        collection(db, 'games'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteGames = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Game));
            setGames(remoteGames);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'games');
        }
      );

      const unsubProposals = onSnapshot(
        collection(db, 'proposals'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remote = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Proposal));
            setProposals(remote);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'proposals');
        }
      );

      const unsubPolls = onSnapshot(
        collection(db, 'polls'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remote = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Poll));
            setPolls(remote);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'polls');
        }
      );

      const unsubComments = onSnapshot(
        collection(db, 'comments'),
        (snapshot) => {
          if (!snapshot.empty) {
            const remote = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Comment));
            setComments(remote);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'comments');
        }
      );

      return () => {
        unsubGames();
        unsubProposals();
        unsubPolls();
        unsubComments();
      };
    } catch (e) {
      console.warn('Realtime listeners fallback to local state:', e);
    }
  }, []);

  const addOrUpdateGame = async (gameData: Partial<Game> & { gameId: string; name: string }) => {
    const existingIndex = games.findIndex((g) => g.gameId === gameData.gameId);
    const newGame: Game = {
      id: gameData.gameId,
      gameId: gameData.gameId,
      name: gameData.name,
      tagline: gameData.tagline || '',
      description: gameData.description || 'Nuevo videojuego de ANAPSE.',
      mainImage: gameData.mainImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      bannerImage: gameData.bannerImage,
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
      await setDoc(doc(db, 'games', newGame.gameId), newGame, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `games/${newGame.gameId}`);
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
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likesCount: c.likesCount + 1 } : c))
    );
  };

  const deleteComment = async (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId && c.parentId !== commentId));
    try {
      await deleteDoc(doc(db, 'comments', commentId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `comments/${commentId}`);
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
    setGames((prev) =>
      prev.map((g) => {
        if (g.gameId !== gameId) return g;
        const currentBoard = g.sampleLeaderboard || [];
        const newBoard = [...currentBoard, { rank: 0, playerName: name, score, date: new Date().toISOString().split('T')[0] }]
          .sort((a, b) => b.score - a.score)
          .slice(0, 50)
          .map((item, idx) => ({ ...item, rank: idx + 1 }));
        return { ...g, sampleLeaderboard: newBoard };
      })
    );
  };

  const globalAnalytics: GlobalAnalytics = {
    totalVisits: games.reduce((acc, g) => acc + (g.viewsCount || 0), 0) + 12500,
    totalPlays: games.reduce((acc, g) => acc + (g.playsCount || 0), 0),
    totalUsers: 4820,
    totalLikes: games.reduce((acc, g) => acc + (g.likesCount || 0), 0),
    totalDonations: donations.reduce((acc, d) => acc + d.amount, 0),
    totalProposals: proposals.length,
    topGamesByPlays: [...games].sort((a, b) => b.playsCount - a.playsCount).slice(0, 5).map((g) => ({ name: g.name, count: g.playsCount })),
    dailyVisits: [
      { date: 'Lun', visits: 1840, plays: 920 },
      { date: 'Mar', visits: 2150, plays: 1100 },
      { date: 'Mié', visits: 2480, plays: 1350 },
      { date: 'Jue', visits: 2900, plays: 1600 },
      { date: 'Vie', visits: 3850, plays: 2400 },
      { date: 'Sáb', visits: 5200, plays: 3600 },
      { date: 'Dom', visits: 4900, plays: 3200 },
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
        setSelectedGame,
        setActiveGameModal,
        addOrUpdateGame,
        deleteGame,
        updateGameStatus,
        toggleLikeGame,
        rateGame,
        toggleFollowGame,
        recordGamePlay,
        addProposal,
        voteProposal,
        updateProposalStatus,
        votePoll,
        createPoll,
        addComment,
        toggleLikeComment,
        deleteComment,
        addDonation,
        addCategory,
        deleteCategory,
        submitScore,
        globalAnalytics,
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
