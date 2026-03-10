import { create } from 'zustand';

export interface FoodItem {
  id: number;
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealItem {
  id: number;
  food: FoodItem;
  qty: number;
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionState {
  goal: NutritionGoals;
  meals: {
    breakfast: MealItem[];
    lunch: MealItem[];
    dinner: MealItem[];
    snacks: MealItem[];
  };
  water: number;
  waterGoal: number;
  addFood: (mealKey: keyof NutritionState['meals'], food: FoodItem) => void;
  removeFood: (mealKey: keyof NutritionState['meals'], itemId: number) => void;
  updateWater: (amount: number) => void;
  getTotalNutrition: () => { calories: number; protein: number; carbs: number; fat: number };
  resetDay: () => void;
}

const FOOD_DB: FoodItem[] = [
  { id: 1, name: 'Chicken Breast', serving: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: 2, name: 'Brown Rice', serving: '100g cooked', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9 },
  { id: 3, name: 'Whole Eggs', serving: '1 large', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8 },
  { id: 4, name: 'Banana', serving: '1 medium', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
  { id: 5, name: 'Broccoli', serving: '100g', calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4 },
  { id: 6, name: 'Salmon', serving: '100g', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { id: 7, name: 'Greek Yogurt', serving: '170g', calories: 100, protein: 17, carbs: 6, fat: 0.7 },
  { id: 8, name: 'Oats', serving: '40g dry', calories: 148, protein: 5.4, carbs: 26.3, fat: 2.7 },
  { id: 9, name: 'Almonds', serving: '30g', calories: 174, protein: 6, carbs: 6, fat: 15 },
  { id: 10, name: 'Sweet Potato', serving: '100g baked', calories: 90, protein: 2, carbs: 20.7, fat: 0.1 },
  { id: 11, name: 'Milk 2%', serving: '240ml', calories: 122, protein: 8.1, carbs: 11.7, fat: 4.8 },
  { id: 12, name: 'Avocado', serving: 'half', calories: 120, protein: 1.5, carbs: 6.4, fat: 11 },
  { id: 13, name: 'Protein Shake', serving: '1 scoop', calories: 130, protein: 25, carbs: 5, fat: 2.5 },
  { id: 14, name: 'Peanut Butter', serving: '2 tbsp', calories: 191, protein: 8, carbs: 7, fat: 16 },
  { id: 15, name: 'Quinoa', serving: '185g cooked', calories: 222, protein: 8, carbs: 39, fat: 3.6 },
  { id: 16, name: 'Apple', serving: '1 medium', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { id: 17, name: 'Orange', serving: '1 medium', calories: 62, protein: 1.2, carbs: 15, fat: 0.2 },
  { id: 18, name: 'Tuna', serving: '100g', calories: 132, protein: 28, carbs: 0, fat: 1 },
  { id: 19, name: 'Cottage Cheese', serving: '100g', calories: 98, protein: 11, carbs: 3.4, fat: 4.3 },
  { id: 20, name: 'Spinach', serving: '100g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
];

export const FOOD_DATABASE = FOOD_DB;

const defaultNutritionState = {
  goal: { calories: 2200, protein: 160, carbs: 220, fat: 73 },
  meals: {
    breakfast: [
      { id: 1, food: FOOD_DB[2], qty: 3 },
      { id: 2, food: FOOD_DB[7], qty: 1 },
    ],
    lunch: [
      { id: 3, food: FOOD_DB[0], qty: 1.5 },
      { id: 4, food: FOOD_DB[1], qty: 1 },
    ],
    dinner: [
      { id: 5, food: FOOD_DB[5], qty: 1.2 },
      { id: 6, food: FOOD_DB[4], qty: 1.5 },
    ],
    snacks: [
      { id: 7, food: FOOD_DB[3], qty: 1 },
      { id: 8, food: FOOD_DB[8], qty: 1 },
    ],
  },
  water: 6,
  waterGoal: 8,
};

export const useNutritionStore = create<NutritionState>((set, get) => ({
  ...defaultNutritionState,

  addFood: (mealKey, food) => {
    set((state) => ({
      meals: {
        ...state.meals,
        [mealKey]: [
          ...state.meals[mealKey],
          { id: Date.now(), food, qty: 1 },
        ],
      },
    }));
  },

  removeFood: (mealKey, itemId) => {
    set((state) => ({
      meals: {
        ...state.meals,
        [mealKey]: state.meals[mealKey].filter((item) => item.id !== itemId),
      },
    }));
  },

  updateWater: (amount) => {
    set((state) => ({
      water: Math.max(0, Math.min(state.waterGoal, amount)),
    }));
  },

  getTotalNutrition: () => {
    const { meals } = get();
    let total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    Object.values(meals).flat().forEach((item) => {
      total.calories += item.food.calories * item.qty;
      total.protein += item.food.protein * item.qty;
      total.carbs += item.food.carbs * item.qty;
      total.fat += item.food.fat * item.qty;
    });
    
    return {
      calories: Math.round(total.calories),
      protein: Math.round(total.protein),
      carbs: Math.round(total.carbs),
      fat: Math.round(total.fat),
    };
  },

  resetDay: () => set(defaultNutritionState),
}));

export default useNutritionStore;
