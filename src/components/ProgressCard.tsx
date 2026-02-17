import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants';
import { useGamificationStore } from '../stores';

export const ProgressCard: React.FC = () => {
  const { progress, getLevelProgress, currency, avatar } = useGamificationStore();
  
  const getStreakEmoji = () => {
    if (progress.streak >= 100) return '🔥🔥🔥';
    if (progress.streak >= 30) return '🔥🔥';
    if (progress.streak >= 7) return '🔥';
    return '⭐';
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.levelSection}>
        <View style={styles.levelCircle}>
          <Text style={styles.levelNumber}>{progress.level}</Text>
          <Text style={styles.levelLabel}>LVL</Text>
        </View>
        <View style={styles.xpSection}>
          <Text style={styles.xpTitle}>XP Progress</Text>
          <View style={styles.xpBarContainer}>
            <View style={styles.xpBarBackground}>
              <View 
                style={[
                  styles.xpBarFill, 
                  { width: `${getLevelProgress()}%` }
                ]} 
              />
            </View>
            <Text style={styles.xpText}>
              {progress.xp} / {progress.xpToNextLevel}
            </Text>
          </View>
          <Text style={styles.totalXp}>Total: {progress.totalXp.toLocaleString()} XP</Text>
        </View>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>{getStreakEmoji()}</Text>
          <Text style={styles.statValue}>{progress.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>🪙</Text>
          <Text style={styles.statValue}>{currency.coins}</Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>💎</Text>
          <Text style={styles.statValue}>{currency.gems}</Text>
          <Text style={styles.statLabel}>Gems</Text>
        </View>
      </View>
      
      <View style={styles.avatarStatus}>
        <Text style={styles.avatarEmoji}>
          {avatar.mood === 'happy' && '😊'}
          {avatar.mood === 'energized' && '⚡'}
          {avatar.mood === 'tired' && '😴'}
          {avatar.mood === 'sick' && '🤒'}
          {avatar.mood === 'neutral' && '😐'}
        </Text>
        <View style={styles.avatarBars}>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>⚡ Energy</Text>
            <View style={styles.miniBarBackground}>
              <View style={[styles.miniBarFill, { width: `${avatar.energy}%`, backgroundColor: COLORS.warning }]} />
            </View>
          </View>
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>❤️ Health</Text>
            <View style={styles.miniBarBackground}>
              <View style={[styles.miniBarFill, { width: `${avatar.health}%`, backgroundColor: COLORS.heartRate }]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    margin: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  levelCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  levelNumber: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  levelLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  xpSection: {
    flex: 1,
  },
  xpTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  xpBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: SPACING.sm,
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  xpText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    minWidth: 60,
  },
  totalXp: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  avatarStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
  },
  avatarEmoji: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  avatarBars: {
    flex: 1,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  barLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    width: 70,
  },
  miniBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default ProgressCard;
