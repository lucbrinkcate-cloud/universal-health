import { Achievement, AchievementCategory, AchievementTier } from '../types';

// Level thresholds - XP needed to reach each level
export const LEVEL_THRESHOLDS: number[] = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  450,    // Level 4
  700,    // Level 5
  1000,   // Level 6
  1350,   // Level 7
  1750,   // Level 8
  2200,   // Level 9
  2700,   // Level 10
  3250,   // Level 11
  3850,   // Level 12
  4500,   // Level 13
  5200,   // Level 14
  5950,   // Level 15
  6750,   // Level 16
  7600,   // Level 17
  8500,   // Level 18
  9450,   // Level 19
  10450,  // Level 20
  11500,  // Level 21
  12600,  // Level 22
  13750,  // Level 23
  14950,  // Level 24
  16200,  // Level 25
  17500,  // Level 26
  18850,  // Level 27
  20250,  // Level 28
  21700,  // Level 29
  23200,  // Level 30
  24750,  // Level 31
  26350,  // Level 32
  28000,  // Level 33
  29700,  // Level 34
  31450,  // Level 35
  33250,  // Level 36
  35100,  // Level 37
  37000,  // Level 38
  38950,  // Level 39
  40950,  // Level 40
  43000,  // Level 41
  45100,  // Level 42
  47250,  // Level 43
  49450,  // Level 44
  51700,  // Level 45
  54000,  // Level 46
  56350,  // Level 47
  58750,  // Level 48
  61200,  // Level 49
  63700,  // Level 50
];

// XP Rewards for various actions
export const XP_REWARDS = {
  DAILY_LOGIN: 10,
  STEPS_1K: 5,
  STEPS_5K: 15,
  STEPS_10K: 30,
  SLEEP_GOOD: 20,
  SLEEP_EXCELLENT: 40,
  HEART_HEALTHY: 10,
  EXERCISE: 25,
  EXERCISE_30MIN: 25,
  EXERCISE_60MIN: 50,
  CHALLENGE_COMPLETION: 50,
  ACHIEVEMENT_BRONZE: 25,
  ACHIEVEMENT_SILVER: 50,
  ACHIEVEMENT_GOLD: 100,
  ACHIEVEMENT_PLATINUM: 200,
  COLLECTION_ITEM: 15,
  STREAK_7_DAYS: 100,
  STREAK_30_DAYS: 500,
};

// Achievement Definitions
export const ACHIEVEMENTS: Omit<Achievement, 'progress' | 'unlockedAt'>[] = [
  // Steps Achievements
  {
    id: 'steps_10k_day',
    name: 'Daily Walker',
    description: 'Walk 10,000 steps in a single day',
    category: 'steps' as AchievementCategory,
    tier: 'bronze' as AchievementTier,
    icon: '👟',
    requirement: 1,
    reward: { xp: XP_REWARDS.ACHIEVEMENT_BRONZE, coins: 50 },
  },
  {
    id: 'steps_100k_total',
    name: 'Century Steps',
    description: 'Walk 100,000 total steps',
    category: 'steps' as AchievementCategory,
    tier: 'silver' as AchievementTier,
    icon: '🏃',
    requirement: 100000,
    reward: { xp: XP_REWARDS.ACHIEVEMENT_SILVER, coins: 150 },
  },
  {
    id: 'steps_1m_total',
    name: 'Million Step Master',
    description: 'Walk 1 million total steps',
    category: 'steps' as AchievementCategory,
    tier: 'gold' as AchievementTier,
    icon: '🏆',
    requirement: 1000000,
    reward: { xp: XP_REWARDS.ACHIEVEMENT_GOLD, coins: 500 },
  },
  
  // Sleep Achievements
  {
    id: 'sleep_8h',
    name: 'Well Rested',
    description: 'Get 8 hours of sleep for one night',
    category: 'sleep' as AchievementCategory,
    tier: 'bronze' as AchievementTier,
    icon: '😴',
    requirement: 1,
    reward: { xp: XP_REWARDS.ACHIEVEMENT_BRONZE, coins: 40 },
  },
  {
    id: 'sleep_90_score',
    name: 'Sleep Expert',
    description: 'Achieve a sleep score of 90 or higher',
    category: 'sleep' as AchievementCategory,
    tier: 'silver' as AchievementTier,
    icon: '🌙',
    requirement: 1,
    reward: { xp: XP_REWARDS.ACHIEVEMENT_SILVER, coins: 120 },
  },
  {
    id: 'sleep_7_days_good',
    name: 'Sleep Champion',
    description: 'Get 7+ hours of sleep for 7 consecutive days',
    category: 'sleep' as AchievementCategory,
    tier: 'gold' as AchievementTier,
    icon: '🛌',
    requirement: 7,
    reward: { xp: XP_REWARDS.ACHIEVEMENT_GOLD, coins: 300 },
  },
  
  // Heart Health Achievements
  {
    id: 'heart_healthy_week',
    name: 'Heart Healthy',
    description: 'Maintain healthy heart rate for 7 days',
    category: 'heart' as AchievementCategory,
    tier: 'bronze' as AchievementTier,
    icon: '❤️',
    requirement: 7,
    reward: { xp: XP_REWARDS.ACHIEVEMENT_BRONZE, coins: 45 },
  },
  {
    id: 'heart_hrv_50',
    name: 'HRV Master',
    description: 'Maintain HRV above 50ms for a week',
    category: 'heart' as AchievementCategory,
    tier: 'silver' as AchievementTier,
    icon: '💓',
    requirement: 7,
    reward: { xp: XP_REWARDS.ACHIEVEMENT_SILVER, coins: 130 },
  },
  
  // Streak Achievements
  {
    id: 'streak_7_days',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    category: 'streak' as AchievementCategory,
    tier: 'bronze' as AchievementTier,
    icon: '🔥',
    requirement: 7,
    reward: { xp: XP_REWARDS.STREAK_7_DAYS, coins: 100 },
  },
  {
    id: 'streak_30_days',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    category: 'streak' as AchievementCategory,
    tier: 'gold' as AchievementTier,
    icon: '📅',
    requirement: 30,
    reward: { xp: XP_REWARDS.STREAK_30_DAYS, coins: 500 },
  },
  {
    id: 'streak_100_days',
    name: 'Century Champion',
    description: 'Maintain a 100-day streak',
    category: 'streak' as AchievementCategory,
    tier: 'platinum' as AchievementTier,
    icon: '👑',
    requirement: 100,
    reward: { xp: XP_REWARDS.ACHIEVEMENT_PLATINUM, coins: 2000 },
  },
  
  // Collection Achievements
  {
    id: 'avatar_5_accessories',
    name: 'Fashionista',
    description: 'Collect 5 avatar accessories',
    category: 'collection' as AchievementCategory,
    tier: 'bronze' as AchievementTier,
    icon: '🎩',
    requirement: 5,
    reward: { xp: XP_REWARDS.ACHIEVEMENT_BRONZE, coins: 60 },
  },
  {
    id: 'avatar_evolution_3',
    name: 'Growing Strong',
    description: 'Reach evolution stage 3',
    category: 'collection' as AchievementCategory,
    tier: 'silver' as AchievementTier,
    icon: '🌱',
    requirement: 3,
    reward: { xp: XP_REWARDS.ACHIEVEMENT_SILVER, coins: 150 },
  },
  {
    id: 'level_50',
    name: 'Grand Master',
    description: 'Reach level 50',
    category: 'collection' as AchievementCategory,
    tier: 'platinum' as AchievementTier,
    icon: '🏅',
    requirement: 50,
    reward: { xp: XP_REWARDS.ACHIEVEMENT_PLATINUM, coins: 5000 },
  },
];

