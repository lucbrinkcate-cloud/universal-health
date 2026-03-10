import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { useFitnessStore, QUICK_STARTS, Exercise, StravaActivity, ActivityType } from '../../stores/fitnessStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type TabType = 'workouts' | 'library' | 'history' | 'activities' | 'prs';

const ACTIVITY_TYPE_ICONS: Record<ActivityType, string> = {
  Run: '🏃',
  Ride: '🚴',
  Swim: '🏊',
  IceSkate: '⛸️',
  Walk: '🚶',
  Hike: '🥾',
  Workout: '💪',
  Rowing: '🚣',
  Elliptical: '🔄',
  StairStepper: '🪜',
  WeightTraining: '🏋️',
  Yoga: '🧘',
  CrossFit: '🔥',
  RockClimbing: '🧗',
  Ski: '⛷️',
  Snowboard: '🏂',
  Kayaking: '🛶',
  Canoeing: '🛶',
  Sailing: '⛵',
  Windsurf: '🏄',
  Surfing: '🏄',
  Kiteboarding: '🪁',
  Wakeboarding: '🏄',
  WaterSkiing: '🎿',
  Tubing: '游泳圈',
  DragonBoat: '🐉',
  StandUpPaddle: '🏄',
  Inline: '🛼',
  RollerSki: '⛸️',
  Snowshoe: '👣',
  MountainBike: '🚵',
  Cyclocross: '🚴',
  Track: '田径',
  Triathlon: '🏅',
  Duathlon: '🏅',
  Aquathlon: '🏊',
  SwimRun: '🏊🏃',
};

const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  Run: '#FC4C02',
  Ride: '#00BFA6',
  Swim: '#4285F4',
  IceSkate: '#7C3AED',
  Walk: '#22C55E',
  Hike: '#F59E0B',
  Workout: '#EF4444',
  Rowing: '#06B6D4',
  Elliptical: '#8B5CF6',
  StairStepper: '#EC4899',
  WeightTraining: '#64748B',
  Yoga: '#A855F7',
  CrossFit: '#F97316',
  RockClimbing: '#78716C',
  Ski: '#0EA5E9',
  Snowboard: '#38BDF8',
  Kayaking: '#14B8A6',
  Canoeing: '#14B8A6',
  Sailing: '#3B82F6',
  Windsurf: '#06B6D4',
  Surfing: '#0EA5E9',
  Kiteboarding: '#06B6D4',
  Wakeboarding: '#0EA5E9',
  WaterSkiing: '#0EA5E9',
  Tubing: '#0EA5E9',
  DragonBoat: '#EF4444',
  StandUpPaddle: '#14B8A6',
  Inline: '#6B7280',
  RollerSki: '#A78BFA',
  Snowshoe: '#E5E7EB',
  MountainBike: '#F59E0B',
  Cyclocross: '#F59E0B',
  Track: '#DC2626',
  Triathlon: '#FBBF24',
  Duathlon: '#FBBF24',
  Aquathlon: '#3B82F6',
  SwimRun: '#3B82F6',
};

const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Legs', 'Arms', 'Core', 'Shoulders', 'Full Body'];

const EXERCISE_TEMPLATES: Record<string, number[]> = {
  'Full Body': [1, 5, 7, 8, 9],
  'HIIT': [5, 9, 10, 8],
  'Core': [8, 10, 7],
  'Yoga': [8, 7],
  'Strength': [1, 2, 3, 6],
  'Stretch': [7, 8],
};

