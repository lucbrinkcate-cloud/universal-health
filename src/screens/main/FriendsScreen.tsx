import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  Image,
} from 'react-native';
import { useSocialStore } from '../../stores';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { UserProfile, Friendship, FriendRequest, FriendActivity } from '../../types/social';

type TabType = 'friends' | 'requests' | 'activity';

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

const getActivityIcon = (type: FriendActivity['type']): string => {
  switch (type) {
    case 'achievement_unlocked': return '🏆';
    case 'challenge_completed': return '✅';
    case 'level_up': return '⬆️';
    case 'streak_milestone': return '🔥';
    case 'health_milestone': return '❤️';
    case 'joined': return '👋';
    default: return '📊';
  }
};

const FriendCard: React.FC<{ friendship: Friendship; onRemove: (id: string) => void }> = ({ friendship, onRemove }) => {
  const friend = friendship.friend;
  if (!friend) return null;

  return (
    <View style={styles.friendCard}>
      <View style={styles.avatarContainer}>
        {friend.photoURL ? (
          <Image source={{ uri: friend.photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{friend.displayName.charAt(0)}</Text>
          </View>
        )}
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{friend.displayName}</Text>
        <View style={styles.friendStats}>
          <Text style={styles.friendStat}>Lvl {friend.level}</Text>
          <Text style={styles.friendStat}>•</Text>
          <Text style={styles.friendStat}>🔥 {friend.streak}</Text>
          <Text style={styles.friendStat}>•</Text>
          <Text style={styles.friendStat}>❤️ {friend.healthScore}</Text>
        </View>
        <Text style={styles.lastActive}>Active {formatTimeAgo(friend.lastActive)}</Text>
      </View>
      <Pressable 
        style={styles.removeButton}
        onPress={() => onRemove(friendship.id)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </Pressable>
    </View>
  );
};

const RequestCard: React.FC<{ request: FriendRequest; onAccept: (id: string) => void; onReject: (id: string) => void }> = ({ 
  request, 
  onAccept, 
  onReject 
}) => {
  const user = request.fromUser;

  return (
    <View style={styles.requestCard}>
      <View style={styles.avatarContainer}>
        {user.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{user.displayName.charAt(0)}</Text>
          </View>
        )}
      </View>
      <View style={styles.requestInfo}>
        <Text style={styles.requestName}>{user.displayName}</Text>
        <View style={styles.friendStats}>
          <Text style={styles.friendStat}>Lvl {user.level}</Text>
          <Text style={styles.friendStat}>•</Text>
          <Text style={styles.friendStat}>🔥 {user.streak}</Text>
          <Text style={styles.friendStat}>•</Text>
          <Text style={styles.friendStat}>❤️ {user.healthScore}</Text>
        </View>
        <Text style={styles.requestTime}>{formatTimeAgo(request.createdAt)}</Text>
      </View>
      <View style={styles.requestActions}>
        <Pressable style={styles.acceptButton} onPress={() => onAccept(request.id)}>
          <Text style={styles.acceptButtonText}>✓</Text>
        </Pressable>
        <Pressable style={styles.rejectButton} onPress={() => onReject(request.id)}>
          <Text style={styles.rejectButtonText}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
};

const ActivityCard: React.FC<{ activity: FriendActivity }> = ({ activity }) => {
  return (
    <View style={styles.activityCard}>
      <View style={styles.activityIconContainer}>
        <Text style={styles.activityIcon}>{getActivityIcon(activity.type)}</Text>
      </View>
      <View style={styles.activityInfo}>
        <Text style={styles.activityUser}>{activity.user.displayName}</Text>
        <Text style={styles.activityDetails}>{activity.details}</Text>
        <Text style={styles.activityTime}>{formatTimeAgo(activity.timestamp)}</Text>
      </View>
    </View>
  );
};

export const FriendsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const { friends, friendRequests, activityFeed, acceptFriendRequest, rejectFriendRequest, removeFriend } = useSocialStore();

  const renderFriendsTab = () => (
    <View style={styles.tabContent}>
      {friends.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyTitle}>No Friends Yet</Text>
          <Text style={styles.emptyText}>Connect with others to track progress together!</Text>
        </View>
      ) : (
        friends.map(friendship => (
          <FriendCard 
            key={friendship.id} 
            friendship={friendship} 
            onRemove={removeFriend} 
          />
        ))
      )}
    </View>
  );

  const renderRequestsTab = () => (
    <View style={styles.tabContent}>
      {friendRequests.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📬</Text>
          <Text style={styles.emptyTitle}>No Pending Requests</Text>
          <Text style={styles.emptyText}>Friend requests will appear here.</Text>
        </View>
      ) : (
        friendRequests.map(request => (
          <RequestCard 
            key={request.id} 
            request={request} 
            onAccept={acceptFriendRequest}
            onReject={rejectFriendRequest}
          />
        ))
      )}
    </View>
  );

  const renderActivityTab = () => (
    <View style={styles.tabContent}>
      {activityFeed.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📡</Text>
          <Text style={styles.emptyTitle}>No Activity</Text>
          <Text style={styles.emptyText}>Your friends' activities will appear here.</Text>
        </View>
      ) : (
        activityFeed.map(activity => (
          <ActivityCard key={activity.id} activity={activity} />
        ))
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
      </View>

      <View style={styles.tabs}>
        <Pressable 
          style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>
            👥 Friends ({friends.length})
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
            📬 Requests ({friendRequests.length})
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'activity' && styles.tabActive]}
          onPress={() => setActiveTab('activity')}
        >
          <Text style={[styles.tabText, activeTab === 'activity' && styles.tabTextActive]}>
            📡 Activity
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'friends' && renderFriendsTab()}
        {activeTab === 'requests' && renderRequestsTab()}
        {activeTab === 'activity' && renderActivityTab()}
      </ScrollView>
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
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
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
  content: {
    flex: 1,
  },
  tabContent: {
    padding: SPACING.md,
    paddingTop: 0,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  avatarContainer: {
    marginRight: SPACING.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  friendStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  friendStat: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.xs,
  },
  lastActive: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  requestTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  requestActions: {
    flexDirection: 'row',
  },
  acceptButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  acceptButtonText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    fontWeight: '700',
  },
  rejectButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButtonText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    fontWeight: '700',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  activityIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  activityIcon: {
    fontSize: 24,
  },
  activityInfo: {
    flex: 1,
  },
  activityUser: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  activityDetails: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  activityTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default FriendsScreen;
