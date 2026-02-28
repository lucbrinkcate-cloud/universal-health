import { create } from 'zustand';
import { 
  UserProgress, 
  Currency, 
  Achievement, 
  AchievementCategory, 
  AvatarState, 
  DailyChallenge,
  XPGain,
  HealthData 
} from '../types';
import { ACHIEVEMENTS, LEVEL_THRESHOLDS, XP_REWARDS } from '../constants/gamification';

interface GamificationStore {
  // User Progress
  progress: UserProgress;
  recentXPGains: XPGain[];
  
  // Currency
  currency: Currency;
  
  // Achievements
  achievements: Achievement[];
  
  // Avatar State (Tamagotchi)
  avatar: AvatarState;
  
  // Daily Challenges
  dailyChallenges: DailyChallenge[];
  
  // Actions
  addXP: (amount: number, reason: string) => void;
  addCurrency: (coins: number, gems: number, reason: string) => void;
  spendCurrency: (coins: number, gems: number) => boolean;
  checkAchievements: (healthData: HealthData) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  refreshDailyChallenges: () => void;
  feedAvatar: () => void;
  exerciseAvatar: () => void;
  updateAvatarState: (healthData: HealthData, readiness?: number) => void;
  buyAccessory: (accessoryId: string, cost: { coins: number; gems: number }) => boolean;
  getLevelProgress: () => number;
  getUnlockedAchievements: () => Achievement[];
  getAvailableAchievements: () => Achievement[];
}

const getXpForLevel = (level: number): number => {
  return LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
};

const calculateLevel = (totalXp: number): { level: number; xpInLevel: number; xpToNext: number } => {
  let level = 1;
  let xpAccumulated = 0;
  
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) {
      xpAccumulated = LEVEL_THRESHOLDS[i];
      level = i + 1;
    } else {
      break;
    }
  }
  
  const xpInLevel = totalXp - xpAccumulated;
  const xpToNext = LEVEL_THRESHOLDS[level] - xpAccumulated;
  
  return { level, xpInLevel, xpToNext };
};

