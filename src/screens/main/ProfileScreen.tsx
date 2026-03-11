import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore, useThemeStore, useGoalsStore, useHealthStore, useFitnessStore, useCycleStore } from '../../stores';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { CycleTracker } from '../../components/CycleTracker';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, signOut, isLoading } = useAuthStore();
  const { mode, setThemeMode, toggleTheme } = useThemeStore();
  const { goals } = useGoalsStore();
  const { healthData } = useHealthStore();
  const { activities, history: workoutHistory, prs } = useFitnessStore();
  const { settings: cycleSettings } = useCycleStore();

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Demo User';
  const firstName = userName.split(' ')[0];
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              // Error handled in store
            }
          }
        },
      ]
    );
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will show the onboarding screen next time you restart the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          onPress: async () => {
            await AsyncStorage.setItem('@onboarding_complete', 'false');
            Alert.alert('Done', 'Onboarding will show on next app restart.');
          }
        },
      ]
    );
  };

  const isDarkMode = mode === 'dark';

  const calculateProgress = (goal: any): number => {
    if (goal.type === 'weight') {
      // For weight loss, calculate progress from start (79.2) to target
      const startWeight = 79.2;
      const progress = ((startWeight - goal.current) / (startWeight - goal.target)) * 100;
      return Math.min(100, Math.max(0, progress));
    }
    return Math.min(100, Math.max(0, (goal.current / goal.target) * 100));
  };

  const menuItems = [
    { icon: '📱', title: 'Devices', subtitle: 'Connect health devices', onPress: () => navigation.navigate('Devices') },
    { icon: '🔔', title: 'Notifications', subtitle: 'Push notifications settings', onPress: () => navigation.navigate('Notifications') },
    { icon: '🌙', title: 'Dark Mode', subtitle: isDarkMode ? 'Currently enabled' : 'Currently disabled', onPress: toggleTheme, hasSwitch: true, switchValue: isDarkMode },
    { icon: '🔒', title: 'Privacy', subtitle: 'Data and security settings', onPress: () => {} },
    { icon: '📊', title: 'Data Export', subtitle: 'Download your health data', onPress: () => {} },
    { icon: '❓', title: 'Help & Support', subtitle: 'FAQ and contact us', onPress: () => {} },
    { icon: '🔄', title: 'Reset Onboarding', subtitle: 'Show welcome screens again', onPress: handleResetOnboarding },
    { icon: 'ℹ️', title: 'About', subtitle: 'App version and info', onPress: () => {} },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.displayName}>
          {userName}
        </Text>
        <Text style={styles.email}>{user?.email || 'demo@universalhealth.app'}</Text>
      </View>

      {/* Goals Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Active Goals</Text>
        {goals.map((goal) => {
          const progress = calculateProgress(goal);
          return (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalName}>{goal.name}</Text>
                <View style={[styles.goalStatus, { backgroundColor: goal.onTrack ? `${COLORS.success}20` : `${COLORS.warning}20` }]}>
                  <Text style={[styles.goalStatusText, { color: goal.onTrack ? COLORS.success : COLORS.warning }]}>
                    {goal.onTrack ? '✅ On Track' : '⚠️ Behind'}
                  </Text>
                </View>
              </View>
              <View style={styles.goalProgress}>
                <View style={styles.goalStats}>
                  <View>
                    <Text style={styles.goalStatValue}>{goal.current}</Text>
                    <Text style={styles.goalStatLabel}>Current</Text>
                  </View>
                  <View style={styles.goalArrow}>
                    <Text style={styles.goalArrowText}>→</Text>
                  </View>
                  <View>
                    <Text style={[styles.goalStatValue, { color: COLORS.primary }]}>{goal.target}</Text>
                    <Text style={styles.goalStatLabel}>Target</Text>
                  </View>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBg}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { 
                          width: `${progress}%`,
                          backgroundColor: goal.onTrack ? COLORS.primary : COLORS.warning 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Cycle Tracker Section */}
      <View style={styles.section}>
        <CycleTracker />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        {/* Expandable Personal Info */}
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => setExpandedSection(expandedSection === 'personal' ? null : 'personal')}
        >
          <Text style={styles.menuIcon}>👤</Text>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Personal Info</Text>
            <Text style={styles.menuSubtitle}>{userName} · Male · 28 yrs</Text>
          </View>
          <Text style={styles.chevron}>{expandedSection === 'personal' ? '▼' : '›'}</Text>
        </TouchableOpacity>
        
        {expandedSection === 'personal' && (
          <View style={styles.expandedInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{userName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || 'demo@universalhealth.app'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>28 years</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>Male</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Height</Text>
              <Text style={styles.infoValue}>178 cm</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Weight</Text>
              <Text style={styles.infoValue}>77.2 kg</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Blood Type</Text>
              <Text style={styles.infoValue}>O+</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>BMI</Text>
              <Text style={styles.infoValue}>24.4</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>BMR</Text>
              <Text style={styles.infoValue}>1,780 kcal/day</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>TDEE</Text>
              <Text style={styles.infoValue}>2,759 kcal/day</Text>
            </View>
          </View>
        )}

        {/* Expandable Fitness Profile */}
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => setExpandedSection(expandedSection === 'fitness' ? null : 'fitness')}
        >
          <Text style={styles.menuIcon}>💪</Text>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Fitness Profile</Text>
            <Text style={styles.menuSubtitle}>{workoutHistory.length} workouts · {activities.length} activities</Text>
          </View>
          <Text style={styles.chevron}>{expandedSection === 'fitness' ? '▼' : '›'}</Text>
        </TouchableOpacity>
        
        {expandedSection === 'fitness' && (
          <View style={styles.expandedInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Workouts</Text>
              <Text style={styles.infoValue}>{workoutHistory.length}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Activities Logged</Text>
              <Text style={styles.infoValue}>{activities.length}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Distance</Text>
              <Text style={styles.infoValue}>{activities.reduce((sum, a) => sum + a.distance, 0).toFixed(1)} km</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Calories Burned</Text>
              <Text style={styles.infoValue}>{activities.reduce((sum, a) => sum + a.calories, 0).toLocaleString()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Personal Records</Text>
              <Text style={styles.infoValue}>{prs.length}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Favorite Activity</Text>
              <Text style={styles.infoValue}>Running</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Avg Weekly Workouts</Text>
              <Text style={styles.infoValue}>4.2</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Current Streak</Text>
              <Text style={styles.infoValue}>7 days</Text>
            </View>
          </View>
        )}

        {/* Expandable Health Metrics */}
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => setExpandedSection(expandedSection === 'health' ? null : 'health')}
        >
          <Text style={styles.menuIcon}>❤️</Text>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Health Metrics</Text>
            <Text style={styles.menuSubtitle}>HR: {healthData?.heartRate || 64} bpm · Sleep: 7.2h</Text>
          </View>
          <Text style={styles.chevron}>{expandedSection === 'health' ? '▼' : '›'}</Text>
        </TouchableOpacity>
        
        {expandedSection === 'health' && (
          <View style={styles.expandedInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Resting Heart Rate</Text>
              <Text style={styles.infoValue}>{healthData?.heartRate || 64} bpm</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Avg Daily Steps</Text>
              <Text style={styles.infoValue}>8,420</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sleep Duration</Text>
              <Text style={styles.infoValue}>7.2h</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sleep Score</Text>
              <Text style={styles.infoValue}>82/100</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Stress Level</Text>
              <Text style={styles.infoValue}>Low</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mood</Text>
              <Text style={styles.infoValue}>Good</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Water Intake</Text>
              <Text style={styles.infoValue}>6/8 glasses</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>SpO2</Text>
              <Text style={styles.infoValue}>98%</Text>
            </View>
          </View>
        )}

        {menuItems.slice(0, 4).map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            {item.hasSwitch ? (
              <Switch
                value={item.switchValue}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: COLORS.primaryLight }}
                thumbColor={item.switchValue ? COLORS.primary : '#f4f3f4'}
              />
            ) : (
              <Text style={styles.chevron}>›</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        {menuItems.slice(4).map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.signOutButton} 
        onPress={handleSignOut}
        disabled={isLoading}
      >
        <Text style={styles.signOutText}>
          {isLoading ? 'Signing out...' : 'Sign Out'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    fontSize: FONT_SIZE.xxxl,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  displayName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  chevron: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.textTertiary,
  },
  signOutButton: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.error,
  },
  version: {
    textAlign: 'center',
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: SPACING.lg,
  },
  // Goals Section Styles
  goalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  goalName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  goalStatus: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  goalStatusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  goalProgress: {},
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  goalStatValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  goalStatLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
  goalArrow: {
    paddingHorizontal: SPACING.sm,
  },
  goalArrowText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textTertiary,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    minWidth: 40,
    textAlign: 'right',
  },
  // Info Card Styles for Personal Info
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  expandedInfo: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
});

export default ProfileScreen;
