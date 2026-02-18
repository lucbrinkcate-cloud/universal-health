import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { useNotificationsStore } from '../../stores';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { AppNotification, NotificationType } from '../../types';

type TabType = 'all' | 'achievements' | 'challenges' | 'friends';

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

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
};

interface NotificationItemProps {
  notification: AppNotification;
  onPress: () => void;
  onDismiss: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onDismiss,
}) => (
  <Pressable
    style={[styles.notificationItem, !notification.read && styles.notificationUnread]}
    onPress={onPress}
    onLongPress={onDismiss}
  >
    <View style={styles.notificationIcon}>
      <Text style={styles.notificationIconText}>
        {getNotificationIcon(notification.type)}
      </Text>
    </View>
    <View style={styles.notificationContent}>
      <Text style={[styles.notificationTitle, !notification.read && styles.notificationTitleUnread]}>
        {notification.title}
      </Text>
      <Text style={styles.notificationBody} numberOfLines={2}>
        {notification.body}
      </Text>
      <Text style={styles.notificationTime}>
        {formatTimeAgo(notification.createdAt)}
      </Text>
    </View>
    {!notification.read && <View style={styles.unreadDot} />}
  </Pressable>
);

export const NotificationsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const {
    notifications,
    preferences,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAllNotifications,
    updatePreferences,
    requestPermissions,
    sendAchievementNotification,
    sendDailyChallengeNotification,
    sendFriendActivityNotification,
    sendStreakReminderNotification,
    sendLevelUpNotification,
  } = useNotificationsStore();

  useEffect(() => {
    requestPermissions();
  }, []);

  const filteredNotifications = notifications.filter(n => {
    if (n.dismissed) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'achievements') return n.type === 'achievement_unlocked' || n.type === 'level_up';
    if (activeTab === 'challenges') return n.type === 'daily_challenge' || n.type === 'streak_reminder';
    if (activeTab === 'friends') return n.type === 'friend_activity';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read && !n.dismissed).length;

  const handleNotificationPress = (notification: AppNotification) => {
    markAsRead(notification.id);
  };

  const handleDismiss = (notificationId: string) => {
    Alert.alert(
      'Dismiss Notification',
      'Are you sure you want to dismiss this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Dismiss', style: 'destructive', onPress: () => dismissNotification(notificationId) },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearAllNotifications },
      ]
    );
  };

  const testNotifications = () => {
    sendAchievementNotification({
      achievementId: 'test_achievement',
      achievementName: 'First Steps',
      reward: { xp: 100, coins: 50 },
    });
  };

  const testChallengeNotification = () => {
    sendDailyChallengeNotification({
      challengeId: 'test_challenge',
      challengeTitle: 'Step Master',
      target: 10000,
      current: 7500,
    });
  };

  const testFriendNotification = () => {
    sendFriendActivityNotification({
      friendId: 'friend_1',
      friendName: 'John Doe',
      activity: 'completed a 5k run!',
    });
  };

  const renderNotificationList = () => (
    <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
      {filteredNotifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptySubtitle}>
            You're all caught up! Check back later for updates.
          </Text>
        </View>
      ) : (
        filteredNotifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onPress={() => handleNotificationPress(notification)}
            onDismiss={() => handleDismiss(notification.id)}
          />
        ))
      )}
    </ScrollView>
  );

  const renderSettings = () => (
    <ScrollView style={styles.settingsList} showsVerticalScrollIndicator={false}>
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Push Notifications</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Push Notifications</Text>
          <Switch
            value={preferences.pushEnabled}
            onValueChange={(value) => updatePreferences({ pushEnabled: value })}
            trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
            thumbColor={preferences.pushEnabled ? COLORS.primary : COLORS.textTertiary}
          />
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Notification Types</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Achievements</Text>
          <Switch
            value={preferences.achievements}
            onValueChange={(value) => updatePreferences({ achievements: value })}
            trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
            thumbColor={preferences.achievements ? COLORS.primary : COLORS.textTertiary}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Daily Challenges</Text>
          <Switch
            value={preferences.dailyChallenges}
            onValueChange={(value) => updatePreferences({ dailyChallenges: value })}
            trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
            thumbColor={preferences.dailyChallenges ? COLORS.primary : COLORS.textTertiary}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Friend Activity</Text>
          <Switch
            value={preferences.friendActivity}
            onValueChange={(value) => updatePreferences({ friendActivity: value })}
            trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
            thumbColor={preferences.friendActivity ? COLORS.primary : COLORS.textTertiary}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Streak Reminders</Text>
          <Switch
            value={preferences.streakReminders}
            onValueChange={(value) => updatePreferences({ streakReminders: value })}
            trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
            thumbColor={preferences.streakReminders ? COLORS.primary : COLORS.textTertiary}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Level Up Alerts</Text>
          <Switch
            value={preferences.levelUp}
            onValueChange={(value) => updatePreferences({ levelUp: value })}
            trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
            thumbColor={preferences.levelUp ? COLORS.primary : COLORS.textTertiary}
          />
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Test Notifications</Text>
        <Text style={styles.testDescription}>
          Tap these buttons to test notification delivery:
        </Text>
        <Pressable style={styles.testButton} onPress={testNotifications}>
          <Text style={styles.testButtonText}>Test Achievement 🔔</Text>
        </Pressable>
        <Pressable style={styles.testButton} onPress={testChallengeNotification}>
          <Text style={styles.testButtonText}>Test Challenge 🔔</Text>
        </Pressable>
        <Pressable style={styles.testButton} onPress={testFriendNotification}>
          <Text style={styles.testButtonText}>Test Friend Activity 🔔</Text>
        </Pressable>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <Pressable style={styles.actionButton} onPress={markAllAsRead}>
          <Text style={styles.actionButtonText}>Mark All as Read</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.destructiveButton]} onPress={handleClearAll}>
          <Text style={[styles.actionButtonText, styles.destructiveText]}>Clear All Notifications</Text>
        </Pressable>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            All
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'achievements' && styles.tabActive]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[styles.tabText, activeTab === 'achievements' && styles.tabTextActive]}>
            🏆 Achievements
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'challenges' && styles.tabActive]}
          onPress={() => setActiveTab('challenges')}
        >
          <Text style={[styles.tabText, activeTab === 'challenges' && styles.tabTextActive]}>
            🎯 Challenges
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>
            👥 Friends
          </Text>
        </Pressable>
      </View>

      {activeTab === 'all' ? renderSettings() : renderNotificationList()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
    paddingTop: SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  badge: {
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  notificationUnread: {
    backgroundColor: COLORS.primaryLight + '15',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  notificationIconText: {
    fontSize: 24,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  notificationTitleUnread: {
    fontWeight: '700',
  },
  notificationBody: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  notificationTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  settingsList: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  settingsSection: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  testDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  testButton: {
    backgroundColor: COLORS.primary + '20',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  testButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  destructiveButton: {
    backgroundColor: COLORS.error + '15',
  },
  destructiveText: {
    color: COLORS.error,
  },
});

export default NotificationsScreen;
