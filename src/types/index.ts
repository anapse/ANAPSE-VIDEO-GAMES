export type GameStatus =
  | 'SIN CATEGORÍA'
  | 'PROPUESTO'
  | 'EN ENCUESTA'
  | 'SELECCIONADO'
  | 'EN CREACIÓN'
  | 'BETA'
  | 'PUBLICADO'
  | 'EN REPARACIÓN'
  | 'EN PROMOCIÓN'
  | 'PRÓXIMAMENTE'
  | 'ARCHIVADO';

export type UserRole =
  | 'ADMINISTRADOR'
  | 'MAYORDOMO'
  | 'EDITOR'
  | 'MODERADOR'
  | 'USUARIO'
  | 'VISITANTE';

export interface Game {
  id: string;
  gameId: string;
  name: string;
  tagline?: string;
  description: string;
  howToPlay?: string;
  mainImage: string;
  bannerImage?: string;
  screenshots?: string[];
  category: string;
  tags: string[];
  status: GameStatus;
  webUrl?: string;
  embedAllowed: boolean;
  repository?: {
    provider: 'github' | 'gitlab' | 'bitbucket' | 'other';
    owner: string;
    name: string;
    branch: string;
    url?: string;
    lastSync?: string;
  };
  firebaseConfig?: {
    projectId: string;
    databaseType: 'firestore' | 'realtime' | 'none';
    collections?: {
      players?: string;
      ranking?: string;
      scores?: string;
      events?: string;
      achievements?: string;
    };
  };
  version: string;
  platforms: ('Web' | 'Android' | 'iOS' | 'Windows' | 'Mac' | 'Linux')[];
  featured: boolean;
  inPromotion: boolean;
  isNew?: boolean;
  visible: boolean;
  likesCount: number;
  playsCount: number;
  viewsCount: number;
  ratingAvg: number;
  ratingsCount: number;
  rankingConfig?: {
    enabled?: boolean;
    type?: 'score' | 'time' | 'level' | 'coins' | 'distance';
    scoreField?: string;
    order?: 'desc' | 'asc';
    limit?: number;
    unit?: string;
    collection?: string;
    playerField?: string;
  };
  dashboardUrl?: string;
  sampleLeaderboard?: {
    rank: number;
    playerName: string;
    score: number;
    avatar?: string;
    date: string;
  }[];
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  order: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  role: UserRole;
  bio?: string;
  favoriteCategory?: string;
  badges?: string[];
  createdAt: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  category: string;
  idea: string;
  imageUrl?: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  votesCount: number;
  commentsCount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_DEVELOPMENT' | 'COMPLETED';
  createdAt: string;
}

export interface Poll {
  id: string;
  question: string;
  description?: string;
  options: {
    text: string;
    votes: number;
    icon?: string;
  }[];
  active: boolean;
  totalVotes: number;
  expiresAt?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  targetType: 'game' | 'proposal' | 'community' | 'poll';
  targetId: string;
  parentId?: string | null;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  likesCount: number;
  hidden?: boolean;
  createdAt: string;
}

export interface Donation {
  id: string;
  gameId: string;
  gameName: string;
  amount: number;
  currency: string;
  userId?: string;
  userName: string;
  message?: string;
  isPublic: boolean;
  paymentMethod: string;
  createdAt: string;
}

export interface SupportSettings {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  yape: {
    enabled: boolean;
    phone: string; // "+51 912391502"
    holderName?: string;
  };
  paypal: {
    enabled: boolean;
    email: string; // "anapse_j@yahoo.es"
    url?: string;
  };
  qr: {
    enabled: boolean; // default false
    imageUrl?: string;
  };
  whatsapp: {
    enabled: boolean; // default false
    phone?: string;
  };
  customAmounts?: number[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'release' | 'event' | 'maintenance';
  actionUrl?: string;
  actionLabel?: string;
  active: boolean;
  createdAt: string;
}

export interface GlobalAnalytics {
  totalVisits: number;
  totalPlays: number;
  totalUsers: number;
  totalLikes: number;
  totalDonations: number;
  totalProposals: number;
  topGamesByPlays: { name: string; count: number }[];
  dailyVisits: { date: string; visits: number; plays: number }[];
}

export interface MascotConfig {
  enabled: boolean;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'floating-right';
  size: 'small' | 'medium' | 'large';
  frequencySeconds: number;
  displayDurationSeconds: number;
  showCloud: boolean;
  allowClickInteraction: boolean;
  messages: string[];
  spriteSourceType: 'placeholder_engine' | 'custom_sprite' | 'spritesheet';
  customSpriteUrl?: string;
  frameSpeedMs?: number;
}

export interface Score {
  id: string;
  gameId: string;
  userId: string;
  playerName: string;
  score: number;
  createdAt: string;
}
