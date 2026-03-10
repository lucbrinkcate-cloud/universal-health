import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants';
import { useGamificationStore } from '../stores';
import { Achievement, AchievementTier } from '../types';

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, isUnlocked }) => {
  const getTierColor = (tier: AchievementTier): string => {
    switch (tier) {
      case 'bronze':
        return '#CD7F32';
      case 'silver':
        return '#C0C0C0';
      case 'gold':
        return '#FFD700';
      case 'platinum':
        return '#E5E4E2';
      default:
        return COLORS.textSecondary;
    }
  };
  
  const getTierLabel = (tier: AchievementTier): string => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  return (
    <View style={[styles.card, isUnlocked && styles.cardUnlocked]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${getTierColor(achievement.tier)}20` }]}>
          <Text style={styles.icon}>{achievement.icon}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>{achievement.name}</Text>
          <View style={styles.tierBadge}>
            <Text style={[styles.tierText, { color: getTierColor(achievement.tier) }]}>
              {getTierLabel(achievement.tier)}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.description}>{achievement.description}</Text>
      
      <View style={styles.progressSection}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${achievement.progress}%`, backgroundColor: getTierColor(achievement.tier) }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{achievement.progress}%</Text>
      </View>
      
      <View style={styles.rewards}>
        <Text style={styles.rewardText}>
          +{achievement.reward.xp} XP • +{achievement.reward.coins} 🪙
        </Text>
      </View>
      
      {isUnlocked && (
        <View style={styles.unlockedBadge}>
          <Text style={styles.unlockedText}>✓ Unlocked</Text>
        </View>
      )}
    </View>
  );
};

export const AchievementsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked'>('all');
  const { achievements, getUnlockedAchievements, getAvailableAchievements } = useGamificationStore();
  
  const unlockedAchievements = getUnlockedAchievements();
  const availableAchievements = getAvailableAchievements();
  
  const getFilteredAchievements = (): Achievement[] => {
    switch (activeTab) {
      case 'unlocked':
        return unlockedAchievements;
      case 'locked':
        return availableAchievements;
      default:
        return achievements;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Achievements</Text>
        <Text style={styles.subtitle}>
          {unlockedAchievements.length} / {achievements.length} Unlocked
        </Text>
      </View>
      
      <View style={styles.tabs}>
        <Pressable 
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            All ({achievements.length})
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'unlocked' && styles.tabActive]}
          onPress={() => setActiveTab('unlocked')}
        >
          <Text style={[styles.tabText, activeTab === 'unlocked' && styles.tabTextActive]}>
            Unlocked ({unlockedAchievements.length})
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'locked' && styles.tabActive]}
          onPress={() => setActiveTab('locked')}
        >
          <Text style={[styles.tabText, activeTab === 'locked' && styles.tabTextActive]}>
            Locked ({availableAchievements.length})
          </Text>
        </Pressable>
      </View>
      
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {getFilteredAchievements().map((achievement) => (
          <AchievementCard 
            key={achievement.id} 
            achievement={achievement} 
            isUnlocked={!!achievement.unlockedAt}
          />
        ))}
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
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
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
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  list: {
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    opacity: 0.7,
  },
  cardUnlocked: {
    opacity: 1,
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  tierBadge: {
    alignSelf: 'flex-start',
  },
  tierText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: SPACING.sm,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    minWidth: 35,
  },
  rewards: {
    flexDirection: 'row',
  },
  rewardText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  unlockedBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  unlockedText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    fontWeight: '600',
  },
});

export default AchievementsList;