// Avatar Accessories Shop
export const AVATAR_ACCESSORIES = [
  { id: 'sunglasses', name: 'Cool Shades', cost: { coins: 100, gems: 0 }, icon: '🕶️' },
  { id: 'hat', name: 'Baseball Cap', cost: { coins: 150, gems: 0 }, icon: '🧢' },
  { id: 'crown', name: 'Royal Crown', cost: { coins: 0, gems: 10 }, icon: '👑' },
  { id: 'glasses', name: 'Smart Glasses', cost: { coins: 200, gems: 0 }, icon: '👓' },
  { id: 'scarf', name: 'Winter Scarf', cost: { coins: 120, gems: 0 }, icon: '🧣' },
  { id: 'gloves', name: 'Workout Gloves', cost: { coins: 180, gems: 0 }, icon: '🧤' },
  { id: 'halo', name: 'Angel Halo', cost: { coins: 0, gems: 20 }, icon: '👼' },
  { id: 'ribbon', name: 'Champion Ribbon', cost: { coins: 500, gems: 5 }, icon: '🎀' },
  { id: 'medal', name: 'Gold Medal', cost: { coins: 1000, gems: 10 }, icon: '🏅' },
  { id: 'trophy', name: 'Champion Trophy', cost: { coins: 5000, gems: 50 }, icon: '🏆' },
];

// Evolution stages descriptions
export const EVOLUTION_STAGES = [
  { stage: 1, name: 'Baby', description: 'Just starting your health journey', minLevel: 1 },
  { stage: 2, name: 'Child', description: 'Growing stronger every day', minLevel: 5 },
  { stage: 3, name: 'Teen', description: 'Finding your health rhythm', minLevel: 10 },
  { stage: 4, name: 'Adult', description: 'Mastering healthy habits', minLevel: 20 },
  { stage: 5, name: 'Master', description: 'A true health champion', minLevel: 40 },
];

// Streak rewards
export const STREAK_REWARDS: Record<number, { xp: number; coins: number; gems: number }> = {
  3: { xp: 50, coins: 25, gems: 0 },
  7: { xp: XP_REWARDS.STREAK_7_DAYS, coins: 100, gems: 1 },
  14: { xp: 200, coins: 250, gems: 2 },
  30: { xp: XP_REWARDS.STREAK_30_DAYS, coins: 500, gems: 5 },
  60: { xp: 1000, coins: 1000, gems: 10 },
  100: { xp: XP_REWARDS.ACHIEVEMENT_PLATINUM, coins: 2000, gems: 25 },
};
