export interface AnapseGameSpec {
  gameId: string;
  name: string;
  version: string;
  category: string;
  status: 'published' | 'beta' | 'in_development' | 'in_repair' | 'promotional' | 'upcoming';
  web: {
    url: string;
    allowEmbed?: boolean;
    aspectRatio?: string;
  };
  repository?: {
    provider: 'github' | 'gitlab' | 'bitbucket';
    owner: string;
    name: string;
    branch: string;
  };
  firebase?: {
    projectId: string;
    databaseType: 'firestore' | 'realtime';
  };
  collections?: {
    players?: string;
    ranking?: string;
    scores?: string;
    events?: string;
    achievements?: string;
  };
  features?: {
    ranking?: boolean;
    likes?: boolean;
    ratings?: boolean;
    comments?: boolean;
    sharing?: boolean;
    donations?: boolean;
    multiplayer?: boolean;
  };
  ranking?: {
    enabled: boolean;
    type: 'score' | 'time' | 'level' | 'coins' | 'distance';
    limit?: number;
    scoreField?: string;
    order?: 'desc' | 'asc';
    unit?: string;
  };
  metadata?: {
    author?: string;
    platforms?: string[];
    minPlayers?: number;
    maxPlayers?: number;
    tags?: string[];
    engine?: string;
  };
}

export interface SpecValidationResult {
  isValid: boolean;
  score: number;
  checks: {
    id: string;
    title: string;
    status: 'pass' | 'fail' | 'warn';
    message: string;
  }[];
  spec?: AnapseGameSpec;
}
