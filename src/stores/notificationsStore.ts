import { create } from 'zustand';
import * as Notifications from 'expo-notifications';
import {
  AppNotification,
  NotificationPreferences,
  NotificationType,
  AchievementNotificationData,
  DailyChallengeNotificationData,
  FriendActivityNotificationData,
  StreakReminderData,
  LevelUpData,
} from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationsStore {
  notifications: AppNotification[];
  preferences: NotificationPreferences;
  expoPushToken: string | null;
  
  requestPermissions: () => Promise<boolean>;
  scheduleLocalNotification: (
    title: string,
    body: string,
    data?: Record<string, unknown>
  ) => Promise<string>;
  
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read' | 'dismissed'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  
  sendAchievementNotification: (data: AchievementNotificationData) => Promise<void>;
  sendDailyChallengeNotification: (data: DailyChallengeNotificationData) => Promise<void>;
  sendFriendActivityNotification: (data: FriendActivityNotificationData) => Promise<void>;
  sendStreakReminderNotification: (data: StreakReminderData) => Promise<void>;
  sendLevelUpNotification: (data: LevelUpData) => Promise<void>;
  
  getUnreadCount: () => number;
  getNotificationsByType: (type: NotificationType) => AppNotification[];
}

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case 'achievement_unlocked':
      return '🏆';
    case 'daily_challenge':
      return '🎯';
    case 'friend_activity':
      return '👥';
    case 'streak_reminder':
      return '🔥';
    case 'level_up':
      return '⬆️';
    case 'system':
      return '📢';
    default:
      return '🔔';
  }
};

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],
  
  preferences: {
    achievements: true,
    dailyChallenges: true,
    friendActivity: true,
    streakReminders: true,
    levelUp: true,
    pushEnabled: true,
  },
  
  expoPushToken: null,
  
  requestPermissions: async (): Promise<boolean> => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  },
  
  scheduleLocalNotification: async (
    title: string,
    body: string,
    data?: Record<string, unknown>
  ): Promise<string> => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null,
      });
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return '';
    }
  },
  
  addNotification: (notification) => {
    const newNotification: AppNotification = {
      ...notification,
      id: generateId(),
      read: false,
      dismissed: false,
      createdAt: new Date().toISOString(),
    };
    
    set(state => ({
      notifications: [newNotification, ...state.notifications],
    }));
  },
  
  markAsRead: (notificationId: string) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
  },
  
  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
    }));
  },
  
  dismissNotification: (notificationId: string) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === notificationId ? { ...n, dismissed: true } : n
      ),
    }));
  },
  
  clearAllNotifications: () => {
    set({ notifications: [] });
  },
  
  updatePreferences: (preferences) => {
    set(state => ({
      preferences: { ...state.preferences, ...preferences },
    }));
  },
  
  sendAchievementNotification: async (data) => {
    const { preferences } = get();
    if (!preferences.achievements || !preferences.pushEnabled) return;
    
    const title = `🏆 Achievement Unlocked!`;
    const body = `You've earned: ${data.achievementName} (+${data.reward.xp} XP, +${data.reward.coins} coins)`;
    
    await get().scheduleLocalNotification(title, body, {
      type: 'achievement_unlocked',
      ...data,
    });
    
    get().addNotification({
      type: 'achievement_unlocked',
      title,
      body,
      data: { type: 'achievement_unlocked', ...data },
      priority: 'high',
    });
  },
  
  sendDailyChallengeNotification: async (data) => {
    const { preferences } = get();
    if (!preferences.dailyChallenges || !preferences.pushEnabled) return;
    
    const progress = Math.round((data.current / data.target) * 100);
    const title = `🎯 Daily Challenge`;
    const body = `${data.challengeTitle}: ${progress}% complete`;
    
    await get().scheduleLocalNotification(title, body, {
      type: 'daily_challenge',
      ...data,
    });
    
    get().addNotification({
      type: 'daily_challenge',
      title,
      body,
      data: { type: 'daily_challenge', ...data },
      priority: 'normal',
    });
  },
  
  sendFriendActivityNotification: async (data) => {
    const { preferences } = get();
    if (!preferences.friendActivity || !preferences.pushEnabled) return;
    
    const title = `👥 Friend Activity`;
    const body = `${data.friendName}: ${data.activity}`;
    
    await get().scheduleLocalNotification(title, body, {
      type: 'friend_activity',
      ...data,
    });
    
    get().addNotification({
      type: 'friend_activity',
      title,
      body,
      data: { type: 'friend_activity', ...data },
      priority: 'low',
    });
  },
  
  sendStreakReminderNotification: async (data) => {
    const { preferences } = get();
    if (!preferences.streakReminders || !preferences.pushEnabled) return;
    
    const title = `🔥 Keep Your Streak!`;
    const body = `Your ${data.currentStreak} day streak is at risk. Complete a challenge today!`;
    
    await get().scheduleLocalNotification(title, body, {
      type: 'streak_reminder',
      ...data,
    });
    
    get().addNotification({
      type: 'streak_reminder',
      title,
      body,
      data: { type: 'streak_reminder', ...data },
      priority: 'high',
    });
  },
  
  sendLevelUpNotification: async (data) => {
    const { preferences } = get();
    if (!preferences.levelUp || !preferences.pushEnabled) return;
    
    const title = `⬆️ Level Up!`;
    const body = `Congratulations! You've reached level ${data.newLevel}!`;
    
    await get().scheduleLocalNotification(title, body, {
      type: 'level_up',
      ...data,
    });
    
    get().addNotification({
      type: 'level_up',
      title,
      body,
      data: { type: 'level_up', ...data },
      priority: 'high',
    });
  },
  
  getUnreadCount: () => {
    const { notifications } = get();
    return notifications.filter(n => !n.read && !n.dismissed).length;
  },
  
  getNotificationsByType: (type) => {
    const { notifications } = get();
    return notifications.filter(n => n.type === type && !n.dismissed);
  },
}));

export default useNotificationsStore;
