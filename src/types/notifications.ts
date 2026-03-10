export type NotificationType = 
  | 'achievement_unlocked'
  | 'daily_challenge'
  | 'friend_activity'
  | 'streak_reminder'
  | 'level_up'
  | 'system';

export type NotificationPriority = 'low' | 'normal' | 'high';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  priority: NotificationPriority;
  read: boolean;
  dismissed: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  achievements: boolean;
  dailyChallenges: boolean;
  friendActivity: boolean;
  streakReminders: boolean;
  levelUp: boolean;
  pushEnabled: boolean;
}

export interface NotificationSchedule {
  id: string;
  notificationId: string;
  triggerAt: string;
  scheduled: boolean;
}

export interface AchievementNotificationData {
  achievementId: string;
  achievementName: string;
  reward: {
    xp: number;
    coins: number;
  };
}

export interface DailyChallengeNotificationData {
  challengeId: string;
  challengeTitle: string;
  target: number;
  current: number;
}

export interface FriendActivityNotificationData {
  friendId: string;
  friendName: string;
  activity: string;
}

export interface StreakReminderData {
  currentStreak: number;
  lastActiveDate: string;
}

export interface LevelUpData {
  newLevel: number;
  totalXp: number;
}
