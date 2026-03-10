import { create } from 'zustand';
import { UserProfile, FriendActivity, FriendRequest, Friendship, ActivityType } from '../types/social';

interface SocialStore {
  friends: Friendship[];
  friendRequests: FriendRequest[];
  activityFeed: FriendActivity[];
  isLoading: boolean;
  
  sendFriendRequest: (userId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  removeFriend: (friendshipId: string) => void;
  getFriends: () => Friendship[];
  getPendingRequests: () => FriendRequest[];
  getActivityFeed: () => FriendActivity[];
}

const mockUsers: UserProfile[] = [
  {
    id: 'user_1',
    displayName: 'Sarah Johnson',
    photoURL: null,
    level: 15,
    totalXp: 2450,
    streak: 23,
    healthScore: 87,
    lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'user_2',
    displayName: 'Mike Chen',
    photoURL: null,
    level: 22,
    totalXp: 4800,
    streak: 45,
    healthScore: 92,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'user_3',
    displayName: 'Emma Wilson',
    photoURL: null,
    level: 8,
    totalXp: 890,
    streak: 7,
    healthScore: 75,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'user_4',
    displayName: 'David Brown',
    photoURL: null,
    level: 30,
    totalXp: 8200,
    streak: 89,
    healthScore: 95,
    lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'user_5',
    displayName: 'Lisa Martinez',
    photoURL: null,
    level: 12,
    totalXp: 1800,
    streak: 14,
    healthScore: 81,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

const generateMockActivity = (): FriendActivity[] => {
  const activities: FriendActivity[] = [
    {
      id: 'act_1',
      userId: 'user_2',
      user: mockUsers[1],
      type: 'achievement_unlocked',
      details: 'Unlocked "Heart Healthy" achievement!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 'act_2',
      userId: 'user_4',
      user: mockUsers[3],
      type: 'level_up',
      details: 'Reached Level 30!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'act_3',
      userId: 'user_1',
      user: mockUsers[0],
      type: 'streak_milestone',
      details: 'Hit a 20-day streak!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: 'act_4',
      userId: 'user_3',
      user: mockUsers[2],
      type: 'challenge_completed',
      details: 'Completed "Step Master" challenge!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
      id: 'act_5',
      userId: 'user_5',
      user: mockUsers[4],
      type: 'health_milestone',
      details: 'Achieved health score of 80!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
    {
      id: 'act_6',
      userId: 'user_2',
      user: mockUsers[1],
      type: 'achievement_unlocked',
      details: 'Unlocked "Sleep Champion" achievement!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ];
  return activities;
};

const generateMockFriends = (): Friendship[] => {
  return [
    {
      id: 'friend_1',
      userId: 'current_user',
      friendId: 'user_1',
      status: 'accepted',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      friend: mockUsers[0],
    },
    {
      id: 'friend_2',
      userId: 'current_user',
      friendId: 'user_2',
      status: 'accepted',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
      friend: mockUsers[1],
    },
    {
      id: 'friend_3',
      userId: 'current_user',
      friendId: 'user_4',
      status: 'accepted',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      friend: mockUsers[3],
    },
  ];
};

const generateMockRequests = (): FriendRequest[] => {
  return [
    {
      id: 'req_1',
      fromUserId: 'user_3',
      fromUser: mockUsers[2],
      toUserId: 'current_user',
      status: 'pending',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'req_2',
      fromUserId: 'user_5',
      fromUser: mockUsers[4],
      toUserId: 'current_user',
      status: 'pending',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
  ];
};

export const useSocialStore = create<SocialStore>((set, get) => ({
  friends: generateMockFriends(),
  friendRequests: generateMockRequests(),
  activityFeed: generateMockActivity(),
  isLoading: false,

  sendFriendRequest: (userId: string) => {
    console.log('Sending friend request to:', userId);
  },

  acceptFriendRequest: (requestId: string) => {
    set(state => {
      const request = state.friendRequests.find(r => r.id === requestId);
      if (!request) return state;

      const newFriend: Friendship = {
        id: `friend_${Date.now()}`,
        userId: 'current_user',
        friendId: request.fromUserId,
        status: 'accepted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        friend: request.fromUser,
      };

      const activity: FriendActivity = {
        id: `act_${Date.now()}`,
        userId: request.fromUserId,
        user: request.fromUser,
        type: 'joined',
        details: 'Started their health journey!',
        timestamp: new Date().toISOString(),
      };

      return {
        friends: [...state.friends, newFriend],
        friendRequests: state.friendRequests.filter(r => r.id !== requestId),
        activityFeed: [activity, ...state.activityFeed],
      };
    });
  },

  rejectFriendRequest: (requestId: string) => {
    set(state => ({
      friendRequests: state.friendRequests.filter(r => r.id !== requestId),
    }));
  },

  removeFriend: (friendshipId: string) => {
    set(state => ({
      friends: state.friends.filter(f => f.id !== friendshipId),
    }));
  },

  getFriends: () => {
    return get().friends;
  },

  getPendingRequests: () => {
    return get().friendRequests.filter(r => r.status === 'pending');
  },

  getActivityFeed: () => {
    return get().activityFeed;
  },
}));

export default useSocialStore;
