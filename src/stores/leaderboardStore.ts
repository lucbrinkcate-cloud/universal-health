import { create } from 'zustand';
import { Leaderboard, LeaderboardEntry, LeaderboardType, LeaderboardCategory } from '../types/leaderboard';

interface LeaderboardStore {
  leaderboards: Leaderboard[];
  isLoading: boolean;
  selectedType: LeaderboardType;
  selectedCategory: LeaderboardCategory;
  
  fetchLeaderboards: () => void;
  setSelectedType: (type: LeaderboardType) => void;
  setSelectedCategory: (category: LeaderboardCategory) => void;
  getCurrentLeaderboard: () => Leaderboard | undefined;
}

const generateMockEntries = (): LeaderboardEntry[] => {
  const users = [
    { id: 'user_1', name: 'Sarah Johnson', value: 12500, photoURL: null as string | null },
    { id: 'user_2', name: 'Mike Chen', value: 11800, photoURL: null as string | null },
    { id: 'user_4', name: 'David Brown', value: 10200, photoURL: null as string | null },
    { id: 'user_5', name: 'Lisa Martinez', value: 9800, photoURL: null as string | null },
    { id: 'user_6', name: 'James Wilson', value: 8900, photoURL: null as string | null },
    { id: 'user_7', name: 'Anna Garcia', value: 8200, photoURL: null as string | null },
    { id: 'user_8', name: 'Tom Anderson', value: 7500, photoURL: null as string | null },
    { id: 'user_9', name: 'Rachel Kim', value: 6800, photoURL: null as string | null },
    { id: 'user_10', name: 'Chris Lee', value: 6100, photoURL: null as string | null },
    { id: 'current_user', name: 'You', value: 5450, photoURL: null as string | null },
  ];

  return users.map((user, index) => ({
    rank: index + 1,
    userId: user.id,
    displayName: user.name,
    photoURL: user.photoURL,
    value: user.value,
    previousRank: user.id === 'current_user' ? 12 : index + 1,
    isCurrentUser: user.id === 'current_user',
  }));
};

const generateWeeklyLeaderboard = (): Leaderboard => ({
  id: 'weekly_xp',
  type: 'weekly',
  title: 'Weekly XP Leaders',
  description: 'Top performers this week',
  entries: generateMockEntries(),
  lastUpdated: new Date().toISOString(),
  currentUserEntry: generateMockEntries().find(e => e.isCurrentUser),
});

const generateGlobalLeaderboard = (): Leaderboard => ({
  id: 'global_xp',
  type: 'global',
  title: 'Global Rankings',
  description: 'All-time XP leaders',
  entries: generateMockEntries().map((e, i) => ({
    ...e,
    value: e.value * 10,
    rank: i + 1,
  })),
  lastUpdated: new Date().toISOString(),
  currentUserEntry: generateMockEntries().find(e => e.isCurrentUser),
});

const generateCategoryLeaderboard = (category: LeaderboardCategory): Leaderboard => {
  const categoryData: Record<LeaderboardCategory, { title: string; unit: string; values: number[] }> = {
    steps: { title: 'Steps', unit: 'steps', values: [15000, 14500, 13200, 12800, 11500, 10200, 9500, 8800, 8100, 7500] },
    sleep: { title: 'Sleep Score', unit: 'pts', values: [95, 92, 90, 88, 85, 82, 80, 78, 75, 72] },
    heart: { title: 'Heart Health', unit: 'bpm', values: [65, 68, 70, 72, 75, 78, 80, 82, 85, 88] },
    streak: { title: 'Streak Days', unit: 'days', values: [45, 38, 32, 28, 24, 21, 18, 15, 12, 10] },
    xp: { title: 'Total XP', unit: 'xp', values: [45000, 42000, 38000, 35000, 32000, 29000, 26000, 23000, 20000, 18000] },
    health_score: { title: 'Health Score', unit: 'pts', values: [95, 93, 91, 89, 87, 85, 83, 81, 79, 77] },
  };

  const data = categoryData[category];
  const names = ['Sarah Johnson', 'Mike Chen', 'David Brown', 'Lisa Martinez', 'James Wilson', 
                 'Anna Garcia', 'Tom Anderson', 'Rachel Kim', 'Chris Lee', 'You'];
  const ids = ['user_1', 'user_2', 'user_4', 'user_5', 'user_6', 'user_7', 'user_8', 'user_9', 'user_10', 'current_user'];

  return {
    id: `category_${category}`,
    type: 'category',
    category,
    title: `${data.title} Leaderboard`,
    description: `Top performers in ${data.title.toLowerCase()}`,
    entries: names.map((name, index) => ({
      rank: index + 1,
      userId: ids[index],
      displayName: name,
      photoURL: null,
      value: data.values[index],
      previousRank: index + 1,
      isCurrentUser: ids[index] === 'current_user',
    })),
    lastUpdated: new Date().toISOString(),
    currentUserEntry: names.map((name, index) => ({
      rank: index + 1,
      userId: ids[index],
      displayName: name,
      photoURL: null,
      value: data.values[index],
      previousRank: index + 1,
      isCurrentUser: ids[index] === 'current_user',
    })).find(e => e.isCurrentUser),
  };
};

export const useLeaderboardStore = create<LeaderboardStore>((set, get) => ({
  leaderboards: [
    generateWeeklyLeaderboard(),
    generateGlobalLeaderboard(),
    generateCategoryLeaderboard('steps'),
  ],
  isLoading: false,
  selectedType: 'weekly',
  selectedCategory: 'steps',

  fetchLeaderboards: () => {
    set({ isLoading: true });
    setTimeout(() => {
      const { selectedType, selectedCategory } = get();
      if (selectedType === 'weekly') {
        set({ leaderboards: [generateWeeklyLeaderboard(), ...get().leaderboards.slice(1)], isLoading: false });
      } else if (selectedType === 'global') {
        set({ leaderboards: [get().leaderboards[0], generateGlobalLeaderboard(), ...get().leaderboards.slice(2)], isLoading: false });
      } else {
        const newCategoryLeaderboard = generateCategoryLeaderboard(selectedCategory);
        set({ leaderboards: [get().leaderboards[0], get().leaderboards[1], newCategoryLeaderboard], isLoading: false });
      }
    }, 500);
  },

  setSelectedType: (type: LeaderboardType) => {
    set({ selectedType: type });
    get().fetchLeaderboards();
  },

  setSelectedCategory: (category: LeaderboardCategory) => {
    set({ selectedCategory: category });
    get().fetchLeaderboards();
  },

  getCurrentLeaderboard: () => {
    const { leaderboards, selectedType, selectedCategory } = get();
    if (selectedType === 'weekly') return leaderboards[0];
    if (selectedType === 'global') return leaderboards[1];
    return leaderboards[2];
  },
}));

export default useLeaderboardStore;
