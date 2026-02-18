export interface UserProfile {
  id: string;
  displayName: string;
  photoURL: string | null;
  level: number;
  totalXp: number;
  streak: number;
  healthScore: number;
  lastActive: string;
}

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected';

export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
  friend?: UserProfile;
}

export type ActivityType = 
  | 'achievement_unlocked'
  | 'challenge_completed'
  | 'level_up'
  | 'streak_milestone'
  | 'health_milestone'
  | 'joined';

export interface FriendActivity {
  id: string;
  userId: string;
  user: UserProfile;
  type: ActivityType;
  details: string;
  timestamp: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUser: UserProfile;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export type SocialTabParamList = {
  Friends: undefined;
  Requests: undefined;
  Activity: undefined;
};