export const FitnessScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('workouts');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const {
    exercises,
    history,
    prs,
    activities,
    activeWorkout,
    timer,
    isRunning,
    startWorkout,
    endWorkout,
    setTimer,
    setRunning,
    addActivity,
  } = useFitnessStore();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && activeWorkout) {
      timerRef.current = setInterval(() => {
        setTimer(timer + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, activeWorkout, timer]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredExercises = exercises.filter(
    (ex) => muscleFilter === 'All' || ex.muscle === muscleFilter
  );

  const handleStartWorkout = (workoutName: string) => {
    const exerciseIds = EXERCISE_TEMPLATES[workoutName] || [1, 2, 5];
    startWorkout(workoutName, exerciseIds);
  };

  const handleEndWorkout = () => {
    Alert.alert(
      'Finish Workout',
      'Are you sure you want to end this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Finish',
          onPress: () => {
            endWorkout();
          },
        },
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return COLORS.success;
      case 'Intermediate':
        return COLORS.warning;
      case 'Advanced':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getWorkoutExercises = () => {
    if (!activeWorkout) return [];
    return activeWorkout.exercises.map((id) => exercises.find((ex) => ex.id === id)).filter(Boolean);
  };

  // Active Workout View
  if (activeWorkout) {
    const workoutExercises = getWorkoutExercises();
    const currentExercise = workoutExercises[currentExerciseIndex];

    return (
      <View style={styles.container}>
        <View style={styles.activeWorkoutHeader}>
          <Pressable onPress={() => setRunning(!isRunning)} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <View style={styles.activeWorkoutInfo}>
            <Text style={styles.activeWorkoutTitle}>{activeWorkout.name}</Text>
            <Text style={styles.activeWorkoutTimer}>{formatTime(timer)}</Text>
          </View>
          <Pressable
            onPress={handleEndWorkout}
            style={styles.finishButton}
          >
            <Text style={styles.finishButtonText}>Finish</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.exerciseNav}>
            {workoutExercises.map((ex, index) => (
              <Pressable
                key={ex!.id}
                onPress={() => setCurrentExerciseIndex(index)}
                style={[
                  styles.exerciseNavItem,
                  index === currentExerciseIndex && styles.exerciseNavItemActive,
                ]}
              >
                <Text
                  style={[
                    styles.exerciseNavText,
                    index === currentExerciseIndex && styles.exerciseNavTextActive,
                  ]}
                >
                  {index + 1}. {ex!.name}
                </Text>
              </Pressable>
            ))}
          </View>

          {currentExercise && (
            <View style={styles.currentExerciseCard}>
              <Text style={styles.currentExerciseEmoji}>{currentExercise.emoji}</Text>
              <Text style={styles.currentExerciseName}>{currentExercise.name}</Text>
              <View style={styles.exerciseTags}>
                <View style={[styles.tag, { backgroundColor: `${COLORS.primary}20` }]}>
                  <Text style={[styles.tagText, { color: COLORS.primary }]}>{currentExercise.muscle}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: `${COLORS.sleep}20` }]}>
                  <Text style={[styles.tagText, { color: COLORS.sleep }]}>{currentExercise.equipment}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: `${getDifficultyColor(currentExercise.difficulty)}20` }]}>
                  <Text style={[styles.tagText, { color: getDifficultyColor(currentExercise.difficulty) }]}>
                    {currentExercise.difficulty}
                  </Text>
                </View>
              </View>

              <View style={styles.setsContainer}>
                {[1, 2, 3].map((set) => (
                  <View key={set} style={styles.setRow}>
                    <Text style={styles.setLabel}>Set {set}</Text>
                    <View style={styles.setInputs}>
                      <TextInput
                        style={styles.setInput}
                        placeholder="kg"
                        placeholderTextColor={COLORS.textTertiary}
                        keyboardType="numeric"
                      />
                      <Text style={styles.setX}>×</Text>
                      <TextInput
                        style={styles.setInput}
                        placeholder="reps"
                        placeholderTextColor={COLORS.textTertiary}
                        keyboardType="numeric"
                      />
                    </View>
                    <Pressable style={styles.completeButton}>
                      <Text style={styles.completeButtonText}>✓</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.navigationButtons}>
            <Pressable
              style={[styles.navButton, styles.navButtonPrev]}
              onPress={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
              disabled={currentExerciseIndex === 0}
            >
              <Text style={styles.navButtonText}>← Prev</Text>
            </Pressable>
            <Pressable
              style={[styles.navButton, styles.navButtonNext]}
              onPress={() => {
                if (currentExerciseIndex < workoutExercises.length - 1) {
                  setCurrentExerciseIndex(currentExerciseIndex + 1);
                } else {
                  handleEndWorkout();
                }
              }}
            >
              <Text style={[styles.navButtonText, { color: '#fff' }]}>
                {currentExerciseIndex < workoutExercises.length - 1 ? 'Next →' : 'Finish 🎉'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fitness</Text>
        <Text style={styles.subtitle}>Workouts & exercises</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['workouts', 'library', 'history', 'activities', 'prs'] as TabType[]).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'activities' ? 'Activities' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Workouts Tab */}
        {activeTab === 'workouts' && (
          <View>
            <Text style={styles.sectionTitle}>Quick Start</Text>
            <View style={styles.quickStartGrid}>
              {QUICK_STARTS.map((workout) => (
                <Pressable
                  key={workout.name}
                  style={styles.quickStartCard}
                  onPress={() => handleStartWorkout(workout.name)}
                >
                  <Text style={styles.quickStartEmoji}>{workout.emoji}</Text>
                  <Text style={styles.quickStartName}>{workout.name}</Text>
                  <Text style={styles.quickStartDuration}>{workout.duration}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Personal Records</Text>
            {prs.map((pr, index) => (
              <View key={index} style={styles.prCard}>
                <View style={styles.prInfo}>
                  <Text style={styles.prExercise}>{pr.exercise}</Text>
                  <Text style={styles.prDate}>{pr.date}</Text>
                </View>
                <Text style={styles.prWeight}>{pr.weight} kg</Text>
              </View>
            ))}
          </View>
        )}

        {/* Library Tab */}
        {activeTab === 'library' && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.muscleFilterContainer}
            >
              {MUSCLE_GROUPS.map((muscle) => (
                <Pressable
                  key={muscle}
                  style={[
                    styles.muscleFilterButton,
                    muscleFilter === muscle && styles.muscleFilterActive,
                  ]}
                  onPress={() => setMuscleFilter(muscle)}
                >
                  <Text
                    style={[
                      styles.muscleFilterText,
                      muscleFilter === muscle && styles.muscleFilterTextActive,
                    ]}
                  >
                    {muscle}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {filteredExercises.map((exercise) => (
              <Pressable
                key={exercise.id}
                style={styles.exerciseCard}
                onPress={() => {
                  setSelectedExercise(exercise);
                  setShowExerciseModal(true);
                }}
              >
                <Text style={styles.exerciseEmoji}>{exercise.emoji}</Text>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <View style={styles.exerciseTags}>
                    <View style={[styles.tag, { backgroundColor: `${COLORS.primary}20` }]}>
                      <Text style={[styles.tagText, { color: COLORS.primary }]}>{exercise.muscle}</Text>
                    </View>
                    <View style={[styles.tag, { backgroundColor: `${COLORS.sleep}20` }]}>
                      <Text style={[styles.tagText, { color: COLORS.sleep }]}>{exercise.equipment}</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles.difficultyBadge,
                    { backgroundColor: `${getDifficultyColor(exercise.difficulty)}20` },
                  ]}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      { color: getDifficultyColor(exercise.difficulty) },
                    ]}
                  >
                    {exercise.difficulty}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <View>
            {history.map((workout) => (
              <View key={workout.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View>
                    <Text style={styles.historyName}>{workout.name}</Text>
                    <Text style={styles.historyDate}>{workout.date}</Text>
                  </View>
                  <View style={styles.historyCalorieBadge}>
                    <Text style={styles.historyCalorieText}>{workout.calories} cal</Text>
                  </View>
                </View>
                <View style={styles.historyStats}>
                  <View style={styles.historyStat}>
                    <Text style={styles.historyStatValue}>{workout.duration}</Text>
                    <Text style={styles.historyStatLabel}>min</Text>
                  </View>
                  <View style={styles.historyStat}>
                    <Text style={styles.historyStatValue}>{workout.exercises}</Text>
                    <Text style={styles.historyStatLabel}>exercises</Text>
                  </View>
                  <View style={styles.historyStat}>
                    <Text style={styles.historyStatValue}>
                      {workout.volume > 0 ? workout.volume.toLocaleString() : '—'}
                    </Text>
                    <Text style={styles.historyStatLabel}>kg vol</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Activities Tab - Strava Style */}
        {activeTab === 'activities' && (
          <View>
            <View style={styles.activitySummary}>
              <View style={styles.activitySummaryItem}>
                <Text style={styles.activitySummaryValue}>{activities.length}</Text>
                <Text style={styles.activitySummaryLabel}>Activities</Text>
              </View>
              <View style={styles.activitySummaryItem}>
                <Text style={styles.activitySummaryValue}>
                  {(activities.reduce((sum, a) => sum + a.distance, 0)).toFixed(1)}km
                </Text>
                <Text style={styles.activitySummaryLabel}>Distance</Text>
              </View>
              <View style={styles.activitySummaryItem}>
                <Text style={styles.activitySummaryValue}>
                  {Math.round(activities.reduce((sum, a) => sum + a.calories, 0))}
                </Text>
                <Text style={styles.activitySummaryLabel}>Calories</Text>
              </View>
              <View style={styles.activitySummaryItem}>
                <Text style={styles.activitySummaryValue}>
                  {activities.reduce((sum, a) => {
                    const parts = a.time.split(':').map(Number);
                    return sum + (parts.length === 3 ? parts[0] * 60 + parts[1] + parts[2] / 60 : parts[0] + parts[1] / 60);
                  }, 0).toFixed(0)}min
                </Text>
                <Text style={styles.activitySummaryLabel}>Time</Text>
              </View>
            </View>
            
            {activities.map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <View style={styles.activityTypeContainer}>
                    <Text style={styles.activityTypeIcon}>
                      {ACTIVITY_TYPE_ICONS[activity.type] || '🏃'}
                    </Text>
                    <View style={[styles.activityTypeBadge, { backgroundColor: `${ACTIVITY_TYPE_COLORS[activity.type] || COLORS.primary}20` }]}>
                      <Text style={[styles.activityTypeText, { color: ACTIVITY_TYPE_COLORS[activity.type] || COLORS.primary }]}>
                        {activity.type}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.activityDate}>{activity.date} · {activity.startTime}</Text>
                </View>
                
                <Text style={styles.activityName}>{activity.name}</Text>
                
                <View style={styles.activityStats}>
                  <View style={styles.activityStat}>
                    <Text style={styles.activityStatIcon}>📏</Text>
                    <Text style={styles.activityStatValue}>{activity.distance} km</Text>
                    <Text style={styles.activityStatLabel}>Distance</Text>
                  </View>
                  <View style={styles.activityStat}>
                    <Text style={styles.activityStatIcon}>⏱</Text>
                    <Text style={styles.activityStatValue}>{activity.time}</Text>
                    <Text style={styles.activityStatLabel}>Time</Text>
                  </View>
                  <View style={styles.activityStat}>
                    <Text style={styles.activityStatIcon}>👟</Text>
                    <Text style={styles.activityStatValue}>{activity.pace}</Text>
                    <Text style={styles.activityStatLabel}>Pace</Text>
                  </View>
                  <View style={styles.activityStat}>
                    <Text style={styles.activityStatIcon}>❤️</Text>
                    <Text style={styles.activityStatValue}>{activity.heartRate}</Text>
                    <Text style={styles.activityStatLabel}>Avg HR</Text>
                  </View>
                  <View style={styles.activityStat}>
                    <Text style={styles.activityStatIcon}>🔥</Text>
                    <Text style={styles.activityStatValue}>{activity.calories}</Text>
                    <Text style={styles.activityStatLabel}>Cal</Text>
                  </View>
                  {activity.elevation > 0 && (
                    <View style={styles.activityStat}>
                      <Text style={styles.activityStatIcon}>⛰</Text>
                      <Text style={styles.activityStatValue}>{activity.elevation}m</Text>
                      <Text style={styles.activityStatLabel}>Elev</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* PRs Tab */}
        {activeTab === 'prs' && (
          <View>
            {prs.map((pr, index) => (
              <View key={index} style={styles.prDetailCard}>
                <Text style={styles.prDetailEmoji}>🏆</Text>
                <View style={styles.prDetailInfo}>
                  <Text style={styles.prDetailExercise}>{pr.exercise}</Text>
                  <Text style={styles.prDetailDate}>{pr.date}</Text>
                </View>
                <Text style={styles.prDetailWeight}>{pr.weight} kg</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Exercise Detail Modal */}
      <Modal
        visible={showExerciseModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowExerciseModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedExercise?.name}</Text>
            <Pressable onPress={() => setShowExerciseModal(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </Pressable>
          </View>

          {selectedExercise && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.modalExerciseIcon}>
                <Text style={styles.modalExerciseEmoji}>{selectedExercise.emoji}</Text>
              </View>

              <View style={styles.modalTags}>
                <View style={[styles.tag, { backgroundColor: `${COLORS.primary}20` }]}>
                  <Text style={[styles.tagText, { color: COLORS.primary }]}>{selectedExercise.muscle}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: `${COLORS.sleep}20` }]}>
                  <Text style={[styles.tagText, { color: COLORS.sleep }]}>{selectedExercise.equipment}</Text>
                </View>
                <View
                  style={[
                    styles.tag,
                    { backgroundColor: `${getDifficultyColor(selectedExercise.difficulty)}20` },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: getDifficultyColor(selectedExercise.difficulty) },
                    ]}
                  >
                    {selectedExercise.difficulty}
                  </Text>
                </View>
              </View>

              <View style={styles.recommendationCard}>
                <Text style={styles.recommendationText}>
                  💡 Recommended: 3–4 sets × 8–12 reps
                </Text>
              </View>

              <Pressable
                style={styles.startWorkoutButton}
                onPress={() => {
                  handleStartWorkout(selectedExercise.name);
                  setShowExerciseModal(false);
                }}
              >
                <Text style={styles.startWorkoutButtonText}>Start with this Exercise</Text>
              </Pressable>
            </ScrollView>
          )}
        </View>
      </Modal>
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
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  quickStartGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  quickStartCard: {
    width: '31%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickStartEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  quickStartName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  quickStartDuration: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  prCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  prInfo: {},
  prExercise: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  prDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  prWeight: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  muscleFilterContainer: {
    marginBottom: SPACING.md,
  },
  muscleFilterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  muscleFilterActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  muscleFilterText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  muscleFilterTextActive: {
    color: '#fff',
  },
  exerciseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  exerciseEmoji: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  exerciseTags: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  tag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  tagText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  difficultyText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  historyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  historyName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  historyDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  historyCalorieBadge: {
    backgroundColor: `${COLORS.calories}20`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  historyCalorieText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.calories,
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  historyStat: {
    alignItems: 'center',
  },
  historyStatValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  historyStatLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  prDetailCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  prDetailEmoji: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  prDetailInfo: {
    flex: 1,
  },
  prDetailExercise: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  prDetailDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  prDetailWeight: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  bottomPadding: {
    height: SPACING.xxl,
  },
  // Active Workout Styles
  activeWorkoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.sm,
  },
  backButtonText: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.text,
  },
  activeWorkoutInfo: {
    flex: 1,
    alignItems: 'center',
  },
  activeWorkoutTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  activeWorkoutTimer: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  finishButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  finishButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: FONT_SIZE.sm,
  },
  exerciseNav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  exerciseNavItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  exerciseNavItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  exerciseNavText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  exerciseNavTextActive: {
    color: '#fff',
  },
  currentExerciseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  currentExerciseEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  currentExerciseName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  setsContainer: {
    width: '100%',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  setLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    width: 60,
  },
  setInputs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  setInput: {
    width: 60,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    color: COLORS.text,
  },
  setX: {
    marginHorizontal: SPACING.sm,
    color: COLORS.textTertiary,
  },
  completeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  navButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  navButtonPrev: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  navButtonNext: {
    backgroundColor: COLORS.primary,
  },
  navButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalClose: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    padding: SPACING.sm,
  },
  modalContent: {
    padding: SPACING.md,
  },
  modalExerciseIcon: {
    height: 140,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalExerciseEmoji: {
    fontSize: 64,
  },
  modalTags: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  recommendationCard: {
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  recommendationText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  startWorkoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  startWorkoutButtonText: {
    color: '#fff',
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  // Activity Card Styles - Strava Style
  activitySummary: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    justifyContent: 'space-around',
  },
  activitySummaryItem: {
    alignItems: 'center',
  },
  activitySummaryValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  activitySummaryLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  activityTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  activityTypeIcon: {
    fontSize: 24,
  },
  activityTypeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  activityTypeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  activityDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  activityName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  activityStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  activityStat: {
    alignItems: 'center',
    flex: 1,
  },
  activityStatIcon: {
    fontSize: 14,
    marginBottom: 2,
  },
  activityStatValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  activityStatLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
});

export default FitnessScreen;
