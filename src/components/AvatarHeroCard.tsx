import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { AvataaarsAvatar } from './avatar/AvataaarsAvatar';
import { AvatarEditor } from './avatar/AvatarEditor';
import { useAvatarStore } from '../stores/avatarStore';
import { useGamificationStore } from '../stores';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants';
import { calculateOverallMuscleHealth, getRecommendedMuscles } from '../utils/muscleTracker';

interface AvatarHeroCardProps {
  onCustomize?: () => void;
  useZAnatomy?: boolean;
}

type ViewMode = 'avatar' | 'muscles';

export const AvatarHeroCard: React.FC<AvatarHeroCardProps> = ({ onCustomize, useZAnatomy = false }) => {
  const { muscleGroups } = useAvatarStore();
  const { avatar } = useGamificationStore();
  const [showEditor, setShowEditor] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('avatar');
  
  const muscleHealth = calculateOverallMuscleHealth(muscleGroups);
  const recommendedMuscles = getRecommendedMuscles(muscleGroups);
  
  const getMoodEmoji = () => {
    switch (avatar.mood) {
      case 'happy': return '😊';
      case 'energized': return '⚡';
      case 'tired': return '😴';
      case 'sick': return '🤒';
      default: return '😐';
    }
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'avatar' ? 'muscles' : 'avatar');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Your Digital Twin</Text>
          <Text style={styles.subtitle}>
            {viewMode === 'avatar' ? 'Tap for Muscles Anatomy' : 'Muscles Anatomy'}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <View style={styles.moodContainer}>
            <Text style={styles.moodEmoji}>{getMoodEmoji()}</Text>
          </View>
          <Pressable style={styles.editButton} onPress={() => setShowEditor(true)}>
            <Text style={styles.editButtonText}>✏️</Text>
          </Pressable>
        </View>
      </View>
      
      <Pressable style={styles.avatarSection} onPress={toggleViewMode}>
        {viewMode === 'avatar' ? (
          <AvataaarsAvatar size={180} />
        ) : (
          <View style={styles.musclesView}>
            <Text style={styles.stickFigure}>🧍</Text>
            <Text style={styles.musclesText}>Muscles Anatomy</Text>
          </View>
        )}
      </Pressable>
      
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{muscleHealth}%</Text>
          <Text style={styles.statLabel}>Muscle Health</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{viewMode === 'avatar' ? 'Avatar' : 'Muscles'}</Text>
          <Text style={styles.statLabel}>View Mode</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue} numberOfLines={1}>
            {recommendedMuscles[0] || 'All good'}
          </Text>
          <Text style={styles.statLabel}>Focus Area</Text>
        </View>
      </View>

      <AvatarEditor 
        visible={showEditor} 
        onClose={() => setShowEditor(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    marginHorizontal: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodContainer: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  moodEmoji: {
    fontSize: 20,
  },
  editButton: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
  },
  editButtonText: {
    fontSize: 18,
  },
  avatarSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    backgroundColor: '#f0f0f0',
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    minHeight: 200,
  },
  musclesView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickFigure: {
    fontSize: 100,
    marginBottom: 10,
  },
  musclesText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: SPACING.xs,
  },
  statValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },
});

export default AvatarHeroCard;