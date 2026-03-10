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
import { useLeaderboardStore } from '../../stores';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { LeaderboardEntry, LeaderboardCategory } from '../../types/leaderboard';

type LeaderboardType = 'weekly' | 'global' | 'category';

const CATEGORIES: { value: LeaderboardCategory; label: string }[] = [
  { value: 'steps', label: '👟 Steps' },
  { value: 'sleep', label: '😴 Sleep' },
  { value: 'heart', label: '❤️ Heart' },
  { value: 'streak', label: '🔥 Streak' },
  { value: 'xp', label: '⭐ XP' },
  { value: 'health_score', label: '💪 Health' },
];

const LeaderboardItem: React.FC<{ entry: LeaderboardEntry; unit?: string }> = ({ entry, unit }) => {
  const getRankStyle = (rank: number) => {
    if (rank === 1) return { backgroundColor: '#FFD700', color: '#000' };
    if (rank === 2) return { backgroundColor: '#C0C0C0', color: '#000' };
    if (rank === 3) return { backgroundColor: '#CD7F32', color: '#000' };
    return { backgroundColor: COLORS.surface, color: COLORS.text };
  };

  const rankStyle = getRankStyle(entry.rank);
  const rankChange = entry.previousRank - entry.rank;
  const isTopThree = entry.rank <= 3;

  return (
    <View style={[styles.leaderboardItem, entry.isCurrentUser && styles.currentUserItem]}>
      <View style={[styles.rankBadge, { backgroundColor: rankStyle.backgroundColor }]}>
        <Text style={[styles.rankText, { color: rankStyle.color }]}>
          {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
        </Text>
      </View>
      <View style={styles.userInfo}>
        {entry.photoURL ? (
          <Image source={{ uri: entry.photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{entry.displayName.charAt(0)}</Text>
          </View>
        )}
        <View style={styles.userDetails}>
          <Text style={[styles.userName, entry.isCurrentUser && styles.currentUserName]}>
            {entry.displayName}
          </Text>
          {rankChange !== 0 && (
            <Text style={[styles.rankChange, rankChange > 0 ? styles.rankUp : styles.rankDown]}>
              {rankChange > 0 ? `↑${rankChange}` : `↓${Math.abs(rankChange)}`}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{entry.value.toLocaleString()}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </View>
  );
};

const TopThreePodium: React.FC<{ entries: LeaderboardEntry[] }> = ({ entries }) => {
  const topThree = entries.slice(0, 3);
  
  return (
    <View style={styles.podiumContainer}>
      {topThree[1] && (
        <View style={[styles.podiumItem, styles.podiumSecond]}>
          <View style={styles.podiumAvatarContainer}>
            <View style={styles.podiumAvatar}>
              <Text style={styles.podiumAvatarText}>{topThree[1].displayName.charAt(0)}</Text>
            </View>
          </View>
          <Text style={styles.podiumName}>{topThree[1].displayName}</Text>
          <Text style={styles.podiumValue}>{topThree[1].value.toLocaleString()}</Text>
          <View style={[styles.podiumStand, styles.podiumStandSecond]}>
            <Text style={styles.podiumRank}>2</Text>
          </View>
        </View>
      )}
      {topThree[0] && (
        <View style={[styles.podiumItem, styles.podiumFirst]}>
          <Text style={styles.crown}>👑</Text>
          <View style={styles.podiumAvatarContainer}>
            <View style={[styles.podiumAvatar, styles.podiumAvatarFirst]}>
              <Text style={styles.podiumAvatarText}>{topThree[0].displayName.charAt(0)}</Text>
            </View>
          </View>
          <Text style={styles.podiumName}>{topThree[0].displayName}</Text>
          <Text style={styles.podiumValue}>{topThree[0].value.toLocaleString()}</Text>
          <View style={[styles.podiumStand, styles.podiumStandFirst]}>
            <Text style={styles.podiumRank}>1</Text>
          </View>
        </View>
      )}
      {topThree[2] && (
        <View style={[styles.podiumItem, styles.podiumThird]}>
          <View style={styles.podiumAvatarContainer}>
            <View style={styles.podiumAvatar}>
              <Text style={styles.podiumAvatarText}>{topThree[2].displayName.charAt(0)}</Text>
            </View>
          </View>
          <Text style={styles.podiumName}>{topThree[2].displayName}</Text>
          <Text style={styles.podiumValue}>{topThree[2].value.toLocaleString()}</Text>
          <View style={[styles.podiumStand, styles.podiumStandThird]}>
            <Text style={styles.podiumRank}>3</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export const LeaderboardScreen: React.FC = () => {
  const [activeType, setActiveType] = useState<LeaderboardType>('weekly');
  const [activeCategory, setActiveCategory] = useState<LeaderboardCategory>('steps');
  const { leaderboards } = useLeaderboardStore();

  const getCurrentLeaderboard = () => {
    if (activeType === 'weekly') return leaderboards[0];
    if (activeType === 'global') return leaderboards[1];
    return leaderboards[2];
  };

  const currentLeaderboard = getCurrentLeaderboard();
  const entries = currentLeaderboard?.entries || [];

  const getUnit = () => {
    if (activeType === 'category') {
      const categoryData: Record<LeaderboardCategory, string> = {
        steps: 'steps',
        sleep: 'pts',
        heart: 'bpm',
        streak: 'days',
        xp: 'xp',
        health_score: 'pts',
      };
      return categoryData[activeCategory];
    }
    return 'xp';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboards</Text>
        <Text style={styles.subtitle}>{currentLeaderboard?.description}</Text>
      </View>

      <View style={styles.typeTabs}>
        <Pressable 
          style={[styles.typeTab, activeType === 'weekly' && styles.typeTabActive]}
          onPress={() => setActiveType('weekly')}
        >
          <Text style={[styles.typeTabText, activeType === 'weekly' && styles.typeTabTextActive]}>
            📅 Weekly
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.typeTab, activeType === 'global' && styles.typeTabActive]}
          onPress={() => setActiveType('global')}
        >
          <Text style={[styles.typeTabText, activeType === 'global' && styles.typeTabTextActive]}>
            🌍 Global
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.typeTab, activeType === 'category' && styles.typeTabActive]}
          onPress={() => setActiveType('category')}
        >
          <Text style={[styles.typeTabText, activeType === 'category' && styles.typeTabTextActive]}>
            📊 Categories
          </Text>
        </Pressable>
      </View>

      {activeType === 'category' && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.value}
              style={[styles.categoryChip, activeCategory === cat.value && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat.value)}
            >
              <Text style={[styles.categoryChipText, activeCategory === cat.value && styles.categoryChipTextActive]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TopThreePodium entries={entries} />

        <View style={styles.leaderboardList}>
          {entries.slice(3).map((entry) => (
            <LeaderboardItem key={entry.userId} entry={entry} unit={getUnit()} />
          ))}
        </View>
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
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  typeTabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  typeTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  typeTabActive: {
    borderBottomColor: COLORS.primary,
  },
  typeTabText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  typeTabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoryScroll: {
    maxHeight: 50,
    marginBottom: SPACING.md,
  },
  categoryContainer: {
    paddingHorizontal: SPACING.md,
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: COLORS.textLight,
  },
  content: {
    flex: 1,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  podiumItem: {
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  podiumFirst: {
    marginTop: 0,
  },
  podiumSecond: {
    marginTop: SPACING.lg,
  },
  podiumThird: {
    marginTop: SPACING.xl,
  },
  crown: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  podiumAvatarContainer: {
    marginBottom: SPACING.xs,
  },
  podiumAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumAvatarFirst: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
  },
  podiumAvatarText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  podiumName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  podiumValue: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  podiumStand: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: BORDER_RADIUS.md,
    borderTopRightRadius: BORDER_RADIUS.md,
  },
  podiumStandFirst: {
    height: 50,
    backgroundColor: '#FFD700',
  },
  podiumStandSecond: {
    height: 35,
    backgroundColor: '#C0C0C0',
  },
  podiumStandThird: {
    height: 25,
    backgroundColor: '#CD7F32',
  },
  podiumRank: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  leaderboardList: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  rankText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  avatarText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  currentUserName: {
    color: COLORS.primary,
  },
  rankChange: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
  },
  rankUp: {
    color: COLORS.success,
  },
  rankDown: {
    color: COLORS.error,
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  unit: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
});

export default LeaderboardScreen;