const generateDailyChallenges = (): DailyChallenge[] => {
  const challenges: DailyChallenge[] = [
    {
      id: 'steps_10k',
      title: 'Step Master',
      description: 'Walk 10,000 steps today',
      type: 'steps',
      target: 10000,
      current: 0,
      reward: { xp: XP_REWARDS.CHALLENGE_COMPLETION, coins: 100 },
      completed: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sleep_8h',
      title: 'Sleep Champion',
      description: 'Get 8 hours of sleep',
      type: 'sleep',
      target: 480,
      current: 0,
      reward: { xp: XP_REWARDS.CHALLENGE_COMPLETION, coins: 80 },
      completed: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'heart_healthy',
      title: 'Heart Healthy',
      description: 'Maintain avg heart rate between 60-80 bpm',
      type: 'heart',
      target: 1,
      current: 0,
      reward: { xp: XP_REWARDS.CHALLENGE_COMPLETION, coins: 60 },
      completed: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  
  return challenges;
};

export const useGamificationStore = create<GamificationStore>((set, get) => ({
  progress: {
    level: 1,
    xp: 0,
    xpToNextLevel: getXpForLevel(1),
    totalXp: 0,
    streak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
  },
  recentXPGains: [],
  
  currency: {
    coins: 500,
    gems: 10,
  },
  
  achievements: ACHIEVEMENTS.map((a: typeof ACHIEVEMENTS[0]) => ({ ...a, progress: 0 })),
  
  avatar: {
    mood: 'happy',
    energy: 100,
    health: 100,
    lastFed: new Date().toISOString(),
    lastExercised: new Date().toISOString(),
    accessories: [],
    evolutionStage: 1,
  },
  
  dailyChallenges: generateDailyChallenges(),
  
  addXP: (amount: number, reason: string) => {
    set(state => {
      const newTotalXp = state.progress.totalXp + amount;
      const { level, xpInLevel, xpToNext } = calculateLevel(newTotalXp);
      
      const xpGain: XPGain = {
        amount,
        reason,
        timestamp: new Date().toISOString(),
      };
      
      const recentGains = [xpGain, ...state.recentXPGains].slice(0, 10);
      
      return {
        progress: {
          ...state.progress,
          level,
          xp: xpInLevel,
          xpToNextLevel: xpToNext,
          totalXp: newTotalXp,
        },
        recentXPGains: recentGains,
      };
    });
  },
  
  addCurrency: (coins: number, gems: number, reason: string) => {
    set(state => ({
      currency: {
        coins: state.currency.coins + coins,
        gems: state.currency.gems + gems,
      },
    }));
    
    // Also add small XP for earning currency
    get().addXP(Math.floor(coins / 10), `Earned currency: ${reason}`);
  },
  
  spendCurrency: (coins: number, gems: number): boolean => {
    const state = get();
    if (state.currency.coins < coins || state.currency.gems < gems) {
      return false;
    }
    
    set(state => ({
      currency: {
        coins: state.currency.coins - coins,
        gems: state.currency.gems - gems,
      },
    }));
    
    return true;
  },
  
  checkAchievements: (healthData: HealthData) => {
    set(state => {
      let xpGained = 0;
      let coinsGained = 0;
      
      const updatedAchievements = state.achievements.map(achievement => {
        if (achievement.unlockedAt) return achievement;
        
        let progress = achievement.progress;
        
        // Update progress based on achievement type
        switch (achievement.id) {
          case 'steps_10k_day':
            if (healthData.steps >= 10000) {
              progress = 100;
            } else {
              progress = Math.floor((healthData.steps / 10000) * 100);
            }
            break;
          case 'steps_100k_total':
            progress = Math.min(100, Math.floor((healthData.steps / 100000) * 100));
            break;
          case 'sleep_8h':
            if (healthData.sleepData.totalMinutes >= 480) {
              progress = 100;
            } else {
              progress = Math.floor((healthData.sleepData.totalMinutes / 480) * 100);
            }
            break;
          case 'heart_healthy_week':
            if (healthData.heartRate >= 60 && healthData.heartRate <= 80) {
              progress = Math.min(100, progress + 14);
            }
            break;
        }
        
        // Check if achievement is unlocked
        if (progress >= 100 && !achievement.unlockedAt) {
          xpGained += achievement.reward.xp;
          coinsGained += achievement.reward.coins;
          
          return {
            ...achievement,
            progress: 100,
            unlockedAt: new Date().toISOString(),
          };
        }
        
        return { ...achievement, progress };
      });
      
      // Apply rewards
      if (xpGained > 0) {
        get().addXP(xpGained, 'Achievement Unlocked!');
      }
      if (coinsGained > 0) {
        get().addCurrency(coinsGained, 0, 'Achievement Reward');
      }
      
      return { achievements: updatedAchievements };
    });
  },
  
  updateChallengeProgress: (challengeId: string, progress: number) => {
    set(state => {
      const updatedChallenges = state.dailyChallenges.map(challenge => {
        if (challenge.id !== challengeId || challenge.completed) return challenge;
        
        const newProgress = Math.min(challenge.target, progress);
        const completed = newProgress >= challenge.target;
        
        if (completed && !challenge.completed) {
          // Award rewards
          get().addXP(challenge.reward.xp, `Completed: ${challenge.title}`);
          get().addCurrency(challenge.reward.coins, 0, challenge.title);
        }
        
        return {
          ...challenge,
          current: newProgress,
          completed,
        };
      });
      
      return { dailyChallenges: updatedChallenges };
    });
  },
  
  refreshDailyChallenges: () => {
    set({ dailyChallenges: generateDailyChallenges() });
  },
  
  feedAvatar: () => {
    set(state => {
      const now = new Date().toISOString();
      const newEnergy = Math.min(100, state.avatar.energy + 20);
      const newHealth = Math.min(100, state.avatar.health + 5);
      
      return {
        avatar: {
          ...state.avatar,
          energy: newEnergy,
          health: newHealth,
          lastFed: now,
          mood: newEnergy > 70 ? 'energized' : newEnergy > 40 ? 'happy' : 'tired',
        },
      };
    });
    
    get().addXP(XP_REWARDS.DAILY_LOGIN, 'Fed your Digital Twin');
    get().addCurrency(5, 0, 'Caring for your twin');
  },
  
  exerciseAvatar: () => {
    set(state => {
      const now = new Date().toISOString();
      const newHealth = Math.min(100, state.avatar.health + 15);
      const newEnergy = Math.max(0, state.avatar.energy - 10);
      
      return {
        avatar: {
          ...state.avatar,
          health: newHealth,
          energy: newEnergy,
          lastExercised: now,
          mood: newHealth > 80 ? 'energized' : 'happy',
        },
      };
    });
    
    get().addXP(XP_REWARDS.EXERCISE, 'Exercise completed');
    get().addCurrency(10, 0, 'Exercise session');
  },
  
  updateAvatarState: (healthData: HealthData, readiness?: number) => {
    set(state => {
      const hoursSinceLastFed = (Date.now() - new Date(state.avatar.lastFed).getTime()) / (1000 * 60 * 60);
      const hoursSinceExercise = (Date.now() - new Date(state.avatar.lastExercised).getTime()) / (1000 * 60 * 60);
      
      let newEnergy = state.avatar.energy;
      let newHealth = state.avatar.health;
      
      // If we have readiness from the Biological Engine, use it to influence Health/Energy
      if (readiness !== undefined) {
        newHealth = Math.round((newHealth + readiness) / 2);
        newEnergy = Math.round((newEnergy + readiness) / 2);
      } else {
        // Decay energy over time if no real-time readiness
        if (hoursSinceLastFed > 4) {
          newEnergy = Math.max(0, newEnergy - 5);
        }
        
        // Health decreases if not exercised
        if (hoursSinceExercise > 24) {
          newHealth = Math.max(0, newHealth - 5);
        }
      }
      
      // Health increases with good sleep
      if (healthData.sleepData.score > 80) {
        newHealth = Math.min(100, newHealth + 10);
      }
      
      // Determine mood
      let mood: AvatarState['mood'] = 'neutral';
      if (newHealth < 30 || newEnergy < 20) {
        mood = 'sick';
      } else if (newHealth > 80 && newEnergy > 70) {
        mood = 'energized';
      } else if (newEnergy < 40) {
        mood = 'tired';
      } else if (newHealth > 60) {
        mood = 'happy';
      }
      
      // Evolution based on streak and level
      const evolutionStage = Math.min(5, Math.floor(state.progress.streak / 7) + 1);
      
      return {
        avatar: {
          ...state.avatar,
          energy: newEnergy,
          health: newHealth,
          mood,
          evolutionStage,
        },
      };
    });
  },
  
  buyAccessory: (accessoryId: string, cost: { coins: number; gems: number }): boolean => {
    if (!get().spendCurrency(cost.coins, cost.gems)) {
      return false;
    }
    
    set(state => ({
      avatar: {
        ...state.avatar,
        accessories: [...state.avatar.accessories, accessoryId],
      },
    }));
    
    get().addXP(XP_REWARDS.COLLECTION_ITEM, 'New accessory unlocked');
    return true;
  },
  
  getLevelProgress: () => {
    const state = get();
    return (state.progress.xp / state.progress.xpToNextLevel) * 100;
  },
  
  getUnlockedAchievements: () => {
    return get().achievements.filter(a => a.unlockedAt);
  },
  
  getAvailableAchievements: () => {
    return get().achievements.filter(a => !a.unlockedAt);
  },
}));

export default useGamificationStore;
