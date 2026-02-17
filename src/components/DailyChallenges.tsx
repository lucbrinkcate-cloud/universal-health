import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants';
import { useGamificationStore } from '../stores';
import { DailyChallenge } from '../types';

interface ChallengeCardProps {
  challenge: DailyChallenge;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const progress = Math.min(100, (challenge.current / challenge.target) * 100);
  
  const getChallengeIcon = (type: string): string => {
    switch (type) {
      case 'steps':
        return '👟';
      case 'sleep':
        return '😴';
      case 'heart':
        return '❤️';
      case 'hydration':
        return '💧';
      case 'meditation':
        return '🧘';
      default:
        return '🎯';
    }
  };
  
  const formatTarget = (type: string, target: number): string => {
    switch (type) {
      case 'steps':
        return `${target.toLocaleString()} steps`;
      case 'sleep':
        return `${Math.floor(target / 60)}h ${target % 60}m`;
      case 'heart':
        return 'Healthy HR';
      case 'hydration':
        return `${target}ml`;
      case 'meditation':
        return `${target} min`;
      default:
        return target.toString();
    }
  };
  
  const formatProgress = (type: string, current: number): string => {
    switch (type) {
      case 'steps':
        return `${current.toLocaleString()}`;
      case 'sleep':
        return `${Math.floor(current / 60)}h ${current % 60}m`;
      case 'heart':
        return current >= 1 ? '✓' : '○';
      case 'hydration':
        return `${current}ml`;
      case 'meditation':
        return `${current} min`;
      default:
        return current.toString();
    }
  };

  return (
    <View style={[styles.card, challenge.completed && styles.cardCompleted]}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{getChallengeIcon(challenge.type)}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{challenge.title}</Text>
          <Text style={styles.description}>{challenge.description}</Text>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${progress}%` },
              challenge.completed && styles.progressBarCompleted
            ]} 
          />
        </View>
        <View style={styles.progressText}>
          <Text style={styles.progressValue}>
            {formatProgress(challenge.type, challenge.current)} / {formatTarget(challenge.type, challenge.target)}
          </Text>
          <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
        </View>
      </View>
      
      <View style={styles.rewards}>
        <View style={styles.rewardItem}>
          <Text style={styles.rewardIcon}>⭐</Text>
          <Text style={styles.rewardValue}>+{challenge.reward.xp}</Text>
        </View>
        <View style={styles.rewardItem}>
          <Text style={styles.rewardIcon}>🪙</Text>
          <Text style={styles.rewardValue}>+{challenge.reward.coins}</Text>
        </View>
      </View>
      
      {challenge.completed && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>✓ Complete</Text>
        </View>
      )}
    </View>
  );
};

export const DailyChallenges: React.FC = () => {
  const { dailyChallenges, refreshDailyChallenges } = useGamificationStore();
  
  const completedCount = dailyChallenges.filter(c => c.completed).length;
  const totalCount = dailyChallenges.length;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Daily Challenges</Text>
          <Text style={styles.subtitle}>
            {completedCount} / {totalCount} Completed
          </Text>
        </View>
        <Pressable style={styles.refreshButton} onPress={refreshDailyChallenges}>
          <Text style={styles.refreshText}>🔄 Refresh</Text>
        </Pressable>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${(completedCount / totalCount) * 100}%` }
          ]} 
        />
      </View>
      
      {dailyChallenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
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
  refreshButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  refreshText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardCompleted: {
    borderWidth: 2,
    borderColor: COLORS.success,
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
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
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  progressSection: {
    marginBottom: SPACING.md,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressBarCompleted: {
    backgroundColor: COLORS.success,
  },
  progressText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  progressPercent: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  rewards: {
    flexDirection: 'row',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  rewardIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  rewardValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  completedBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  completedText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    fontWeight: '600',
  },
});

export default DailyChallenges;
