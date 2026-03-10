export type LeaderboardType = 'weekly' | 'global' | 'category';

export type LeaderboardCategory = 
  | 'steps'
  | 'sleep'
  | 'heart'
  | 'streak'
  | 'xp'
  | 'health_score';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  photoURL: string | null;
  value: number;
  previousRank: number;
  isCurrentUser: boolean;
}

export interface Leaderboard {
  id: string;
  type: LeaderboardType;
  category?: LeaderboardCategory;
  title: string;
  description: string;
  entries: LeaderboardEntry[];
  lastUpdated: string;
  currentUserEntry?: LeaderboardEntry;
}
